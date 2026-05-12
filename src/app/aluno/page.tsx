"use client";

import { Check, Flame, Trophy, Calendar, Award } from "lucide-react";

export default function AlunoDashboard() {
  return (
    <div className="space-y-8">
      {/* Saudação */}
      <div className="text-center md:text-left py-4">
        <h1 className="text-3xl font-bold mb-2">Bora treinar, Victor! 💪</h1>
        <p className="text-gray-400">Você já treinou 3 dias nessa semana.</p>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-br from-brand-accent/20 to-brand-primary p-6 rounded-3xl border border-brand-accent/20 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-accent/20 rounded-full blur-[50px]"></div>
        <Flame className="w-16 h-16 text-brand-accent mb-2 animate-pulse" />
        <div className="text-5xl font-bold text-white mb-2">12</div>
        <div className="text-sm uppercase tracking-widest font-medium text-brand-accent">Treinos Seguidos</div>
        
        <div className="w-full max-w-xs mt-6">
          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
            <span>Streak atual</span>
            <span className="text-brand-accent">Meta: 15</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-accent w-[80%] rounded-full shadow-[0_0_10px_#EAB308]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Próxima Aula */}
        <div className="bg-brand-support p-6 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-neon" />
              Próxima Aula
            </h3>
            <span className="text-xs bg-brand-neon/20 text-brand-neon px-2 py-1 rounded font-bold">Hoje</span>
          </div>
          <div className="text-2xl font-bold mb-1">18:00</div>
          <div className="text-sm text-gray-400 mb-6">Funcional Inteligente • Tatame</div>
          <div className="flex gap-2">
            <button className="flex-1 bg-brand-neon text-brand-primary font-bold py-3 rounded-xl hover:opacity-90">Confirmar</button>
            <button className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10">Cancelar</button>
          </div>
        </div>

        {/* Nível Atual */}
        <div className="bg-brand-support p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-gray-400 mb-1">Nível Atual</h3>
            <div className="text-3xl font-bold mb-1 text-white flex items-center gap-2">
              🗡️ Guerreiro
            </div>
            <div className="text-sm text-brand-neon font-bold mb-6">2.450 XP</div>
            
            <div className="w-full">
              <div className="flex justify-between text-xs font-medium text-gray-400 mb-2">
                <span>XP para Gladiador</span>
                <span>3.500 XP</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand-neon w-[70%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mural do Coach */}
      <div>
        <h2 className="text-xl font-bold mb-4">Mural do Coach</h2>
        <div className="bg-brand-primary border border-brand-accent/20 p-5 rounded-2xl relative">
          <div className="absolute top-5 left-0 w-1 h-10 bg-brand-accent rounded-r-md"></div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-brand-support rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-brand-accent" />
            </div>
            <div>
              <div className="font-bold text-sm">Coach Dantas</div>
              <div className="text-xs text-gray-500">Ontem às 20:30</div>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Excelente evolução na mobilidade de quadril ontem! Continue focando na respiração durante o agachamento. Estamos no caminho certo! 🔥
          </p>
        </div>
      </div>
    </div>
  );
}
