"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"

// Importação dinâmica para evitar erro de SSR com face-api
const FaceCameraWidget = dynamic(
  () => import("@/face-auth-core/components/FaceCameraWidget").then(mod => mod.FaceCameraWidget),
  { ssr: false }
)

export function FaceLoginForm() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"email" | "camera">("email")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setErrorMsg(null)
    setStep("camera")
  }

  const handleCapture = async (videoElement: HTMLVideoElement) => {
    setIsProcessing(true)
    setErrorMsg(null)
    
    try {
      // 1. Importa a função de extração dinamicamente para não quebrar SSR
      const { captureEmbedding } = await import("@/face-auth-core/FaceCapture")
      
      // 2. Extrai o embedding usando o FaceCapture core
      const embedding = await captureEmbedding(videoElement, () => {})
      
      // 3. Envia o email + embedding para o backend validar e criar sessão
      const res = await fetch('/api/face-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, embedding: Array.from(embedding) })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Falha na validação facial")
      }

      // Sucesso! A sessão foi criada via cookie pelo backend.
      // Redireciona para o painel apropriado (estamos assumindo /aluno, mas o middleware ou a API poderia lidar com isso)
      router.push('/aluno')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message)
      setStep("email") // Volta pro email em caso de erro
    } finally {
      setIsProcessing(false)
    }
  }

  if (step === "camera") {
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
        <button
          type="button"
          onClick={() => setStep("email")}
          disabled={isProcessing}
          className="w-full py-3 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Voltar e alterar e-mail
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
          {errorMsg}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="face-email">
          E-mail cadastrado
        </label>
        <input
          id="face-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu e-mail"
          className="w-full bg-brand-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent transition-colors"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
      >
        Continuar para Câmera
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  )
}
