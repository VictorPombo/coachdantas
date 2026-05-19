import { Settings as SettingsIcon, MessageSquare, Trophy, Shield } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { hasEnrollment } from "@/face-auth-core/database/queries";
import { FaceAuthSection } from "@/app/aluno/perfil/FaceAuthSection";

export default async function AdminConfig() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isEnrolled = false;
  let role = "student";
  if (user) {
    isEnrolled = await hasEnrollment(supabase, user.id);
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile) role = profile.role;
  }
  
  const isAdmin = role === "admin";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-gray-400">Ajustes gerais da plataforma e automações.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isAdmin && (
          <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-brand-accent" />
              <h2 className="text-xl font-bold">Templates de WhatsApp</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Lembrete de Aula</label>
                <textarea 
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-sm h-24 focus:outline-none focus:border-brand-accent"
                  defaultValue="Oi {nome}! 🏋️ Lembrete: sua aula é amanhã às {horario}, modalidade {modalidade}. Confirmado(a)? 💪"
                ></textarea>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Cobrança (5 dias antes)</label>
                <textarea 
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-sm h-24 focus:outline-none focus:border-brand-accent"
                  defaultValue="Oi {nome}! 😊 Passando para lembrar que sua mensalidade vence dia {vencimento}. Valor: R$ {valor}."
                ></textarea>
              </div>
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors">Salvar Templates</button>
            </div>
          </div>
        )}

        <div className={`space-y-8 ${!isAdmin ? 'col-span-1 md:col-span-2 max-w-xl mx-auto' : ''}`}>
          {isAdmin && (
            <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-brand-neon" />
                <h2 className="text-xl font-bold">Gamificação & Conquistas</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">Gerencie as badges e conquistas automáticas e manuais do portal do aluno.</p>
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors w-full text-left flex justify-between">
                Ver lista de Conquistas (32 cadastradas)
                <span>→</span>
              </button>
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors w-full text-left mt-2 flex justify-between">
                Configurar Tabela de XP
                <span>→</span>
              </button>
            </div>
          )}

          <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-gray-400" />
              <h2 className="text-xl font-bold">{isAdmin ? "Segurança & Acessos" : "Segurança da Conta"}</h2>
            </div>
            
            {isAdmin && (
              <>
                <div className="flex items-center justify-between p-3 bg-brand-primary rounded-xl border border-white/5 mb-4">
                  <div>
                    <div className="font-bold text-sm">Leandro Dantas</div>
                    <div className="text-xs text-brand-accent">Administrador Principal</div>
                  </div>
                  <button className="text-xs text-gray-400 hover:text-white">Editar</button>
                </div>
                
                <div className="mb-4">
                  <button className="text-xs text-brand-accent hover:underline">+ Adicionar Professor/Admin</button>
                </div>
              </>
            )}

            {user && (
              <div className={isAdmin ? "pt-4 border-t border-white/10" : ""}>
                <FaceAuthSection userId={user.id} initialIsEnrolled={isEnrolled} />
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
