
import { motion } from "framer-motion";
import { Ticket, BarChart3, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const additionalFeatures = [{
  icon: <Ticket className="w-10 h-10 text-blue-500" />,
  title: "Gestión de lesiones",
  description: "Realiza un seguimiento detallado de lesiones, tiempos de recuperación y recomendaciones médicas para cada jugador.",
  checkItems: ["Historial médico completo", "Alertas de sobrecargas", "Planes de recuperación"]
}, {
  icon: <BarChart3 className="w-10 h-10 text-green-500" />,
  title: "Análisis de rivales",
  description: "Crea perfiles de equipos oponentes, analiza sus fortalezas y debilidades, y desarrolla estrategias específicas.",
  checkItems: ["Scouting completo", "Estadísticas de jugadores clave", "Patrones de juego y tácticas"]
}, {
  icon: <Calendar className="w-10 h-10 text-red-500" />,
  title: "Planificación de temporada",
  description: "Define objetivos a corto y largo plazo, crea calendarios de entrenamiento y realiza seguimiento de la evolución.",
  checkItems: ["Periodización completa", "Gestión de cargas de trabajo", "Evaluación de progresos"]
}];

export const Stats = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Funcionalidades Adicionales</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre todas las herramientas que Statsor pone a tu disposición para revolucionar la gestión de tu equipo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.checkItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
