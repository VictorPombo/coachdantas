"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { User, Phone, CreditCard, Calendar, Loader2, Check } from "lucide-react";

export function EditProfileForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || "",
    phone: initialData.phone || "",
    cpf: initialData.cpf || "",
    birth_date: initialData.birth_date || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const updatePayload = {
        full_name: formData.full_name,
        phone: formData.phone,
        cpf: formData.cpf,
        updated_at: new Date().toISOString(),
      } as any;

      // Only add birth_date if it is set
      if (formData.birth_date) {
        updatePayload.birth_date = formData.birth_date;
      } else {
        updatePayload.birth_date = null;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      router.refresh(); 
      
      setTimeout(() => {
        router.push("/aluno/perfil");
      }, 1500);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const InputGroup = ({ label, icon: Icon, className, ...props }: any) => (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>
      <div className="relative group flex items-center">
        <Icon className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-brand-accent transition-colors pointer-events-none" />
        <input
          {...props}
          className={`w-full h-12 bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent focus:bg-black/60 focus:ring-1 focus:ring-brand-accent/50 transition-all placeholder:text-gray-600 ${className || ""}`}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <InputGroup
            label="Nome Completo"
            icon={User}
            name="full_name"
            required
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Digite seu nome completo"
          />
        </div>

        <InputGroup
          label="Telefone (WhatsApp)"
          icon={Phone}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
        />

        <InputGroup
          label="CPF"
          icon={CreditCard}
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="000.000.000-00"
        />

        <div className="md:col-span-2">
          <InputGroup
            label="Data de Nascimento"
            icon={Calendar}
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            className="[&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 mt-8">
        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-brand-accent hover:bg-brand-accent/90 text-black font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,184,0,0.2)]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : success ? (
            <>
              <Check className="w-5 h-5" />
              Salvo com Sucesso!
            </>
          ) : (
            "Salvar Alterações"
          )}
        </button>
      </div>
    </form>
  );
}
