import { User, Activity, Wallet, Medal, Calendar, ChevronLeft, Send } from "lucide-react";
import Link from "next/link";

export default function AdminAlunoDetail() {
  return (
    <div className="space-y-6">
      <Link href="/admin/alunos" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
        <ChevronLeft className="w-4 h-4" /> Voltar para Alunos
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Info */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-brand-support p-6 rounded-2xl border border-white/5 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-brand-accent to-brand-neon flex items-center justify-center text-4xl font-bold text-brand-primary mb-4">
              V
            </div>
            <h2 className="text-xl font-bold mb-1">Victor Assis</h2>
            <div className="text-sm text-gray-400 mb-4">Funcional Inteligente</div>
            <div className="flex justify-center gap-2 mb-6">
              <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-bold">Em dia</span>
              <span className="bg-brand-accent/20 text-brand-accent text-xs px-3 py-1 rounded-full font-bold">Guerreiro</span>
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-brand-primary font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> WhatsApp
            </button>
          </div>

          <div className="bg-brand-support p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold border-b border-white/10 pb-2">Detalhes</h3>
            <div className="text-sm">
              <div className="text-gray-400">Plano</div>
              <div className="font-medium">3x /semana (Tatame)</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-400">Mensalidade</div>
              <div className="font-medium">R$ 516,00 (Vence dia 15)</div>
            </div>
            <div className="text-sm">
              <div className="text-gray-400">Objetivo</div>
              <div className="font-medium">Condicionamento e Força</div>
            </div>
          </div>
        </div>

        {/* Main Content (Tabs Mock) */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-px">
            <button className="px-4 py-2 border-b-2 border-brand-accent text-brand-accent font-bold whitespace-nowrap">Resumo & Treino</button>
            <button className="px-4 py-2 text-gray-400 hover:text-white font-medium whitespace-nowrap">Evolução</button>
            <button className="px-4 py-2 text-gray-400 hover:text-white font-medium whitespace-nowrap">Presença (Streak)</button>
            <button className="px-4 py-2 text-gray-400 hover:text-white font-medium whitespace-nowrap">Financeiro</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-brand-accent" />
                Nível & Skills
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Força</span><span>4/5</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full"><div className="h-full w-4/5 bg-brand-accent rounded-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Mobilidade</span><span>3/5</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full"><div className="h-full w-3/5 bg-brand-neon rounded-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Resistência</span><span>5/5</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full"><div className="h-full w-full bg-green-400 rounded-full"></div></div>
                </div>
              </div>
            </div>

            <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Medal className="w-5 h-5 text-brand-neon" />
                Últimas Conquistas
              </h3>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-accent/20 border border-brand-accent flex items-center justify-center text-xl mx-auto mb-2 shadow-[0_0_10px_#EAB308]">🔥</div>
                  <div className="text-[10px] text-brand-accent font-bold">Esquentando</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-xl mx-auto mb-2">🏃</div>
                  <div className="text-[10px] text-green-400 font-bold">1º Suor</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
            <h3 className="font-bold mb-4">Anotações do Coach</h3>
            <textarea 
              className="w-full bg-brand-primary border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-accent text-sm min-h-[120px]"
              defaultValue="Victor melhorou consideravelmente a carga no agachamento. Manter o foco na respiração e estabilidade do core."
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-sm font-bold transition-colors">Salvar Nota</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
