"use client";

import { useState } from "react";
import { ChevronLeft, Users, ScanFace, Search, CheckCircle2 } from "lucide-react";
import { FaceLoginForm } from "@/app/login/FaceLoginForm"; // We will adapt this or use its underlying logic

interface Aula {
  id: string;
  hora: string;
  local: string;
  modalidade: string;
  limite: number;
  alunos: number;
}

interface Props {
  todayClasses: Aula[];
}

export default function AttendanceManager({ todayClasses }: Props) {
  const [selectedClass, setSelectedClass] = useState<Aula | null>(null);
  const [checkinMethod, setCheckinMethod] = useState<"facial" | "manual">("facial");
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fake manual students for UI demonstration
  const dummyStudents = [
    { id: "1", name: "Victor Assis", plan: "Funcional Inteligente" },
    { id: "2", name: "Rony Gomes", plan: "Surf Training" },
    { id: "3", name: "Marina Lima", plan: "Funcional Inteligente" },
  ].filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleManualCheckin = async (studentId: string, studentName: string) => {
    // In a real scenario, this would call an API route/Server Action
    // await registerCheckin(studentId, selectedClass.id);
    setMessage({ text: `✅ ${studentName} - Check-in realizado! (🔥 Streak: 5 semanas)`, type: "success" });
    setTimeout(() => setMessage(null), 3000);
  };

  if (!selectedClass) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chamada</h1>
          <p className="text-gray-400">Selecione uma aula para registrar as presenças.</p>
        </div>

        {todayClasses.length === 0 ? (
          <div className="bg-brand-support p-8 rounded-3xl text-center border border-white/5">
            <p className="text-gray-400">Nenhuma aula cadastrada para hoje.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayClasses.map((aula) => (
              <button
                key={aula.id}
                onClick={() => setSelectedClass(aula)}
                className="bg-brand-support hover:bg-white/5 p-6 rounded-2xl border border-white/5 text-left transition-colors flex flex-col gap-4 group"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="text-2xl font-bold text-brand-neon group-hover:text-brand-accent transition-colors">
                    {aula.hora}
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <Users className="w-3 h-3 text-brand-accent" />
                    {aula.alunos}/{aula.limite}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{aula.modalidade}</h3>
                  <p className="text-gray-400 text-sm">{aula.local}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedClass(null)}
          className="flex items-center text-gray-400 hover:text-white transition-colors py-2 pr-4 font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Voltar às Aulas
        </button>
      </div>

      <div className="bg-brand-support p-6 rounded-3xl border border-brand-accent/20 relative">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">{selectedClass.modalidade}</h2>
          <p className="text-brand-neon font-medium">{selectedClass.hora} • {selectedClass.local}</p>
        </div>

        {/* Toast Flutuante */}
        {message && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-center font-bold shadow-2xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-4 ${
            message.type === "success" ? "bg-green-500 text-brand-primary border border-green-400" : "bg-red-500 text-white border border-red-400"
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex bg-brand-primary p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setCheckinMethod("facial")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer text-sm font-medium rounded-lg transition-all ${
              checkinMethod === "facial" 
                ? "bg-brand-support text-white shadow border border-white/5" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            <ScanFace className="w-4 h-4 pointer-events-none" />
            Câmera (Rápido)
          </button>
          <button
            type="button"
            onClick={() => setCheckinMethod("manual")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer text-sm font-medium rounded-lg transition-all ${
              checkinMethod === "manual" 
                ? "bg-brand-support text-white shadow border border-white/5" 
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Search className="w-4 h-4 pointer-events-none" />
            Busca Manual
          </button>
        </div>

        {checkinMethod === "facial" ? (
          <div className="bg-brand-primary rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center min-h-[300px]">
            {/* Here we would mount the camera widget. 
                For the MVP simulation, we just show a placeholder message. 
                In a real scenario, this would use the same logic as FaceLoginForm 
                but call registerCheckin on success and NOT redirect, just show the success message. */}
            <ScanFace className="w-16 h-16 text-brand-accent mb-4 animate-pulse" />
            <p className="text-gray-400 text-center max-w-sm">
              Posicione o rosto do aluno em frente à câmera para registrar a presença automaticamente.
            </p>
            <button 
              onClick={() => handleManualCheckin("1", "Victor Assis (Simulação Facial)")}
              className="mt-6 px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10"
            >
              Simular Reconhecimento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar aluno por nome..." 
                className="w-full bg-brand-primary border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-accent"
              />
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {dummyStudents.length > 0 ? dummyStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between bg-brand-primary p-3 rounded-xl border border-white/5">
                  <div>
                    <div className="font-bold text-white text-sm">{student.name}</div>
                    <div className="text-xs text-gray-400">{student.plan}</div>
                  </div>
                  <button 
                    onClick={() => handleManualCheckin(student.id, student.name)}
                    className="bg-brand-accent/20 hover:bg-brand-accent/40 text-brand-accent px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Dar Presença
                  </button>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Nenhum aluno encontrado com "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
