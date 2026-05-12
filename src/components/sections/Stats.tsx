export function Stats() {
  const stats = [
    { value: "15+", label: "Anos de Experiência" },
    { value: "2", label: "Campeões Mundiais" },
    { value: "3", label: "Anos no COB" },
    { value: "6", label: "Atletas Seleção BR" },
  ];

  return (
    <section className="bg-brand-support border-y border-white/5 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center px-4">
              <div className="text-4xl md:text-5xl font-bold text-brand-neon mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm md:text-base font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
