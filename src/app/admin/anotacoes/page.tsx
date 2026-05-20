import { getNotes, createNote } from "./actions";
import Link from "next/link";
import { Plus, StickyNote, ChevronRight, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AnotacoesPage() {
  const notes = await getNotes();

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

  // Função para formatar a data como no celular
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Se for hoje, mostrar hora
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Se for ontem
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem";
    }
    
    // Senão, mostrar data
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  // Pega o título principal (se tiver title usa ele, senão a primeira linha)
  const getNotePreview = (note: any) => {
    if (note.title && note.title.trim() !== "") {
      return note.title.substring(0, 50) + (note.title.length > 50 ? "..." : "");
    }
    if (!note.content || note.content.trim() === "") return "Nova anotação vazia...";
    const firstLine = note.content.split('\n')[0].trim();
    return firstLine.substring(0, 50) + (firstLine.length > 50 ? "..." : "");
  };
  
  // Pega o subtítulo (se tem title, pega a 1a linha do content. Senão pega a 2a linha)
  const getNoteSubPreview = (note: any) => {
    if (!note.content || note.content.trim() === "") return "Sem texto adicional";
    const lines = note.content.split('\n');
    
    // Se o titulo está preenchido, o subtitulo é a primeira linha do content
    if (note.title && note.title.trim() !== "") {
      const firstLine = lines[0].trim();
      if (!firstLine) return "Sem texto adicional";
      return firstLine.substring(0, 60) + (firstLine.length > 60 ? "..." : "");
    }
    
    // Senão, é a segunda linha do content (pois a primeira já é o titulo fallback)
    if (lines.length < 2) return "Sem texto adicional";
    
    const secondLine = lines.slice(1).join(" ").trim();
    if (!secondLine) return "Sem texto adicional";
    
    return secondLine.substring(0, 60) + (secondLine.length > 60 ? "..." : "");
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Anotações</h1>
            {!isAdmin && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/10 text-gray-300 rounded-full flex items-center gap-1 border border-white/5">
                <Eye className="w-2.5 h-2.5" /> Apenas Leitura
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {isAdmin ? "Suas anotações pessoais, como no celular." : "Anotações e diretrizes compartilhadas pelo administrador."}
          </p>
        </div>
        
        {isAdmin && (
          <form action={createNote}>
            <button 
              type="submit" 
              className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary p-3 rounded-full transition-all shadow-lg shadow-brand-accent/20 flex items-center justify-center transform hover:scale-105 active:scale-95"
              aria-label="Nova anotação"
            >
              <Plus className="w-6 h-6" />
            </button>
          </form>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-10 hide-scrollbar">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-brand-support/50 rounded-3xl border border-white/5">
            <div className="bg-white/5 p-4 rounded-full mb-4">
              <StickyNote className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhuma anotação</h3>
            <p className="text-gray-400 max-w-sm">
              {isAdmin ? "Clique no botão + no topo da tela para criar sua primeira nota." : "Nenhuma anotação disponível no momento."}
            </p>
          </div>
        ) : (
          <div className="bg-brand-support rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
            <ul className="divide-y divide-white/5">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link 
                    href={`/admin/anotacoes/${note.id}`}
                    className="flex items-center p-5 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-white font-semibold truncate text-lg mb-1 group-hover:text-brand-accent transition-colors">
                        {getNotePreview(note)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 min-w-fit">{formatDate(note.updated_at)}</span>
                        <span className="text-gray-600 truncate">{getNoteSubPreview(note)}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors flex-shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
