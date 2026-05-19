import { ArrowRight, Calendar, User } from "lucide-react";
import Image from "next/image";

const articles = [
  {
    id: 1,
    title: "Benefícios do Treinamento Funcional para Atletas em Santos",
    excerpt: "Descubra como a preparação física especializada e o treinamento funcional inteligente podem elevar seu desempenho nos esportes, prevenindo lesões e aumentando sua resistência.",
    category: "Preparação Física",
    date: "18 Nov, 2026",
    author: "Coach Dantas",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 2,
    title: "Surf Training: Como Melhorar sua Remada e Explosão no Mar",
    excerpt: "Aprenda exercícios específicos de Surf Training focados em mobilidade, força de core e explosão, fundamentais para surfistas de Santos e região que buscam a alta performance.",
    category: "Surf",
    date: "15 Nov, 2026",
    author: "Coach Dantas",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 3,
    title: "A Importância da Avaliação Física na Evolução do Treino",
    excerpt: "Entenda por que a avaliação física contínua é o diferencial do nosso estúdio de treinamento personalizado. Métricas exatas geram resultados reais e seguros.",
    category: "Metodologia",
    date: "10 Nov, 2026",
    author: "Equipe Dantas",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    link: "#"
  },
  {
    id: 4,
    title: "Recuperação Muscular: O Segredo dos Atletas de Alta Performance",
    excerpt: "Não basta apenas treinar pesado. Conheça as técnicas de recovery e descanso ativo que aplicamos com nossos alunos de preparação física para maximizar os ganhos.",
    category: "Saúde & Recovery",
    date: "05 Nov, 2026",
    author: "Equipe Dantas",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
    link: "#"
  }
];

export function Blog() {
  return (
    <section id="blog" className="py-24 bg-brand-primary relative overflow-hidden border-t border-white/5">
      {/* Elementos de fundo */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-brand-accent font-bold tracking-wider uppercase text-sm mb-4 block">
            Conteúdo & Conhecimento
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Blog do <span className="text-brand-accent">Coach</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Dicas de treinamento funcional, preparação física para atletas e estilo de vida saudável. 
            Acompanhe nossos artigos para maximizar seus resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <article 
              key={article.id} 
              className="bg-brand-support border border-white/5 rounded-2xl overflow-hidden hover:border-brand-accent/30 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-brand-accent text-brand-primary px-3 py-1 rounded-full text-xs font-bold z-10">
                  {article.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors line-clamp-2">
                  <a href={article.link}>{article.title}</a>
                </h3>
                
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                
                <a 
                  href={article.link}
                  className="inline-flex items-center gap-2 text-brand-accent font-bold text-sm hover:gap-3 transition-all mt-auto"
                >
                  Ler artigo completo <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#" className="inline-block border border-white/10 hover:border-brand-accent hover:bg-brand-accent/10 text-white hover:text-brand-accent font-bold py-3 px-8 rounded-full transition-all duration-300">
            Ver todas as publicações
          </a>
        </div>
      </div>
    </section>
  );
}
