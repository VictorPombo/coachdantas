"use client";

import { useState } from "react";
import { Search, Plus, Play, MoreVertical } from "lucide-react";

export default function BibliotecaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockVideos = [
    { id: 1, title: "Treino em Casa: Preparação Física para Surf", category: "Full Body", duration: "45:00" },
    { id: 2, title: "Mobilidade e Equilíbrio para Skate", category: "Mobilidade", duration: "15:30" },
    { id: 3, title: "Core Reforçado: Estabilidade na Prancha", category: "Core", duration: "20:00" },
    { id: 4, title: "Prevenção de Lesões nos Ombros (Remada)", category: "Superiores", duration: "12:00" },
    { id: 5, title: "Pliometria e Explosão para Aéreos", category: "Inferiores", duration: "35:00" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Biblioteca de Treinos em Casa</h1>
          <p className="text-gray-400 mt-1">Repositório de treinos completos para os alunos executarem em casa</p>
        </div>
        <button className="bg-brand-accent hover:bg-brand-accent/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Novo Vídeo
        </button>
      </header>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por exercício..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-brand-support/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockVideos.map((video) => (
          <div key={video.id} className="bg-brand-support/30 border border-white/5 rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
            {/* Video Thumbnail Mock */}
            <div className="h-40 bg-black/50 relative flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="w-12 h-12 bg-brand-accent/90 rounded-full flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer">
                <Play className="w-5 h-5 ml-1" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-medium">
                {video.duration}
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{video.title}</h3>
                <span className="inline-block mt-2 text-xs font-medium bg-white/10 text-gray-300 px-2 py-1 rounded-md">
                  {video.category}
                </span>
              </div>
              <button className="text-gray-500 hover:text-white p-1 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
