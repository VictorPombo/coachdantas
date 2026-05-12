import { MapPin, Clock, Calendar } from "lucide-react";

export function Location() {
  return (
    <section className="py-24 bg-brand-support border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Onde <span className="text-brand-accent">Treinamos</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Localização privilegiada na Mooca com estrutura completa para o seu desenvolvimento.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-lg bg-brand-primary border border-white/5">
                  <MapPin className="w-6 h-6 text-brand-neon" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Endereço</h4>
                  <p className="text-gray-400">Av. Paes de Barros, 1760</p>
                  <p className="text-gray-400">Mooca, São Paulo - SP</p>
                  <p className="text-gray-400">CEP 03114-001</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-lg bg-brand-primary border border-white/5">
                  <Clock className="w-6 h-6 text-brand-neon" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Horário de Atendimento</h4>
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Segunda a Sexta</span>
                  </div>
                  <p className="text-gray-400 font-medium">06:00 às 13:00</p>
                  <p className="text-gray-400 font-medium">16:00 às 22:30</p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Av.+Paes+de+Barros,+1760+-+Mooca,+São+Paulo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all border border-white/10 backdrop-blur-sm"
            >
              COMO CHEGAR
              <MapPin className="w-5 h-5" />
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden aspect-square lg:aspect-video border border-white/10 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.170669229863!2d-46.59371078491211!3d-23.57018998467885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5eaf888eb1c9%3A0x6b8bc2132eb22eb1!2sAv.%20Paes%20de%20Barros%2C%201760%20-%20Mooca%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003114-001!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
