"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, Wallet, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Alunos", href: "/admin/alunos", icon: Users },
    { name: "Agenda", href: "/admin/agenda", icon: CalendarDays },
    { name: "Financeiro", href: "/admin/financeiro", icon: Wallet },
    { name: "Config", href: "/admin/config", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-primary flex flex-col md:flex-row font-sans">
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-support border-t border-white/5 px-2 pb-safe z-50 flex justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-3 w-1/5 ${
                isActive ? "text-brand-accent" : "text-gray-400 hover:text-white"
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-brand-support border-r border-white/5 flex-col h-screen sticky top-0">
        <div className="p-6">
          <Link href="/" className="font-bold text-2xl tracking-tighter block">
            COACH<span className="text-brand-accent">DANTAS</span>
            <span className="block text-xs font-medium text-gray-400 tracking-widest mt-1 uppercase">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive ? "bg-brand-accent/10 text-brand-accent border border-brand-accent/20" : "text-gray-400 hover:text-white hover:bg-white/5"
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
      <main className="flex-1 pb-24 md:pb-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
