import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    // 1. Validate authorization header (Basic protection for CRON)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('[CRON] Starting Engagement Score and Streak calculation...')

    // 2. Fetch all student profiles
    const { data: students, error: studentsError } = await supabaseAdmin
      .from('profiles')
      .select('id, current_streak, longest_streak, streak_freezes, last_checkin_at')
      .eq('role', 'student')

    if (studentsError) throw studentsError

    const now = new Date()
    const updates = []
    const alerts = []

    for (const student of students) {
      let { id, current_streak, longest_streak, streak_freezes, last_checkin_at } = student
      
      let daysSinceLastCheckin = 999
      if (last_checkin_at) {
        const lastCheckinDate = new Date(last_checkin_at)
        daysSinceLastCheckin = Math.floor((now.getTime() - lastCheckinDate.getTime()) / (1000 * 60 * 60 * 24))
      }

      // --- STREAK FREEZE LOGIC ---
      // If it's been more than 7 days, they missed a week.
      // In a real production system, this is better calculated on Sunday nights checking the calendar week.
      // For this daily CRON, if days >= 8, we apply freeze logic. 
      // To prevent consuming all freezes at once if they are gone for a month, we would need to track 'last_freeze_used_at'.
      // For MVP, we will assume if it's EXACTLY 8 days (or we just reset if > 7).
      
      let streakBroken = false
      if (daysSinceLastCheckin === 8) { 
        // Exactly on the 8th day of absence, we decide the fate of the streak
        if (streak_freezes > 0) {
          streak_freezes -= 1
          console.log(`[CRON] Student ${id} used a Streak Freeze! Remaining: ${streak_freezes}`)
          alerts.push({
            user_id: id,
            alert_type: 'streak_freeze_used',
            message: 'O aluno utilizou um Congelamento de Ofensiva (Streak Freeze) para não perder a sequência!',
            priority: 'info'
          })
        } else {
          current_streak = 0
          streakBroken = true
          alerts.push({
            user_id: id,
            alert_type: 'streak_broken',
            message: 'O aluno perdeu a sequência de treinos (Streak = 0).',
            priority: 'medium'
          })
        }
      } else if (daysSinceLastCheckin > 8 && current_streak > 0) {
        // If they are gone for longer and have no freezes left (or we don't want to burn multiple freezes in a row automatically without them buying more)
        current_streak = 0
        streakBroken = true
      }

      // --- SCORE CALCULATION ---
      let score = 50 // Base score

      // 1. Time without training
      if (daysSinceLastCheckin <= 3) score += 10
      else if (daysSinceLastCheckin >= 4 && daysSinceLastCheckin <= 7) score -= 5
      else if (daysSinceLastCheckin >= 8 && daysSinceLastCheckin <= 14) score -= 10
      else if (daysSinceLastCheckin > 14) score -= 20

      // 2. Consistency (Streak)
      if (current_streak >= 5) score += 20
      else if (current_streak === 4) score += 16
      else if (current_streak === 3) score += 12
      else if (current_streak === 2) score += 8
      else if (current_streak === 1) score += 4

      // Clamp score between 0 and 100
      score = Math.max(0, Math.min(100, score))

      // --- CONVERSION POTENTIAL (ELITE PLAN) ---
      let conversion_potential = 'low'
      if (score >= 70 && current_streak >= 3) {
        conversion_potential = 'high'
        
        // Se ficou 'high' e treina com consistência, gera alerta pro Admin
        alerts.push({
          user_id: id,
          alert_type: 'elite_conversion',
          message: `🟢 Retenção Forte | 🔥 Chance Premium: ${score}%. Convidar para Plano Elite!`,
          priority: 'high'
        })
      } else if (score >= 50) {
        conversion_potential = 'medium'
      }

      updates.push({
        id,
        current_streak,
        longest_streak: Math.max(current_streak, longest_streak || 0),
        streak_freezes,
        engagement_score: score,
        conversion_potential
      })
    }

    // 3. Apply updates to the database
    if (updates.length > 0) {
      for (const update of updates) {
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            current_streak: update.current_streak,
            longest_streak: update.longest_streak,
            streak_freezes: update.streak_freezes,
            engagement_score: update.engagement_score,
            conversion_potential: update.conversion_potential
          })
          .eq('id', update.id)
        
        if (updateError) throw updateError
      }
    }

    // 4. Insert Alerts
    if (alerts.length > 0) {
      const { error: alertsError } = await supabaseAdmin
        .from('alerts')
        .insert(alerts)
      
      if (alertsError) throw alertsError
    }

    console.log(`[CRON] Processed ${students.length} students successfully. Generated ${alerts.length} alerts.`)

    return NextResponse.json({ success: true, processed: students.length })
  } catch (error: any) {
    console.error('[CRON Error]', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
