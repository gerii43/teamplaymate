
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-green-600">
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para revolucionar tu equipo?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a miles de entrenadores que ya están usando Statsor para mejorar el rendimiento de sus equipos
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
            Comenzar prueba gratuita
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
