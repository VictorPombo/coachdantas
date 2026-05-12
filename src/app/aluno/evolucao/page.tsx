import { Activity, Target } from "lucide-react";

export default function AlunoEvolucao() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sua Evolução</h1>
        <p className="text-gray-400">Acompanhe seu progresso ao longo do tempo.</p>
      </div>

      <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
        <h3 className="font-bold flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-brand-neon" />
          Gráfico de Peso (Mock)
        </h3>
        <div className="h-64 w-full bg-brand-primary rounded-xl border border-white/5 flex items-end px-4 gap-2 py-4 relative">
          {/* Mock bar chart simulating weight loss */}
          <div className="flex-1 bg-white/10 rounded-t-sm h-[90%] group relative"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">85kg</div></div>
          <div className="flex-1 bg-white/10 rounded-t-sm h-[85%] group relative"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">83kg</div></div>
          <div className="flex-1 bg-white/10 rounded-t-sm h-[80%] group relative"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100">80kg</div></div>
          <div className="flex-1 bg-brand-neon rounded-t-sm h-[75%] group relative"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-brand-neon">78kg</div></div>
          
          <div className="absolute w-full border-t border-dashed border-brand-accent top-[80%] left-0 z-0"></div>
          <div className="absolute right-2 top-[76%] text-xs text-brand-accent">Meta: 75kg</div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
          <span>Jul</span><span>Ago</span><span>Set</span><span>Out</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-brand-accent" />
            Skills (Radar Mock)
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1 font-bold">
                <span>Força</span><span className="text-brand-accent">80%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-accent w-[80%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-bold">
                <span>Mobilidade</span><span className="text-brand-neon">60%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-neon w-[60%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-bold">
                <span>Resistência</span><span className="text-green-400">95%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 w-[95%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
          <h3 className="font-bold mb-4">Histórico Recente</h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-accent before:via-white/10 before:to-transparent">
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-brand-support bg-brand-accent text-slate-500 group-[.is-active]:bg-brand-accent shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-brand-primary p-4 rounded-xl border border-white/5 shadow">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-white">Avaliação Outubro</div>
                  <time className="font-medium text-xs text-brand-neon">10/10</time>
                </div>
                <div className="text-sm text-gray-400">Peso: 78kg (Perdeu 2kg). Resistência subiu muito.</div>
              </div>
            </div>
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-brand-support bg-white/20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-brand-primary p-4 rounded-xl border border-white/5 shadow opacity-70">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-white">Avaliação Setembro</div>
                  <time className="font-medium text-xs text-gray-500">05/09</time>
                </div>
                <div className="text-sm text-gray-400">Peso: 80kg. Foco inicial.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
