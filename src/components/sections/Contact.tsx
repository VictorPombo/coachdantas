import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function Contact() {
  return (
    <section className="py-24 bg-brand-primary" id="contato">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-brand-support rounded-3xl p-12 border border-white/5 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-neon/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pare de treinar sem objetivo.
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Agende sua avaliação gratuita e descubra como o treino funcional inteligente pode transformar seu corpo e sua performance.
            </p>

            <Link
              href="https://wa.me/551275006875?text=Oi%20Coach%20Dantas!%20Quero%20agendar%20uma%20avalia%C3%A7%C3%A3o%20gratuita."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex py-4 px-10 bg-brand-accent hover:bg-brand-accent-hover text-brand-primary rounded-xl font-bold text-lg transition-all duration-300 items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              SOLICITAR AVALIAÇÃO GRATUITA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
