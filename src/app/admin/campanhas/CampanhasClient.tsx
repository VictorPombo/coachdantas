"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Megaphone,
  Plus,
  Phone,
  Trash2,
  Send,
  X,
  Filter,
} from "lucide-react";
import { createLeadAction, deleteLeadAction, createCampaignAction } from "./actions";

interface Lead {
  id: string;
  full_name: string;
  phone: string;
  source: string;
  notes: string | null;
  created_at: string;
}

interface Campaign {
  id: string;
  title: string;
  message_template: string;
  target_source: string | null;
  sends_count: number;
  created_at: string;
}

const SOURCE_LABELS: Record<string, string> = {
  totalpass: "TotalPass",
  gympass: "GymPass",
  indicacao: "Indicação",
  instagram: "Instagram",
  organic: "Orgânico",
};

const SOURCE_COLORS: Record<string, string> = {
  totalpass: "bg-purple-500/10 text-purple-400",
  gympass: "bg-orange-500/10 text-orange-400",
  indicacao: "bg-blue-500/10 text-blue-400",
  instagram: "bg-pink-500/10 text-pink-400",
  organic: "bg-green-500/10 text-green-400",
};

export function CampanhasClient({
  initialLeads,
  initialCampaigns,
}: {
  initialLeads: Lead[];
  initialCampaigns: Campaign[];
}) {
  const [tab, setTab] = useState<"leads" | "campanhas">("leads");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredLeads =
    sourceFilter === "all"
      ? initialLeads
      : initialLeads.filter((l) => l.source === sourceFilter);

  const handleCreateLead = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createLeadAction(formData);
      if (result.success) {
        setShowLeadModal(false);
        router.refresh();
      }
    });
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Remover este lead?")) return;
    startTransition(async () => {
      await deleteLeadAction(id);
      router.refresh();
    });
  };

  const handleCreateCampaign = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createCampaignAction(formData);
      if (result.success) {
        setShowCampaignModal(false);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Campanhas
          </h1>
          <p className="text-gray-400 mt-1">
            Gerencie leads e envie ofertas via WhatsApp
          </p>
        </div>
        <button
          onClick={() =>
            tab === "leads"
              ? setShowLeadModal(true)
              : setShowCampaignModal(true)
          }
          className="bg-brand-accent hover:bg-brand-accent/90 text-white px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {tab === "leads" ? "Novo Lead" : "Nova Campanha"}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-brand-support/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("leads")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === "leads"
              ? "bg-brand-accent text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          Leads ({initialLeads.length})
        </button>
        <button
          onClick={() => setTab("campanhas")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === "campanhas"
              ? "bg-brand-accent text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Campanhas ({initialCampaigns.length})
        </button>
      </div>

      {/* ============================== LEADS TAB ============================== */}
      {tab === "leads" && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-brand-support border border-white/10 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-brand-accent"
            >
              <option value="all">Todas as Origens</option>
              <option value="totalpass">TotalPass</option>
              <option value="gympass">GymPass</option>
              <option value="indicacao">Indicação</option>
              <option value="instagram">Instagram</option>
            </select>
            <span className="text-sm text-gray-500">
              {filteredLeads.length} leads
            </span>
          </div>

          {/* Table */}
          <div className="bg-brand-support border border-white/5 rounded-2xl overflow-hidden">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-bold mb-2">
                  Nenhum lead cadastrado
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Adicione os contatos dos alunos TotalPass para começar a
                  enviar ofertas.
                </p>
                <button
                  onClick={() => setShowLeadModal(true)}
                  className="bg-brand-accent text-white px-5 py-2.5 rounded-xl font-medium"
                >
                  Cadastrar Primeiro Lead
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-gray-400 text-sm">
                    <tr>
                      <th className="p-4 font-medium">Nome</th>
                      <th className="p-4 font-medium">Telefone</th>
                      <th className="p-4 font-medium">Origem</th>
                      <th className="p-4 font-medium">Notas</th>
                      <th className="p-4 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-bold text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                            {lead.full_name.charAt(0)}
                          </div>
                          {lead.full_name}
                        </td>
                        <td className="p-4 text-gray-300">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                            {lead.phone}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              SOURCE_COLORS[lead.source] ??
                              "bg-gray-500/10 text-gray-400"
                            }`}
                          >
                            {SOURCE_LABELS[lead.source] ?? lead.source}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400 text-xs max-w-[200px] truncate">
                          {lead.notes || "—"}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                            title="Remover lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================== CAMPAIGNS TAB ============================== */}
      {tab === "campanhas" && (
        <div className="space-y-4">
          {initialCampaigns.length === 0 ? (
            <div className="bg-brand-support border border-white/5 rounded-2xl p-12 text-center">
              <Megaphone className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">
                Nenhuma campanha criada
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Crie sua primeira campanha para enviar ofertas aos leads.
              </p>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="bg-brand-accent text-white px-5 py-2.5 rounded-xl font-medium"
              >
                Criar Primeira Campanha
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {initialCampaigns.map((c) => (
                <div
                  key={c.id}
                  className="bg-brand-support border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {c.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {c.message_template}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {c.target_source && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              SOURCE_COLORS[c.target_source] ??
                              "bg-gray-500/10 text-gray-400"
                            }`}
                          >
                            {SOURCE_LABELS[c.target_source] ??
                              c.target_source}
                          </span>
                        )}
                        <span>
                          {c.sends_count} envio
                          {c.sends_count !== 1 ? "s" : ""}
                        </span>
                        <span>
                          {new Date(c.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/campanhas/${c.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      Disparar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================== MODAL: NOVO LEAD ============================== */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-support border border-white/10 rounded-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Novo Lead</h2>
              <button
                onClick={() => setShowLeadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleCreateLead} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Nome completo *
                </label>
                <input
                  name="full_name"
                  required
                  placeholder="João Silva"
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Telefone (WhatsApp) *
                </label>
                <input
                  name="phone"
                  required
                  placeholder="5521999999999"
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Origem
                </label>
                <select
                  name="source"
                  defaultValue="totalpass"
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-brand-accent"
                >
                  <option value="totalpass">TotalPass</option>
                  <option value="gympass">GymPass</option>
                  <option value="indicacao">Indicação</option>
                  <option value="instagram">Instagram</option>
                  <option value="organic">Orgânico</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Notas (opcional)
                </label>
                <textarea
                  name="notes"
                  placeholder="Ex: Frequentou 3 meses pelo TotalPass, treina de manhã"
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-white text-sm h-20 focus:outline-none focus:border-brand-accent resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {isPending ? "Salvando..." : "Cadastrar Lead"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================== MODAL: NOVA CAMPANHA ============================== */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-support border border-white/10 rounded-2xl p-6 w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Nova Campanha</h2>
              <button
                onClick={() => setShowCampaignModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Título da campanha *
                </label>
                <input
                  name="title"
                  required
                  placeholder="Workshop Sábado — Maio"
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Mensagem do WhatsApp *
                </label>
                <textarea
                  name="message_template"
                  required
                  placeholder={`Oi {nome}! 🏋️ Treinamos juntos e quero te fazer um convite especial: Workshop de Sábado por R$ 120 (10% OFF exclusivo para você). Bora? 💪`}
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-white text-sm h-32 focus:outline-none focus:border-brand-accent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Use <code className="text-brand-accent">{"{nome}"}</code> para
                  inserir o nome do lead automaticamente.
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">
                  Público-alvo
                </label>
                <select
                  name="target_source"
                  defaultValue="totalpass"
                  className="w-full bg-brand-primary border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-brand-accent"
                >
                  <option value="">Todos os Leads</option>
                  <option value="totalpass">TotalPass</option>
                  <option value="gympass">GymPass</option>
                  <option value="indicacao">Indicação</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {isPending ? "Criando..." : "Criar Campanha"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
