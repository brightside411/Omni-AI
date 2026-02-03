import { useState } from "react";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { LegacySection } from "@/components/legacy-section";
import { EcosystemSection } from "@/components/ecosystem-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Landing() {
  const [selectedTier, setSelectedTier] = useState<string>("peasant");

  return (
    <div className="min-h-screen bg-[#050505] text-white noise-overlay">
      <CursorSpotlight />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection onTierSelect={setSelectedTier} />
        <LegacySection />
        <EcosystemSection />
        <ContactSection preselectedTier={selectedTier} />
      </main>
      <Footer />
    </div>
  );
}
