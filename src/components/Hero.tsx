
import { motion } from "framer-motion";
import { DashboardPreview } from "./DashboardPreview";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pb-24 pt-10 bg-white">
      <nav className="p-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-secondary">Statsor</div>
          <div className="hidden md:flex gap-8">
            <a href="/" className="hover:text-primary transition-colors text-secondary">Inicio</a>
            <a href="/pricing" className="hover:text-primary transition-colors text-secondary">Precios</a>
            <a href="#demo" className="hover:text-primary transition-colors text-secondary">Demo</a>
            <a href="#contacto" className="hover:text-primary transition-colors text-secondary">Contacto</a>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto text-secondary">
            Digitaliza y analiza el rendimiento de tu equipo de futsal en tiempo real
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-3xl mx-auto">
            Desde tu tablet, sin necesidad de Wi-Fi. Statsor revoluciona la gestión táctica y estadística para entrenadores que buscan optimizar cada jugada y entrenamientos de sus equipos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="bg-primary text-white px-8 py-6 rounded-lg font-medium text-lg shadow-lg hover:bg-primary/90 transition-colors">
              Solicita tu demo
            </Button>
            <Button variant="outline" className="px-8 py-6 rounded-lg font-medium text-lg border-2 hover:bg-gray-50 transition-colors">
              Ver en acción
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl mt-8"
          >
            <DashboardPreview />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
