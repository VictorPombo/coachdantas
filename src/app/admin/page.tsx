import { Users, TrendingUp, DollarSign, AlertCircle, Dumbbell } from "lucide-react";
import Link from "next/link";
import {
  getAdminDashboardStats,
  getTodayClasses,
  getPastDueStudents,
} from "@/lib/queries";
import { createClient } from "@/utils/supabase/server";

function formatCurrency(value: number) {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1).replace(".", ",")}k`;
  }
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default async function AdminDashboard() {
  const [stats, todayClasses, pastDueStudents] = await Promise.all([
    getAdminDashboardStats(),
    getTodayClasses(),
    getPastDueStudents(),
  ]);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = "professor"; // Default fallback
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile) {
      role = profile.role;
    }
  }

  const isAdmin = role === "admin";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
        <p className="text-gray-400">Aqui está o resumo do seu negócio hoje.</p>
      </div>

      {/* Resumo Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-brand-primary rounded-lg border border-white/5">
              <Users className="w-5 h-5 text-brand-neon" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.activeStudents}</div>
          <div className="text-sm text-gray-400">Alunos ativos</div>
        </div>

        <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-brand-primary rounded-lg border border-white/5">
              <Dumbbell className="w-5 h-5 text-brand-accent" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{todayClasses.length}</div>
          <div className="text-sm text-gray-400">Aulas hoje</div>
        </div>

        {isAdmin && (
          <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-primary rounded-lg border border-white/5">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <div className="text-sm text-gray-400">Faturamento no mês</div>
          </div>
        )}

        {isAdmin && (
          <div className="bg-brand-support p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <DollarSign className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-400 mb-1">
              {stats.pastDueCount}
            </div>
            <div className="text-sm text-gray-400">Pagamentos pendentes</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Aulas do dia */}
        <div className={`${isAdmin ? "lg:col-span-2" : "lg:col-span-3"} bg-brand-support rounded-3xl border border-white/5 p-6`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Aulas de Hoje</h2>
            <Link
              href="/admin/agenda"
              className="text-sm text-brand-accent hover:underline"
            >
              Ver agenda completa
            </Link>
          </div>
          <div className="space-y-3">
            {todayClasses.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                Nenhuma aula cadastrada para hoje.
              </p>
            ) : (
              todayClasses.map((aula) => (
                <div
                  key={aula.id}
                  className="flex items-center justify-between p-4 bg-brand-primary rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-lg text-brand-neon">
                      {aula.hora}
                    </div>
                    <div>
                      <div className="font-medium">{aula.modalidade}</div>
                      <div className="text-sm text-gray-400">{aula.local}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold bg-white/5 px-3 py-1 rounded-full">
                      <span
                        className={
                          aula.alunos >= aula.limite
                            ? "text-brand-accent"
                            : "text-white"
                        }
                      >
                        {aula.alunos}
                      </span>
                      <span className="text-gray-500">/{aula.limite} vagas</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alertas */}
        {isAdmin && (
          <div className="bg-brand-support rounded-3xl border border-white/5 p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-brand-accent" />
              Atenção
            </h2>
            <div className="space-y-4">
              {/* Inadimplentes (Only Admin) */}
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <h3 className="font-bold text-red-400 text-sm mb-1">
                  Atrasados ({stats.pastDueCount})
                </h3>
                {stats.pastDueCount > 0 ? (
                  <>
                    <p className="text-sm text-gray-400 mb-3">
                      {formatCurrency(stats.pastDueAmount)} pendentes
                    </p>
                    <ul className="mb-3 space-y-1">
                      {pastDueStudents.slice(0, 3).map((s) => (
                        <li key={s.id} className="text-xs text-gray-300 truncate">
                          • {s.name} — {s.plan}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 mb-3">Nenhum em atraso 🎉</p>
                )}
                <Link
                  href="/admin/financeiro"
                  className="w-full py-2 bg-red-500/20 text-red-400 text-sm font-bold rounded-lg hover:bg-red-500/30 transition-colors block text-center"
                >
                  Ver Inadimplentes
                </Link>
              </div>

            {/* Inativos */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <h3 className="font-bold text-yellow-400 text-sm mb-1">
                Inativos ({stats.inactiveCount})
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                {stats.inactiveCount > 0
                  ? "Mais de 15 dias sem vir"
                  : "Todos estão frequentando 💪"}
              </p>
              <button className="w-full py-2 bg-yellow-500/20 text-yellow-400 text-sm font-bold rounded-lg hover:bg-yellow-500/30 transition-colors">
                Chamar no WhatsApp
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
