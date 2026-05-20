import { getNote } from "../actions";
import NoteEditor from "./NoteEditor";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    from?: string;
  };
}

export default async function NotePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const from = resolvedSearchParams?.from || "";
  const note = await getNote(id);

  if (!note || note.target_date !== null) {
    notFound();
  }

  // Get user role to handle permissions on NoteEditor
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <NoteEditor 
      id={note.id} 
      initialTitle={note.title || ""}
      initialContent={note.content || ""} 
      updatedAt={note.updated_at} 
      initialTargetDate={note.target_date || null}
      isAdmin={isAdmin}
      from={from}
    />
  );
}
