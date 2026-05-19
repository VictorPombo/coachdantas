import { getNote } from "../actions";
import NoteEditor from "./NoteEditor";
import { notFound } from "next/navigation";

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

  return (
    <NoteEditor 
      id={note.id} 
      initialTitle={note.title || ""}
      initialContent={note.content || ""} 
      updatedAt={note.updated_at} 
    />
  );
}
