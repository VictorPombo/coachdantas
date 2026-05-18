"use server";

import { createLead, createCampaign, markCampaignSent, deleteLead } from "@/lib/queries";
import { revalidatePath } from "next/cache";

export async function createLeadAction(formData: FormData) {
  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const source = formData.get("source") as string;
  const notes = formData.get("notes") as string;

  if (!full_name || !phone) {
    return { error: "Nome e telefone são obrigatórios." };
  }

  try {
    await createLead({ full_name, phone, source: source || "totalpass", notes: notes || undefined });
    revalidatePath("/admin/campanhas");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteLeadAction(id: string) {
  try {
    await deleteLead(id);
    revalidatePath("/admin/campanhas");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function createCampaignAction(formData: FormData) {
  const title = formData.get("title") as string;
  const message_template = formData.get("message_template") as string;
  const target_source = formData.get("target_source") as string;

  if (!title || !message_template) {
    return { error: "Título e mensagem são obrigatórios." };
  }

  try {
    const campaign = await createCampaign({
      title,
      message_template,
      target_source: target_source || undefined,
    });
    revalidatePath("/admin/campanhas");
    return { success: true, campaignId: campaign.id };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function markSentAction(campaignId: string, leadId: string) {
  try {
    await markCampaignSent(campaignId, leadId);
    revalidatePath(`/admin/campanhas/${campaignId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
