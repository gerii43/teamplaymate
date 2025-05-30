
import { Hero } from "@/components/Hero";
import { KeyBenefits } from "@/components/KeyBenefits";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { FormatTypes } from "@/components/FormatTypes";
import { MoreFeatures } from "@/components/MoreFeatures";
import { CTASection } from "@/components/CTASection";
import { Testimonials } from "@/components/Testimonials";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <KeyBenefits />
      <Features />
      <FormatTypes />
      <Stats />
      <CTASection />
      <MoreFeatures />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
};

export default Index;
