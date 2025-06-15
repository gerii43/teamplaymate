import { motion } from "framer-motion";
import { Check } from "lucide-react";
export const ModalitySection = () => {
  return <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Adaptado a tu modalidad</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Statsor se adapta perfectamente tanto a fútbol 11 como a futsal, con funcionalidades específicas para cada modalidad.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }} viewport={{
          once: true
        }} className="text-white p-8 rounded-xl bg-green-500">
            <h3 className="text-3xl font-bold mb-6 text-center">Fútbol 11</h3>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-6 h-6 text-blue-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Gestión de plantillas amplias (hasta 25 jugadores)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-6 h-6 text-blue-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Análisis táctico para formaciones 11vs11</span>
              </li>
              <li className="flex items-start">
                <Check className="w-6 h-6 text-blue-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Seguimiento de posiciones específicas</span>
              </li>
              <li className="flex items-start">
                <Check className="w-6 h-6 text-blue-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Estadísticas de partidos completos (90 min)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-6 h-6 text-blue-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Planificación de temporada completa</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="bg-red-500 text-white p-8 rounded-xl">
            <h3 className="text-3xl font-bold mb-6 text-center">Futsal</h3>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-6 h-6 text-red-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Control de rotaciones intensivas</span>
              </li>
              <li className="flex items-start">
                <Check className="w-6 h-6 text-red-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Análisis de juego en espacio reducido</span>
              </li>
              <li className="flex items-start">
                <Check className="w-6 h-6 text-red-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Métricas de intensidad y ritmo</span>
              </li>
              <li className="flex items-start">
                <Check className="w-6 h-6 text-red-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Estadísticas de partidos (40 min)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-6 h-6 text-red-200 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-lg">Gestión de dobles competiciones</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>;
};