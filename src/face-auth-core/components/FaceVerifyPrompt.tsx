"use client"

import { useState } from "react"
import { FaceCameraWidget } from "./FaceCameraWidget"
import { verifyFaceLogin, FaceLoginResult } from "../FaceLogin"

export interface FaceVerifyPromptProps {
  userId: string
  context: string // ex: 'login', 'aula_123'
  onResult: (result: FaceLoginResult) => void
}

export function FaceVerifyPrompt({ userId, context, onResult }: FaceVerifyPromptProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressText, setProgressText] = useState("")

  const handleCapture = async (videoElement: HTMLVideoElement) => {
    setIsProcessing(true)
    
    try {
      // 1. Extrai a biometria da webcam localmente
      // 2. Manda para a API para validar com o embedding do userId
      const result = await verifyFaceLogin(userId, videoElement, (msg) => setProgressText(msg))
      
      onResult(result)
    } catch (err: any) {
      console.error(err)
      onResult({
        passed: false,
        distance: 1.0,
        confidence: 'failed',
        error: err.message
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white text-center mb-4">
          Confirmação Necessária
        </h3>
        
        <FaceCameraWidget 
          onCapture={handleCapture}
          label="Iniciar Reconhecimento"
          loading={isProcessing}
        />
        
        {isProcessing && (
          <p className="text-center text-sm text-brand-accent mt-4 font-medium animate-pulse">
            {progressText}
          </p>
        )}
      </div>
    </div>
  )
}
