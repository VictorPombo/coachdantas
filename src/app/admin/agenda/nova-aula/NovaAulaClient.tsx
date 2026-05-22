"use client";

import { useState, useEffect } from "react";
import { FaceVerifyPrompt } from "@/face-auth-core/components/FaceVerifyPrompt";
import { ArrowLeft, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerCheckin } from "./actions";

export default function NovaAulaClient({ alunos }: { alunos: any[] }) {
  const [selectedAluno, setSelectedAluno] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [step, setStep] = useState<"select" | "verify" | "saving" | "success">("select");
  const [currentTime, setCurrentTime] = useState("");
  const [scanTime, setScanTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setHoraInicio(timeString);
    
    // Default end time to 1 hour later
    const later = new Date(now.getTime() + 60 * 60 * 1000);
    setHoraFim(later.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStartCheckin = () => {
    if (!selectedAluno || !horaInicio || !horaFim) {
      alert("Selecione o aluno e os horários da aula.");
      return;
    }
    setStep("verify");
  };

  const handleVerificationResult = async (result: any) => {
    if (result.passed) {
      setStep("saving");
      
      const now = new Date();
      setScanTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      
      try {
        await registerCheckin(selectedAluno, horaInicio, horaFim);
      } catch (err) {
        console.error(err);
      }
      
      setStep("success");
    } else {
      alert("Falha no reconhecimento facial. Tente novamente.");
      setStep("select");
    }
  };

  const handleNextStudent = () => {
    setSelectedAluno("");
    setStep("select");
  };

  const selectedAlunoObj = alunos.find(a => a.id === selectedAluno);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Link href="/admin/agenda" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Voltar para Agenda
      </Link>

      <div className="bg-brand-support border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Check-in de Aula</h1>
          <p className="text-gray-400 text-center">
            Marque a presença do aluno através do reconhecimento facial.
          </p>
          <div className="mt-4 bg-brand-primary border border-white/5 px-6 py-3 rounded-full flex items-center gap-3">
            <Clock className="w-5 h-5 text-brand-accent" />
            <span className="font-mono text-xl text-white font-bold">{currentTime || "00:00:00"}</span>
          </div>
        </div>

        {step === "select" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Horário de Início</label>
                <input 
                  type="time" 
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full bg-brand-primary border border-white/10 text-white p-4 rounded-xl focus:border-brand-accent outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Horário de Encerramento</label>
                <input 
                  type="time" 
                  value={horaFim}
                  onChange={(e) => setHoraFim(e.target.value)}
                  className="w-full bg-brand-primary border border-white/10 text-white p-4 rounded-xl focus:border-brand-accent outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Selecione o Aluno</label>
              <select 
                value={selectedAluno}
                onChange={(e) => setSelectedAluno(e.target.value)}
                className="w-full bg-brand-primary border border-white/10 text-white p-4 rounded-xl focus:border-brand-accent outline-none transition-colors appearance-none"
              >
                <option value="" disabled>-- Escolha o aluno --</option>
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.name || aluno.email}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleStartCheckin}
              disabled={!selectedAluno}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-primary p-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 mt-8"
            >
              Iniciar Reconhecimento Facial
            </button>
          </div>
        )}

        {step === "verify" && (
          <div className="flex flex-col items-center">
            <FaceVerifyPrompt 
              userId={selectedAluno}
              context={`aula_${horaInicio}`}
              onResult={handleVerificationResult}
            />
            <button 
              onClick={() => setStep("select")}
              className="mt-6 text-gray-400 hover:text-white underline text-sm transition-colors"
            >
              Cancelar e voltar
            </button>
          </div>
        )}

        {step === "saving" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-brand-accent animate-spin mb-4" />
            <p className="text-white font-bold">Salvando presença...</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Presença Confirmada!</h2>
            
            <div className="bg-brand-primary border border-white/5 p-6 rounded-2xl w-full my-6 text-left">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Aluno</p>
                  <p className="text-white font-bold text-lg">{selectedAlunoObj?.name || selectedAlunoObj?.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Data do Scan</p>
                    <p className="text-gray-300">{new Date().toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Hora do Scan</p>
                    <p className="text-gray-300">{scanTime}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Período da Aula</p>
                  <p className="text-brand-accent font-medium">{horaInicio} - {horaFim}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full mt-4">
              <button 
                onClick={handleNextStudent}
                className="flex-1 bg-brand-accent text-brand-primary p-4 rounded-xl font-bold hover:bg-brand-accent-hover transition-colors"
              >
                Próximo Aluno
              </button>
              <button 
                onClick={() => router.push("/admin/agenda")}
                className="flex-1 bg-white/5 border border-white/10 text-white p-4 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
