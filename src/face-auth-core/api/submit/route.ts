import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSessionByToken, getEmbedding, updateSessionResult } from '../../database/queries'
import { verifyIdentity } from '../../FaceVerification'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, embedding } = body

    if (!token || !embedding) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Busca a sessão e verifica TTL
    const session = await getSessionByToken(supabaseAdmin, token)
    
    if (!session) {
      return NextResponse.json({ error: 'Sessão inválida ou não encontrada.' }, { status: 404 })
    }

    if (new Date() > new Date(session.expiresAt)) {
      // Atualiza status para expired (poderia ser feito aqui, mas a subscription cuida na origem se demorar)
      return NextResponse.json({ error: 'Sessão expirada.' }, { status: 410 })
    }

    if (session.status !== 'pending') {
      return NextResponse.json({ error: `Sessão já processada com status: ${session.status}` }, { status: 400 })
    }

    // 2. Busca o embedding mestre do dono da sessão
    const storedEmbedding = await getEmbedding(supabaseAdmin, session.userId)

    if (!storedEmbedding) {
      await updateSessionResult(supabaseAdmin, token, { passed: false, distance: 1.0 })
      return NextResponse.json({ error: 'Usuário não possui cadastro facial.' }, { status: 404 })
    }

    // 3. Compara
    const result = verifyIdentity(embedding, storedEmbedding)

    // 4. Salva resultado (isso vai disparar o realtime event para quem gerou o QR Code)
    await updateSessionResult(supabaseAdmin, token, {
      passed: result.passed,
      distance: result.distance,
      embedding: embedding // Opcional, guarda o histórico de quem tentou
    })

    return NextResponse.json({ success: true, passed: result.passed, confidence: result.confidence })
  } catch (error: any) {
    console.error('[FaceAuth API - Submit]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
