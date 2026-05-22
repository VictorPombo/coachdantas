"use client"

import { useState } from "react"
import { FaceCameraWidget } from "./FaceCameraWidget"
import { identifyFaceLogin, FaceIdentifyResult } from "../FaceLogin"

export interface FaceIdentifyPromptProps {
  onResult: (result: FaceIdentifyResult) => void
}

export function FaceIdentifyPrompt({ onResult }: FaceIdentifyPromptProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressText, setProgressText] = useState("")

  const handleCapture = async (videoElement: HTMLVideoElement) => {
    setIsProcessing(true)
    
    try {
      const result = await identifyFaceLogin(videoElement, (msg) => setProgressText(msg))
      onResult(result)
    } catch (err: any) {
      console.error(err)
      onResult({
        passed: false,
        distance: 1.0,
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
          Identificação Facial
        </h3>
        
        <FaceCameraWidget 
          onCapture={handleCapture}
          label="Iniciar Escaneamento"
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
