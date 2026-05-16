import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

export default function AdminFinanceiro() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Financeiro</h1>
        <p className="text-gray-400">Controle de mensalidades, entradas e despesas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Entradas (Mês)</h3>
            <ArrowUpRight className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">R$ 28.500</div>
          <span className="text-xs text-green-400">+12% vs mês anterior</span>
        </div>
        <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Saídas (Mês)</h3>
            <ArrowDownRight className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">R$ 4.200</div>
          <span className="text-xs text-gray-400">Despesas fixas e var.</span>
        </div>
        <div className="bg-brand-support p-6 rounded-2xl border border-brand-accent/20">
          <div className="flex justify-between mb-4">
            <h3 className="text-brand-accent text-sm">Lucro Líquido</h3>
            <TrendingUp className="w-5 h-5 text-brand-accent" />
          </div>
          <div className="text-3xl font-bold text-brand-neon mb-1">R$ 24.300</div>
        </div>
        <div className="bg-brand-support p-6 rounded-2xl border border-red-500/20">
          <div className="flex justify-between mb-4">
            <h3 className="text-red-400 text-sm">Inadimplência</h3>
            <DollarSign className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400 mb-1">R$ 1.548</div>
          <span className="text-xs text-red-400/80">3 alunos em atraso</span>
        </div>
      </div>

      {/* Automações Financeiras */}
      <div className="bg-brand-support rounded-2xl border border-brand-accent/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-accent" />
            Automações & Cobranças
          </h2>
          <span className="bg-brand-accent/10 text-brand-accent text-xs px-3 py-1 rounded-full font-bold">API WhatsApp Ativa</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-primary p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Cobrança Automática</p>
              <p className="text-xs text-gray-400 mt-1">Lembrete 3 dias antes do vencimento</p>
            </div>
            <div className="w-12 h-6 bg-brand-neon rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-black rounded-full absolute right-1 top-0.5"></div>
            </div>
          </div>
          <div className="bg-brand-primary p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Bloqueio Automático</p>
              <p className="text-xs text-gray-400 mt-1">Bloquear QR Code após 3 dias de atraso</p>
            </div>
            <div className="w-12 h-6 bg-brand-neon rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-black rounded-full absolute right-1 top-0.5"></div>
            </div>
          </div>
          <div className="bg-brand-primary p-4 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Mensagem de Vencido</p>
              <p className="text-xs text-gray-400 mt-1">Avisar no dia do vencimento (WhatsApp)</p>
            </div>
            <div className="w-12 h-6 bg-brand-neon rounded-full relative cursor-pointer">
              <div className="w-5 h-5 bg-black rounded-full absolute right-1 top-0.5"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-brand-support rounded-2xl border border-white/5 p-6">
          <h2 className="text-xl font-bold mb-6">Mensalidades a Receber</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-brand-primary rounded-xl border border-white/5">
                <div>
                  <div className="font-bold">Aluno Exemplo {i}</div>
                  <div className="text-sm text-gray-400">Vencimento: 15/11/2026</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-400">R$ 516,00</div>
                  <button className="text-xs mt-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors">
                    Registrar Pgto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-support rounded-2xl border border-white/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Últimas Transações</h2>
            <button className="text-sm text-brand-accent hover:underline">+ Nova Transação</button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-brand-primary rounded-xl border border-white/5">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400"><ArrowUpRight className="w-5 h-5"/></div>
                <div>
                  <div className="font-bold">Mensalidade - Victor Assis</div>
                  <div className="text-sm text-gray-400">PIX • Hoje</div>
                </div>
              </div>
              <div className="font-bold text-green-400">+ R$ 420,00</div>
            </div>
            <div className="flex justify-between items-center p-4 bg-brand-primary rounded-xl border border-white/5">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400"><ArrowDownRight className="w-5 h-5"/></div>
                <div>
                  <div className="font-bold">Aluguel do Espaço</div>
                  <div className="text-sm text-gray-400">Transferência • Ontem</div>
                </div>
              </div>
              <div className="font-bold text-red-400">- R$ 3.500,00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
