import { createClient } from "@/utils/supabase/server";

// Maps JS Date.getDay() (0=Sun) to our weekday enum
const WEEKDAY_MAP: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

// Supabase returns joined relations as T | T[] depending on cardinality.
// This helper safely extracts the first (or only) item from either shape.
function scalar<T>(val: unknown): T | null {
  if (Array.isArray(val)) return (val[0] as T) ?? null;
  return (val as T) ?? null;
}

// -------------------------------------------------------
// Admin Dashboard
// -------------------------------------------------------

export async function getAdminDashboardStats() {
  const supabase = await createClient();

  // 1. Alunos ativos = subscriptions com status 'active'
  const { count: activeStudents } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // 2. Faturamento mensal = soma dos preços dos planos de assinaturas ativas
  const { data: activeSubs } = await supabase
    .from("subscriptions")
    .select("plans(price)")
    .eq("status", "active");

  const monthlyRevenue =
    activeSubs?.reduce((sum, sub) => {
      const plan = scalar<{ price: number }>(sub.plans);
      return sum + (plan?.price ?? 0);
    }, 0) ?? 0;

  // 3. Pagamentos atrasados
  const { count: pastDueCount } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "past_due");

  // 4. Valor total em atraso
  const { data: pastDueSubs } = await supabase
    .from("subscriptions")
    .select("plans(price)")
    .eq("status", "past_due");

  const pastDueAmount =
    pastDueSubs?.reduce((sum, sub) => {
      const plan = scalar<{ price: number }>(sub.plans);
      return sum + (plan?.price ?? 0);
    }, 0) ?? 0;

  // 5. Alunos inativos (sem check-in há mais de 15 dias)
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

  const { data: recentCheckins } = await supabase
    .from("checkins")
    .select("profile_id")
    .gte("checked_in_at", fifteenDaysAgo.toISOString());

  const recentProfileIds = [
    ...new Set(recentCheckins?.map((c) => c.profile_id) ?? []),
  ];

  let inactiveCount = 0;
  if (activeStudents && activeStudents > 0) {
    const { data: activeSubProfiles } = await supabase
      .from("subscriptions")
      .select("profile_id")
      .eq("status", "active");

    const activeProfileIds = activeSubProfiles?.map((s) => s.profile_id) ?? [];
    inactiveCount = activeProfileIds.filter(
      (id) => !recentProfileIds.includes(id)
    ).length;
  }

  return {
    activeStudents: activeStudents ?? 0,
    monthlyRevenue,
    pastDueCount: pastDueCount ?? 0,
    pastDueAmount,
    inactiveCount,
  };
}

export async function getTodayClasses() {
  const supabase = await createClient();
  const todayWeekday = WEEKDAY_MAP[new Date().getDay()];

  const { data: classes } = await supabase
    .from("classes")
    .select(
      `
      id,
      start_time,
      location,
      max_capacity,
      modalities(name),
      class_enrollments(count)
    `
    )
    .eq("weekday", todayWeekday)
    .eq("is_active", true)
    .order("start_time");

  return (
    classes?.map((c) => {
      const modality = scalar<{ name: string }>(c.modalities);
      const enrollmentRow = scalar<{ count: number }>(c.class_enrollments);
      return {
        id: c.id,
        hora: c.start_time.slice(0, 5),
        local: c.location ?? "",
        modalidade: modality?.name ?? "—",
        limite: c.max_capacity,
        alunos: enrollmentRow?.count ?? 0,
      };
    }) ?? []
  );
}

export async function getPastDueStudents() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("subscriptions")
    .select(
      `
      id,
      current_period_end,
      profiles(full_name, phone),
      plans(name, price)
    `
    )
    .eq("status", "past_due")
    .order("current_period_end");

  return (
    data?.map((s) => {
      const profile = scalar<{ full_name: string; phone: string }>(s.profiles);
      const plan = scalar<{ name: string; price: number }>(s.plans);
      return {
        id: s.id,
        name: profile?.full_name ?? "—",
        phone: profile?.phone ?? "",
        plan: plan?.name ?? "—",
        price: plan?.price ?? 0,
        dueDate: s.current_period_end,
      };
    }) ?? []
  );
}

// -------------------------------------------------------
// Leads (Contatos externos — TotalPass, etc.)
// -------------------------------------------------------

export async function getLeads(source?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("leads")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (source && source !== "all") {
    query = query.eq("source", source);
  }

  const { data } = await query;
  return data ?? [];
}

export async function createLead(lead: {
  full_name: string;
  phone: string;
  source: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("leads").insert(lead).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").update({ is_active: false }).eq("id", id);
  if (error) throw new Error(error.message);
}

// -------------------------------------------------------
// Campaigns (Ofertas / Promoções)
// -------------------------------------------------------

export async function getCampaigns() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("campaigns")
    .select("*, campaign_sends(count)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    data?.map((c) => {
      const sendsRow = scalar<{ count: number }>(c.campaign_sends);
      return {
        ...c,
        sends_count: sendsRow?.count ?? 0,
      };
    }) ?? []
  );
}

export async function getCampaignById(id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function createCampaign(campaign: {
  title: string;
  message_template: string;
  target_source?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("campaigns").insert(campaign).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCampaignLeads(campaignId: string, targetSource?: string | null) {
  const supabase = await createClient();

  // 1. Busca todos os leads elegíveis
  let leadsQuery = supabase.from("leads").select("*").eq("is_active", true);
  if (targetSource) {
    leadsQuery = leadsQuery.eq("source", targetSource);
  }
  const { data: leads } = await leadsQuery;

  // 2. Busca os que já foram enviados nesta campanha
  const { data: sends } = await supabase
    .from("campaign_sends")
    .select("lead_id")
    .eq("campaign_id", campaignId);

  const sentIds = new Set(sends?.map((s) => s.lead_id) ?? []);

  return (leads ?? []).map((lead) => ({
    ...lead,
    already_sent: sentIds.has(lead.id),
  }));
}

export async function markCampaignSent(campaignId: string, leadId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("campaign_sends").insert({
    campaign_id: campaignId,
    lead_id: leadId,
  });
  if (error) throw new Error(error.message);
}
