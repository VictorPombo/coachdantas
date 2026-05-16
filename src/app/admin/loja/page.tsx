"use client";

import { useState } from "react";
import { Plus, Package, DollarSign, TrendingUp, MoreVertical } from "lucide-react";

export default function AdminLojaPage() {
  const mockProdutos = [
    { id: 1, nome: "Workshop Execução", preco: "R$ 47,90", vendas: 24, status: "Ativo" },
    { id: 2, nome: "E-book Nutrição", preco: "R$ 29,90", vendas: 58, status: "Ativo" },
    { id: 3, nome: "Mentoria 1h", preco: "R$ 150,00", vendas: 12, status: "Pausado" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Loja & Produtos</h1>
          <p className="text-gray-400 mt-1">Gerencie seus infoprodutos e serviços adicionais</p>
        </div>
        <button className="bg-brand-accent hover:bg-brand-accent/90 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-support/50 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Receita da Loja</p>
              <h3 className="text-2xl font-bold text-white mt-1">R$ 4.683,80</h3>
            </div>
            <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-green-400 text-sm mt-4 flex items-center gap-1 font-medium">
            <TrendingUp className="w-4 h-4" /> +12% este mês
          </p>
        </div>
        
        <div className="bg-brand-support/50 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Produtos Ativos</p>
              <h3 className="text-2xl font-bold text-white mt-1">2</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-support/30 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 text-sm">
                <th className="p-4 font-medium">Produto</th>
                <th className="p-4 font-medium">Preço</th>
                <th className="p-4 font-medium">Vendas</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockProdutos.map((produto) => (
                <tr key={produto.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 text-white font-medium">{produto.nome}</td>
                  <td className="p-4 text-gray-300">{produto.preco}</td>
                  <td className="p-4 text-gray-300">{produto.vendas}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${produto.status === 'Ativo' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {produto.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-gray-500 hover:text-white p-1 rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
