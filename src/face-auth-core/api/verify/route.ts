import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getEmbedding } from '../../database/queries'
import { verifyIdentity } from '../../FaceVerification'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, embedding } = body

    if (!userId || !embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Busca o embedding armazenado em banco para o usuário
    const storedEmbedding = await getEmbedding(supabaseAdmin, userId)

    if (!storedEmbedding) {
      return NextResponse.json({ error: 'Rosto não cadastrado no banco.' }, { status: 404 })
    }

    // Valida a identidade de forma segura no backend
    const result = verifyIdentity(embedding, storedEmbedding)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[FaceAuth API - Verify]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
