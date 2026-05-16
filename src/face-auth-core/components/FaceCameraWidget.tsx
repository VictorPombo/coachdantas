"use client"

import { useState, useRef, useEffect } from "react"
import { Loader2, Camera, AlertCircle } from "lucide-react"
import { startCamera, stopCamera, calculateAverageBrightness, captureFrame } from "../FaceCapture"

export interface FaceCameraWidgetProps {
  onCapture: (videoElement: HTMLVideoElement) => Promise<void>
  label?: string
  loading?: boolean
}

export function FaceCameraWidget({ onCapture, label = "Capturar", loading = false }: FaceCameraWidgetProps) {
  const [isActive, setIsActive] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [status, setStatus] = useState<string>("Aguardando interação...")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      handleStopCamera()
    }
  }, [])

  const handleStopCamera = () => {
    if (videoRef.current) {
      stopCamera(videoRef.current)
      videoRef.current = null
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setIsActive(false)
  }

  const checkBrightnessLoop = () => {
    if (!videoRef.current || !overlayRef.current) return
    const tempCanvas = captureFrame(videoRef.current)
    const br = calculateAverageBrightness(tempCanvas)
    
    if (br < 60) {
      overlayRef.current.style.borderColor = "#ef4444" // red
      setStatus("Iluminação Baixa - Adicione luz no seu rosto")
    } else {
      overlayRef.current.style.borderColor = "#22c55e" // green
      setStatus("Rosto Enquadrado - Pode Capturar")
    }
    
    rafRef.current = requestAnimationFrame(checkBrightnessLoop)
  }

  const domVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isActive && videoRef.current && domVideoRef.current) {
      domVideoRef.current.srcObject = videoRef.current.srcObject
      domVideoRef.current.onloadeddata = () => {
        checkBrightnessLoop()
      }
    }
  }, [isActive])

  const handleStartCamera = async () => {
    setIsStarting(true)
    setErrorMsg(null)
    setStatus("Acessando câmera...")
    
    try {
      const videoEl = await startCamera()
      videoRef.current = videoEl
      setIsActive(true) // Isso fará o DOM renderizar o `<video>`, e o useEffect acima fará o bind da stream
    } catch (err: any) {
      setErrorMsg("Falha ao acessar a câmera. Verifique permissões.")
      console.error(err)
    } finally {
      setIsStarting(false)
    }
  }

  const executeCapture = async () => {
    if (!videoRef.current) return
    try {
      setErrorMsg(null)
      await onCapture(videoRef.current)
    } catch (err: any) {
      setErrorMsg(err.message || "Erro na captura")
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {!isActive ? (
        <button
          onClick={handleStartCamera}
          disabled={isStarting || loading}
          className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-brand-accent text-white rounded-xl font-bold hover:bg-brand-accent/90 transition-all disabled:opacity-50"
        >
          {isStarting || loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
          {isStarting ? "Iniciando..." : loading ? "Carregando..." : label}
        </button>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white">Olhe para a câmera</h3>
            <p className="text-sm text-gray-400 mt-1">Mantenha o rosto centralizado e bem iluminado</p>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80 bg-black rounded-full overflow-hidden shadow-2xl border-4 border-white/10 mb-6 flex-shrink-0">
            <video 
              ref={domVideoRef}
              id="face-auth-video"
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            {/* Overlay de Brilho */}
            <div 
              ref={overlayRef} 
              className="absolute inset-0 border-[6px] border-transparent transition-colors duration-300 pointer-events-none rounded-full"
            ></div>

            {/* Guia oval (silhueta) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[65%] h-[85%] border-2 border-dashed border-white/40 rounded-[50%]" />
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-accent animate-spin" />
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-red-500 mb-4 bg-red-500/10 p-3 rounded-lg w-full justify-center">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          <p className={`text-sm font-medium mb-6 ${status.includes("Baixa") ? "text-red-500" : "text-gray-400"}`}>
            {status}
          </p>

          <div className="flex gap-4 w-full">
            <button 
              onClick={handleStopCamera} 
              disabled={loading}
              className="flex-1 py-3 px-4 border border-white/20 text-white rounded-xl font-medium hover:bg-white/5 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={executeCapture} 
              disabled={loading || status.includes("Baixa")}
              className="flex-1 py-3 px-4 bg-brand-accent text-white rounded-xl font-bold hover:bg-brand-accent/90 transition-all disabled:opacity-50"
            >
              {loading ? "Processando..." : "Capturar"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
