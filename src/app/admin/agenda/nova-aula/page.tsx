import { createClient } from "@/utils/supabase/server";
import NovaAulaClient from "./NovaAulaClient";

export default async function NovaAulaPage() {
  const supabase = await createClient();

  // Fetch all users to populate the student select dropdown
  const { data: alunos } = await supabase
    .from("profiles")
    .select("id, name, email")
    .order("name", { ascending: true });

  return (
    <div className="container mx-auto px-4">
      <NovaAulaClient alunos={alunos || []} />
    </div>
  );
}
