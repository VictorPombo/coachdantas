import { Lock } from "lucide-react";
import Image from "next/image";

export default function AlunoConquistas() {
  const badges = [
    { id: 1, imgSrc: "/medals/surf_suor.png", nome: "1º Suor", desc: "Completar a primeira aula", unlocked: true, glow: "from-green-500/40 via-transparent to-transparent", shadow: "shadow-green-500/20", textColor: "text-green-400" },
    { id: 2, imgSrc: "/medals/surf_fogo.png", nome: "Esquentando", desc: "5 treinos seguidos", unlocked: true, glow: "from-orange-500/40 via-transparent to-transparent", shadow: "shadow-orange-500/20", textColor: "text-orange-400" },
    { id: 3, imgSrc: "/medals/surf_raio.png", nome: "Imparável", desc: "10 treinos seguidos", unlocked: true, glow: "from-yellow-400/40 via-transparent to-transparent", shadow: "shadow-yellow-400/20", textColor: "text-yellow-400" },
    { id: 4, imgSrc: "/medals/surf_vulcao.png", nome: "Vulcânico", desc: "20 treinos seguidos", unlocked: false, glow: "from-red-500/40 via-transparent to-transparent", shadow: "shadow-red-500/20", textColor: "text-red-400", progress: "12/20", pct: "60%" },
    { id: 5, imgSrc: "/medals/surf_alvo.png", nome: "Meta Batida", desc: "Atingir peso objetivo", unlocked: false, glow: "from-blue-500/40 via-transparent to-transparent", shadow: "shadow-blue-500/20", textColor: "text-blue-400" },
    { id: 6, imgSrc: "/medals/surf_estrela.png", nome: "5 Estrelas", desc: "Score máximo na avaliação", unlocked: false, glow: "from-purple-500/40 via-transparent to-transparent", shadow: "shadow-purple-500/20", textColor: "text-purple-400" },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-400">
          Galeria de Honra
        </h1>
        <p className="text-gray-400">Você desbloqueou 3 de 25 conquistas totais.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {badges.map((badge) => (
          <div 
            key={badge.id} 
            className={`relative p-5 md:p-6 rounded-3xl border flex flex-col items-center text-center transition-all duration-500 overflow-hidden ${
              badge.unlocked 
                ? `bg-gradient-to-b from-[#111] to-[#0a0a0a] border-gray-700 hover:scale-[1.03] shadow-[0_10px_30px_rgba(0,0,0,0.8)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:${badge.shadow}` 
                : 'bg-[#0a0a0a] border-white/5 opacity-70 grayscale'
            }`}
          >
            {/* Efeito de brilho de fundo dinâmico */}
            {badge.unlocked && (
              <div className={`absolute inset-0 bg-gradient-to-t ${badge.glow} opacity-60 pointer-events-none`} />
            )}
            
            {/* Container da Medalha com o Logo */}
            <div className={`relative w-24 h-24 md:w-32 md:h-32 mb-4 rounded-2xl flex items-center justify-center p-2 transition-transform duration-500 ${
              badge.unlocked 
                ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-110' 
                : 'opacity-40'
            }`}>
              <Image 
                src={badge.imgSrc} 
                alt={badge.nome} 
                fill 
                className="object-contain"
                priority
              />
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-2xl">
                  <Lock className="w-8 h-8 text-white/50" />
                </div>
              )}
            </div>

            <div className="relative z-10 w-full flex flex-col flex-1 justify-end">
              <h3 className={`font-bold mb-1 tracking-wide ${badge.unlocked ? badge.textColor : 'text-gray-400'}`}>
                {badge.nome}
              </h3>
              <p className="text-xs text-gray-400/80 leading-relaxed min-h-[32px]">
                {badge.desc}
              </p>

              {badge.progress && !badge.unlocked && (
                <div className="w-full mt-4">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Progresso</span>
                    <span className="text-[10px] font-bold text-gray-400">{badge.progress}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gray-600 rounded-full" style={{ width: badge.pct }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] p-6 rounded-2xl border border-gray-700 shadow-2xl flex flex-col sm:flex-row justify-between items-center mt-12 gap-6">
        {/* Efeito metálico no card inferior */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30" />
        
        <div className="relative z-10 text-center sm:text-left">
          <h3 className="font-bold text-lg text-white mb-1 flex items-center justify-center sm:justify-start gap-2">
            Próximo Nível: Gladiador
            <Image src="/medals/gladiador.png" alt="Gladiador" width={24} height={24} className="opacity-80 object-contain drop-shadow-md" />
          </h3>
          <p className="text-sm text-gray-400">Faltam <span className="text-white font-bold">1.050 XP</span> para alcançar</p>
        </div>
        
        <button className="relative z-10 bg-gradient-to-b from-gray-200 to-gray-400 text-black font-bold px-6 py-3 rounded-xl text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Como ganhar XP?
        </button>
      </div>
    </div>
  );
}
