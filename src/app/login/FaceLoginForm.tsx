"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { FaceTermsAccept } from "@/face-auth-core/components/FaceTermsAccept"

// Importação dinâmica para evitar erro de SSR com face-api
const FaceCameraWidget = dynamic(
  () => import("@/face-auth-core/components/FaceCameraWidget").then(mod => mod.FaceCameraWidget),
  { ssr: false }
)

export function FaceLoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [termsAcceptedThisSession, setTermsAcceptedThisSession] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Checa localStorage para evitar mostrar os termos sempre
    const accepted = localStorage.getItem('face_terms_accepted') === 'true'
    if (!accepted) {
      setShowTerms(true)
    }
  }, [])

  const handleAcceptTerms = () => {
    localStorage.setItem('face_terms_accepted', 'true')
    setTermsAcceptedThisSession(true)
    setShowTerms(false)
  }

  const handleCapture = async (videoElement: HTMLVideoElement) => {
    setIsProcessing(true)
    setErrorMsg(null)
    
    try {
      // 1. Importa a função de extração dinamicamente para não quebrar SSR
      const { captureEmbedding } = await import("@/face-auth-core/FaceCapture")
      
      // 2. Extrai o embedding usando o FaceCapture core (modo ultra rápido para login)
      const embedding = await captureEmbedding(videoElement, () => {}, { fastMode: true })
      
      // 3. Envia o embedding para o backend (1:N search)
      const res = await fetch('/api/face-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          embedding: Array.from(embedding),
          acceptedTerms: termsAcceptedThisSession
        })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        
        // Volta para os termos se o banco de dados exigir
        if (errData.error === 'terms_required') {
          setShowTerms(true)
          throw new Error("Você precisa aceitar os termos antes de usar o reconhecimento facial.")
        }
        
        throw new Error(errData.error || "Falha na validação facial")
      }

      // Parse successful response
      const data = await res.json()

      // Sucesso! A sessão foi criada via cookie pelo backend.
      if (data.role === 'admin' || data.role === 'professor') {
        router.push('/admin')
      } else {
        router.push('/aluno')
      }
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (showTerms) {
    return (
      <div className="space-y-4">
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}
        <FaceTermsAccept 
          onAccept={handleAcceptTerms} 
          onCancel={() => window.location.reload()} 
          isProcessing={isProcessing}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
          {errorMsg}
        </div>
      )}
      <div className="bg-black/20 p-4 rounded-2xl">
        <FaceCameraWidget 
          onCapture={handleCapture}
          label="Validar Identidade"
          loading={isProcessing}
        />
      </div>
    </div>
  )
}
