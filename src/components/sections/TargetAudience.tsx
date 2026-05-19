import { Waves, Droplets, Activity, Heart } from "lucide-react";

export function TargetAudience() {
  const audiences = [
    {
      icon: Waves,
      title: "Surfistas",
      desc: "Mais força, mobilidade e resistência para dominar as ondas.",
    },
    {
      icon: Droplets,
      title: "Skatistas",
      desc: "Mais controle, potência e prevenção de lesões para evoluir sempre.",
    },
    {
      icon: Activity,
      title: "Atletas",
      desc: "Performance completa para qualquer modalidade esportiva.",
    },
    {
      icon: Heart,
      title: "Qualidade de vida",
      desc: "Treino inteligente para mais saúde, disposição e longevidade.",
    },
  ];

  return (
    <section className="bg-brand-primary py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-brand-accent font-bold tracking-widest text-xs sm:text-sm uppercase mb-4">Para quem é</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Mais que treino. É evolução.
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Nosso método é pensado para quem leva o esporte a sério e busca resultados concretos dentro e fora das ondas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-brand-support p-8 rounded-2xl border border-white/5 hover:border-brand-accent/50 transition-all duration-300 group hover:-translate-y-2 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 bg-brand-highlight/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-7 h-7 text-brand-neon" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
