
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Stats } from "@/components/Stats";
import { Footer } from "@/components/Footer";
import { FormatTypes } from "@/components/FormatTypes";
import { MoreFeatures } from "@/components/MoreFeatures";
import { Testimonials } from "@/components/Testimonials";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <FormatTypes />
      <Stats />
      <MoreFeatures />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
};

export default Index;
