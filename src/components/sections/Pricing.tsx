"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

const plansTatame = [
  { freq: "1x por semana", month: 275, hour: 68.75 },
  { freq: "2x por semana", month: 420, hour: 52.5 },
  { freq: "3x por semana", month: 516, hour: 43.0, popular: true },
  { freq: "4x por semana", month: 576, hour: 36.0 },
  { freq: "5x por semana", month: 610, hour: 30.5 },
];

const plansPiscina = [
  { freq: "1x por semana", month: 210, hour: 52.5 },
  { freq: "2x por semana", month: 300, hour: 37.5 },
  { freq: "3x por semana", month: 380, hour: 31.66, popular: true },
];

export function Pricing() {
  const [activeTab, setActiveTab] = useState<"tatame" | "piscina">("tatame");

  const plans = activeTab === "tatame" ? plansTatame : plansPiscina;

  return (
    <section className="py-12 md:py-20 bg-brand-primary" id="planos">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Planos e <span className="text-brand-accent">Preços</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Escolha a frequência ideal para o seu objetivo. <br className="hidden md:block" />
            <span className="text-brand-neon font-semibold">Parceiros Surf&apos;s Up Club: 10% OFF em todos os planos.</span>
          </p>

          <div className="inline-flex items-center p-1 bg-brand-primary rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab("tatame")}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${
                activeTab === "tatame"
                  ? "bg-brand-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Tatame
            </button>
            <button
              onClick={() => setActiveTab("piscina")}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${
                activeTab === "piscina"
                  ? "bg-brand-accent text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Piscina
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] max-w-[380px] bg-brand-primary rounded-3xl p-8 border ${
                plan.popular ? "border-brand-accent scale-105 z-10 shadow-[0_0_20px_rgba(234,179,8,0.15)]" : "border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-accent text-white px-4 py-1 rounded-full text-sm font-bold tracking-wider">
                  MAIS POPULAR
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-300 mb-2">{plan.freq}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">R$ {plan.month.toFixed(2).replace(".", ",")}</span>
                  <span className="text-gray-500">/mês</span>
                </div>
                <div className="text-sm text-brand-neon mt-2 font-medium">
                  R$ {plan.hour.toFixed(2).replace(".", ",")} por hora/aula
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-accent shrink-0" />
                  <span className="text-gray-300">Treino personalizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-accent shrink-0" />
                  <span className="text-gray-300">Avaliação contínua</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-accent shrink-0" />
                  <span className="text-gray-300">Suporte no WhatsApp</span>
                </li>
              </ul>

              <Link
                href={`https://wa.me/551275006875?text=Oi%20Coach%20Dantas!%20Tenho%20interesse%20no%20plano%20de%20${plan.freq}%20na%20${activeTab}.`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-4 text-center rounded-xl font-bold transition-all ${
                  plan.popular
                    ? "bg-brand-accent hover:bg-brand-accent-hover text-white"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                QUERO ESSE PLANO
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
