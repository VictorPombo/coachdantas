import { MessageCircle, Mail, Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] py-8 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="font-bold text-xl tracking-tighter text-white shrink-0">
            COACH<span className="text-brand-accent">DANTAS</span>
          </div>

          <div className="flex items-center gap-6 text-gray-400">
            <a href="https://instagram.com/coachdantas" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
              <Camera className="w-5 h-5" />
            </a>
            <a href="https://wa.me/5511967630066" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="mailto:contato@coachdantas.com.br" className="hover:text-brand-accent transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <div className="text-xs text-gray-500 text-center md:text-right shrink-0">
            © {new Date().getFullYear()} Coach Dantas. Todos os direitos reservados.
          </div>

        </div>
      </div>
    </footer>
  );
}
