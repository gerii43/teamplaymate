
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para revolucionar tu equipo?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a los entrenadores que ya están usando Statsor para optimizar el rendimiento de sus equipos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors">
              Solicita tu demo gratuita
            </Button>
            <Button variant="outline" className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Ver precios
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
