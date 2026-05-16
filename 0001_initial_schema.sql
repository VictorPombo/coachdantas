
-- DROPS DE SEGURANÇA PARA PERMITIR RODAR MÚLTIPLAS VEZES
DROP TABLE IF EXISTS store_orders CASCADE;
DROP TABLE IF EXISTS store_products CASCADE;
DROP TABLE IF EXISTS profile_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS workout_exercises CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS class_enrollments CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS modalities CASCADE;
DROP TABLE IF EXISTS whatsapp_templates CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS enrollment_status CASCADE;
DROP TYPE IF EXISTS billing_cycle CASCADE;
DROP TYPE IF EXISTS weekday CASCADE;
DROP TYPE IF EXISTS product_type CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

DROP FUNCTION IF EXISTS update_updated_at CASCADE;
DROP FUNCTION IF EXISTS public.user_role CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- ============================================================
-- Coach Dantas - Migration Inicial Completa
-- Criado para Supabase (PostgreSQL 15+)
-- ============================================================
-- Este arquivo cria TODA a estrutura de banco de dados do sistema.
-- Tabelas de fases futuras (Loja, Gamificação) já estão aqui
-- para evitar reestruturação depois.
-- ============================================================

-- ========================
-- 1. ENUMs (Listas fechadas de opções válidas)
-- ========================
-- ENUMs garantem que ninguém insira um valor inválido no banco.
-- Ex: o status de uma assinatura SÓ pode ser 'active', 'past_due' ou 'canceled'.

CREATE TYPE user_role AS ENUM ('admin', 'student');

CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trial');

CREATE TYPE enrollment_status AS ENUM ('confirmed', 'canceled');

CREATE TYPE billing_cycle AS ENUM ('monthly', 'quarterly', 'semiannual', 'annual');

CREATE TYPE weekday AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

CREATE TYPE product_type AS ENUM ('workshop', 'ebook', 'physical', 'mentorship');

CREATE TYPE order_status AS ENUM ('pending', 'paid', 'refunded', 'canceled');


-- ========================
-- 2. TABELAS CORE (Perfis e Modalidades)
-- ========================

-- profiles: Extensão do auth.users do Supabase.
-- Cada usuário que faz login tem um registro aqui com seus dados extras.
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'student',
  full_name   TEXT NOT NULL,
  phone       TEXT,                          -- WhatsApp do aluno (formato: 5521999999999)
  avatar_url  TEXT,
  goal        TEXT,                          -- Ex: "Condicionamento e Força" (campo da tela do aluno)
  coach_notes TEXT,                          -- Anotações livres do coach sobre o aluno
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- modalities: Modalidades do estúdio (Funcional, Surf Training, Natação, etc.)
CREATE TABLE modalities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,          -- Ex: "Funcional Inteligente"
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ========================
-- 3. TABELAS FINANCEIRAS (Planos, Assinaturas)
-- ========================

-- plans: Catálogo de planos vendidos pelo coach.
CREATE TABLE plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,              -- Ex: "3x/semana (Tatame)"
  price           NUMERIC(10,2) NOT NULL,     -- Ex: 516.00
  billing_cycle   billing_cycle NOT NULL DEFAULT 'monthly',
  modality_id     UUID REFERENCES modalities(id) ON DELETE SET NULL,
  max_sessions    INT,                        -- Limite de aulas por semana (NULL = ilimitado)
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- subscriptions: Vínculo ativo entre aluno e plano.
-- É aqui que o sistema checa se o aluno pode fazer check-in ou está bloqueado.
CREATE TABLE subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id             UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  status              subscription_status NOT NULL DEFAULT 'active',
  asaas_customer_id   TEXT,                   -- ID do cliente no Asaas (para cobranças automáticas)
  asaas_subscription_id TEXT,                 -- ID da assinatura recorrente no Asaas
  current_period_start TIMESTAMPTZ,
  current_period_end  TIMESTAMPTZ,            -- Data de vencimento atual
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para buscar rápido a assinatura do aluno
CREATE INDEX idx_subscriptions_profile ON subscriptions(profile_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);


-- ========================
-- 4. GRADE DE AULAS E PRESENÇA
-- ========================

-- classes: Cada linha é uma aula específica num horário.
-- Pode ser recorrente (toda terça 18h) ou avulsa.
CREATE TABLE classes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modality_id   UUID NOT NULL REFERENCES modalities(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  weekday       weekday NOT NULL,             -- Dia da semana fixo
  start_time    TIME NOT NULL,                -- Ex: '18:00'
  end_time      TIME NOT NULL,                -- Ex: '19:00'
  location      TEXT,                         -- Ex: "Tatame", "Piscina"
  max_capacity  INT NOT NULL DEFAULT 6,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- class_enrollments: Quando o aluno clica "Confirmar" na próxima aula.
-- Diferente do check-in — aqui é a intenção de ir, não a presença física.
CREATE TABLE class_enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_date  DATE NOT NULL,                  -- Data específica da aula (ex: 2026-05-18)
  status      enrollment_status NOT NULL DEFAULT 'confirmed',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Impede o mesmo aluno confirmar duas vezes na mesma aula do mesmo dia
  UNIQUE(class_id, profile_id, class_date)
);

CREATE INDEX idx_enrollments_class_date ON class_enrollments(class_id, class_date);
CREATE INDEX idx_enrollments_profile ON class_enrollments(profile_id);

-- checkins: Registro FÍSICO de presença via QR Code.
-- É o que alimenta o streak, gamificação e gráficos de frequência.
CREATE TABLE checkins (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id        UUID REFERENCES classes(id) ON DELETE SET NULL,  -- Pode ser NULL se veio sem agendar
  checked_in_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  validated_by    UUID REFERENCES profiles(id) ON DELETE SET NULL  -- Qual admin validou o QR
);

CREATE INDEX idx_checkins_profile ON checkins(profile_id);
CREATE INDEX idx_checkins_date ON checkins(checked_in_at);


-- ========================
-- 5. TREINOS E EXERCÍCIOS
-- ========================

-- exercises: Banco de exercícios com vídeo do YouTube.
CREATE TABLE exercises (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,                -- Ex: "Agachamento Búlgaro"
  muscle_group  TEXT NOT NULL,                -- Ex: "Quadríceps", "Core"
  video_url     TEXT,                         -- Link não listado do YouTube
  description   TEXT,                         -- Instruções de execução
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- workouts: Ficha de treino do aluno (A, B, C).
CREATE TABLE workouts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,                  -- Ex: "Treino A", "Treino B"
  is_active   BOOLEAN NOT NULL DEFAULT true,  -- Só os ativos aparecem pro aluno
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workouts_profile ON workouts(profile_id);

-- workout_exercises: Detalhe de cada exercício dentro de um treino.
-- Aqui ficam séries, repetições, carga e observações do coach.
CREATE TABLE workout_exercises (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id    UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id   UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sort_order    INT NOT NULL DEFAULT 0,       -- Ordem de execução no treino
  sets          INT NOT NULL DEFAULT 3,       -- Quantidade de séries
  reps          TEXT NOT NULL DEFAULT '12',   -- Repetições (TEXT porque pode ser "8-12" ou "30s")
  rest_seconds  INT,                          -- Descanso entre séries em segundos
  load          TEXT,                         -- Carga sugerida (ex: "20kg", "elástico médio")
  notes         TEXT,                         -- Obs individual do coach
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);


-- ========================
-- 6. AVALIAÇÕES E EVOLUÇÃO
-- ========================
-- Alimenta a tela "Sua Evolução" com gráfico de peso e skills.

CREATE TABLE assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assessed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg   NUMERIC(5,2),                   -- Ex: 78.50
  body_fat    NUMERIC(5,2),                   -- Percentual de gordura (opcional)
  -- Skills avaliadas pelo coach (0 a 100)
  skill_strength    INT CHECK (skill_strength BETWEEN 0 AND 100),
  skill_mobility    INT CHECK (skill_mobility BETWEEN 0 AND 100),
  skill_endurance   INT CHECK (skill_endurance BETWEEN 0 AND 100),
  notes       TEXT,                           -- Ex: "Perdeu 2kg. Resistência subiu muito."
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assessments_profile ON assessments(profile_id);


-- ========================
-- 7. GAMIFICAÇÃO
-- ========================

-- achievements: Catálogo de conquistas/badges do sistema.
CREATE TABLE achievements (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,             -- Ex: "Esquentando"
  description       TEXT,                      -- Ex: "5 treinos seguidos"
  icon              TEXT,                      -- Emoji ou URL do ícone (ex: "🔥")
  category          TEXT,                      -- Agrupamento (ex: "streak", "meta", "special")
  required_checkins INT,                       -- Quantos check-ins para desbloquear (NULL = manual)
  xp_reward         INT NOT NULL DEFAULT 0,    -- Quanto XP o aluno ganha
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- profile_achievements: Quais badges cada aluno já desbloqueou.
CREATE TABLE profile_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(profile_id, achievement_id)
);

CREATE INDEX idx_profile_achievements_profile ON profile_achievements(profile_id);


-- ========================
-- 8. LOJA INTERNA
-- ========================

CREATE TABLE store_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,                   -- Ex: "Workshop Mobilidade Avançada"
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  type        product_type NOT NULL,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE store_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES store_products(id) ON DELETE RESTRICT,
  status          order_status NOT NULL DEFAULT 'pending',
  asaas_payment_id TEXT,                       -- ID do pagamento no Asaas
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_store_orders_profile ON store_orders(profile_id);


-- ========================
-- 9. TEMPLATES DE WHATSAPP (Configurações)
-- ========================
-- Armazena os templates editáveis da tela de Configurações.

CREATE TABLE whatsapp_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,            -- Identificador fixo (ex: "class_reminder", "billing_warning")
  name        TEXT NOT NULL,                   -- Nome amigável (ex: "Lembrete de Aula")
  template    TEXT NOT NULL,                   -- Corpo da mensagem com variáveis {nome}, {horario}, etc.
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ========================
-- 10. FUNÇÕES AUXILIARES
-- ========================

-- Função reutilizável para atualizar o campo updated_at automaticamente.
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplica o trigger nas tabelas que têm updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_workouts_updated_at
  BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_whatsapp_templates_updated_at
  BEFORE UPDATE ON whatsapp_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ========================
-- 11. FUNÇÃO DE ROLE DO USUÁRIO (para RLS)
-- ========================

-- Busca a role do usuário logado direto da tabela profiles.
-- Usada pelas políticas de segurança abaixo.
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ========================
-- 12. RLS (Row Level Security) - Controle de Acesso
-- ========================
-- RLS = cada usuário só vê/edita o que tem permissão.
-- Sem isso, qualquer aluno logado poderia ver dados de todos.

-- Ativa RLS em TODAS as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;


-- ---------------------
-- ADMIN: acesso total a tudo
-- ---------------------
-- Uma política genérica para cada tabela: se é admin, pode tudo.

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles', 'modalities', 'plans', 'subscriptions',
      'classes', 'class_enrollments', 'checkins',
      'exercises', 'workouts', 'workout_exercises',
      'assessments', 'achievements', 'profile_achievements',
      'store_products', 'store_orders', 'whatsapp_templates'
    ])
  LOOP
    EXECUTE format(
      'CREATE POLICY admin_full_access ON %I FOR ALL USING (public.user_role() = ''admin'') WITH CHECK (public.user_role() = ''admin'')',
      tbl
    );
  END LOOP;
END $$;


-- ---------------------
-- ALUNO: acesso restrito aos próprios dados
-- ---------------------

-- Perfil: aluno vê e edita apenas o próprio
CREATE POLICY student_own_profile ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY student_update_own_profile ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Modalidades e Planos: aluno pode ver (são públicos), mas não editar
CREATE POLICY student_read_modalities ON modalities
  FOR SELECT USING (true);

CREATE POLICY student_read_plans ON plans
  FOR SELECT USING (true);

-- Assinatura: aluno vê apenas a própria
CREATE POLICY student_own_subscription ON subscriptions
  FOR SELECT USING (profile_id = auth.uid());

-- Aulas: aluno pode ver a grade (pública)
CREATE POLICY student_read_classes ON classes
  FOR SELECT USING (true);

-- Agendamento: aluno vê os próprios e pode criar/cancelar
CREATE POLICY student_own_enrollments_select ON class_enrollments
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY student_own_enrollments_insert ON class_enrollments
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY student_own_enrollments_update ON class_enrollments
  FOR UPDATE USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Check-ins: aluno vê os próprios (não pode criar — só o admin/sistema cria)
CREATE POLICY student_own_checkins ON checkins
  FOR SELECT USING (profile_id = auth.uid());

-- Exercícios: aluno pode ver (precisa para a tela de treino)
CREATE POLICY student_read_exercises ON exercises
  FOR SELECT USING (true);

-- Treinos: aluno vê apenas os próprios
CREATE POLICY student_own_workouts ON workouts
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY student_own_workout_exercises ON workout_exercises
  FOR SELECT USING (
    workout_id IN (SELECT id FROM workouts WHERE profile_id = auth.uid())
  );

-- Avaliações: aluno vê as próprias
CREATE POLICY student_own_assessments ON assessments
  FOR SELECT USING (profile_id = auth.uid());

-- Conquistas: catálogo é público, desbloqueios são pessoais
CREATE POLICY student_read_achievements ON achievements
  FOR SELECT USING (true);

CREATE POLICY student_own_profile_achievements ON profile_achievements
  FOR SELECT USING (profile_id = auth.uid());

-- Loja: produtos são públicos, pedidos são pessoais
CREATE POLICY student_read_products ON store_products
  FOR SELECT USING (true);

CREATE POLICY student_own_orders ON store_orders
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY student_create_order ON store_orders
  FOR INSERT WITH CHECK (profile_id = auth.uid());

-- Templates WhatsApp: aluno não precisa ver
-- (sem policy = sem acesso, que é o comportamento padrão do RLS)


-- ========================
-- 13. TRIGGER: Criar profile automaticamente ao cadastrar usuário
-- ========================
-- Quando o Admin cria um usuário via Supabase Auth,
-- essa função cria o registro correspondente em profiles.

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student'),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
