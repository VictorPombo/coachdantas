import { ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";

export function Blog() {
  const posts = [
    {
      id: 1,
      title: "Como a hipertrofia previne lesões na terceira idade",
      excerpt: "Descubra como o treinamento de força com técnica adequada pode fortalecer articulações e garantir longevidade no esporte.",
      category: "Treinamento",
      date: "14 Mai 2026",
      author: "Coach Dantas",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Nutrição pré e pós-treino: O que realmente importa?",
      excerpt: "Mitos e verdades sobre a janela anabólica e como otimizar seus macronutrientes para máximo rendimento.",
      category: "Nutrição",
      date: "10 Mai 2026",
      author: "Nutri Parceiro",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "A importância do descanso para resultados reais",
      excerpt: "Se você treina pesado todos os dias e não vê resultados, o problema pode estar no seu sono e na recuperação muscular.",
      category: "Recuperação",
      date: "05 Mai 2026",
      author: "Coach Dantas",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <section id="blog" className="py-24 bg-brand-primary">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-brand-accent font-bold tracking-widest text-sm uppercase mb-2">Conhecimento e Dicas</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">Blog & Artigos</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conteúdos exclusivos sobre treinamento, nutrição e biomecânica para te ajudar a extrair o máximo de performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-brand-support/50 border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10 bg-brand-primary/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-neon border border-brand-neon/20">
                  {post.category}
                </div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-brand-neon transition-colors">
                  <Link href={`#`}>
                    {post.title}
                  </Link>
                </h4>
                
                <p className="text-sm text-gray-400 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link href={`#`} className="inline-flex items-center gap-2 text-brand-accent font-bold text-sm hover:underline">
                  Ler Artigo Completo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white/5 transition-colors">
            Ver Todos os Artigos
          </Link>
        </div>
      </div>
    </section>
  );
}
