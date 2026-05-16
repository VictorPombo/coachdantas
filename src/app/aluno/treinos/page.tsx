"use client";

import { PlayCircle, CheckCircle2, Circle } from "lucide-react";

export default function TreinosAlunoPage() {
  const mockTreino = {
    nome: "Treino A - Peito e Tríceps",
    foco: "Hipertrofia",
    exercicios: [
      { id: 1, nome: "Supino Reto com Barra", series: "4", repetições: "10-12", obs: "Pausa de 1s embaixo", feito: true },
      { id: 2, nome: "Supino Inclinado c/ Halteres", series: "3", repetições: "12", obs: "Controlar a descida", feito: false },
      { id: 3, nome: "Crucifixo na Máquina", series: "3", repetições: "15", obs: "Pico de contração", feito: false },
      { id: 4, nome: "Tríceps Pulley", series: "4", repetições: "12-15", obs: "Isolar bem o cotovelo", feito: false },
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">{mockTreino.nome}</h1>
        <p className="text-brand-neon mt-1">Foco: {mockTreino.foco}</p>
      </header>

      <div className="space-y-4">
        {mockTreino.exercicios.map((ex) => (
          <div key={ex.id} className={`p-4 rounded-2xl border ${ex.feito ? 'bg-green-500/10 border-green-500/20' : 'bg-brand-support/50 border-white/10'}`}>
            <div className="flex gap-4 items-start">
              <button className="mt-1 flex-shrink-0">
                {ex.feito ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold ${ex.feito ? 'text-green-400' : 'text-white'}`}>{ex.nome}</h3>
                  <button className="text-brand-neon bg-brand-neon/10 hover:bg-brand-neon/20 p-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors">
                    <PlayCircle className="w-4 h-4" />
                    Vídeo
                  </button>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white/5 rounded-lg p-2">
                    <span className="text-gray-500 text-xs block">Séries</span>
                    <span className="text-white font-medium">{ex.series}</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <span className="text-gray-500 text-xs block">Reps</span>
                    <span className="text-white font-medium">{ex.repetições}</span>
                  </div>
                </div>
                
                {ex.obs && (
                  <div className="mt-3 text-sm text-gray-400 bg-white/5 p-2 rounded-lg border-l-2 border-brand-neon">
                    💡 {ex.obs}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-brand-neon text-brand-primary font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(253,224,71,0.3)] hover:scale-[1.02] transition-transform">
        FINALIZAR TREINO
      </button>
    </div>
  );
}
