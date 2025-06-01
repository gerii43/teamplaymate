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
  return;
};