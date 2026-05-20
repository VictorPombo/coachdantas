"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to check if the user is an admin
async function checkIsAdmin(supabase: any, userId: string): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin";
}

export async function getNotes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  const { data, error } = await supabase
    .from("admin_notes")
    .select("*")
    .is("target_date", null)
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
    if (error.code !== "PGRST116") {
      console.error("Erro ao buscar nota:", error);
    }
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

  // Verify that the user is an admin
  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) {
    throw new Error("Apenas administradores podem criar anotações.");
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

  // Verify that the user is an admin
  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) {
    throw new Error("Apenas administradores podem editar anotações.");
  }

  const updateData: any = {
    title,
    content,
    updated_at: new Date().toISOString()
  };

  if (target_date !== undefined) {
    updateData.target_date = target_date;
  }

  const { error } = await supabase
    .from("admin_notes")
    .update(updateData)
    .eq("id", id);

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

  // Verify that the user is an admin
  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) {
    throw new Error("Apenas administradores podem excluir anotações.");
  }

  const { error } = await supabase
    .from("admin_notes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir nota:", error);
    throw new Error("Erro ao excluir a anotação");
  }

  revalidatePath("/admin/anotacoes");
  return { success: true };
}

export async function createNoteForDate(dateString: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  // Verify that the user is an admin
  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) {
    throw new Error("Apenas administradores podem criar anotações.");
  }

  // Check if there is already a note for this target date
  const { data: existing } = await supabase
    .from("admin_notes")
    .select("id")
    .eq("target_date", dateString)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return { success: true, noteId: existing.id };
  }

  // Create a new note pre-filled with a nice title and the target_date
  const formattedDate = dateString.split("-").reverse().join("/");
  const { data, error } = await supabase
    .from("admin_notes")
    .insert([{ 
      user_id: user.id,
      title: `Treino do Dia - ${formattedDate}`,
      content: "",
      target_date: dateString
    }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar nota para data:", error);
    throw new Error("Erro ao criar nova anotação");
  }

  revalidatePath("/admin/anotacoes");
  revalidatePath("/admin/agenda");

  return { success: true, noteId: data.id };
}
