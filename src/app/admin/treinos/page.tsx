"use client";

import { useState } from "react";
import { Search, Plus, Dumbbell, Filter, MoreVertical } from "lucide-react";

export default function TreinosPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockWorkouts = [
    {
      id: 1,
      name: "Treino A - Hipertrofia",
      focus: "Peito e Tríceps",
      difficulty: "Intermediário",
      duration: "60 min",
      exercises: 8,
    },
    {
      id: 2,
      name: "Treino B - Hipertrofia",
      focus: "Costas e Bíceps",
      difficulty: "Avançado",
      duration: "75 min",
      exercises: 10,
    },
    {
      id: 3,
      name: "HIIT - Queima Gordura",
      focus: "Cardio",
      difficulty: "Iniciante",
      duration: "30 min",
      exercises: 5,
    },
    {
      id: 4,
      name: "Treino C - Força",
      focus: "Pernas",
      difficulty: "Avançado",
      duration: "90 min",
      exercises: 7,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Treinos</h1>
          <p className="text-gray-400 mt-1">Gerencie a biblioteca de treinos e exercícios</p>
        </div>
        <button className="bg-brand-accent hover:bg-brand-accent/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Novo Treino
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou foco..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-support/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-support/50 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all w-full md:w-auto">
          <Filter className="w-5 h-5" />
          Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-brand-support/30 border border-white/5 rounded-2xl p-6 hover:bg-brand-support/50 hover:border-white/10 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl group-hover:scale-110 transition-transform">
                <Dumbbell className="w-6 h-6" />
              </div>
              <button className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{workout.name}</h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Foco</span>
                <span className="text-gray-200 font-medium">{workout.focus}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Dificuldade</span>
                <span className="text-brand-accent/90 font-medium">{workout.difficulty}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Duração</span>
                <span className="text-gray-200">{workout.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Exercícios</span>
                <span className="text-gray-200">{workout.exercises}</span>
              </div>
            </div>

            <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm font-medium transition-colors text-white">
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
