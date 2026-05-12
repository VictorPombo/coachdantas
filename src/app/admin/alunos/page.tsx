import { Search, UserPlus, MoreVertical, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function AdminAlunos() {
  const alunos = [
    { id: 1, nome: "Victor Assis", modalidade: "Funcional Inteligente", status: "Em dia", ultima: "Hoje", nivel: "Iniciante" },
    { id: 2, nome: "Rony Gomes", modalidade: "Preparação de Atletas", status: "Em dia", ultima: "Ontem", nivel: "Avançado" },
    { id: 3, nome: "Marina Lima", modalidade: "Surf Training", status: "Pendente", ultima: "Há 2 dias", nivel: "Intermediário" },
    { id: 4, nome: "Diego Takahashi", modalidade: "Preparação de Atletas", status: "Atrasado", ultima: "Há 16 dias", nivel: "Avançado" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alunos</h1>
          <p className="text-gray-400">Gerencie todos os seus alunos ativos e inativos.</p>
        </div>
        <button className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
          <UserPlus className="w-5 h-5" />
          Novo Aluno
        </button>
      </div>

      {/* Buscas e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar aluno por nome..." 
            className="w-full bg-brand-support border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-accent"
          />
        </div>
        <select className="bg-brand-support border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-accent">
          <option>Todas as Modalidades</option>
          <option>Funcional</option>
          <option>Surf Training</option>
          <option>Natação</option>
        </select>
      </div>

      {/* Tabela/Lista */}
      <div className="bg-brand-support border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium">Modalidade</th>
                <th className="p-4 font-medium">Nível</th>
                <th className="p-4 font-medium">Última Aula</th>
                <th className="p-4 font-medium">Pagamento</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {alunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-brand-neon flex items-center justify-center text-brand-primary">
                      {aluno.nome.charAt(0)}
                    </div>
                    {aluno.nome}
                  </td>
                  <td className="p-4 text-gray-300">{aluno.modalidade}</td>
                  <td className="p-4 text-gray-300">
                    <span className="bg-white/5 px-2 py-1 rounded text-xs">{aluno.nivel}</span>
                  </td>
                  <td className="p-4 text-gray-300">{aluno.ultima}</td>
                  <td className="p-4">
                    {aluno.status === "Em dia" && <span className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4"/> Em dia</span>}
                    {aluno.status === "Pendente" && <span className="flex items-center gap-1 text-yellow-400"><CheckCircle2 className="w-4 h-4"/> Pendente</span>}
                    {aluno.status === "Atrasado" && <span className="flex items-center gap-1 text-red-400"><XCircle className="w-4 h-4"/> Atrasado</span>}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/alunos/${aluno.id}`} className="text-gray-400 hover:text-white p-2">
                      <MoreVertical className="w-5 h-5 inline" />
                    </Link>
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
