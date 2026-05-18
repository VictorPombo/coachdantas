import { getLeads, getCampaigns } from "@/lib/queries";
import { CampanhasClient } from "./CampanhasClient";

export default async function AdminCampanhasPage() {
  const [leads, campaigns] = await Promise.all([
    getLeads(),
    getCampaigns(),
  ]);

  return <CampanhasClient initialLeads={leads} initialCampaigns={campaigns} />;
}
