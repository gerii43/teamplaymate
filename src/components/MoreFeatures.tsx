
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const MoreFeatures = () => {
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
            Descubre cómo Statsor se adapta perfectamente a tus necesidades, ya sea en fútbol 11 o futsal
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-blue-600 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">Fútbol 11</h3>
            <p className="text-center mb-6">Perfecta para equipos competitivos</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Análisis táctico avanzado con patrones de juego y transiciones</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Seguimiento de distancias y zonas de acción por posición</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Gestión completa de plantillas y rotaciones</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Análisis de formaciones y estrategias personalizadas</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Estadísticas específicas para porteros y defensas</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">Características comunes</h3>
            <p className="text-center mb-6 text-gray-300">Incluidas en todas las versiones</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Planificación de entrenamientos con ejercicios</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Control de asistencia y compromiso del equipo</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Estadísticas individuales y evolutivas por jugador</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Generación de informes y reportes automáticos</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Calendario de partidos y entrenamientos</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-600 text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center">Futsal</h3>
            <p className="text-center mb-6">Optimizado para acción rápida</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Seguimiento de sistemas 4-0, 3-1 y rotaciones dinámicas</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Control de tiempos de juego y descanso por jugador</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Análisis específico de jugadas a balón parado</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Métricas de intensidad y rendimiento en pista</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Estadísticas de portero-jugador y superioridad</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
