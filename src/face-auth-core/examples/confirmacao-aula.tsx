"use client"

import { useState } from "react"
import { FaceVerifyPrompt } from "../components/FaceVerifyPrompt"

export default function ConfirmacaoAulaExemplo() {
  const [isPresent, setIsPresent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000"
  const aulaId = "aula_999"

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      
      {!isPresent && !isVerifying && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Treino de Força #12</h1>
          <p className="text-gray-400 mb-8">Para visualizar o treino de hoje, confirme sua presença.</p>
          
          <button 
            className="bg-brand-accent px-8 py-4 rounded-xl text-white font-bold text-lg"
            onClick={() => setIsVerifying(true)}
          >
            Fazer Check-in com Rosto
          </button>
        </div>
      )}

      {isVerifying && !isPresent && (
        <FaceVerifyPrompt 
          userId={mockUserId}
          context={`aula_${aulaId}`}
          onResult={(result) => {
            if (result.passed) {
              setIsPresent(true)
            } else {
              alert("Não foi possível confirmar sua identidade. Fale com a recepção.")
              setIsVerifying(false)
            }
          }}
        />
      )}

      {isPresent && (
        <div className="text-center p-8 bg-green-500/10 border border-green-500/20 rounded-2xl max-w-md">
          <h2 className="text-2xl font-bold text-green-500 mb-4">Presença Confirmada!</h2>
          <p className="text-gray-300">Aqui está o seu treino do dia...</p>
          {/* Conteúdo da aula liberado */}
        </div>
      )}

    </div>
  )
}
