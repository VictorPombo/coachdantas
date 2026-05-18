"use client";

import { useState } from "react";
import { ShieldAlert, ArrowRight, X } from "lucide-react";
import { FACE_AUTH_TERMS } from "../legal/FaceAuthTerms";

export interface FaceTermsAcceptProps {
  onAccept: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export function FaceTermsAccept({ onAccept, onCancel, isProcessing = false }: FaceTermsAcceptProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto">
      <div className="w-16 h-16 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldAlert className="w-8 h-8 text-brand-accent" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Termos de Privacidade
      </h2>
      <p className="text-gray-400 mb-6 text-sm text-center">
        Para utilizar o reconhecimento facial, por favor leia e aceite nossos termos.
      </p>

      {/* Box de Termos com Scroll */}
      <div className="bg-black/40 border border-white/5 rounded-xl p-4 h-64 overflow-y-auto mb-6 custom-scrollbar text-left space-y-4">
        {FACE_AUTH_TERMS.map((term, idx) => (
          <div key={idx}>
            <h3 className="text-white font-bold text-sm mb-1">{term.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{term.content}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 mb-6 text-left">
        <div className="pt-1">
          <input
            type="checkbox"
            id="accept-terms"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5 rounded border-white/20 bg-black/50 text-brand-accent focus:ring-brand-accent focus:ring-offset-gray-900 cursor-pointer"
          />
        </div>
        <label
          htmlFor="accept-terms"
          className="text-sm text-gray-300 cursor-pointer leading-tight"
        >
          Li e concordo com os termos de uso e consentimento para tratamento de dados biométricos.
        </label>
      </div>

      <div className="flex gap-4 w-full">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 py-3 px-4 border border-white/20 text-white rounded-xl font-medium hover:bg-white/5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={!accepted || isProcessing}
          className="flex-1 py-3 px-4 bg-brand-accent text-white rounded-xl font-bold hover:bg-brand-accent/90 transition-all disabled:opacity-50 disabled:bg-gray-600 disabled:text-gray-400 flex items-center justify-center gap-2"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
