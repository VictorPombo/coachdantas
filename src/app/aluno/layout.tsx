"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LineChart, Trophy, User, LogOut, QrCode, Dumbbell, ShoppingBag } from "lucide-react";

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Início", href: "/aluno", icon: Home },
    { name: "Treinos", href: "/aluno/treinos", icon: Dumbbell },
    { name: "QR Code", href: "/aluno/qr-code", icon: QrCode },
    { name: "Conquistas", href: "/aluno/conquistas", icon: Trophy },
    { name: "Loja", href: "/aluno/loja", icon: ShoppingBag },
    { name: "Perfil", href: "/aluno/perfil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-brand-primary flex flex-col md:flex-row font-sans">
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-support border-t border-white/5 px-2 pb-safe z-50 flex justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-3 flex-1 relative ${
                isActive ? "text-brand-neon" : "text-gray-400 hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-neon rounded-b-full shadow-[0_0_10px_rgba(253,224,71,0.5)]"></div>
              )}
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar (Optional, but good to have) */}
      <aside className="hidden md:flex w-64 bg-brand-support border-r border-white/5 flex-col h-screen sticky top-0">
        <div className="p-6">
          <Link href="/" className="font-bold text-2xl tracking-tighter block">
            COACH<span className="text-brand-accent">DANTAS</span>
            <span className="block text-xs font-medium text-brand-neon tracking-widest mt-1 uppercase">Portal do Aluno</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive ? "bg-brand-neon/10 text-brand-neon border border-brand-neon/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium">
            <LogOut className="w-5 h-5" />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-0 min-h-screen relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-0 w-full h-96 bg-brand-neon/5 blur-[150px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
