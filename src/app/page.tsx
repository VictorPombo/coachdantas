import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Modalities } from "@/components/sections/Modalities";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Athletes } from "@/components/sections/Athletes";
import { Pricing } from "@/components/sections/Pricing";
import { About } from "@/components/sections/About";
import { Blog } from "@/components/sections/Blog";
import { Location } from "@/components/sections/Location";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

import { Header } from "@/components/ui/Header";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Stats />
      <Modalities />
      <HowItWorks />
      <Athletes />
      <Pricing />
      <About />
      <Blog />
      <Location />
      <Contact />
      <Footer />
    </main>
  );
}
