import { SupabaseClient } from '@supabase/supabase-js'

export type FaceSessionRow = {
  id: string
  user_id: string
  context: string | null
  token: string | null
  distance: number | null
  passed: boolean | null
  method: string | null
  status: string | null
  expires_at: string | null
  created_at: string
}

// Busca embedding cadastrado de um usuário
export async function getEmbedding(
  supabase: SupabaseClient,
  userId: string
): Promise<number[] | null> {
  const { data, error } = await supabase
    .from('face_embeddings')
    .select('embedding')
    .eq('user_id', userId)
    .single()

  if (error || !data || !data.embedding) return null

  // pgvector returns string or array depending on client parsing
  if (typeof data.embedding === 'string') {
    try {
      return JSON.parse(data.embedding)
    } catch {
      return null
    }
  }
  
  return data.embedding as number[]
}

// Salva ou substitui embedding de um usuário
export async function upsertEmbedding(
  supabase: SupabaseClient,
  userId: string,
  embedding: number[]
): Promise<void> {
  // Try to delete existing first (or we could use upsert if we had an ON CONFLICT constraint)
  await supabase.from('face_embeddings').delete().eq('user_id', userId)
  
  const { error } = await supabase.from('face_embeddings').insert({
    user_id: userId,
    embedding: JSON.stringify(embedding)
  })

  if (error) throw new Error('Failed to save embedding: ' + error.message)
}

// Verifica se usuário tem enrollment ativo
export async function hasEnrollment(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('face_embeddings')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
    
  if (error) return false
  return !!data
}

// Cria sessão de verificação (QR flow)
export async function createSession(
  supabase: SupabaseClient,
  userId: string,
  context: string,
  ttlMinutes: number
): Promise<{ token: string; expiresAt: string }> {
  // Generate a cryptographically secure random token (or UUID)
  const token = crypto.randomUUID().replace(/-/g, '')
  
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes)
  
  const { error } = await supabase.from('face_sessions').insert({
    user_id: userId,
    context,
    token,
    status: 'pending',
    expires_at: expiresAt.toISOString()
  })
  
  if (error) throw new Error('Failed to create session: ' + error.message)
  
  return { token, expiresAt: expiresAt.toISOString() }
}

// Busca sessão pelo token
export async function getSessionByToken(
  supabase: SupabaseClient,
  token: string
): Promise<{ userId: string; status: string; expiresAt: string } | null> {
  const { data, error } = await supabase
    .from('face_sessions')
    .select('user_id, status, expires_at')
    .eq('token', token)
    .single()
    
  if (error || !data) return null
  
  return {
    userId: data.user_id,
    status: data.status,
    expiresAt: data.expires_at
  }
}

// Atualiza resultado da sessão
export async function updateSessionResult(
  supabase: SupabaseClient,
  token: string,
  result: {
    passed: boolean
    distance: number
    embedding?: number[]
  }
): Promise<void> {
  const status = result.passed ? 'done' : 'failed'
  
  const payload: any = {
    status,
    passed: result.passed,
    distance: result.distance
  }
  
  if (result.embedding) {
    payload.embedding = JSON.stringify(result.embedding)
  }
  
  const { error } = await supabase
    .from('face_sessions')
    .update(payload)
    .eq('token', token)
    
  if (error) throw new Error('Failed to update session: ' + error.message)
}

// Busca histórico de verificações de um usuário
export async function getSessionHistory(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 10
): Promise<FaceSessionRow[]> {
  const { data, error } = await supabase
    .from('face_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  if (error || !data) return []
  return data as FaceSessionRow[]
}

// Deleta enrollment de um usuário (para reconfiguração)
export async function deleteEnrollment(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('face_embeddings')
    .delete()
    .eq('user_id', userId)
    
  if (error) throw new Error('Failed to delete enrollment: ' + error.message)
}
