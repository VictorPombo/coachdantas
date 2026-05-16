"use client";

import { ShoppingCart, Star, ExternalLink } from "lucide-react";

export default function LojaAlunoPage() {
  const produtos = [
    {
      id: 1,
      nome: "Workshop: Execução Perfeita",
      tipo: "Evento Online",
      preco: "R$ 47,90",
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      nome: "E-book: Nutrição para Hipertrofia",
      tipo: "Digital",
      preco: "R$ 29,90",
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      nome: "Mentoria Individual (1h)",
      tipo: "Serviço",
      preco: "R$ 150,00",
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop",
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Loja</h1>
        <p className="text-brand-neon mt-1">Produtos e serviços exclusivos</p>
      </header>

      <div className="space-y-6">
        {produtos.map((produto) => (
          <div key={produto.id} className="bg-brand-support/80 border border-white/5 rounded-3xl overflow-hidden relative group">
            {produto.destaque && (
              <div className="absolute top-4 right-4 bg-brand-neon text-brand-primary text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1 shadow-lg">
                <Star className="w-3 h-3 fill-brand-primary" />
                Recomendado
              </div>
            )}
            
            <div className="h-48 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-support to-transparent z-10" />
              <img 
                src={produto.imagem} 
                alt={produto.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 relative z-20 -mt-12">
              <span className="text-xs font-bold text-gray-400 bg-white/10 px-2 py-1 rounded backdrop-blur-md">
                {produto.tipo}
              </span>
              <h3 className="text-xl font-bold text-white mt-3 leading-tight">{produto.nome}</h3>
              
              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-bold text-brand-neon">{produto.preco}</span>
                <button className="bg-white text-brand-primary hover:bg-gray-200 px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
