"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col bg-brand-primary">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="font-bold text-2xl tracking-tighter inline-block mb-6">
              COACH<span className="text-brand-accent">DANTAS</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Acesso Demonstrativo</h1>
            <p className="text-gray-400">Escolha qual painel você deseja testar.</p>
          </div>

          <div className="bg-brand-support p-8 rounded-3xl border border-white/5 space-y-4 shadow-2xl">
            <button
              onClick={() => router.push("/aluno")}
              className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              Entrar como Aluno
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => router.push("/admin")}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-white/10 transform hover:scale-105"
            >
              Entrar como Administrador
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-6">
              O sistema está com os logins abertos temporariamente para facilitar a visualização do design e das telas antes de conectarmos o banco de dados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
