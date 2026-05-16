import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { upsertEmbedding } from '../../database/queries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, embedding } = body

    if (!userId || !embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 })
    }

    // Usa Service Role para bypassar RLS e inserir/atualizar na tabela segura
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await upsertEmbedding(supabaseAdmin, userId, embedding)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[FaceAuth API - Enroll]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
