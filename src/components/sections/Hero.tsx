import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video/Image Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/80 via-brand-primary/60 to-brand-primary z-10" />
        <img
          src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
          alt="Treino Funcional"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center mt-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
          <span className="text-sm font-medium tracking-wide text-brand-secondary">
            15 anos de experiência | Comitê Olímpico Brasileiro | 2 Campeões Mundiais
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up [animation-delay:200ms]">
          Treinamento <span className="text-brand-accent">inteligente</span> para melhorar seu corpo, sua performance e seu esporte.
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto animate-fade-in-up [animation-delay:400ms]">
          Funcional personalizado para surfistas, skatistas, atletas e quem busca qualidade de vida real.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:600ms]">
          <Link
            href="https://wa.me/551275006875?text=Oi%20Coach%20Dantas!%20Quero%20agendar%20uma%20avalia%C3%A7%C3%A3o%20gratuita."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-primary rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            SOLICITAR AVALIAÇÃO GRATUITA
            <MessageCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
