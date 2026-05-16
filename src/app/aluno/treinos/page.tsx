"use client";

import { PlayCircle, CheckCircle2, Circle, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";

const FaceVerifyPrompt = dynamic(
  () => import("@/face-auth-core/components/FaceVerifyPrompt").then((mod) => mod.FaceVerifyPrompt),
  { ssr: false }
);

export default function TreinosAlunoPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

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

  useEffect(() => {
    const initAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      setUserId(user.id);
      
      // Checa se tem enrollment
      const { data: embedding } = await supabase
        .from('face_embeddings')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (!embedding) {
        // Redireciona para o perfil para cadastrar o rosto
        router.push("/aluno/perfil?require_face_auth=true");
        return;
      }
      
      setIsLoadingUser(false);
    };
    
    initAuth();
  }, [router]);

  const handleVerificationResult = (result: any) => {
    if (result.passed) {
      setIsVerifying(false);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 2) {
        setIsBlocked(true);
      }
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-brand-accent animate-spin mb-4" />
        <p className="text-gray-400">Verificando segurança...</p>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Acesso Bloqueado</h2>
        <p className="text-gray-400">
          A verificação facial falhou múltiplas vezes. Por motivos de segurança, este treino foi bloqueado. Entre em contato com a recepção ou o suporte.
        </p>
      </div>
    );
  }

  if (isVerifying && userId) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">Confirme sua Identidade</h1>
          <p className="text-brand-accent mt-2 max-w-sm mx-auto">
            Para acessar o seu treino de hoje, precisamos validar sua biometria facial.
          </p>
        </div>
        
        {failedAttempts > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center text-sm mb-4 max-w-md mx-auto">
            Rosto não reconhecido. Tentativa {failedAttempts} de 2.
          </div>
        )}
        
        <FaceVerifyPrompt 
          userId={userId} 
          context="aula_treino_dia" 
          onResult={handleVerificationResult} 
        />
      </div>
    );
  }

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
