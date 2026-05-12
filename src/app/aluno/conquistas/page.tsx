import { Lock } from "lucide-react";

export default function AlunoConquistas() {
  const badges = [
    { id: 1, icon: "🌱", nome: "1º Suor", desc: "Completar a primeira aula", unlocked: true, color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500" },
    { id: 2, icon: "🔥", nome: "Esquentando", desc: "5 treinos seguidos", unlocked: true, color: "text-brand-accent", bg: "bg-brand-accent/20", border: "border-brand-accent" },
    { id: 3, icon: "⚡", nome: "Imparável", desc: "10 treinos seguidos", unlocked: true, color: "text-brand-neon", bg: "bg-brand-neon/20", border: "border-brand-neon" },
    { id: 4, icon: "🌋", nome: "Vulcânico", desc: "20 treinos seguidos", unlocked: false, color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500", progress: "12/20" },
    { id: 5, icon: "🎯", nome: "Meta Batida", desc: "Atingir peso objetivo", unlocked: false, color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500" },
    { id: 6, icon: "🌟", nome: "5 Estrelas", desc: "Score máximo na avaliação", unlocked: false, color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Coleção de Conquistas</h1>
        <p className="text-gray-400">Você desbloqueou 3 de 25 conquistas totais.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className={`relative p-6 rounded-3xl border flex flex-col items-center text-center transition-all ${badge.unlocked ? `bg-brand-support ${badge.border}/50 hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-${badge.border.split('-')[1]}-500/20` : 'bg-brand-primary border-white/5 opacity-60 grayscale'}`}>
            
            {/* Ícone grande */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner ${badge.unlocked ? badge.bg + ' ' + badge.border : 'bg-white/5 border-white/10'}`}>
              {!badge.unlocked && <Lock className="absolute w-6 h-6 text-white/50" />}
              <span className={!badge.unlocked ? 'opacity-20' : ''}>{badge.icon}</span>
            </div>

            <h3 className={`font-bold mb-1 ${badge.unlocked ? badge.color : 'text-gray-400'}`}>{badge.nome}</h3>
            <p className="text-xs text-gray-500">{badge.desc}</p>

            {badge.progress && !badge.unlocked && (
              <div className="w-full mt-4">
                <div className="text-[10px] font-bold text-gray-400 mb-1">{badge.progress}</div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white/30 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-brand-support to-brand-primary p-6 rounded-2xl border border-brand-accent/20 flex justify-between items-center mt-12">
        <div>
          <h3 className="font-bold text-lg text-white mb-1">Próximo Nível: Gladiador 🛡️</h3>
          <p className="text-sm text-brand-neon">Faltam 1.050 XP</p>
        </div>
        <div className="text-right">
          <button className="bg-brand-accent text-brand-primary font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90">Como ganhar XP?</button>
        </div>
      </div>
    </div>
  );
}
