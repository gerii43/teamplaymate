import { Hero } from "@/components/Hero";
import { KeyBenefits } from "@/components/KeyBenefits";
import { Features } from "@/components/Features";
import { FunctionalitiesCarousel } from "@/components/FunctionalitiesCarousel";
import { FormatTypes } from "@/components/FormatTypes";
import { ModalitySection } from "@/components/ModalitySection";
import { NewPricingSection } from "@/components/NewPricingSection";
import { CTASection } from "@/components/CTASection";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { PersonalizedDemoForm } from "@/components/PersonalizedDemoForm";
import { Footer } from "@/components/Footer";
import { AuthChatbot } from "@/components/AuthChatbot";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <KeyBenefits />
      <FormatTypes />
      <Features />
      <FunctionalitiesCarousel />
      <ModalitySection />
      <NewPricingSection />
      <CTASection />
      <TestimonialsCarousel />
      <PersonalizedDemoForm />
      <Footer />
      <AuthChatbot />
    </main>
  );
};

export default Index;