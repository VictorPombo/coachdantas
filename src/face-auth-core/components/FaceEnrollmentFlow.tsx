"use client"

import { useState } from "react"
import { FaceCameraWidget } from "./FaceCameraWidget"
import { FaceTermsAccept } from "./FaceTermsAccept"
import { enrollFace } from "../FaceEnrollment"
import { CheckCircle2, ShieldCheck } from "lucide-react"

export interface FaceEnrollmentFlowProps {
  userId: string
  onComplete: () => void
  onError?: (error: string) => void
}

type Step = "intro" | "terms" | "camera" | "success"

export function FaceEnrollmentFlow({ userId, onComplete, onError }: FaceEnrollmentFlowProps) {
  const [step, setStep] = useState<Step>("intro")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressText, setProgressText] = useState("")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleCapture = async (videoElement: HTMLVideoElement) => {
    setIsProcessing(true)
    setErrorMsg(null)
    
    try {
      const result = await enrollFace(userId, videoElement, (msg) => setProgressText(msg))
      
      if (result.success) {
        setStep("success")
      } else {
        throw new Error(result.error || "Falha desconhecida no cadastro.")
      }
    } catch (err: any) {
      setErrorMsg(err.message)
      if (onError) onError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (step === "intro") {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-brand-accent" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Segurança Biométrica</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Para garantir a segurança do seu acesso, vamos cadastrar o seu rosto. 
          Este processo leva menos de 1 minuto e só precisa ser feito uma vez.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => setStep("terms")}
            className="w-full py-4 bg-brand-accent text-white rounded-xl font-bold hover:bg-brand-accent/90 transition-all"
          >
            Começar Cadastro
          </button>
        </div>
      </div>
    )
  }

  if (step === "terms") {
    return (
      <FaceTermsAccept 
        onAccept={() => setStep("camera")} 
        onCancel={() => setStep("intro")} 
      />
    )
  }

  if (step === "camera") {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-auto">
        <FaceCameraWidget 
          onCapture={handleCapture}
          label="Tirar Foto"
          loading={isProcessing}
        />
        
        {isProcessing && (
          <p className="text-center text-sm text-brand-accent mt-4 font-medium animate-pulse">
            {progressText}
          </p>
        )}

        {errorMsg && (
          <p className="text-center text-sm text-red-500 mt-4 font-medium bg-red-500/10 p-2 rounded-lg">
            {errorMsg}
          </p>
        )}
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="bg-[#1A1A1A] border border-green-500/20 bg-gradient-to-b from-[#1A1A1A] to-green-900/10 rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-green-400 mb-3">Cadastro Concluído!</h2>
        <p className="text-gray-400 mb-8">
          Seu rosto foi cadastrado com sucesso. Agora você pode usar a biometria facial para acessar o portal e confirmar sua presença nas aulas.
        </p>
        
        <button
          onClick={() => onComplete()}
          className="w-full py-4 border border-green-500/30 text-green-400 rounded-xl font-bold hover:bg-green-500/10 transition-all"
        >
          Continuar
        </button>
      </div>
    )
  }

  return null
}
