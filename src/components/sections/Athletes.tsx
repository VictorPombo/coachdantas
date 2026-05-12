import { Medal } from "lucide-react";

export function Athletes() {
  const athletes = [
    {
      name: "Rony Gomes",
      sport: "Skate",
      achievement: "Campeão Mundial Vertical e Mega Ramp",
    },
    {
      name: "Marina Lima",
      sport: "Skate",
      achievement: "Seleção Brasileira",
    },
    {
      name: "Fernanda Galdino",
      sport: "Skate",
      achievement: "Seleção Brasileira",
    },
    {
      name: "Diego Takahashi",
      sport: "Skate",
      achievement: "Seleção Brasileira",
    },
  ];

  return (
    <section className="py-24 bg-brand-support relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Nossos <span className="text-brand-accent">Atletas</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Resultados reais de quem vive da performance e escolheu o Coach Dantas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {athletes.map((athlete, index) => (
            <div key={index} className="bg-brand-primary p-6 rounded-2xl border border-white/5 hover:border-brand-neon/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-highlight flex items-center justify-center">
                  <Medal className="w-5 h-5 text-brand-neon" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{athlete.name}</h3>
                  <p className="text-brand-accent text-sm font-medium">{athlete.sport}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{athlete.achievement}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
