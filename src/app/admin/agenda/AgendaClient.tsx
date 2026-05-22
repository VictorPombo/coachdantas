"use client";

import { useState, useEffect, useRef } from "react";
import { CalendarDays, Clock, Plus, Users, StickyNote, ChevronLeft, ChevronRight, Loader2, Trash2, CheckCircle2, Maximize2, X, Camera, Search, Edit2 } from "lucide-react";
import { createNoteForDate, updateNote, deleteNote } from "../anotacoes/actions";
import { searchStudents } from "./actions";
import { FaceIdentifyPrompt } from "@/face-auth-core/components/FaceIdentifyPrompt";

interface Note {
  id: string;
  title: string | null;
  content: string | null;
  target_date: string | null;
}

interface AgendaClientProps {
  initialNotes: Note[];
  isAdmin: boolean;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function AgendaClient({ initialNotes, isAdmin }: AgendaClientProps) {
  // Set current date context
  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];
  
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  // Notes lists and inline editor states
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Facial identify states
  const [activeIdentifyClass, setActiveIdentifyClass] = useState<any>(null);
  const [identifySuccess, setIdentifySuccess] = useState<any>(null);

  // Initialize states from localStorage if available
  const [extraStudents, setExtraStudents] = useState<Record<string, string[]>>({});
  const [removedStudents, setRemovedStudents] = useState<Record<string, string[]>>({});
  const [editedClasses, setEditedClasses] = useState<Record<string, any>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedExtra = localStorage.getItem('coachdantas_extraStudents');
    const savedRemoved = localStorage.getItem('coachdantas_removedStudents');
    const savedEdited = localStorage.getItem('coachdantas_editedClasses');
    
    if (savedExtra) setExtraStudents(JSON.parse(savedExtra));
    if (savedRemoved) setRemovedStudents(JSON.parse(savedRemoved));
    if (savedEdited) setEditedClasses(JSON.parse(savedEdited));
    setIsInitialized(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('coachdantas_extraStudents', JSON.stringify(extraStudents));
    localStorage.setItem('coachdantas_removedStudents', JSON.stringify(removedStudents));
    localStorage.setItem('coachdantas_editedClasses', JSON.stringify(editedClasses));
  }, [extraStudents, removedStudents, editedClasses, isInitialized]);

  // Manual Add states
  const [activeManualAddClass, setActiveManualAddClass] = useState<any>(null);
  const [manualStudentName, setManualStudentName] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Edit Class states
  const [activeEditClass, setActiveEditClass] = useState<any>(null);

  const handleRemoveStudent = (classId: string, studentName: string) => {
    if (window.confirm(`Remover ${studentName} desta aula?`)) {
      setRemovedStudents(prev => {
        const current = prev[classId] || [];
        return { ...prev, [classId]: [...current, studentName] };
      });
    }
  };

  useEffect(() => {
    if (!activeManualAddClass) return;

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchStudents(manualStudentName);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [manualStudentName, activeManualAddClass]);

  const handleManualAdd = (studentName: string) => {
    if (!activeManualAddClass) return;
    
    setExtraStudents(prev => {
      const current = prev[activeManualAddClass.classIdentifier] || [];
      return {
        ...prev,
        [activeManualAddClass.classIdentifier]: [...current, studentName]
      };
    });
    
    setManualStudentName("");
    setSearchResults([]);
    setActiveManualAddClass(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditClass) return;

    setEditedClasses(prev => ({
      ...prev,
      [activeEditClass.classIdentifier]: {
        hora: activeEditClass.hora,
        fim: activeEditClass.fim,
        local: activeEditClass.local,
        modalidade: activeEditClass.modalidade,
        descricao: activeEditClass.descricao
      }
    }));
    setActiveEditClass(null);
  };

  // Expand modal and auto-resize textareas refs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize inline textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [noteContent, noteId]);

  // Auto-resize modal textarea
  useEffect(() => {
    if (modalTextareaRef.current) {
      modalTextareaRef.current.style.height = "auto";
      modalTextareaRef.current.style.height = `${modalTextareaRef.current.scrollHeight}px`;
    }
  }, [noteContent, isModalOpen]);

  // Sync editor fields when the selected date or local notes array updates
  useEffect(() => {
    const note = notes.find((n) => n.target_date === selectedDate);
    if (note) {
      setNoteId(note.id);
      setNoteTitle(note.title || "");
      setNoteContent(note.content || "");
      setSaveStatus("idle");
    } else {
      setNoteId(null);
      setNoteTitle("");
      setNoteContent("");
      setSaveStatus("idle");
    }
  }, [selectedDate, notes]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!isAdmin || !noteId) return;

    // Check if anything actually changed from the currently stored note
    const currentStoredNote = notes.find((n) => n.id === noteId);
    if (!currentStoredNote) return;

    if (noteTitle === (currentStoredNote.title || "") && noteContent === (currentStoredNote.content || "")) {
      return;
    }

    setSaveStatus("saving");

    const timeoutId = setTimeout(async () => {
      try {
        await updateNote(noteId, noteTitle, noteContent, selectedDate);
        setSaveStatus("saved");

        // Keep local notes array in sync so visual indicators on the calendar update immediately
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? { ...n, title: noteTitle, content: noteContent } : n))
        );

        setTimeout(() => {
          setSaveStatus((prev) => (prev === "saved" ? "idle" : prev));
        }, 2000);
      } catch (err) {
        setSaveStatus("error");
      }
    }, 1000); // 1-second debounce

    return () => clearTimeout(timeoutId);
  }, [noteTitle, noteContent, noteId, notes, selectedDate, isAdmin]);

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const pad = (n: number) => String(n).padStart(2, '0');
  
  // Helper to format ISO date string
  const getDayISOString = (day: number) => {
    return `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
  };

  // Formatting date for displaying on the card header (e.g. Quinta-feira, 12 de Nov)
  const getFormattedSelectedDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    const dayName = d.toLocaleDateString("pt-BR", { weekday: "long" });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalizedDay}, ${dayNum} de ${capitalizedMonth}`;
  };

  // Check if a day has a note linked to it
  const getNoteForDate = (dateStr: string) => {
    return notes.find((n) => n.target_date === dateStr);
  };

  // Mock classes dynamic generator by weekday
  const getClassesForDate = (dateStr: string) => {
    const dateObj = new Date(dateStr + "T12:00:00");
    const dayOfWeek = dateObj.getDay();
    
    if (dayOfWeek === 0) {
      return []; // Sunday
    }
    
    if (dayOfWeek === 6) {
      // Saturday
      return [
        { hora: "08:00", fim: "09:30", local: "Praia", alunos: ["Victor Assis", "Rony Gomes", "João"], limite: 10, modalidade: "Treino de Surf Especial" },
        { hora: "10:00", fim: "11:00", local: "Tatame", alunos: ["Maria", "Marina Lima"], limite: 8, modalidade: "Funcional Sábado" },
      ];
    }
    
    // Standard Weekday
    return [
      { hora: "06:00", fim: "07:00", local: "Tatame", alunos: ["Victor Assis", "João", "Maria"], limite: 6, modalidade: "Funcional Inteligente" },
      { hora: "07:00", fim: "08:00", local: "Tatame", alunos: ["Rony Gomes", "Marina Lima"], limite: 6, modalidade: "Surf Training" },
      { hora: "16:00", fim: "17:00", local: "Piscina", alunos: ["Pedro", "Ana"], limite: 4, modalidade: "Natação" },
    ];
  };

  const baseClasses = getClassesForDate(selectedDate);
  const classes = baseClasses.map(baseClass => {
    const classIdentifier = `${baseClass.hora}-${baseClass.modalidade}`;
    return editedClasses[classIdentifier] 
      ? { ...baseClass, ...editedClasses[classIdentifier] } 
      : baseClass;
  });

  // Inline Note creation handler
  const handleCreateNote = async () => {
    if (!isAdmin) return;
    
    setIsCreatingNote(true);
    try {
      const res = await createNoteForDate(selectedDate);
      if (res?.success && res.noteId) {
        const formattedDate = selectedDate.split("-").reverse().join("/");
        const newNote = {
          id: res.noteId,
          title: `Treino do Dia - ${formattedDate}`,
          content: "",
          target_date: selectedDate
        };
        
        // Add to local state list to trigger indicators and show inline fields
        setNotes((prev) => [...prev, newNote]);
        setIsCreatingNote(false);
      } else {
        setIsCreatingNote(false);
        alert("Erro ao criar anotação.");
      }
    } catch (err) {
      setIsCreatingNote(false);
      alert("Erro ao criar anotação para esta data.");
    }
  };

  // Inline Note deletion handler
  const handleDeleteNote = async () => {
    if (!isAdmin || !noteId) return;

    if (window.confirm("Tem certeza que deseja excluir esta anotação?")) {
      setIsDeleting(true);
      try {
        const res = await deleteNote(noteId);
        if (res?.success) {
          // Remove from local notes list to update calendar styles instantly
          setNotes((prev) => prev.filter((n) => n.id !== noteId));
          setIsDeleting(false);
        } else {
          setIsDeleting(false);
          alert("Erro ao excluir anotação");
        }
      } catch (err) {
        setIsDeleting(false);
        alert("Erro ao excluir anotação");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Dynamic Calendar */}
      <div className="bg-brand-support p-6 rounded-2xl border border-white/5 h-fit shadow-lg flex flex-col">
        {/* Calendar Header with Controls */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-white tracking-tight">
            {MONTHS[currentMonth]} {currentYear}
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white/5 active:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white/5 active:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-white/5"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3 text-gray-500 font-bold">
          {WEEKDAYS.map((w, idx) => (
            <div key={idx}>{w}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}

          {/* Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dayISO = getDayISOString(day);
            const isSelected = selectedDate === dayISO;
            const isToday = todayISO === dayISO;
            const hasNote = getNoteForDate(dayISO) !== undefined;

            return (
              <button
                key={`day-${day}`}
                onClick={() => setSelectedDate(dayISO)}
                className={`
                  relative py-2.5 rounded-xl font-medium transition-all flex flex-col items-center justify-center cursor-pointer select-none outline-none w-full aspect-square
                  ${isSelected 
                    ? "bg-brand-accent text-brand-primary font-bold shadow-md shadow-brand-accent/20" 
                    : hasNote
                      ? "border-2 border-brand-accent text-brand-accent font-semibold hover:bg-brand-accent/10"
                      : isToday
                        ? "border border-brand-accent/40 text-brand-accent hover:bg-white/5"
                        : "hover:bg-white/5 text-gray-300 hover:text-white"
                  }
                `}
              >
                <span>{day}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Agenda/Classes List & Notes Panel */}
      <div className="lg:col-span-3 space-y-5">
        {/* Selected Date Card */}
        <div className="flex justify-between items-center bg-brand-primary border border-brand-accent/20 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-brand-accent/10 p-2.5 rounded-xl">
              <CalendarDays className="w-6 h-6 text-brand-accent" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white">
                {getFormattedSelectedDateLabel(selectedDate)}
              </h3>
              <p className="text-sm text-gray-400">
                {classes.length === 0 ? "Nenhuma aula" : `${classes.length} aulas`} programadas
              </p>
            </div>
          </div>
        </div>

        {/* Selected Date Note/Workout Panel */}
        <div 
          className={`
            border rounded-2xl p-6 transition-all shadow-lg
            ${noteId 
              ? "bg-brand-support/70 border-brand-accent/30 shadow-[0_0_20px_rgba(234,179,8,0.03)]" 
              : "bg-brand-support/40 border-white/5"
            }
          `}
        >
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div 
                className={`
                  p-2.5 rounded-xl transition-colors
                  ${noteId ? "bg-brand-accent/20" : "bg-white/5"}
                `}
              >
                <StickyNote 
                  className={`
                    w-5 h-5 transition-colors
                    ${noteId ? "text-brand-accent" : "text-gray-400"}
                  `} 
                />
              </div>
              <div>
                <h3 className="font-bold text-white">Anotações do Dia</h3>
                <p className="text-xs text-gray-500">Treino, avisos ou agenda especial.</p>
              </div>
            </div>

            {/* Status & Deletion Controls inside Header */}
            {noteId && (
              <div className="flex items-center gap-2">
                {/* Save Status (Admins only) */}
                {isAdmin && (
                  <div className="text-xs font-medium flex items-center justify-center min-w-[80px] mr-1">
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
                )}

                {/* Expand Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 text-gray-400 hover:text-brand-accent hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                  title="Expandir anotação"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Delete Button (Admins only) */}
                {isAdmin && (
                  <button
                    onClick={handleDeleteNote}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                    title="Excluir anotação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Note Editor Area */}
          {noteId ? (
            <div className="flex flex-col gap-3">
              {isAdmin ? (
                <>
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Título (ex: Treino de Força)"
                    className="w-full bg-brand-primary/50 text-white font-bold placeholder-gray-600 outline-none border border-white/5 rounded-xl px-4 py-2.5 focus:border-brand-accent transition-colors"
                  />
                  <textarea
                    ref={textareaRef}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Comece a digitar o treino do dia..."
                    className="w-full bg-brand-primary/50 text-white placeholder-gray-600 resize-none outline-none min-h-[140px] leading-relaxed border border-white/5 rounded-xl px-4 py-3 focus:border-brand-accent transition-colors text-sm overflow-hidden"
                    spellCheck="false"
                  />
                </>
              ) : (
                <div className="bg-brand-primary/50 p-4.5 rounded-xl border border-white/5">
                  {noteTitle && <h4 className="font-bold text-brand-accent text-base mb-2">{noteTitle}</h4>}
                  {noteContent && noteContent.trim() !== "" ? (
                    <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {noteContent}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">Sem conteúdo adicional.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-white/[0.01] border border-dashed border-white/5">
              <p className="text-sm text-gray-400 mb-3">Sem anotações vinculadas a esta data.</p>
              {isAdmin ? (
                <button
                  onClick={handleCreateNote}
                  disabled={isCreatingNote}
                  className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isCreatingNote ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Adicionar Anotação
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-gray-500">Apenas administradores podem registrar anotações.</p>
              )}
            </div>
          )}
        </div>

        {/* Classes List */}
        <div className="space-y-4">
          {classes.length === 0 ? (
            <div className="bg-brand-support p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center gap-3">
              <Clock className="w-8 h-8 text-gray-600" />
              <div>
                <h4 className="font-bold text-white">Sem aulas programadas</h4>
                <p className="text-sm text-gray-400 mt-1">Nenhum treino agendado para este dia da semana.</p>
              </div>
            </div>
          ) : (
            classes.map((aula, idx) => {
              const classIdentifier = `${aula.hora}-${aula.modalidade}`;
              const allStudents = [...aula.alunos, ...(extraStudents[classIdentifier] || [])]
                .filter(aluno => !(removedStudents[classIdentifier] || []).includes(aluno));
              
              return (
                <div key={idx} className="bg-brand-support p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 shadow-sm hover:border-white/10 transition-colors">
                  <div className="flex flex-col items-center justify-center min-w-[100px] border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                    <div className="text-2xl font-bold text-brand-accent">{aula.hora}</div>
                    <div className="text-sm text-gray-400">{aula.fim}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-white">{aula.modalidade}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">{aula.local}</span>
                          {aula.descricao && (
                            <span className="text-xs text-brand-accent/80 border border-brand-accent/20 px-2 py-0.5 rounded-md">
                              {aula.descricao}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/5 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-white/5 text-gray-300">
                          <Users className="w-4 h-4 text-brand-accent" />
                          {allStudents.length} {allStudents.length === 1 ? 'aluno' : 'alunos'}
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => setActiveEditClass({ ...aula, classIdentifier })}
                            className="p-1.5 bg-white/5 hover:bg-brand-accent hover:text-brand-primary text-gray-400 rounded-lg transition-colors cursor-pointer border border-white/5"
                            title="Editar Aula"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {allStudents.map((aluno, aIdx) => (
                        <span key={aIdx} className="text-xs bg-brand-primary border border-white/5 pl-3 pr-1.5 py-1.5 rounded-lg flex items-center gap-2 text-gray-300 group">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                          {aluno}
                          <button 
                            onClick={() => handleRemoveStudent(classIdentifier, aluno)}
                            title={`Remover ${aluno}`}
                            className="ml-1 p-0.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setActiveIdentifyClass({ ...aula, classIdentifier })}
                          className="text-xs border border-dashed border-white/20 text-brand-accent hover:text-white px-3 py-1.5 rounded-lg hover:border-white/45 transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Facial
                        </button>
                        <button 
                          onClick={() => setActiveManualAddClass({ ...aula, classIdentifier })}
                          className="text-xs border border-dashed border-white/20 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:border-white/45 transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Manual
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Expand Note Modal */}
      {isModalOpen && noteId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6 transition-all duration-300">
          <div className="bg-brand-support border border-white/10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <StickyNote className="w-5 h-5 text-brand-accent" />
                <div>
                  <h3 className="font-bold text-white text-lg">Anotações Expandidas</h3>
                  <p className="text-xs text-gray-400">
                    {getFormattedSelectedDateLabel(selectedDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Save Status for Admin inside modal */}
                {isAdmin && (
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
                )}

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 active:bg-white/20 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-white/5"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[calc(85vh-140px)]">
              {isAdmin ? (
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Título (ex: Treino de Força)"
                    className="w-full bg-brand-primary/50 text-white font-bold text-xl placeholder-gray-600 outline-none border border-white/5 rounded-xl px-4 py-3 focus:border-brand-accent transition-colors"
                  />
                  <textarea
                    ref={modalTextareaRef}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Comece a digitar o treino do dia..."
                    className="w-full bg-brand-primary/50 text-white placeholder-gray-600 resize-none outline-none min-h-[250px] leading-relaxed border border-white/5 rounded-xl px-4 py-4 focus:border-brand-accent transition-colors text-base overflow-hidden"
                    spellCheck="false"
                  />
                </div>
              ) : (
                <div className="bg-brand-primary/50 p-6 rounded-2xl border border-white/5 min-h-[200px]">
                  {noteTitle ? (
                    <h4 className="font-bold text-brand-accent text-xl mb-4 pb-2 border-b border-white/5">
                      {noteTitle}
                    </h4>
                  ) : (
                    <h4 className="font-bold text-brand-accent text-xl mb-4 pb-2 border-b border-white/5 italic">
                      Anotações do Dia
                    </h4>
                  )}
                  {noteContent && noteContent.trim() !== "" ? (
                    <div className="text-gray-200 text-base whitespace-pre-wrap leading-relaxed">
                      {noteContent}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-base italic">Sem conteúdo adicional.</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all border border-white/5 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Face Identify Modal */}
      {activeIdentifyClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 transition-all duration-300">
          <div className="bg-brand-support border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-brand-accent" />
                <div>
                  <h3 className="font-bold text-white">Check-in: {activeIdentifyClass.modalidade}</h3>
                  <p className="text-xs text-gray-400">
                    {activeIdentifyClass.hora} - {activeIdentifyClass.local}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveIdentifyClass(null);
                  setIdentifySuccess(null);
                }}
                className="p-1.5 hover:bg-white/10 active:bg-white/20 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {identifySuccess ? (
                <div className="flex flex-col items-center text-center py-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Check-in Confirmado!</h2>
                  <p className="text-gray-400 mb-6">
                    <span className="text-white font-bold">{identifySuccess.name}</span> foi adicionado à aula com sucesso.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveIdentifyClass(null);
                      setIdentifySuccess(null);
                    }}
                    className="w-full bg-brand-accent text-brand-primary p-3 rounded-xl font-bold hover:bg-brand-accent-hover transition-colors cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              ) : (
                <FaceIdentifyPrompt 
                  onResult={(result) => {
                    if (result.passed && result.name) {
                      setIdentifySuccess(result);
                      setExtraStudents(prev => {
                        const current = prev[activeIdentifyClass.classIdentifier] || [];
                        return {
                          ...prev,
                          [activeIdentifyClass.classIdentifier]: [...current, result.name!]
                        };
                      });
                    } else {
                      alert(result.error || "Rosto não reconhecido. Tente novamente.");
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {activeManualAddClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 transition-all duration-300">
          <div className="bg-brand-support border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5 text-brand-accent" />
                <div>
                  <h3 className="font-bold text-white">Adicionar Manual</h3>
                  <p className="text-xs text-gray-400">
                    {activeManualAddClass.hora} - {activeManualAddClass.modalidade}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveManualAddClass(null);
                  setManualStudentName("");
                }}
                className="p-1.5 hover:bg-white/10 active:bg-white/20 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-300 mb-2">Buscar Aluno</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={manualStudentName}
                  onChange={(e) => setManualStudentName(e.target.value)}
                  autoFocus
                  placeholder="Ex: João Silva"
                  className="w-full bg-brand-primary border border-white/10 text-white pl-10 p-3.5 rounded-xl focus:border-brand-accent outline-none transition-colors"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-accent animate-spin" />
                )}
              </div>
              
              <div className="mt-4 bg-brand-primary/50 border border-white/5 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
                {isSearching && searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-400">Buscando...</div>
                ) : searchResults.length > 0 ? (
                  <ul className="divide-y divide-white/5">
                    {searchResults.map((aluno) => (
                      <li key={aluno.id}>
                        <button
                          onClick={() => handleManualAdd(aluno.full_name)}
                          className="w-full text-left p-3 hover:bg-white/5 flex items-center justify-between transition-colors group cursor-pointer"
                        >
                          <div>
                            <div className="text-white font-medium">{aluno.full_name}</div>
                            <div className="text-xs text-gray-500">{aluno.email}</div>
                          </div>
                          <Plus className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400">Nenhum aluno encontrado no banco de dados.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {activeEditClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 transition-all duration-300">
          <div className="bg-brand-support border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <Edit2 className="w-5 h-5 text-brand-accent" />
                <div>
                  <h3 className="font-bold text-white">Editar Aula</h3>
                  <p className="text-xs text-gray-400">
                    {activeEditClass.classIdentifier}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveEditClass(null)}
                className="p-1.5 hover:bg-white/10 active:bg-white/20 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Modalidade / Título da Aula</label>
                <input 
                  type="text" 
                  value={activeEditClass.modalidade}
                  onChange={(e) => setActiveEditClass({...activeEditClass, modalidade: e.target.value})}
                  className="w-full bg-brand-primary border border-white/10 text-white p-3.5 rounded-xl focus:border-brand-accent outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Descrição (Opcional)</label>
                <textarea 
                  value={activeEditClass.descricao || ''}
                  onChange={(e) => setActiveEditClass({...activeEditClass, descricao: e.target.value})}
                  placeholder="Ex: Treino focado em força..."
                  className="w-full bg-brand-primary border border-white/10 text-white p-3.5 rounded-xl focus:border-brand-accent outline-none transition-colors min-h-[100px] resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Horário de Início</label>
                  <input 
                    type="time" 
                    value={activeEditClass.hora}
                    onChange={(e) => setActiveEditClass({...activeEditClass, hora: e.target.value})}
                    className="w-full bg-brand-primary border border-white/10 text-white p-3.5 rounded-xl focus:border-brand-accent outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Horário de Término</label>
                  <input 
                    type="time" 
                    value={activeEditClass.fim}
                    onChange={(e) => setActiveEditClass({...activeEditClass, fim: e.target.value})}
                    className="w-full bg-brand-primary border border-white/10 text-white p-3.5 rounded-xl focus:border-brand-accent outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Local</label>
                <input 
                  type="text" 
                  value={activeEditClass.local}
                  onChange={(e) => setActiveEditClass({...activeEditClass, local: e.target.value})}
                  className="w-full bg-brand-primary border border-white/10 text-white p-3.5 rounded-xl focus:border-brand-accent outline-none transition-colors"
                  required
                />
              </div>

              {/* Edit Students Section */}
              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-300 mb-2">Alunos Matriculados</label>
                <div className="bg-brand-primary/50 border border-white/5 rounded-xl p-4 flex flex-wrap gap-2 min-h-[60px]">
                  {(()=>{
                    const currentAll = [...(activeEditClass.alunos || []), ...(extraStudents[activeEditClass.classIdentifier] || [])]
                      .filter(aluno => !(removedStudents[activeEditClass.classIdentifier] || []).includes(aluno));
                    
                    if (currentAll.length === 0) return <span className="text-gray-500 text-sm">Nenhum aluno.</span>;
                    
                    return currentAll.map((aluno, idx) => (
                      <span key={idx} className="text-xs bg-brand-support border border-white/10 pl-3 pr-1.5 py-1.5 rounded-lg flex items-center gap-2 text-gray-300 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        {aluno}
                        <button 
                          type="button"
                          onClick={() => handleRemoveStudent(activeEditClass.classIdentifier, aluno)}
                          className="ml-1 p-0.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ));
                  })()}
                </div>
                <p className="text-xs text-gray-500 mt-2">Para adicionar mais alunos, use os botões na tela da agenda.</p>
              </div>

              <div className="pt-4 mt-2 border-t border-white/5">
                <button 
                  type="submit"
                  className="w-full bg-brand-accent text-brand-primary p-3 rounded-xl font-bold hover:bg-brand-accent-hover transition-colors cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
