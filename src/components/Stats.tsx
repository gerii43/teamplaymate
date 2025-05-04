
import { motion } from "framer-motion";
import { Ticket, BarChart3, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

const additionalFeatures = [
  {
    icon: <Ticket className="w-10 h-10 text-blue-500" />,
    title: "Gestión de lesiones",
    description: "Realiza un seguimiento detallado de lesiones, tiempos de recuperación y recomendaciones médicas para cada jugador.",
    checkItems: [
      "Historial médico completo",
      "Alertas de sobrecargas",
      "Planes de recuperación"
    ]
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-green-500" />,
    title: "Análisis de rivales",
    description: "Crea perfiles de equipos oponentes, analiza sus fortalezas y debilidades, y desarrolla estrategias específicas.",
    checkItems: [
      "Scouting completo",
      "Estadísticas de jugadores clave",
      "Patrones de juego y tácticas"
    ]
  },
  {
    icon: <Calendar className="w-10 h-10 text-red-500" />,
    title: "Planificación de temporada",
    description: "Define objetivos a corto y largo plazo, crea calendarios de entrenamiento y realiza seguimiento de la evolución.",
    checkItems: [
      "Periodización completa",
      "Gestión de cargas de trabajo",
      "Evaluación de progresos"
    ]
  }
];

export const Stats = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {additionalFeatures.map((feature, index) => (
            <Card key={index} className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-secondary">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.checkItems.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
