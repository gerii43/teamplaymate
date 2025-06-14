
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">¿Listo para revolucionar tu equipo?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a miles de entrenadores que ya confían en Statsor
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Comenzar ahora
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
