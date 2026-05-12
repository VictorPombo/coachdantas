import { MessageCircle, FileText, Dumbbell, TrendingUp } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Agendamento",
      description: "Entre em contato pelo WhatsApp ou formulário.",
      icon: MessageCircle,
    },
    {
      title: "Avaliação",
      description: "Avaliação física e definição de objetivos.",
      icon: FileText,
    },
    {
      title: "Treino Personalizado",
      description: "Programa montado para sua realidade.",
      icon: Dumbbell,
    },
    {
      title: "Evolução Contínua",
      description: "Acompanhamento e ajustes constantes.",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-24 bg-brand-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Como <span className="text-brand-accent">Funciona</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Uma jornada desenhada para levar você ao seu melhor desempenho de forma segura e progressiva.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent/30 to-brand-primary -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-brand-support border border-brand-accent/20 flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full bg-brand-accent/10 animate-ping [animation-duration:3s]"></div>
                  <step.icon className="w-8 h-8 text-brand-neon" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold border-4 border-brand-primary">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
