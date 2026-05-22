"use client";

import { useState } from "react";
import { Loader2, User, Key, CheckCircle2, X } from "lucide-react";
import { updateProfileName, updatePassword } from "./actions";

interface ProfileSettingsClientProps {
  initialName: string;
  role: string;
}

export function ProfileSettingsClient({ initialName, role }: ProfileSettingsClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState("");
  
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const roleLabels: Record<string, string> = {
    admin: "Administrador Principal",
    student: "Aluno",
    user: "Usuário Padrão"
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    try {
      // Update name if changed
      if (name !== initialName) {
        const nameRes = await updateProfileName(name);
        if (nameRes.error) throw new Error(nameRes.error);
      }

      // Update password if provided
      if (password.trim() !== "") {
        const passRes = await updatePassword(password);
        if (passRes.error) throw new Error(passRes.error);
      }

      setStatus("success");
      setTimeout(() => {
        setIsEditing(false);
        setStatus("idle");
        setPassword("");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Erro ao atualizar dados.");
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-3 bg-brand-primary rounded-xl border border-white/5 mb-4 group hover:border-white/10 transition-colors">
        <div>
          <div className="font-bold text-sm text-white">{name}</div>
          <div className="text-xs text-brand-accent">{roleLabels[role] || role}</div>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-colors"
        >
          Editar Perfil
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="bg-brand-primary p-4 rounded-xl border border-white/10 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <User className="w-4 h-4 text-brand-accent" />
          Editar Perfil
        </h3>
        <button 
          type="button"
          onClick={() => {
            setIsEditing(false);
            setName(initialName);
            setPassword("");
            setStatus("idle");
          }}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Nome Completo</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/20 border border-white/10 text-white p-2.5 rounded-lg text-sm focus:border-brand-accent outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1.5">
            <Key className="w-3 h-3" />
            Nova Senha (opcional)
          </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Deixe em branco para manter a atual"
            className="w-full bg-black/20 border border-white/10 text-white p-2.5 rounded-lg text-sm focus:border-brand-accent outline-none transition-colors"
            minLength={6}
          />
        </div>

        {status === "error" && (
          <div className="text-red-400 text-xs bg-red-400/10 p-2 rounded-lg border border-red-400/20">
            {errorMessage}
          </div>
        )}

        {status === "success" && (
          <div className="text-green-400 text-xs bg-green-400/10 p-2 rounded-lg border border-green-400/20 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Dados atualizados com sucesso!
          </div>
        )}

        <div className="pt-2">
          <button 
            type="submit"
            disabled={status === "saving" || status === "success"}
            className="w-full bg-brand-accent text-brand-primary p-2.5 rounded-lg text-sm font-bold hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "saving" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
