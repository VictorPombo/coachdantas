import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function CTAStrip() {
  return (
    <section className="bg-brand-primary py-16 md:py-24 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="text-center md:text-left">
            <p className="text-brand-accent font-bold tracking-widest text-xs sm:text-sm uppercase mb-3">
              Pronto para evoluir?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight max-w-lg leading-tight">
              Vamos juntos alcançar seu próximo nível.
            </h2>
          </div>

          <Link
            href="https://wa.me/5511967630066?text=Oi%20Coach%20Dantas!%20Estou%20pronto%20para%20evoluir.%20Quero%20agendar%20minha%20avalia%C3%A7%C3%A3o."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-primary rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shrink-0"
          >
            SOLICITAR AVALIAÇÃO
            <MessageCircle className="w-5 h-5" />
          </Link>
          
        </div>
      </div>
    </section>
  );
}
