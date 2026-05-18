import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { getAllEmbeddings, createSession, updateSessionResult, acceptTerms } from '@/face-auth-core/database/queries'
import { euclideanDistance } from '@/face-auth-core/FaceVerification'

// Limite simples de tentativas em memória
// Agora indexado pelo IP ou 'global' já que não temos o email primeiro
const rateLimits = new Map<string, { attempts: number, lastAttempt: number }>()

export async function POST(request: Request) {
  try {
    const { embedding, acceptedTerms } = await request.json()

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 })
    }

    // 1. Rate Limiting (máximo 5 tentativas por minuto global/IP)
    const ip = request.headers.get('x-forwarded-for') || 'global'
    const now = Date.now()
    const rl = rateLimits.get(ip) || { attempts: 0, lastAttempt: 0 }
    
    if (now - rl.lastAttempt > 5 * 60 * 1000) {
      rl.attempts = 0
    }

    if (rl.attempts >= 5) {
      return NextResponse.json({ error: 'Muitas tentativas falhas. Bloqueado por 5 minutos.' }, { status: 429 })
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 2. Busca todos os embeddings (1:N search)
    const allEmbeddings = await getAllEmbeddings(supabaseAdmin)

    if (allEmbeddings.length === 0) {
      rl.attempts += 1
      rl.lastAttempt = now
      rateLimits.set(ip, rl)
      return NextResponse.json({ error: 'Nenhuma biometria cadastrada no sistema.' }, { status: 401 })
    }

    // 3. Calcula a distância de todos os usuários em relação ao rosto capturado
    const sorted = allEmbeddings
      .map(({ userId, embedding: storedEmbedding, termsAcceptedAt }) => ({
        userId,
        termsAcceptedAt,
        distance: euclideanDistance(embedding, storedEmbedding)
      }))
      .sort((a, b) => a.distance - b.distance)

    const best = sorted[0]
    const second = sorted[1]

    // 4. Regra de Segurança Rigorosa
    // 1. Melhor match tem distância < 0.45 (alta confiança)
    // 2. Gap entre 1º e 2º lugar é > 0.15 (match inequívoco)
    const approved = 
      best.distance < 0.45 && 
      (!second || (second.distance - best.distance) > 0.15)

    if (!approved) {
      rl.attempts += 1
      rl.lastAttempt = now
      rateLimits.set(ip, rl)
      
      // Registra a tentativa falha
      const session = await createSession(supabaseAdmin, best.userId, 'login_1_n', 5)
      await updateSessionResult(supabaseAdmin, session.token, { passed: false, distance: best.distance })
      
      return NextResponse.json({ error: 'Não foi possível identificar. Use login com senha.' }, { status: 401 })
    }

    // 5. Regra LGPD: Termos de Uso Obrigatórios
    if (!best.termsAcceptedAt && !acceptedTerms) {
      // Bloqueia sessão e pede para usuário aceitar os termos
      return NextResponse.json({ error: 'terms_required' }, { status: 403 })
    }

    if (!best.termsAcceptedAt && acceptedTerms) {
      // Grava o aceite silenciosamente para o usuário legado que acabou de aceitar
      await acceptTerms(supabaseAdmin, best.userId)
    }

    const userId = best.userId

    // Registra auditoria de sucesso
    const session = await createSession(supabaseAdmin, userId, 'login_1_n', 5)
    await updateSessionResult(supabaseAdmin, session.token, { passed: true, distance: best.distance })

    // Reset rate limits on success
    rateLimits.delete(ip)

    // 5. Encontra o e-mail do usuário validado para gerar a sessão
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (userError || !user || !user.email) {
      return NextResponse.json({ error: 'Conta de usuário inválida.' }, { status: 500 })
    }

    const email = user.email

    // 6. Cria sessão mágica programaticamente
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    })

    if (linkError) throw linkError

    // 7. Seta os cookies na resposta através do cliente SSR
    const supabaseServer = await createClient()
    const { error: otpError } = await supabaseServer.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: 'magiclink'
    })

    if (otpError) throw otpError

    // Retorna sucesso para o Frontend redirecionar
    return NextResponse.json({ success: true, email })
  } catch (error: any) {
    console.error('[FaceAuth API - Login]', error)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
