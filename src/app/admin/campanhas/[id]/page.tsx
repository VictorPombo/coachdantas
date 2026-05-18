import { getCampaignById, getCampaignLeads } from "@/lib/queries";
import { notFound } from "next/navigation";
import { CampaignDispatchClient } from "./CampaignDispatchClient";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) return notFound();

  const leads = await getCampaignLeads(id, campaign.target_source);

  return (
    <CampaignDispatchClient campaign={campaign} leads={leads} />
  );
}
