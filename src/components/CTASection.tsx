
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            ¿Listo para revolucionar tu análisis de fútbol?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a miles de entrenadores y analistas que ya están usando nuestra plataforma
          </p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
            Comenzar ahora
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
