"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, ScanFace, RefreshCw, Play, XCircle } from "lucide-react";

const FaceEnrollmentFlow = dynamic(
  () => import("@/face-auth-core/components/FaceEnrollmentFlow").then((mod) => mod.FaceEnrollmentFlow),
  { ssr: false }
);

const FaceVerifyPrompt = dynamic(
  () => import("@/face-auth-core/components/FaceVerifyPrompt").then((mod) => mod.FaceVerifyPrompt),
  { ssr: false }
);

export function FaceAuthSection({ userId, initialIsEnrolled }: { userId: string, initialIsEnrolled: boolean }) {
  const [isEnrolled, setIsEnrolled] = useState(initialIsEnrolled);
  const [isReconfiguring, setIsReconfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "fail" | null>(null);

  if (!isEnrolled || isReconfiguring) {
    return (
      <div className="bg-brand-support border border-white/5 p-6 rounded-2xl relative overflow-hidden">
        <FaceEnrollmentFlow
          userId={userId}
          onComplete={() => {
            setIsEnrolled(true);
            setIsReconfiguring(false);
            setTestResult(null);
          }}
        />
        {isReconfiguring && (
          <button 
            onClick={() => setIsReconfiguring(false)}
            className="absolute top-4 right-4 text-sm text-gray-400 hover:text-white"
          >
            Cancelar
          </button>
        )}
      </div>
    );
  }

  if (isTesting) {
    return (
      <div className="bg-brand-support border border-white/5 p-6 rounded-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <h3 className="font-bold text-white text-lg">Teste de Biometria</h3>
          <p className="text-gray-400 text-sm mt-1">Verificando se o rosto bate com o cadastrado</p>
        </div>
        
        {testResult === "success" ? (
          <div className="flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-green-500 font-bold text-lg mb-2">Você é você mesmo!</h4>
            <p className="text-gray-400 text-sm mb-6">O sistema reconheceu seu rosto perfeitamente.</p>
            <button 
              onClick={() => { setIsTesting(false); setTestResult(null); }}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium transition-colors"
            >
              Fechar Teste
            </button>
          </div>
        ) : testResult === "fail" ? (
          <div className="flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h4 className="text-red-500 font-bold text-lg mb-2">Rosto Não Reconhecido</h4>
            <p className="text-gray-400 text-sm mb-6">A inteligência artificial identificou outra pessoa ou a iluminação estava ruim.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setTestResult(null)}
                className="px-6 py-2 bg-brand-accent text-white rounded-lg font-medium transition-colors hover:bg-brand-accent/90"
              >
                Tentar Novamente
              </button>
              <button 
                onClick={() => { setIsTesting(false); setTestResult(null); }}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <FaceVerifyPrompt 
              userId={userId} 
              context="perfil_teste" 
              onResult={(res) => setTestResult(res.passed ? "success" : "fail")} 
            />
            <button 
              onClick={() => setIsTesting(false)}
              className="absolute top-4 right-4 text-sm text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-brand-support border border-white/5 p-6 rounded-2xl">
      <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Verificação de Identidade</h3>
      
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-left">
        <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
          <ScanFace className="w-6 h-6 text-green-500" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="font-bold text-green-500 flex items-center justify-center sm:justify-start gap-2">
            Rosto Cadastrado <CheckCircle2 className="w-4 h-4" />
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Sua conta está protegida por biometria.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0 flex-wrap justify-center">
          <button 
            onClick={() => setIsTesting(true)}
            className="flex items-center gap-2 text-xs font-medium text-white bg-white/5 border border-white/10 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Play className="w-3 h-3" />
            Testar
          </button>
          <button 
            onClick={() => setIsReconfiguring(true)}
            className="flex items-center gap-2 text-xs font-medium text-brand-accent bg-brand-accent/10 px-3 py-2 rounded-lg hover:bg-brand-accent/20 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reconfigurar
          </button>
        </div>
      </div>
    </div>
  );
}
