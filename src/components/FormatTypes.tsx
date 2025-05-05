
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FormatTypes = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Comparativa</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Encuentra el plan perfecto para tu equipo, independientemente del formato de juego
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-blue-600 text-white p-8 rounded-xl shadow-lg border-4 border-blue-400"
          >
            <div className="flex items-center justify-center h-16 w-16 bg-blue-500 rounded-full mb-4 mx-auto border-2 border-blue-300">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-center">Fútbol 11</h3>
            <p className="text-center mb-2">Perfecta para equipos competitivos</p>
            <div className="text-center mb-6">
              <span className="text-3xl font-bold">€25</span>
              <span className="text-lg">/mes</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Análisis táctico avanzado con patrones de juego</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Seguimiento de distancias y zonas de acción</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Gestión completa de plantillas y rotaciones</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Análisis de formaciones personalizadas</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Estadísticas específicas para porteros</span>
              </li>
            </ul>
            
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-100 font-semibold">
              Empezar ahora
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-green-600 text-white p-8 rounded-xl shadow-lg border-4 border-green-400"
          >
            <div className="flex items-center justify-center h-16 w-16 bg-green-500 rounded-full mb-4 mx-auto border-2 border-green-300">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-center">Futsal</h3>
            <p className="text-center mb-2">Optimizado para acción rápida</p>
            <div className="text-center mb-6">
              <span className="text-3xl font-bold">€20</span>
              <span className="text-lg">/mes</span>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Seguimiento de sistemas 4-0, 3-1 y rotaciones</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Control de tiempos de juego y descanso</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Análisis de jugadas a balón parado</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Métricas de intensidad y rendimiento</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                <span>Estadísticas de portero-jugador y superioridad</span>
              </li>
            </ul>
            
            <Button className="w-full bg-white text-green-600 hover:bg-green-100 font-semibold">
              Empezar ahora
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
