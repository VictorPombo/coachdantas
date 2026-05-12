import Link from "next/link";
import { UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="absolute top-0 w-full z-50 py-4 px-4 sm:px-6 lg:px-8 border-b border-white/5 bg-brand-primary/50 backdrop-blur-md">
      <div className="container mx-auto max-w-5xl flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tighter">
          COACH<span className="text-brand-accent">DANTAS</span>
        </Link>
        <Link 
          href="/login"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-sm font-medium border border-white/10"
        >
          <UserCircle className="w-4 h-4" />
          Área do Aluno
        </Link>
      </div>
    </header>
  );
}
