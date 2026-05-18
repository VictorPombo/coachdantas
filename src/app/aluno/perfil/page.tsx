import { Settings, CreditCard, Clock, Bell, Share2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { hasEnrollment } from "@/face-auth-core/database/queries";
import { FaceAuthSection } from "./FaceAuthSection";

export default async function AlunoPerfil() {
  const supabase = await createClient();
  
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null; // Middleware prevents this, but just in case

  // 2. Get profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const userName = profile?.full_name || "Aluno";
  const userInitial = userName.charAt(0).toUpperCase();

  // 3. Check if user has enrolled their face
  const isEnrolled = await hasEnrollment(supabase, user.id);

  return (
    <div className="space-y-8">
      {/* Header do Perfil */}
      <div className="bg-brand-support rounded-3xl border border-white/5 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-bl-[100px]"></div>
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand-accent to-brand-neon flex items-center justify-center text-4xl font-bold text-brand-primary mb-4 relative z-10">
          {userInitial}
        </div>
        <h1 className="text-2xl font-bold mb-1">{userName}</h1>
        <div className="text-sm text-brand-accent font-medium mb-4">Guerreiro 🗡️ • 2.450 XP</div>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">
          Treinando forte há 8 meses. Foco em condicionamento físico e ganho de massa.
        </p>
      </div>

      {/* Seção Face Auth */}
      <FaceAuthSection userId={user.id} initialIsEnrolled={isEnrolled} />

      {/* Plano e Financeiro */}
      <div className="bg-brand-support rounded-2xl border border-white/5 p-6">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            Meu Plano
          </h2>
          <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-bold">Pagamento em dia</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <div className="text-gray-500 mb-1">Modalidade</div>
            <div className="font-bold">Funcional Inteligente</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Frequência</div>
            <div className="font-bold">3x por semana</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Valor</div>
            <div className="font-bold">R$ 516,00</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Vencimento</div>
            <div className="font-bold">Dia 15</div>
          </div>
        </div>

        <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
          Ver Histórico de Pagamentos
        </button>
      </div>

      {/* Configurações de Conta */}
      <div className="space-y-2">
        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4 px-2">Ajustes da Conta</h3>
        
        <Link href="/aluno/perfil/editar" className="w-full bg-brand-support border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Editar Dados Pessoais</span>
          </div>
          <span className="text-gray-500">→</span>
        </Link>

        <button className="w-full bg-brand-support border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-brand-neon" />
            <span className="font-medium">Notificações</span>
          </div>
          <span className="text-xs bg-brand-neon/20 text-brand-neon px-2 py-1 rounded">Ativadas</span>
        </button>

        <button className="w-full bg-brand-support border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-brand-accent" />
            <span className="font-medium">Indicar um Amigo (Ganhe XP!)</span>
          </div>
          <span className="text-gray-500">→</span>
        </button>
      </div>
    </div>
  );
}
