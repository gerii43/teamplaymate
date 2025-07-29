import React from 'react';
import { Hero } from "@/components/Hero";
import { KeyBenefits } from "@/components/KeyBenefits";
import { Features } from "@/components/Features";
import { FunctionalitiesCarousel } from "@/components/FunctionalitiesCarousel";
import { FormatTypes } from "@/components/FormatTypes";
import { ModalitySection } from "@/components/ModalitySection";
import NewPricingSection from "@/components/NewPricingSection";
import { CTASection } from "@/components/CTASection";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { PersonalizedDemoForm } from "@/components/PersonalizedDemoForm";
import { Footer } from "@/components/Footer";
import { FootballChatbot } from "@/components/FootballChatbot";

const Index = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  // Listen for language changes to force re-render
  React.useEffect(() => {
    const handleLanguageChange = () => forceUpdate();
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

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
      <FootballChatbot />
    </main>
  );
};

export default Index;