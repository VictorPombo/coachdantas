import { SupabaseClient } from '@supabase/supabase-js'
import { startCamera, stopCamera, captureEmbedding } from './FaceCapture'
import { upsertEmbedding } from './database/queries'

export interface EnrollmentResult {
  success: boolean
  error?: string
}

/**
 * Inicia a câmera, avalia a face e salva o embedding no banco (Server-side/API route usually or direct DB insert if RLS allows it).
 * Como a policy permite `usuario le proprio embedding` e `service role gerencia embeddings`,
 * o upsert precisará ser feito via uma API Route na qual passamos o token do Supabase,
 * ou diretamente do cliente se alterarmos a policy para permitir INSERT pelo dono do auth.uid().
 * No script schema.sql fornecido, a policy de INSERT não existe, o que indica que a gravação
 * DEVE ocorrer em Server-Side via Service Role chamando upsertEmbedding() na API.
 * 
 * Sendo assim, esta função no Client captura e devolve o array, e o flow chamará a API /enroll,
 * ou, se passada uma API function customizada no lugar do SupabaseClient direto.
 * 
 * Por padrão, esta função vai invocar a API Route `/api/enroll` para maior segurança.
 */
export async function enrollFace(
  userId: string,
  videoElement: HTMLVideoElement,
  onProgress?: (step: string) => void
): Promise<EnrollmentResult> {
  try {
    onProgress?.('Analisando rosto e iluminação...')
    
    // Captura os 5 frames, faz average e retorna o array 128-dimensional
    const embedding = await captureEmbedding(videoElement, onProgress)
    
    onProgress?.('Salvando biometria de forma segura...')
    
    // Envia para o Endpoint (Passo 5) que possui a Service Role key
    const response = await fetch('/api/face-auth/enroll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        embedding
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Falha ao salvar biometria no servidor.')
    }

    onProgress?.('Concluído!')
    
    return { success: true }
  } catch (error: any) {
    console.error('[FaceEnrollment] Erro:', error)
    return { success: false, error: error.message || 'Erro desconhecido durante o cadastro.' }
  }
}
