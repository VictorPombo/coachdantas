import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSession } from '../../database/queries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, context, ttlMinutes = 5 } = body

    if (!userId || !context) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Cria a sessão com TTL
    const { token, expiresAt } = await createSession(supabaseAdmin, userId, context, ttlMinutes)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verificationUrl = `${appUrl}/face-auth/${token}`

    return NextResponse.json({ 
      token, 
      url: verificationUrl, 
      expiresAt 
    })
  } catch (error: any) {
    console.error('[FaceAuth API - Session]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
