import { Hero } from "@/components/sections/Hero";
import { LogoBanner } from "@/components/sections/LogoBanner";
import { TargetAudience } from "@/components/sections/TargetAudience";
import { Pricing } from "@/components/sections/Pricing";
import { About } from "@/components/sections/About";
import { Location } from "@/components/sections/Location";
import { Blog } from "@/components/sections/Blog";
import { Contact } from "@/components/sections/Contact";
import { CTAStrip } from "@/components/sections/CTAStrip";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/ui/Header";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TargetAudience />
      <Pricing />
      <About />
      <Location />
      <Blog />
      <Contact />
      <CTAStrip />
      <Footer />
    </main>
  );
}
