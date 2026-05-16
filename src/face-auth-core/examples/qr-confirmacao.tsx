"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { waitForSessionResult } from "../database/realtime"

export default function QRConfirmacaoExemplo() {
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [isWaiting, setIsWaiting] = useState(false)
  
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000"

  const startQRSession = async () => {
    setIsWaiting(true)
    
    try {
      // 1. Inicia sessão chamando a API (isso vai gerar o Token no banco)
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: mockUserId, context: 'catraca' })
      })
      
      const { token, url } = await response.json()
      
      // No mundo real, você usaria uma lib como react-qr-code passando a `url` gerada
      setQrUrl(url)
      
      // 2. Fica escutando o Supabase em tempo real para ver se o celular completou
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      // Timeout de 2 minutos (120000 ms)
      const result = await waitForSessionResult(supabase, token, 120000)
      
      if (result.passed) {
        alert("Catraca Liberada!")
      } else {
        alert("Rosto não reconhecido pelo celular.")
      }
      
    } catch (error) {
      alert("Sessão expirou ou ocorreu um erro.")
    } finally {
      setIsWaiting(false)
      setQrUrl(null)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      
      {!isWaiting ? (
        <button 
          className="bg-brand-accent px-8 py-4 rounded-xl text-white font-bold"
          onClick={startQRSession}
        >
          Liberar Catraca pelo Celular
        </button>
      ) : (
        <div className="bg-white p-8 rounded-2xl flex flex-col items-center max-w-sm text-center">
          <h2 className="text-xl font-bold text-black mb-4">Escaneie o QR Code</h2>
          <p className="text-gray-600 mb-6 text-sm">Aponte a câmera do seu celular para fazer a biometria facial.</p>
          
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center border-4 border-black border-dashed mb-4">
            <span className="text-black text-xs break-all px-2 font-mono">{qrUrl}</span>
            {/* Aqui entraria <QRCode value={qrUrl} size={180} /> */}
          </div>
          
          <p className="text-brand-accent animate-pulse text-sm font-bold">Aguardando seu celular...</p>
        </div>
      )}

    </div>
  )
}
