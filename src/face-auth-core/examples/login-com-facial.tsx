"use client"

import { useState } from "react"
import { FaceVerifyPrompt } from "../components/FaceVerifyPrompt"
import { FaceEnrollmentFlow } from "../components/FaceEnrollmentFlow"

export default function LoginComFacialExemplo() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "verify" | "enroll">("email")
  
  // No mundo real, ao digitar o email você buscaria o userId correspondente no banco.
  // Vamos mockar o userId para fins de exemplo:
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000"

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {step === "email" && (
        <div className="bg-[#1A1A1A] p-8 rounded-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6">Acesso</h2>
          <input 
            type="email"
            placeholder="Seu E-mail"
            className="w-full p-4 rounded-xl bg-black border border-white/20 text-white mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            className="w-full bg-brand-accent p-4 rounded-xl text-white font-bold mb-2"
            onClick={() => setStep("verify")}
          >
            Continuar com Biometria
          </button>
          <button 
            className="w-full border border-white/20 p-4 rounded-xl text-white font-bold"
            onClick={() => setStep("enroll")}
          >
            Não tenho biometria (Cadastrar)
          </button>
        </div>
      )}

      {step === "verify" && (
        <FaceVerifyPrompt 
          userId={mockUserId}
          context="login"
          onResult={(result) => {
            if (result.passed) {
              alert(`Login aprovado! Confiança: ${result.confidence}`)
            } else {
              alert(`Rosto não reconhecido.`)
              setStep("email")
            }
          }}
        />
      )}

      {step === "enroll" && (
        <FaceEnrollmentFlow 
          userId={mockUserId}
          onComplete={() => {
            alert("Cadastro feito. Agora tente fazer login!")
            setStep("email")
          }}
        />
      )}
    </div>
  )
}
