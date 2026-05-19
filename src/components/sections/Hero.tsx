import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-brand-primary overflow-hidden pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="flex flex-col items-start text-left max-w-2xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              <span className="text-xs sm:text-sm font-medium tracking-wide text-gray-300">
                15 anos de experiência | Comitê Olímpico Brasileiro | 2 Campeões Mundiais
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1] animate-fade-in-up [animation-delay:200ms]">
              Treinamento <span className="text-brand-accent">inteligente</span> para melhorar seu corpo, sua performance e seu esporte.
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-xl animate-fade-in-up [animation-delay:400ms]">
              Funcional personalizado para surfistas, skatistas, atletas e quem busca qualidade de vida real.
            </p>

            <div className="animate-fade-in-up [animation-delay:600ms] w-full sm:w-auto">
              <Link
                href="https://wa.me/5511967630066?text=Oi%20Coach%20Dantas!%20Quero%20agendar%20uma%20avalia%C3%A7%C3%A3o%20gratuita."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-primary rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:-translate-y-1"
              >
                SOLICITAR AVALIAÇÃO
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="w-full flex items-center justify-center lg:justify-end animate-fade-in-up [animation-delay:800ms]">
             <img
               src="/premium_banner.png"
               alt="Coach Dantas Surfboard"
               className="w-full max-w-lg object-contain relative z-10 opacity-90 drop-shadow-2xl"
             />
          </div>

        </div>
      </div>
    </section>
  );
}
