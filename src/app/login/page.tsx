"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Loader2, KeyRound, ScanFace } from "lucide-react";
import Link from "next/link";
import { login } from "./actions";
import { FaceLoginForm } from "./FaceLoginForm";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loginMethod, setLoginMethod] = useState<"password" | "facial">("password");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        // Translate common Supabase errors
        if (result.error === "Invalid login credentials") {
          setError("E-mail ou senha inválidos.");
        } else {
          setError(result.error);
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-primary">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="font-bold text-2xl tracking-tighter inline-block mb-6">
              COACH<span className="text-brand-accent">DANTAS</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Acesso ao Portal</h1>
            <p className="text-gray-400">Insira suas credenciais para continuar.</p>
          </div>

          <div className="bg-brand-support p-8 rounded-3xl border border-white/5 shadow-2xl">
            {/* Método de Login Toggle */}
            <div className="flex bg-brand-primary p-1 rounded-xl mb-6">
              <button
                onClick={() => setLoginMethod("password")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                  loginMethod === "password" 
                    ? "bg-brand-support text-white shadow" 
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                Senha
              </button>
              <button
                onClick={() => setLoginMethod("facial")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                  loginMethod === "facial" 
                    ? "bg-brand-support text-white shadow" 
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <ScanFace className="w-4 h-4" />
                Facial
              </button>
            </div>

            {loginMethod === "password" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="email">
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Seu e-mail"
                      className="w-full bg-brand-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1" htmlFor="password">
                      Senha
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Sua senha"
                      className="w-full bg-brand-primary border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <FaceLoginForm />
            )}
            
            <div className="text-center mt-6">
              <p className="text-xs text-gray-500">
                Dados para teste:<br/>
                admin@coachdantas.com (Admin)<br/>
                victor@aluno.com (Aluno)<br/>
                Senha: password123
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
