"use client";

import { useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("teste@gmail.com");
  const [password, setPassword] = useState("123456");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "teste@gmail.com" && password === "123456") {
      router.push("/aluno");
    } else if (email === "testeadm@gmail.com" && password === "123456") {
      router.push("/admin");
    } else {
      alert("Credenciais inválidas");
    }
  };

  return (
    <main className="min-h-screen bg-brand-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block font-bold text-2xl tracking-tighter mb-4">
            COACH<span className="text-brand-accent">DANTAS</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Área do Aluno</h1>
          <p className="text-gray-400">Entre para acessar seu painel.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-brand-support p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-primary border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand-accent transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-primary border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand-accent transition-colors"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-primary rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4"
          >
            ENTRAR
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
