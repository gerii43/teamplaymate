
import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
          <h2 className="text-4xl font-bold mb-4">Adaptado para todos los formatos</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Statsor se ajusta a las necesidades específicas de tu modalidad de fútbol
          </p>
        </motion.div>
        
        <div className="bg-gray-50 p-8 rounded-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-center h-16 w-16 bg-blue-500 rounded-full mb-4 mx-auto">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Fútbol 11</h3>
              <p className="text-center mb-6">Perfecta para equipos competitivos</p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Análisis táctico avanzado con patrones de juego y transiciones</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Seguimiento de distancias y zonas de acción por posición</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Gestión completa de plantillas y rotaciones</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Análisis de formaciones y estrategias personalizadas</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Estadísticas específicas para porteros y defensas</span>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-blue-700 rounded-lg text-center">
                <p>"Perfect for creating all kinds of categories, and you can use it with your team creation."</p>
              </div>
            </div>
            
            <div className="bg-gray-800 text-white p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 text-center">Características comunes</h3>
              <p className="text-center mb-8 text-gray-300">Incluidas en todas las versiones</p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Planificación de entrenamientos con ejercicios</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Control de asistencia y compromiso del equipo</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Estadísticas individuales y evolutivas por jugador</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Generación de informes y reportes automáticos</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Calendario de partidos y entrenamientos</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-600 text-white p-6 rounded-lg">
              <div className="flex items-center justify-center h-16 w-16 bg-green-500 rounded-full mb-4 mx-auto">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Futsal</h3>
              <p className="text-center mb-6">Optimizado para acción rápida</p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Seguimiento de sistemas 4-0, 3-1 y rotaciones dinámicas</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Control de tiempos de juego y descanso por jugador</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Análisis específico de jugadas a balón parado</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Métricas de intensidad y rendimiento en pista</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Estadísticas de portero-jugador y superioridad</span>
                </li>
              </ul>
              
              <div className="mt-8 p-4 bg-green-700 rounded-lg text-center">
                <p>"Optimizado para registrar la acción rápida y los cambios constantes característicos del futsal."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
