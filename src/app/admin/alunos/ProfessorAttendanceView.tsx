import { getTodayClasses } from "@/lib/queries";
import AttendanceManager from "./AttendanceManager";

export default async function ProfessorAttendanceView() {
  const todayClasses = await getTodayClasses();
  return <AttendanceManager todayClasses={todayClasses} />;
}
