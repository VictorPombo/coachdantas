import { CalendarDays, Clock, Plus, Users } from "lucide-react";

export default function AdminAgenda() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agenda de Aulas</h1>
          <p className="text-gray-400">Visualização de turmas e presenças.</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-white/10">
          <Plus className="w-5 h-5" />
          Nova Aula
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendário Miniatura (Mock) */}
        <div className="bg-brand-support p-6 rounded-2xl border border-white/5 h-fit">
          <h3 className="font-bold mb-4">Novembro 2026</h3>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400">
            <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {/* Empty spots */}
            <div></div><div></div><div></div><div></div>
            {/* Days */}
            {[...Array(30)].map((_, i) => (
              <div key={i} className={`p-2 rounded-lg ${i === 11 ? 'bg-brand-accent text-brand-primary font-bold' : 'hover:bg-white/10 cursor-pointer'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Aulas do Dia */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-brand-primary border border-brand-accent/20 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <CalendarDays className="w-6 h-6 text-brand-accent" />
              <div>
                <h3 className="font-bold text-lg">Quinta-feira, 12 de Nov</h3>
                <p className="text-sm text-gray-400">4 aulas programadas</p>
              </div>
            </div>
          </div>

          {[
            { hora: "06:00", fim: "07:00", local: "Tatame", alunos: ["Victor Assis", "João", "Maria"], limite: 6, modalidade: "Funcional Inteligente" },
            { hora: "07:00", fim: "08:00", local: "Tatame", alunos: ["Rony Gomes", "Marina Lima"], limite: 6, modalidade: "Surf Training" },
            { hora: "16:00", fim: "17:00", local: "Piscina", alunos: ["Pedro", "Ana"], limite: 4, modalidade: "Natação" },
          ].map((aula, idx) => (
            <div key={idx} className="bg-brand-support p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center justify-center min-w-[100px] border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
                <div className="text-2xl font-bold text-brand-neon">{aula.hora}</div>
                <div className="text-sm text-gray-400">{aula.fim}</div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{aula.modalidade}</h4>
                    <span className="text-sm text-gray-400">{aula.local}</span>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-accent" />
                    {aula.alunos.length}/{aula.limite}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {aula.alunos.map((aluno, aIdx) => (
                    <span key={aIdx} className="text-xs bg-brand-primary border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {aluno}
                    </span>
                  ))}
                  <button className="text-xs border border-dashed border-white/20 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg">
                    + Adicionar Avulso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
