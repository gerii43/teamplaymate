
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">
            ¿Listo para revolucionar tu equipo?
          </h2>
          <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">
            Únete a miles de entrenadores que ya están mejorando su rendimiento con Statsor
          </p>
          
          <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
            Comienza tu prueba gratuita
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
