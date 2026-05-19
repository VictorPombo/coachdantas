-- Migration: Módulo TotalPass CRM & Retenção
-- Descrição: Adiciona colunas para Streak Freezes, Score de Engajamento e tabelas auxiliares.

-- 1. NOVOS CAMPOS NA TABELA PROFILES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 50;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS conversion_potential TEXT DEFAULT 'low' CHECK (conversion_potential IN ('high', 'medium', 'low'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_checkin_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_checkins INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_freezes INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS converted_to_direct_at TIMESTAMPTZ;

-- Índices para performance nas novas colunas
CREATE INDEX IF NOT EXISTS idx_profiles_engagement_score ON profiles(engagement_score);
CREATE INDEX IF NOT EXISTS idx_profiles_conversion_potential ON profiles(conversion_potential);
CREATE INDEX IF NOT EXISTS idx_profiles_last_checkin ON profiles(last_checkin_at);


-- 2. TABELA DE ALERTAS (CRM)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'info')),
  is_read BOOLEAN DEFAULT false,
  coach_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(is_read, created_at DESC) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);


-- 3. SNAPSHOTS DE RANKING
CREATE TABLE IF NOT EXISTS ranking_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'alltime')),
  period_start DATE NOT NULL,
  period_end DATE,
  score NUMERIC(10,2) NOT NULL,
  position INTEGER,
  trend TEXT CHECK (trend IN ('up', 'down', 'same', 'new')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ranking_period ON ranking_snapshots(period_type, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_ranking_user ON ranking_snapshots(user_id, period_type);


-- 4. DESAFIOS (CHALLENGES)
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('frequency', 'performance', 'participation')),
  target_value NUMERIC NOT NULL,
  metric TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reward_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_challenges_active ON challenges(is_active, end_date);


-- 5. PROGRESSO DO ALUNO NOS DESAFIOS
CREATE TABLE IF NOT EXISTS challenge_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_value NUMERIC DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_challenge_progress_user ON challenge_progress(user_id);


-- 6. EVOLUÇÃO FÍSICA E FOTOS
CREATE TABLE IF NOT EXISTS body_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  measured_at DATE NOT NULL,
  weight NUMERIC(5,2),
  arm NUMERIC(5,1),
  chest NUMERIC(5,1),
  waist NUMERIC(5,1),
  hip NUMERIC(5,1),
  thigh NUMERIC(5,1),
  calf NUMERIC(5,1),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_body_measurements_user ON body_measurements(user_id, measured_at DESC);

CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('front', 'side', 'back')),
  taken_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_photos_user ON progress_photos(user_id, taken_at DESC);


-- 7. CONFIGURAÇÃO DE RLS (ROW LEVEL SECURITY)
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- Admins e Professores vêem tudo
CREATE POLICY admin_prof_all_alerts ON alerts FOR ALL USING (public.user_role() IN ('admin', 'professor'));
CREATE POLICY admin_prof_all_ranking ON ranking_snapshots FOR ALL USING (public.user_role() IN ('admin', 'professor'));
CREATE POLICY admin_prof_all_challenges ON challenges FOR ALL USING (public.user_role() IN ('admin', 'professor'));
CREATE POLICY admin_prof_all_progress ON challenge_progress FOR ALL USING (public.user_role() IN ('admin', 'professor'));
CREATE POLICY admin_prof_all_measurements ON body_measurements FOR ALL USING (public.user_role() IN ('admin', 'professor'));
CREATE POLICY admin_prof_all_photos ON progress_photos FOR ALL USING (public.user_role() IN ('admin', 'professor'));

-- Alunos vêem apenas os próprios dados (exceto Ranking Público e Desafios Ativos)
CREATE POLICY student_own_progress ON challenge_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY student_own_measurements ON body_measurements FOR SELECT USING (user_id = auth.uid());
CREATE POLICY student_own_photos ON progress_photos FOR SELECT USING (user_id = auth.uid());

CREATE POLICY student_read_ranking ON ranking_snapshots FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY student_read_challenges ON challenges FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);
