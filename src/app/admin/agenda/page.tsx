import { Plus } from "lucide-react";
import AgendaClient from "./AgendaClient";
import { createClient } from "@/utils/supabase/server";

export default async function AdminAgenda() {
  const supabase = await createClient();

  // 1. Fetch user role to determine permissions (isAdmin)
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  // 2. Fetch all admin notes that have a target_date set
  const { data: notes } = await supabase
    .from("admin_notes")
    .select("id, title, content, target_date")
    .not("target_date", "is", null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agenda de Aulas</h1>
          <p className="text-gray-400">Visualização de turmas, presenças e anotações diárias.</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-white/10 cursor-pointer">
          <Plus className="w-5 h-5" />
          Nova Aula
        </button>
      </div>

      <AgendaClient initialNotes={notes || []} isAdmin={isAdmin} />
    </div>
  );
}
