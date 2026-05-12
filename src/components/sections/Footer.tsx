import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-primary border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold font-outfit mb-4">Coach Dantas</h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              Treinamento Funcional Inteligente focado em saúde, longevidade e performance para a vida real e para o esporte.
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/551275006875"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-accent hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#planos" className="text-gray-400 hover:text-brand-neon transition-colors">Planos e Preços</Link>
              </li>
              <li>
                <Link href="#contato" className="text-gray-400 hover:text-brand-neon transition-colors">Agendar Avaliação</Link>
              </li>
              <li>
                <a href="https://surfsupclub.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-neon transition-colors flex items-center gap-2">
                  Parceiro Oficial: Surf&apos;s Up Club
                  <span className="text-[10px] bg-brand-accent text-white px-2 py-0.5 rounded-full font-bold">10% OFF</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Av. Paes de Barros, 1760 — Mooca</li>
              <li>São Paulo - SP</li>
              <li>WhatsApp: (12) 75006-8752</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Coach Dantas — Todos os direitos reservados</p>
          <p>
            Desenvolvido com foco em <span className="text-brand-neon">Performance</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
