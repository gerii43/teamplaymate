
import { Hero } from "@/components/Hero";
import { KeyBenefits } from "@/components/KeyBenefits";
import { Features } from "@/components/Features";
import { ModalitySection } from "@/components/ModalitySection";
import { NewPricingSection } from "@/components/NewPricingSection";
import { Stats } from "@/components/Stats";
import { CTASection } from "@/components/CTASection";
import { Testimonials } from "@/components/Testimonials";
import { PersonalizedDemoForm } from "@/components/PersonalizedDemoForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <KeyBenefits />
      <Stats />
      <Features />
      <ModalitySection />
      <NewPricingSection />
      <CTASection />
      <Testimonials />
      <PersonalizedDemoForm />
      <Footer />
    </main>
  );
};

export default Index;
