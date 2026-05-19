import { User, Activity, Wallet, Medal, Calendar, ChevronLeft, Send, Flame, Ticket, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AdminAlunoDetail({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const id = params.id; // Or await params depending on Next.js version, assuming 14 here.

  // Fetch student profile
  const { data: aluno, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !aluno) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Aluno não encontrado.</p>
        <Link href="/admin/alunos" className="text-brand-accent hover:underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  const score = aluno.engagement_score || 0;
  let scoreColor = "text-green-400";
  let scoreBg = "bg-green-500/20";
  if (score < 40) {
    scoreColor = "text-red-400";
    scoreBg = "bg-red-500/20";
  } else if (score < 70) {
    scoreColor = "text-yellow-400";
    scoreBg = "bg-yellow-500/20";
  }

  const isEliteReady = aluno.conversion_potential === 'high';

  return (
    <div className="space-y-6">
      <Link href="/admin/totalpass" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
        <ChevronLeft className="w-4 h-4" /> Voltar para Dashboard CRM
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Info */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-brand-support p-6 rounded-2xl border border-white/5 text-center relative overflow-hidden">
            {isEliteReady && (
              <div className="absolute top-0 right-0 bg-brand-accent text-brand-primary text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                Elite Ready
              </div>
            )}
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl font-bold mb-4 border-4 ${isEliteReady ? 'border-brand-accent bg-gradient-to-br from-brand-accent to-brand-neon text-brand-primary' : 'border-white/10 bg-white/5 text-white'}`}>
              {aluno.full_name ? aluno.full_name.charAt(0) : 'A'}
            </div>
            <h2 className="text-xl font-bold mb-1">{aluno.full_name || 'Aluno Sem Nome'}</h2>
            <div className="text-sm text-gray-400 mb-4">{aluno.email}</div>
            
            <div className="flex justify-center gap-2 mb-6">
              <span className={`${scoreBg} ${scoreColor} text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1`}>
                <Activity className="w-3 h-3" /> Score: {score}
              </span>
              <span className="bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <Flame className="w-3 h-3" /> {aluno.current_streak || 0}
              </span>
            </div>
            
            {isEliteReady ? (
              <button className="w-full bg-brand-accent hover:bg-brand-neon text-brand-primary font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                ⭐ Convidar Plano Elite
              </button>
            ) : score < 40 ? (
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Alerta de Evasão
              </button>
            ) : (
              <button className="w-full bg-green-500 hover:bg-green-600 text-brand-primary font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> WhatsApp
              </button>
            )}
          </div>

          <div className="bg-brand-support p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-accent" /> Check-ins & Presença
            </h3>
            <div className="text-sm">
              <div className="text-gray-400">Última Presença</div>
              <div className="font-medium text-white">
                {aluno.last_checkin_at ? formatDistanceToNow(new Date(aluno.last_checkin_at), { addSuffix: true, locale: ptBR }) : 'Nunca registrado'}
              </div>
            </div>
            <div className="text-sm">
              <div className="text-gray-400">Streak Máximo Alcançado</div>
              <div className="font-medium text-white flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" /> {aluno.longest_streak || 0} semanas
              </div>
            </div>
            <div className="text-sm">
              <div className="text-gray-400">Total de Check-ins (Histórico)</div>
              <div className="font-medium text-white">{aluno.total_checkins || 0} treinos</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-support p-6 rounded-2xl border border-white/5 relative overflow-hidden">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Ticket className="w-5 h-5 text-blue-400" />
                Mecânica de Retenção
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Ingressos de Proteção (Streak Freezes)</span>
                    <span className="font-bold text-white">{aluno.streak_freezes || 0} / 3</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(100, ((aluno.streak_freezes || 0) / 3) * 100)}%` }}></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                    Ingressos permitem que o aluno falte uma semana inteira sem perder a sequência de treinos. Ajuda a evitar frustração e cancelamento.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Medal className="w-5 h-5 text-brand-neon" />
                Últimas Vitórias
              </h3>
              {aluno.current_streak > 0 ? (
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-xl mx-auto mb-2 shadow-[0_0_10px_#F97316]">🔥</div>
                    <div className="text-[10px] text-orange-400 font-bold">Ofensiva Ativa</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-6 text-center">
                  O aluno perdeu a ofensiva recentemente e precisa de engajamento.
                </div>
              )}
            </div>
          </div>

          <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
            <h3 className="font-bold mb-4 text-brand-accent">Diário Comportamental (Coach)</h3>
            <textarea 
              className="w-full bg-brand-primary border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-accent text-sm min-h-[120px]"
              placeholder="Ex: O aluno viajou essa semana mas prometeu que não vai cancelar o plano. Usou um streak freeze para manter a pontuação alta."
            ></textarea>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-gray-500">Notas internas. O aluno não vê isso.</span>
              <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-sm font-bold transition-colors">Salvar Nota</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
