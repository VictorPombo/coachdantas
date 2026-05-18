"use client";

import { ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function QrCodePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Carregando...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
        
      if (profile) {
        setUserName(profile.full_name || "Aluno");
      }

      // Check if enrolled
      const { data: embedding } = await supabase
        .from('face_embeddings')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (!embedding) {
        router.push("/aluno/perfil?require_face_auth=true");
        return;
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-brand-accent animate-spin mb-4" />
        <p className="text-gray-400">Preparando segurança...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Acesso</h1>
          <p className="text-brand-neon mt-1">Sua carteirinha digital facial</p>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative p-8 bg-brand-support/80 border border-green-500/30 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.15)] backdrop-blur-md flex flex-col items-center">
          <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-16 h-16 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-1">Acesso Liberado</h2>
          <p className="text-green-400 text-sm font-medium mb-8">Sua carteirinha digital ativa</p>
          
          <div className="mt-4 text-center space-y-2 border-t border-white/10 pt-6 w-full">
            <h2 className="text-xl font-bold text-white">{userName}</h2>
            <p className="text-gray-400">Plano Anual Premium</p>
            <div className="pt-4 flex gap-4 justify-center">
              <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/5 text-center flex-1">
                <p className="text-xs text-gray-500">Último Acesso</p>
                <p className="font-bold text-white">Agora</p>
              </div>
              <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/5 text-center flex-1">
                <p className="text-xs text-gray-500">Treinos na Semana</p>
                <p className="font-bold text-brand-neon">4 / 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
