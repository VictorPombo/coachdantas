"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageCircle,
  Send,
  Phone,
} from "lucide-react";
import { markSentAction } from "../actions";

interface Campaign {
  id: string;
  title: string;
  message_template: string;
  target_source: string | null;
  created_at: string;
}

interface LeadWithStatus {
  id: string;
  full_name: string;
  phone: string;
  source: string;
  already_sent: boolean;
}

/**
 * Substitui {nome} pelo primeiro nome do lead e monta o link wa.me.
 * A substituição acontece aqui no frontend, ANTES de montar a URL,
 * garantindo que a variável literal nunca vai parar na URL.
 */
function buildWhatsAppLink(phone: string, template: string, fullName: string): string {
  const firstName = fullName.split(" ")[0];
  const personalizedMessage = template.replace(/\{nome\}/gi, firstName);
  const encoded = encodeURIComponent(personalizedMessage);
  // Remove caracteres não numéricos do telefone
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function CampaignDispatchClient({
  campaign,
  leads,
}: {
  campaign: Campaign;
  leads: LeadWithStatus[];
}) {
  const [sentLocally, setSentLocally] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const pending = leads.filter(
    (l) => !l.already_sent && !sentLocally.has(l.id)
  );
  const sent = leads.filter(
    (l) => l.already_sent || sentLocally.has(l.id)
  );

  const handleSendAndMark = (lead: LeadWithStatus) => {
    // 1. Abre o WhatsApp com a mensagem personalizada
    const link = buildWhatsAppLink(
      lead.phone,
      campaign.message_template,
      lead.full_name
    );
    window.open(link, "_blank");

    // 2. Marca como enviado no banco
    startTransition(async () => {
      await markSentAction(campaign.id, lead.id);
      setSentLocally((prev) => new Set(prev).add(lead.id));
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <Link
          href="/admin/campanhas"
          className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Campanhas
        </Link>
        <h1 className="text-3xl font-bold text-white">{campaign.title}</h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          {campaign.message_template}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-brand-support/50 border border-white/5 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Total de Leads</p>
          <p className="text-2xl font-bold text-white mt-1">{leads.length}</p>
        </div>
        <div className="bg-brand-support/50 border border-white/5 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Enviados</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {sent.length}
          </p>
        </div>
        <div className="bg-brand-support/50 border border-white/5 rounded-2xl p-5">
          <p className="text-gray-400 text-sm">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {pending.length}
          </p>
        </div>
      </div>

      {/* Pending List */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Pendentes ({pending.length})
          </h2>
          <div className="space-y-2">
            {pending.map((lead) => (
              <div
                key={lead.id}
                className="bg-brand-support border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white font-bold text-sm">
                    {lead.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{lead.full_name}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendAndMark(lead)}
                  disabled={isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sent List */}
      {sent.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Enviados ({sent.length})
          </h2>
          <div className="space-y-2">
            {sent.map((lead) => (
              <div
                key={lead.id}
                className="bg-brand-support/50 border border-white/5 rounded-xl p-4 flex items-center justify-between opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-sm">
                    {lead.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{lead.full_name}</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {lead.phone}
                    </p>
                  </div>
                </div>
                <span className="text-green-400 text-sm flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Enviado
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="bg-brand-support border border-white/5 rounded-2xl p-12 text-center">
          <Send className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">
            Nenhum lead elegível
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Cadastre leads com a origem &quot;
            {campaign.target_source || "qualquer"}&quot; para disparar esta
            campanha.
          </p>
          <Link
            href="/admin/campanhas"
            className="bg-brand-accent text-white px-5 py-2.5 rounded-xl font-medium"
          >
            Voltar e Cadastrar Leads
          </Link>
        </div>
      )}
    </div>
  );
}
