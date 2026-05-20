"use client";

import { useState, useEffect, useRef } from "react";
import { updateNote, deleteNote } from "../actions";
import { ChevronLeft, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NoteEditorProps {
  id: string;
  initialTitle: string;
  initialContent: string;
  updatedAt: string;
  initialTargetDate?: string | null;
  isAdmin?: boolean;
}

export default function NoteEditor({ id, initialTitle, initialContent, updatedAt, initialTargetDate, isAdmin = true }: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [targetDate, setTargetDate] = useState(initialTargetDate || "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Focus on mount if empty
  useEffect(() => {
    if (!initialContent && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [initialContent]);

  // Debounce save
  useEffect(() => {
    if (!isAdmin) return; // Don't autosave if read-only (professor)
    if (content === initialContent && title === initialTitle && targetDate === (initialTargetDate || "")) return;
    
    setSaveStatus("saving");
    const timeoutId = setTimeout(async () => {
      try {
        await updateNote(id, title, content, targetDate || null);
        setSaveStatus("saved");
        
        // Hide "saved" after a few seconds
        setTimeout(() => {
          setSaveStatus((prev) => prev === "saved" ? "idle" : prev);
        }, 2000);
      } catch (err) {
        setSaveStatus("error");
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [content, title, targetDate, id, initialContent, initialTitle, initialTargetDate, isAdmin]);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta anotação?")) {
      setIsDeleting(true);
      try {
        await deleteNote(id);
        // deleteNote redirects, but just in case:
        router.push("/admin/anotacoes");
      } catch (e) {
        setIsDeleting(false);
        alert("Erro ao excluir anotação");
      }
    }
  };

  // Formata a data
  const date = new Date(updatedAt);
  const dateString = date.toLocaleDateString('pt-BR', { 
    day: '2-digit', month: 'long', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] bg-brand-support rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <Link 
          href="/admin/anotacoes"
          className="flex items-center text-brand-accent hover:text-white transition-colors py-2 pr-4 font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Anotações
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          {isAdmin ? (
            <div className="text-xs font-medium flex items-center justify-center min-w-[80px]">
              {saveStatus === "saving" && (
                <span className="flex items-center text-gray-400">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Salvando...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center text-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Salvo
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-500">Erro ao salvar</span>
              )}
            </div>
          ) : (
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              Apenas Leitura
            </div>
          )}
          
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors disabled:opacity-50"
              title="Excluir anotação"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Meta Date and Target Date Picker */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <span className="text-xs text-gray-500 font-medium mb-2 sm:mb-0">
          Última edição: {dateString}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="targetDate" className="text-sm text-gray-400 font-medium">
            Vincular à Agenda:
          </label>
          <input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={!isAdmin}
            className="bg-brand-primary text-white text-sm border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-20 hide-scrollbar flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          readOnly={!isAdmin}
          placeholder={isAdmin ? "Título" : "Sem título"}
          className="w-full bg-transparent text-white text-3xl font-bold placeholder-gray-600 outline-none"
        />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          readOnly={!isAdmin}
          placeholder={isAdmin ? "Comece a digitar..." : "Nota vazia..."}
          className="w-full bg-transparent text-white text-lg placeholder-gray-600 resize-none outline-none min-h-full flex-1 leading-relaxed"
          spellCheck="false"
        />
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
