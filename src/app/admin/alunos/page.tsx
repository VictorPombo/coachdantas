import { createClient } from "@/utils/supabase/server";
import AdminCRMView from "./AdminCRMView";
import ProfessorAttendanceView from "./ProfessorAttendanceView";

export default async function AdminAlunosPage() {
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

  if (isAdmin) {
    return <AdminCRMView />;
  }

  return <ProfessorAttendanceView />;
}
