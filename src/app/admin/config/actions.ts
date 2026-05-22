"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateProfileName(newName: string) {
  if (!newName || newName.trim() === "") {
    return { error: "O nome não pode estar vazio." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: newName.trim() })
    .eq("id", user.id);

  if (error) {
    console.error("Erro ao atualizar nome:", error);
    return { error: "Erro ao atualizar o nome." };
  }

  return { success: true };
}

export async function updatePassword(newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Erro ao atualizar senha:", error);
    return { error: "Erro ao atualizar a senha." };
  }

  return { success: true };
}
