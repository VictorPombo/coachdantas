import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Escuta mudança de status de uma sessão específica.
 * Resolve quando status = 'done' ou 'failed'.
 * Rejeita quando token expira ou dá timeout.
 */
export async function waitForSessionResult(
  supabase: SupabaseClient,
  token: string,
  timeoutMs: number
): Promise<{ passed: boolean; distance: number; status: string }> {
  return new Promise((resolve, reject) => {
    let isFinished = false
    
    // Set timeout to prevent hanging forever
    const timer = setTimeout(() => {
      if (!isFinished) {
        isFinished = true
        supabase.removeChannel(channel)
        reject(new Error('Timeout waiting for session result'))
      }
    }, timeoutMs)

    const channel = supabase
      .channel(`session_${token}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'face_sessions',
          filter: `token=eq.${token}`
        },
        (payload) => {
          const newStatus = payload.new.status
          
          if (newStatus === 'done' || newStatus === 'failed') {
            if (!isFinished) {
              isFinished = true
              clearTimeout(timer)
              supabase.removeChannel(channel)
              
              resolve({
                passed: !!payload.new.passed,
                distance: payload.new.distance ?? 1.0,
                status: newStatus
              })
            }
          } else if (newStatus === 'expired') {
            if (!isFinished) {
              isFinished = true
              clearTimeout(timer)
              supabase.removeChannel(channel)
              reject(new Error('Session expired'))
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Verify if it hasn't finished already before we subscribed
          supabase
            .from('face_sessions')
            .select('status, passed, distance')
            .eq('token', token)
            .single()
            .then(({ data }) => {
              if (data && !isFinished) {
                if (data.status === 'done' || data.status === 'failed') {
                  isFinished = true
                  clearTimeout(timer)
                  supabase.removeChannel(channel)
                  resolve({
                    passed: !!data.passed,
                    distance: data.distance ?? 1.0,
                    status: data.status
                  })
                } else if (data.status === 'expired') {
                  isFinished = true
                  clearTimeout(timer)
                  supabase.removeChannel(channel)
                  reject(new Error('Session expired'))
                }
              }
            })
        }
      })
  })
}
