
import { motion } from "framer-motion";
import { useEffect, useCallback, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";

const functionalities = [
  {
    title: "Estadísticas por Jugador",
    image: "/lovable-uploads/60ccadbb-1eca-4d03-beb4-d5f05ab5cdca.png",
    features: [
      "Minutos jugados y rendimiento",
      "Evolución individual",
      "Comparaciones internas",
      "Historial acumulado"
    ]
  },
  {
    title: "Estadísticas Generales",
    image: "/lovable-uploads/f63b3af8-c725-47c5-a6ba-e0e9bc85e9e0.png",
    features: [
      "Tendencias del equipo en cada jornada",
      "Comparativas por bloque",
      "Goles, robos, tiros, posesión",
      "Exportación rápida"
    ]
  },
  {
    title: "Control de Asistencia",
    image: "/lovable-uploads/40ab3e39-b17e-46b2-95f0-8bd251a8396e.png",
    features: [
      "Registro editable y diario",
      "Histórico por jugador",
      "Compatible con todas las categorías",
      "Muy visual y rápido"
    ]
  },
  {
    title: "Cuadro de Mandos",
    image: "/lovable-uploads/8eed0fb1-425a-44c5-ab66-abc8f7f3855e.png",
    features: [
      "Vista central y simplificada",
      "Accesos rápidos a lo esencial",
      "Optimizado para tablet",
      "Personalizable"
    ]
  },
  {
    title: "Estadísticas de Partidos",
    image: "/lovable-uploads/60ccadbb-1eca-4d03-beb4-d5f05ab5cdca.png",
    features: [
      "Registro en tiempo real",
      "Análisis por fases",
      "Eventos clave (goles, errores)",
      "Revisión postpartido"
    ]
  },
  {
    title: "Chat con IA Táctica",
    image: "/lovable-uploads/f63b3af8-c725-47c5-a6ba-e0e9bc85e9e0.png",
    features: [
      "Preguntas tácticas en directo",
      "Recomendaciones personalizadas",
      "Asistente inteligente",
      "Decisiones estratégicas"
    ]
  }
];

export const FunctionalitiesCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const scrollNext = useCallback(() => {
    if (!api) return;
    api.scrollNext();
  }, [api]);

  const handleCardClick = useCallback(() => {
    setIsAutoPlaying(false);
    // Resume autoplay after 3 seconds of no interaction
    setTimeout(() => setIsAutoPlaying(true), 3000);
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!api || !isAutoPlaying) return;
    
    const interval = setInterval(() => {
      scrollNext();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [api, isAutoPlaying, scrollNext]);

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
          <h2 className="text-5xl font-bold mb-4 text-center">Módulos principales</h2>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
            onClick={handleCardClick}
          >
            <CarouselContent>
              {functionalities.map((functionality, index) => (
                <CarouselItem key={index} className="pl-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="space-y-8"
                    >
                      <div className="border-l-4 border-green-600 pl-6">
                        <h3 className="text-3xl font-bold text-gray-900 mb-6">
                          {functionality.title}
                        </h3>
                        <ul className="space-y-3">
                          {functionality.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <span className="text-green-600 mr-3 mt-1">✅</span>
                              <span className="text-lg text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="flex justify-center"
                    >
                      <div className="relative">
                        <img
                          alt={`Captura de pantalla del módulo ${functionality.title}`}
                          className="w-full max-w-lg h-auto rounded-lg shadow-lg"
                          src={functionality.image}
                        />
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
