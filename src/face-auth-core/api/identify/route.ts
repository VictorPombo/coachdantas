import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAllEmbeddings } from '../../database/queries'
import { euclideanDistance } from '../../FaceVerification'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { embedding } = body

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const allEmbeddings = await getAllEmbeddings(supabaseAdmin)

    if (allEmbeddings.length === 0) {
      return NextResponse.json({ error: 'Nenhum rosto cadastrado no sistema.' }, { status: 404 })
    }

    let bestMatch = null
    let minDistance = Infinity

    for (const record of allEmbeddings) {
      if (record.embedding.length === embedding.length) {
        const distance = euclideanDistance(embedding, record.embedding)
        if (distance < minDistance) {
          minDistance = distance
          bestMatch = record.userId
        }
      }
    }

    // Usando o threshold de 'normal' confidence (0.6) conforme verifyIdentity
    if (minDistance < 0.6 && bestMatch) {
      // Retorna o perfil também
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('full_name')
        .eq('id', bestMatch)
        .single();
        
      if (profileError) {
        console.error("Erro ao buscar perfil do usuário reconhecido:", profileError);
      }
        
      let userName = 'Desconhecido';
      if (profile && profile.full_name && profile.full_name.trim() !== '') {
        userName = profile.full_name;
      }
        
      return NextResponse.json({ 
        passed: true, 
        distance: minDistance, 
        userId: bestMatch,
        name: userName
      })
    }

    return NextResponse.json({ 
      passed: false, 
      distance: minDistance, 
      error: 'Rosto não reconhecido ou distância maior que o limite seguro.' 
    })
  } catch (error: any) {
    console.error('[FaceAuth API - Identify]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
