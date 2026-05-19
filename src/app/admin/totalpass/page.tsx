import { createClient } from "@/utils/supabase/server";
import { Target, TrendingUp, AlertTriangle, UserMinus, ShieldAlert, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function TotalPassDashboard() {
  const supabase = await createClient();

  // Buscar todos os alunos para calcular KPIs
  const { data: alunos } = await supabase
    .from("profiles")
    .select("id, full_name, engagement_score, conversion_potential, current_streak, streak_freezes, last_checkin_at")
    .eq("role", "student");

  const alunosAtivos = alunos || [];

  // Cálculos de KPI
  const mediaScore = alunosAtivos.length > 0
    ? Math.round(alunosAtivos.reduce((acc, a) => acc + (a.engagement_score || 0), 0) / alunosAtivos.length)
    : 0;

  const emRisco = alunosAtivos.filter(a => (a.engagement_score || 0) < 40);
  const potencialElite = alunosAtivos.filter(a => a.conversion_potential === 'high');
  const totalFreezes = alunosAtivos.reduce((acc, a) => acc + (a.streak_freezes || 0), 0);

  // Buscar Alertas Ativos
  const { data: alertas } = await supabase
    .from("alerts")
    .select("*, profiles(full_name)")
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-brand-accent" /> TotalPass CRM
        </h1>
        <p className="text-gray-400">Inteligência de retenção e conversão comportamental.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-support p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-accent/10 rounded-full blur-2xl group-hover:bg-brand-accent/20 transition-all"></div>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-brand-accent" />
            <span className="text-gray-400 font-medium text-sm">Score Médio</span>
          </div>
          <div className="text-3xl font-bold">{mediaScore} <span className="text-sm font-normal text-gray-500">/ 100</span></div>
        </div>

        <div className="bg-brand-support p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-gray-400 font-medium text-sm">Em Risco</span>
          </div>
          <div className="text-3xl font-bold">{emRisco.length} <span className="text-sm font-normal text-gray-500">alunos</span></div>
        </div>

        <div className="bg-brand-support p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-gray-400 font-medium text-sm">Potencial Elite</span>
          </div>
          <div className="text-3xl font-bold">{potencialElite.length} <span className="text-sm font-normal text-gray-500">leads</span></div>
        </div>

        <div className="bg-brand-support p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <span className="text-gray-400 font-medium text-sm">Freezes Acumulados</span>
          </div>
          <div className="text-3xl font-bold">{totalFreezes} <span className="text-sm font-normal text-gray-500">🎟️ ativos</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Potencial Elite Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-support rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2 text-green-400">
                <Target className="w-5 h-5" /> Leads Prontos (Plano Elite)
              </h2>
            </div>
            {potencialElite.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nenhum aluno atingiu os requisitos Elite ainda.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="p-4 font-medium">Nome</th>
                    <th className="p-4 font-medium">Score</th>
                    <th className="p-4 font-medium">Streak</th>
                    <th className="p-4 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {potencialElite.map(aluno => (
                    <tr key={aluno.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-brand-primary">
                          {aluno.full_name?.charAt(0) || 'A'}
                        </div>
                        {aluno.full_name || 'Aluno Sem Nome'}
                      </td>
                      <td className="p-4 text-green-400 font-bold">{aluno.engagement_score}%</td>
                      <td className="p-4 text-gray-300">🔥 {aluno.current_streak} sem</td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/alunos/${aluno.id}`}>
                          <button className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-brand-primary px-4 py-2 rounded-lg font-bold transition-colors text-xs flex items-center gap-1 ml-auto">
                            Convidar <ChevronRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-brand-support rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-lg font-bold flex items-center gap-2 text-red-400">
                <UserMinus className="w-5 h-5" /> Zona de Risco
              </h2>
              <p className="text-sm text-gray-400 mt-1">Alunos com score caindo ou ausentes.</p>
            </div>
            {emRisco.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nenhum aluno em risco no momento. Ótimo trabalho!</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="p-4 font-medium">Nome</th>
                    <th className="p-4 font-medium">Última Presença</th>
                    <th className="p-4 font-medium">Score</th>
                    <th className="p-4 font-medium text-right">Perfil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {emRisco.map(aluno => (
                    <tr key={aluno.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{aluno.full_name || 'Aluno Sem Nome'}</td>
                      <td className="p-4 text-gray-400">
                        {aluno.last_checkin_at 
                          ? formatDistanceToNow(new Date(aluno.last_checkin_at), { addSuffix: true, locale: ptBR })
                          : "Nunca"}
                      </td>
                      <td className="p-4 text-red-400 font-bold">{aluno.engagement_score}%</td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/alunos/${aluno.id}`} className="text-brand-accent hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5 inline" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Últimos Alertas (Sidebar Direita) */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            Últimos Alertas
          </h3>
          {alertas && alertas.length > 0 ? (
            alertas.map(alerta => (
              <div key={alerta.id} className="bg-brand-support p-4 rounded-xl border border-white/5 flex gap-3 items-start relative">
                {alerta.priority === 'high' && <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />}
                {alerta.priority === 'medium' && <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />}
                {alerta.priority === 'info' && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                <div className="flex-1 text-sm">
                  <div className="font-medium text-white mb-1">
                    {alerta.profiles?.full_name || 'Sistema'}
                  </div>
                  <div className="text-gray-400 text-xs">{alerta.message}</div>
                  <div className="text-[10px] text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(alerta.created_at), { addSuffix: true, locale: ptBR })}
                  </div>
                </div>
                <button className="text-gray-500 hover:text-green-400 transition-colors" title="Marcar como lido">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="bg-brand-support p-6 rounded-xl border border-white/5 text-center text-gray-500 text-sm">
              Nenhum alerta pendente.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
