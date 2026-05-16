export type ConfidenceLevel = 'high' | 'normal' | 'uncertain' | 'failed'

export interface FaceVerifyResult {
  passed: boolean
  distance: number
  confidence: ConfidenceLevel
}

/**
 * Calcula a Distância Euclidiana entre dois embeddings de 128 dimensões.
 * Quanto menor a distância, maior a similaridade.
 */
export function euclideanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Embeddings must have the same dimension length')
  }

  let sum = 0
  for (let i = 0; i < vec1.length; i++) {
    sum += Math.pow(vec1[i] - vec2[i], 2)
  }

  return Math.sqrt(sum)
}

/**
 * Calcula a Similaridade de Cosseno entre dois embeddings (opcional, dependendo do modelo do banco de dados).
 * Usado pelo pgvector (vector_cosine_ops) se quisermos manter compatibilidade.
 * Valor varia de -1 a 1, onde 1 é idêntico.
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    normA += vec1[i] * vec1[i]
    normB += vec2[i] * vec2[i]
  }
  
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Valida a identidade de um usuário comparando o embedding capturado 
 * com o embedding armazenado em banco, utilizando Distância Euclidiana.
 * 
 * Regras:
 * - distancia < 0.5 → APROVADO alta confiança
 * - distancia < 0.6 → APROVADO confiança normal
 * - distancia < 0.7 → INCERTO pede nova captura
 * - distancia >= 0.7 → REPROVADO pessoa diferente
 */
export function verifyIdentity(captured: number[], stored: number[]): FaceVerifyResult {
  const distance = euclideanDistance(captured, stored)

  if (distance < 0.5) {
    return { passed: true, distance, confidence: 'high' }
  } 
  
  if (distance < 0.6) {
    return { passed: true, distance, confidence: 'normal' }
  }
  
  if (distance < 0.7) {
    return { passed: false, distance, confidence: 'uncertain' }
  }
  
  return { passed: false, distance, confidence: 'failed' }
}
