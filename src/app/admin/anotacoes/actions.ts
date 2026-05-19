"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getNotes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const { data, error } = await supabase
    .from("admin_notes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar notas:", error);
    throw new Error("Erro ao carregar as anotações");
  }

  return data || [];
}

export async function getNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const { data, error } = await supabase
    .from("admin_notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar nota:", error);
    return null;
  }

  return data;
}

export async function createNote() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const { data, error } = await supabase
    .from("admin_notes")
    .insert([{ 
      user_id: user.id,
      title: "",
      content: ""
    }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar nota:", error);
    throw new Error("Erro ao criar nova anotação");
  }

  revalidatePath("/admin/anotacoes");
  redirect(`/admin/anotacoes/${data.id}`);
}

export async function updateNote(id: string, title: string, content: string, target_date?: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const { error } = await supabase
    .from("admin_notes")
    .update({ 
      title, 
      content, 
      target_date: target_date || null,
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erro ao atualizar nota:", error);
    throw new Error("Erro ao salvar a anotação");
  }

  revalidatePath("/admin/anotacoes");
  revalidatePath(`/admin/anotacoes/${id}`);
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const { error } = await supabase
    .from("admin_notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Erro ao excluir nota:", error);
    throw new Error("Erro ao excluir a anotação");
  }

  revalidatePath("/admin/anotacoes");
  redirect("/admin/anotacoes");
}
