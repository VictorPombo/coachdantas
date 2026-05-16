import { captureEmbedding } from './FaceCapture'
import { FaceVerifyResult } from './FaceVerification'

/**
 * Interface unificada para retorno do login facial
 */
export interface FaceLoginResult extends FaceVerifyResult {
  error?: string
}

/**
 * Fluxo completo de Login Facial no lado do Cliente.
 * 1. Captura o rosto usando a webcam local.
 * 2. Envia para a API `/api/verify` (que possui privilégios de leitura do embedding armazenado do usuário).
 * 3. Retorna o resultado da verificação ({ passed, distance, confidence }).
 * 
 * Assumimos que o usuário digitou o e-mail (ou já foi pré-identificado via sessão)
 * para sabermos qual userId estamos verificando.
 */
export async function verifyFaceLogin(
  userId: string,
  videoElement: HTMLVideoElement,
  onProgress?: (step: string) => void
): Promise<FaceLoginResult> {
  try {
    onProgress?.('Ajustando captura da face...')
    
    // Captura o embedding
    const embedding = await captureEmbedding(videoElement, onProgress)
    
    onProgress?.('Verificando identidade...')
    
    // Envia o embedding capturado para a API Server-Side realizar a comparação euclidiana.
    // Isso é mais seguro pois o embedding mestre (cadastrado) não precisa ser trafegado pro front.
    const response = await fetch('/api/face-auth/verify', {
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
      throw new Error(errorData.error || 'Falha ao comunicar com o servidor de verificação.')
    }

    const resultData: FaceVerifyResult = await response.json()
    
    return resultData
  } catch (error: any) {
    console.error('[FaceLogin] Erro:', error)
    return {
      passed: false,
      distance: 1.0,
      confidence: 'failed',
      error: error.message || 'Erro inesperado na verificação.'
    }
  }
}
