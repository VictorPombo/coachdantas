import { Activity, Dumbbell, Waves, Droplets, Trophy, BicepsFlexed } from "lucide-react";

const modalities = [
  {
    title: "Treinamento Funcional Inteligente",
    description: "Treino personalizado focado em movimento, performance e prevenção de lesão.",
    icon: Dumbbell,
  },
  {
    title: "Natural Move",
    description: "Movimentos naturais: rastejar, escalar, equilibrar. Seu corpo como foi projetado.",
    icon: Activity,
  },
  {
    title: "Surf Training",
    description: "Preparação física específica para surfistas. Equilíbrio, explosão e resistência na água.",
    icon: Waves,
  },
  {
    title: "Natação",
    description: "Técnica e condicionamento na piscina. Para iniciantes e avançados.",
    icon: Droplets,
  },
  {
    title: "Natural Aqua",
    description: "Funcional dentro da água. Baixo impacto, alta eficiência. Ideal para reabilitação e performance.",
    icon: BicepsFlexed,
  },
  {
    title: "Preparação de Atletas",
    description: "Treino específico por modalidade. Skate, surf e outros esportes de alto rendimento.",
    icon: Trophy,
  },
];

export function Modalities() {
  return (
    <section className="py-24 bg-brand-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Nossas <span className="text-brand-accent">Modalidades</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Metodologias exclusivas para atender às suas necessidades, seja no tatame ou na piscina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modalities.map((item, index) => (
            <div
              key={index}
              className="bg-brand-support p-8 rounded-2xl border border-white/5 hover:border-brand-accent/50 transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-brand-highlight/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-7 h-7 text-brand-neon" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
