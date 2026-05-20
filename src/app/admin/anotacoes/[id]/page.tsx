import { getNote } from "../actions";
import NoteEditor from "./NoteEditor";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function NotePage({ params }: PageProps) {
  const { id } = await params;
  const note = await getNote(id);

  if (!note) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = "professor"; // Default fallback
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile) {
      role = profile.role;
    }
  }

  const isAdmin = role === "admin";

  return (
    <NoteEditor 
      id={note.id} 
      initialTitle={note.title || ""}
      initialContent={note.content || ""} 
      updatedAt={note.updated_at} 
      initialTargetDate={note.target_date || null}
      isAdmin={isAdmin}
    />
  );
}
