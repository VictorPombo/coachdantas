import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { getEmbedding, createSession, updateSessionResult } from '@/face-auth-core/database/queries'
import { verifyIdentity } from '@/face-auth-core/FaceVerification'

// Limite simples de tentativas em memória
const rateLimits = new Map<string, { attempts: number, lastAttempt: number }>()

export async function POST(request: Request) {
  try {
    const { email, embedding } = await request.json()

    if (!email || !embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 })
    }

    // 1. Rate Limiting (máximo 3 tentativas por minuto)
    const now = Date.now()
    const rl = rateLimits.get(email) || { attempts: 0, lastAttempt: 0 }
    
    // Se passaram 5 minutos, reseta as tentativas
    if (now - rl.lastAttempt > 5 * 60 * 1000) {
      rl.attempts = 0
    }

    if (rl.attempts >= 3) {
      return NextResponse.json({ error: 'Muitas tentativas falhas. Bloqueado por 5 minutos.' }, { status: 429 })
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 2. Busca userId pelo email em auth.users
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) throw error

    const user = users.find(u => u.email === email)

    if (!user) {
      rl.attempts += 1
      rl.lastAttempt = now
      rateLimits.set(email, rl)
      return NextResponse.json({ error: 'Credenciais inválidas ou rosto não reconhecido.' }, { status: 401 })
    }

    const userId = user.id

    // Registra sessão de auditoria
    const session = await createSession(supabaseAdmin, userId, 'login', 5)

    // 3. Busca embedding cadastrado
    const storedEmbedding = await getEmbedding(supabaseAdmin, userId)

    if (!storedEmbedding) {
      rl.attempts += 1
      rl.lastAttempt = now
      rateLimits.set(email, rl)
      await updateSessionResult(supabaseAdmin, session.token, { passed: false, distance: 1 })
      return NextResponse.json({ error: 'Usuário não possui biometria cadastrada.' }, { status: 401 })
    }

    // 4. Calcula distância euclidiana
    const result = verifyIdentity(embedding, storedEmbedding)

    await updateSessionResult(supabaseAdmin, session.token, result)

    if (!result.passed) {
      rl.attempts += 1
      rl.lastAttempt = now
      rateLimits.set(email, rl)
      return NextResponse.json({ error: 'Rosto não reconhecido.' }, { status: 401 })
    }

    // Reset rate limits on success
    rateLimits.delete(email)

    // 5. Cria sessão
    // NOTA: Como `supabaseAdmin.auth.admin.createSession` não existe na versão atual do JS Client,
    // o método oficial para criar uma sessão programaticamente sem senha é usar um token administrativo
    // gerado silenciosamente e verificá-lo (isso seta os cookies de sessão SSR no Next.js).
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    })

    if (linkError) throw linkError

    // 6. Seta os cookies na resposta através do cliente SSR
    const supabaseServer = await createClient()
    const { error: otpError } = await supabaseServer.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'magiclink'
    })

    if (otpError) throw otpError

    // 7. Retorna sucesso para o Frontend redirecionar
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[FaceAuth API - Login]', error)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
