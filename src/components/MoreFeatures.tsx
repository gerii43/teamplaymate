
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <h2 className="text-4xl font-bold mb-4">Plan de precios</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre cómo Statsor se adapta perfectamente a tus necesidades, ya sea en fútbol 11 o futsal
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-blue-600 text-white p-6 rounded-xl shadow-lg border-4 border-blue-400"
          >
            <h3 className="text-2xl font-bold mb-4 text-center">Statsor Starter</h3>
            <p className="text-center mb-6">Prueba gratuita de 7 días</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Registro táctico de partidos (acciones + jugadores)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Edición y corrección de jugadas en tiempo real</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Visualización básica de estadísticas por partido</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Hasta 1 equipo / 2 partidos activos</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-blue-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Exportación PDF limitada</span>
              </li>
            </ul>

            <div className="text-center mt-6">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-100 font-semibold">
                Empieza gratis
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gray-900 text-white p-6 rounded-xl shadow-lg border-4 border-gray-700 transform scale-105"
          >
            <h3 className="text-2xl font-bold mb-4 text-center">Statsor Pro</h3>
            <p className="text-center mb-6 text-gray-300">€29,99/mes</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Todo lo del plan Starter</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Estadísticas individuales y evolución por jugador</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Informes automáticos por partido / temporada</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Calendario de partidos y entrenamientos</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Control de asistencia y minutos jugados</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Sin límite de equipos ni partidos</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Modo offline completo y sincronización</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Acceso desde web y tablet</span>
              </li>
            </ul>
            
            <div className="text-center mt-6">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
                Suscríbete ahora
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-green-600 text-white p-6 rounded-xl shadow-lg border-4 border-green-400"
          >
            <h3 className="text-2xl font-bold mb-4 text-center">Statsor Club</h3>
            <p className="text-center mb-6">Precio a medida</p>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Todo lo del plan Pro</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Multiusuario y roles (entrenador, analista, coordinador)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Soporte prioritario y asistencia técnica personalizada</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Formación inicial al staff (remoto o presencial)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Informes agregados por categoría o club</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Integración con otras plataformas (vídeo, GPS...)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Posibilidad de incluir tablet preconfigurada</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-300 mt-0.5 mr-2 flex-shrink-0" />
                <span>Facturación adaptada a clubes o escuelas</span>
              </li>
            </ul>

            <div className="text-center mt-6">
              <Button className="w-full bg-white text-green-600 hover:bg-green-100 font-semibold">
                Solicita propuesta
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
