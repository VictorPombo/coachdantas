-- ============================================================
-- Coach Dantas - Seed Data (Dados de Teste)
-- ============================================================
-- Popula o banco com dados realistas para testar as telas.
-- ATENÇÃO: Os UUIDs dos usuários Auth precisam ser criados
-- ANTES deste seed rodar. Em ambiente local, use a Supabase
-- Dashboard ou a Admin API para criar os 4 usuários abaixo,
-- e então substitua os IDs fixos por IDs reais.
-- ============================================================

-- IDs fixos para referência (substituir pelos reais do auth.users)
-- Admin:        '12ba29a5-df0f-472d-b06b-c82601eb32e1'
-- Aluno Victor: 'ecc0f96b-3c03-4dda-b4d4-fdec9509b672'
-- Aluno Marina: 'd7553af1-ecd4-4d2d-a3a2-2fe9a7b29deb'
-- Aluno Diego:  '25dd9f93-71fe-4fb6-92e8-56e1419fd237'


-- ========================
-- PROFILES (já criados pelo trigger on_auth_user_created)
-- Aqui fazemos UPDATE para completar os dados.
-- ========================

-- Se estiver rodando SEM o trigger (ex: seed direto), descomente os INSERTs:
INSERT INTO profiles (id, role, full_name, phone, goal) VALUES
  ('12ba29a5-df0f-472d-b06b-c82601eb32e1', 'admin',   'Leandro Dantas',  '5521999990001', NULL),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'student', 'Victor Assis',    '5521999990002', 'Condicionamento e Força'),
  ('d7553af1-ecd4-4d2d-a3a2-2fe9a7b29deb', 'student', 'Marina Lima',     '5521999990003', 'Emagrecimento'),
  ('25dd9f93-71fe-4fb6-92e8-56e1419fd237', 'student', 'Diego Takahashi', '5521999990004', 'Performance Esportiva');


-- ========================
-- MODALIDADES
-- ========================

INSERT INTO modalities (id, name, description) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Funcional Inteligente', 'Treino funcional com foco em movimento natural e força aplicada.'),
  ('11111111-0000-0000-0000-000000000002', 'Surf Training',        'Preparação física específica para surfistas.'),
  ('11111111-0000-0000-0000-000000000003', 'Natação',              'Aulas de natação para todos os níveis.'),
  ('11111111-0000-0000-0000-000000000004', 'Natural Move',         'Movimento natural: escalada, equilíbrio e locomoção.'),
  ('11111111-0000-0000-0000-000000000005', 'Preparação de Atletas','Treinamento de alto rendimento para atletas competidores.');


-- ========================
-- PLANOS
-- ========================

INSERT INTO plans (id, name, price, billing_cycle, modality_id, max_sessions) VALUES
  ('22222222-0000-0000-0000-000000000001', '3x/semana (Tatame)',     516.00, 'monthly',    '11111111-0000-0000-0000-000000000001', 3),
  ('22222222-0000-0000-0000-000000000002', '5x/semana (Tatame)',     720.00, 'monthly',    '11111111-0000-0000-0000-000000000001', 5),
  ('22222222-0000-0000-0000-000000000003', 'Surf Training Mensal',   580.00, 'monthly',    '11111111-0000-0000-0000-000000000002', 3),
  ('22222222-0000-0000-0000-000000000004', 'Natação 2x/semana',      420.00, 'monthly',    '11111111-0000-0000-0000-000000000003', 2),
  ('22222222-0000-0000-0000-000000000005', 'Trimestral Funcional',  1400.00, 'quarterly',  '11111111-0000-0000-0000-000000000001', 3);


-- ========================
-- ASSINATURAS
-- Victor: ativo | Marina: pendente | Diego: atrasado há 16 dias
-- ========================

INSERT INTO subscriptions (profile_id, plan_id, status, current_period_start, current_period_end) VALUES
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', '22222222-0000-0000-0000-000000000001', 'active',   '2026-05-01', '2026-05-31'),
  ('d7553af1-ecd4-4d2d-a3a2-2fe9a7b29deb', '22222222-0000-0000-0000-000000000003', 'past_due',  '2026-04-01', '2026-04-30'),
  ('25dd9f93-71fe-4fb6-92e8-56e1419fd237', '22222222-0000-0000-0000-000000000005', 'past_due',  '2026-02-01', '2026-04-30');


-- ========================
-- GRADE DE AULAS (Horários recorrentes)
-- ========================

INSERT INTO classes (id, modality_id, instructor_id, weekday, start_time, end_time, location, max_capacity) VALUES
  ('c0000000-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '12ba29a5-df0f-472d-b06b-c82601eb32e1', 'monday',    '06:00', '07:00', 'Tatame', 6),
  ('c0000000-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', '12ba29a5-df0f-472d-b06b-c82601eb32e1', 'monday',    '07:00', '08:00', 'Tatame', 6),
  ('c0000000-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003', '12ba29a5-df0f-472d-b06b-c82601eb32e1', 'monday',    '16:00', '17:00', 'Piscina', 4),
  ('c0000000-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004', '12ba29a5-df0f-472d-b06b-c82601eb32e1', 'monday',    '18:00', '19:00', 'Tatame', 6),
  ('c0000000-0000-0000-0000-000000000005', '11111111-0000-0000-0000-000000000001', '12ba29a5-df0f-472d-b06b-c82601eb32e1', 'wednesday', '06:00', '07:00', 'Tatame', 6),
  ('c0000000-0000-0000-0000-000000000006', '11111111-0000-0000-0000-000000000002', '12ba29a5-df0f-472d-b06b-c82601eb32e1', 'wednesday', '07:00', '08:00', 'Tatame', 6),
  ('c0000000-0000-0000-0000-000000000007', '11111111-0000-0000-0000-000000000001', '12ba29a5-df0f-472d-b06b-c82601eb32e1', 'friday',    '06:00', '07:00', 'Tatame', 6),
  ('c0000000-0000-0000-0000-000000000008', '11111111-0000-0000-0000-000000000004', '12ba29a5-df0f-472d-b06b-c82601eb32e1', 'friday',    '18:00', '19:00', 'Tatame', 6);


-- ========================
-- CHECK-INS SIMULADOS (último mês — alimenta gráficos e streaks)
-- ========================

INSERT INTO checkins (profile_id, class_id, checked_in_at, validated_by) VALUES
  -- Victor: treinou consistente (12 check-ins no mês — streak de 12)
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000001', '2026-04-14 06:05:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000005', '2026-04-16 06:03:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000007', '2026-04-18 06:08:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000001', '2026-04-21 06:02:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000005', '2026-04-23 06:10:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000007', '2026-04-25 06:01:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000001', '2026-04-28 06:05:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000005', '2026-04-30 06:07:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000001', '2026-05-05 06:04:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000005', '2026-05-07 06:02:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000007', '2026-05-09 06:06:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'c0000000-0000-0000-0000-000000000001', '2026-05-12 06:03:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),

  -- Marina: frequência irregular (4 check-ins)
  ('d7553af1-ecd4-4d2d-a3a2-2fe9a7b29deb', 'c0000000-0000-0000-0000-000000000002', '2026-04-14 07:10:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('d7553af1-ecd4-4d2d-a3a2-2fe9a7b29deb', 'c0000000-0000-0000-0000-000000000006', '2026-04-23 07:05:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('d7553af1-ecd4-4d2d-a3a2-2fe9a7b29deb', 'c0000000-0000-0000-0000-000000000002', '2026-05-05 07:08:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('d7553af1-ecd4-4d2d-a3a2-2fe9a7b29deb', 'c0000000-0000-0000-0000-000000000006', '2026-05-07 07:12:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),

  -- Diego: parou de vir (último check-in há 16+ dias)
  ('25dd9f93-71fe-4fb6-92e8-56e1419fd237', 'c0000000-0000-0000-0000-000000000004', '2026-04-14 18:05:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('25dd9f93-71fe-4fb6-92e8-56e1419fd237', 'c0000000-0000-0000-0000-000000000008', '2026-04-18 18:02:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1'),
  ('25dd9f93-71fe-4fb6-92e8-56e1419fd237', 'c0000000-0000-0000-0000-000000000004', '2026-04-21 18:10:00-03', '12ba29a5-df0f-472d-b06b-c82601eb32e1');


-- ========================
-- EXERCÍCIOS (Banco de vídeos)
-- ========================

INSERT INTO exercises (id, name, muscle_group, video_url, description) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Agachamento Búlgaro',     'Quadríceps',     'https://youtube.com/watch?v=placeholder1', 'Pé de trás elevado no banco. Descer controlado até 90°.'),
  ('e0000000-0000-0000-0000-000000000002', 'Remada Curvada',          'Costas',          'https://youtube.com/watch?v=placeholder2', 'Inclinação de 45°. Puxar barra até o umbigo.'),
  ('e0000000-0000-0000-0000-000000000003', 'Prancha Dinâmica',        'Core',            'https://youtube.com/watch?v=placeholder3', 'Alternar entre prancha alta e baixa com ritmo controlado.'),
  ('e0000000-0000-0000-0000-000000000004', 'Desenvolvimento Ombro',   'Ombros',          'https://youtube.com/watch?v=placeholder4', 'Halteres na altura do ombro. Subir acima da cabeça.'),
  ('e0000000-0000-0000-0000-000000000005', 'Swing com Kettlebell',    'Posterior',       'https://youtube.com/watch?v=placeholder5', 'Movimento de quadril explosivo. Braços são guias, não puxam.'),
  ('e0000000-0000-0000-0000-000000000006', 'Box Jump',                'Pernas',          'https://youtube.com/watch?v=placeholder6', 'Saltar sobre a caixa com aterrisagem suave. Descer controlado.'),
  ('e0000000-0000-0000-0000-000000000007', 'Pull-up (Barra Fixa)',    'Costas / Bíceps', 'https://youtube.com/watch?v=placeholder7', 'Pegada pronada na largura dos ombros. Subir até o queixo.'),
  ('e0000000-0000-0000-0000-000000000008', 'Flexão com Rotação',      'Peito / Core',    'https://youtube.com/watch?v=placeholder8', 'Fazer flexão e ao subir, girar o tronco abrindo o braço.'),
  ('e0000000-0000-0000-0000-000000000009', 'Corrida de Praia',        'Cardio',          'https://youtube.com/watch?v=placeholder9', 'Corrida de 20 min na areia. Intercalar intensidades.'),
  ('e0000000-0000-0000-0000-000000000010', 'Mobilidade de Quadril',   'Mobilidade',      'https://youtube.com/watch?v=placeholder10', 'Sequência: 90/90, pombo, agachamento profundo com rotação.');


-- ========================
-- TREINOS DO VICTOR (Treino A e B)
-- ========================

INSERT INTO workouts (id, profile_id, name, is_active) VALUES
  ('55555555-0000-0000-0000-000000000001', 'ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'Treino A - Força', true),
  ('55555555-0000-0000-0000-000000000002', 'ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'Treino B - Cardio + Core', true);

INSERT INTO workout_exercises (workout_id, exercise_id, sort_order, sets, reps, rest_seconds, load, notes) VALUES
  -- Treino A
  ('55555555-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 1, 4, '10',  90,  '16kg cada mão', 'Foco na descida controlada. Joelho não ultrapassa a ponta do pé.'),
  ('55555555-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 2, 4, '12',  60,  '40kg barra',    'Manter core ativado o tempo todo.'),
  ('55555555-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 3, 3, '10',  60,  '12kg cada',     NULL),
  ('55555555-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 4, 3, '8-10', 90,  'Peso corporal', 'Se não conseguir 8, usar elástico de auxílio.'),

  -- Treino B
  ('55555555-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000005', 1, 4, '15',  45,  '16kg',          'Explosão no quadril. Não puxar com os braços.'),
  ('55555555-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000006', 2, 3, '12',  60,  'Caixa 60cm',    'Aterrissagem suave. Cuidar os joelhos.'),
  ('55555555-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003', 3, 3, '30s', 30,  NULL,            'Manter o quadril estável, sem balançar.'),
  ('55555555-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000008', 4, 3, '10',  45,  NULL,            NULL);


-- ========================
-- AVALIAÇÕES (alimenta a tela "Sua Evolução")
-- ========================

INSERT INTO assessments (profile_id, assessed_at, weight_kg, body_fat, skill_strength, skill_mobility, skill_endurance, notes) VALUES
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', '2026-07-05', 85.00, 22.0, 60, 40, 50, 'Início do acompanhamento. Foco geral.'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', '2026-08-05', 83.00, 20.5, 65, 45, 65, 'Boa evolução em resistência.'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', '2026-09-05', 80.00, 19.0, 75, 55, 80, 'Foco inicial consolidado. Manter.'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', '2026-10-10', 78.00, 18.0, 80, 60, 95, 'Perdeu 2kg. Resistência subiu muito.');


-- ========================
-- CONQUISTAS (Catálogo de badges)
-- ========================

INSERT INTO achievements (id, name, description, icon, category, required_checkins, xp_reward) VALUES
  ('a0000000-0000-0000-0000-000000000001', '1º Suor',     'Completar a primeira aula',           '🌱', 'milestone', 1,   100),
  ('a0000000-0000-0000-0000-000000000002', 'Esquentando', '5 treinos seguidos',                  '🔥', 'streak',    5,   250),
  ('a0000000-0000-0000-0000-000000000003', 'Imparável',   '10 treinos seguidos',                 '⚡', 'streak',    10,  500),
  ('a0000000-0000-0000-0000-000000000004', 'Vulcânico',   '20 treinos seguidos',                 '🌋', 'streak',    20,  1000),
  ('a0000000-0000-0000-0000-000000000005', 'Meta Batida', 'Atingir o peso objetivo',             '🎯', 'meta',      NULL, 750),
  ('a0000000-0000-0000-0000-000000000006', '5 Estrelas',  'Score máximo na avaliação do coach',  '🌟', 'special',   NULL, 500);


-- Conquistas desbloqueadas pelo Victor
INSERT INTO profile_achievements (profile_id, achievement_id, unlocked_at) VALUES
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'a0000000-0000-0000-0000-000000000001', '2026-04-14 06:10:00-03'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'a0000000-0000-0000-0000-000000000002', '2026-04-25 06:10:00-03'),
  ('ecc0f96b-3c03-4dda-b4d4-fdec9509b672', 'a0000000-0000-0000-0000-000000000003', '2026-05-09 06:10:00-03');


-- ========================
-- TEMPLATES DE WHATSAPP
-- ========================

INSERT INTO whatsapp_templates (slug, name, template) VALUES
  ('class_reminder',   'Lembrete de Aula',           'Oi {nome}! 🏋️ Lembrete: sua aula é amanhã às {horario}, modalidade {modalidade}. Confirmado(a)? 💪'),
  ('billing_warning',  'Cobrança (5 dias antes)',     'Oi {nome}! 😊 Passando para lembrar que sua mensalidade vence dia {vencimento}. Valor: R$ {valor}.'),
  ('billing_overdue',  'Aviso de Bloqueio',           'Oi {nome}, sua mensalidade venceu em {vencimento}. Para liberar seu acesso, regularize pelo link: {link_pagamento}'),
  ('welcome',          'Boas-vindas',                 'Bem-vindo(a) ao time, {nome}! 🔥 Seu acesso ao portal Coach Dantas está liberado. Acesse: {link_portal}');


-- ========================
-- PRODUTO DE EXEMPLO NA LOJA
-- ========================

INSERT INTO store_products (name, description, price, type) VALUES
  ('Workshop: Mobilidade Avançada', 'Aula especial de 2h sobre mobilidade de quadril e ombros. Inclui apostila em PDF.', 97.00, 'workshop'),
  ('E-book: Guia Nutricional', 'Guia completo de alimentação para treino funcional. 45 páginas.', 47.00, 'ebook');
