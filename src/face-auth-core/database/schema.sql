-- Extensão vetorial
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings faciais dos usuários
CREATE TABLE face_embeddings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  embedding    vector(128) NOT NULL,
  model_version TEXT DEFAULT 'ssdMobilenetv1',
  enrolled_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Sessões de verificação (audit log completo)
CREATE TABLE face_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id),
  context       TEXT, -- ex: 'login', 'aula_123', 'confirmacao'
  token         TEXT UNIQUE,
  distance      FLOAT,
  passed        BOOLEAN,
  method        TEXT CHECK (method IN ('webcam', 'qr_mobile')),
  status        TEXT CHECK (status IN 
                ('pending', 'done', 'expired', 'failed')) 
                DEFAULT 'pending',
  embedding     vector(128),
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca vetorial eficiente
CREATE INDEX ON face_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- RLS
ALTER TABLE face_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_sessions ENABLE ROW LEVEL SECURITY;

-- Policies face_embeddings
CREATE POLICY "usuario le proprio embedding"
  ON face_embeddings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "service role gerencia embeddings"
  ON face_embeddings FOR ALL
  USING (auth.role() = 'service_role');

-- Policies face_sessions
CREATE POLICY "usuario le proprias sessoes"
  ON face_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "service role gerencia sessoes"
  ON face_sessions FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER face_embeddings_updated_at
  BEFORE UPDATE ON face_embeddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
