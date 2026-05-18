import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./EditProfileForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditarPerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="w-full max-w-2xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/aluno/perfil" 
          className="flex items-center justify-center w-10 h-10 bg-brand-support border border-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Dados Pessoais</h1>
          <p className="text-sm text-gray-400">Atualize suas informações de contato e cadastro.</p>
        </div>
      </div>

      <div className="bg-brand-support p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <EditProfileForm initialData={profile || { full_name: "", phone: "", cpf: "", birth_date: "" }} />
        </div>
      </div>
    </div>
  );
}
