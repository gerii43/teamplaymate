
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para revolucionar tu equipo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a más de 1000 equipos que ya confían en Statsor
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            Comenzar prueba gratuita
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
