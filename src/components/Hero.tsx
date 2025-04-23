
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "./DashboardPreview";

export const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden pb-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Optimiza el rendimiento de tu equipo
          </h1>
          <p className="text-lg md:text-xl mb-12 text-gray-600 max-w-3xl mx-auto">
            Software profesional para entrenadores de fútbol 11 y futsal. 
            Gestiona entrenamientos, analiza rendimiento y toma decisiones basadas en datos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8"
            >
              Solicitar Demo
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              Ver características
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <DashboardPreview />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
