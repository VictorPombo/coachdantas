-- ============================================================
-- Coach Dantas - Migration 0002: Leads & Campanhas
-- Central de Leads TotalPass + Disparo WhatsApp
-- ============================================================

-- ========================
-- 1. TABELA LEADS (Contatos externos sem conta no sistema)
-- ========================

CREATE TABLE IF NOT EXISTS leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        TEXT NOT NULL,
  phone            TEXT NOT NULL,
  source           TEXT NOT NULL DEFAULT 'totalpass',
  notes            TEXT,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  converted_to     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_active ON leads(is_active);

-- ========================
-- 2. TABELA CAMPAIGNS (Ofertas/Promoções)
-- ========================

CREATE TABLE IF NOT EXISTS campaigns (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  message_template TEXT NOT NULL,
  target_source    TEXT,
  product_id       UUID REFERENCES store_products(id) ON DELETE SET NULL,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- 3. TABELA CAMPAIGN_SENDS (Registro de envios)
-- ========================

CREATE TABLE IF NOT EXISTS campaign_sends (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id          UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  sent_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  status           TEXT NOT NULL DEFAULT 'sent',

  UNIQUE(campaign_id, lead_id)
);

-- ========================
-- 4. TRIGGER updated_at para leads
-- ========================

CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================
-- 5. RLS
-- ========================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_leads ON leads FOR ALL
  USING (public.user_role() = 'admin') WITH CHECK (public.user_role() = 'admin');
CREATE POLICY admin_campaigns ON campaigns FOR ALL
  USING (public.user_role() = 'admin') WITH CHECK (public.user_role() = 'admin');
CREATE POLICY admin_sends ON campaign_sends FOR ALL
  USING (public.user_role() = 'admin') WITH CHECK (public.user_role() = 'admin');
