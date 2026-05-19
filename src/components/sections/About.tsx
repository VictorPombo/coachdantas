import { Award, Trophy, Clock } from "lucide-react";

export function About() {
  return (
    <section className="py-24 bg-brand-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-transparent z-10"></div>
            <div className="w-full h-full bg-[#0a0a0a] border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-brand-accent/50 transition-colors duration-700">
              <span className="text-white/30 font-bold tracking-widest uppercase">Adicionar Foto</span>
            </div>
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <div className="bg-brand-support/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-1">Leandro Dantas</h3>
                <p className="text-brand-neon font-medium">Head Coach</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Sobre o <span className="text-brand-accent">Coach Dantas</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Acredito que o corpo humano foi feito para o movimento, não para as máquinas. Minha metodologia é baseada em inteligência física, prevenindo lesões enquanto extraímos a máxima performance que você é capaz de alcançar.
            </p>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-support flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-brand-neon" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">15 Anos de Experiência</h4>
                  <p className="text-gray-400">Atuando na elite do esporte e no desenvolvimento de treinos para resultados reais.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-support flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-brand-neon" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Comitê Olímpico Brasileiro</h4>
                  <p className="text-gray-400">Três anos contribuindo ativamente na preparação do COB.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-support flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-brand-neon" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Formador de Campeões</h4>
                  <p className="text-gray-400">2 campeões mundiais formados e treinador de diversos atletas da Seleção Brasileira.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
