"use client";

import { QrCode, ShieldCheck } from "lucide-react";

export default function QrCodePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Acesso</h1>
          <p className="text-brand-neon mt-1">Sua carteirinha digital</p>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative p-8 bg-brand-support/80 border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(253,224,71,0.1)] backdrop-blur-md">
          {/* Mock QR Code Container */}
          <div className="bg-white p-6 rounded-2xl">
            <QrCode className="w-48 h-48 text-brand-primary" />
          </div>
          
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
            <ShieldCheck className="w-4 h-4" />
            Acesso Liberado
          </div>
        </div>

        <div className="mt-12 text-center space-y-2">
          <h2 className="text-xl font-bold text-white">Victor Pombo</h2>
          <p className="text-gray-400">Plano Anual Premium</p>
          <div className="pt-4 flex gap-4 justify-center">
            <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/5 text-center">
              <p className="text-xs text-gray-500">Último Acesso</p>
              <p className="font-bold text-white">Hoje, 09:30</p>
            </div>
            <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/5 text-center">
              <p className="text-xs text-gray-500">Treinos na Semana</p>
              <p className="font-bold text-brand-neon">4 / 5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
