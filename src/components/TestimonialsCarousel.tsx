import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  team: string;
  avatar: string;
  initials: string;
  avatarColor: string;
  rating: number;
  content: {
    en: string;
    es: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Miguel Torres",
    role: "Entrenador",
    team: "Valencia CF",
    avatar: "/avatars/miguel.jpg",
    initials: "MT",
    avatarColor: "bg-orange-500",
    rating: 5,
    content: {
      en: "Statsor has revolutionized the way we prepare our matches. Real-time data integration gives us a clear competitive advantage.",
      es: "Statsor ha revolucionado la forma en que preparamos nuestros partidos. La integración de datos en tiempo real nos da una ventaja competitiva clara."
    }
  },
  {
    id: 2,
    name: "Javier García",
    role: "Dir. Deportivo",
    team: "Real Atlético",
    avatar: "/avatars/javier.jpg",
    initials: "JG",
    avatarColor: "bg-red-500",
    rating: 5,
    content: {
      en: "As a sports director, Statsor allows me to efficiently supervise all our teams. Automatic reports and the ease of sharing data between coaches are exceptional features.",
      es: "Como director deportivo, Statsor me permite supervisar todos nuestros equipos de manera eficiente. Los informes automáticos y la facilidad para compartir datos entre entrenadores son funcionalidades excepcionales."
    }
  },
  {
    id: 3,
    name: "Luisa Sanz",
    role: "Entrenadora",
    team: "Águilas Femenino",
    avatar: "/avatars/luisa.jpg",
    initials: "LS",
    avatarColor: "bg-purple-500",
    rating: 5,
    content: {
      en: "What I like most about Statsor is its ease of use. I can access it from any device, even from the field, and have all my team's information just a click away.",
      es: "Lo que más me gusta de Statsor es la facilidad de uso. Puedo acceder desde cualquier dispositivo, incluso desde el campo, y tener toda la información de mi equipo a un clic de distancia."
    }
  },
  {
    id: 4,
    name: "Carlos Rodriguez",
    role: "Entrenador",
    team: "Barcelona Youth",
    avatar: "/avatars/carlos.jpg",
    initials: "CR",
    avatarColor: "bg-blue-500",
    rating: 5,
    content: {
      en: "The AI assistant has transformed our tactical analysis. It provides insights that would take hours to discover manually.",
      es: "El asistente de IA ha transformado nuestro análisis táctico. Proporciona insights que tomarían horas descubrir manualmente."
    }
  },
  {
    id: 5,
    name: "Ana Martínez",
    role: "Entrenadora",
    team: "Madrid United",
    avatar: "/avatars/ana.jpg",
    initials: "AM",
    avatarColor: "bg-green-500",
    rating: 5,
    content: {
      en: "The injury prevention features have helped us reduce player downtime by 40%. The data-driven approach is game-changing.",
      es: "Las funciones de prevención de lesiones nos han ayudado a reducir el tiempo de inactividad de los jugadores en un 40%. El enfoque basado en datos es revolucionario."
    }
  }
];

export const TestimonialsCarousel: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className={`py-20 px-4 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-white text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {language === 'en' ? 'Testimonials' : 'Testimonios'}
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {language === 'en' 
              ? "Discover how coaches of all levels have improved with Statsor"
              : "Descubre cómo entrenadores de todos los niveles han mejorado con Statsor"
            }
          </motion.p>
        </motion.div>
        
        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 },
                rotateY: { duration: 0.3 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full"
            >
              <Card className={`relative overflow-hidden border-0 shadow-2xl ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <CardContent className="p-8 md:p-12">
                  {/* Quote Icon */}
                  <motion.div
                    className="absolute top-6 right-6 text-green-500 opacity-20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Quote className="w-16 h-16" />
                  </motion.div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar */}
                    <motion.div
                      className={`relative ${testimonials[currentIndex].avatarColor} w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {testimonials[currentIndex].initials}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-green-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                                                 <p className="text-lg md:text-xl leading-relaxed mb-6 italic">
                           &quot;{testimonials[currentIndex].content[language as 'en' | 'es']}&quot;
                         </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="space-y-2"
                      >
                        <h4 className="font-bold text-xl">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {testimonials[currentIndex].team} | {testimonials[currentIndex].role}
                        </p>
                        <div className="flex justify-center md:justify-start gap-1">
                          {renderStars(testimonials[currentIndex].rating)}
                      </div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            className="absolute -left-4 top-1/2 transform -translate-y-1/2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              className={`rounded-full w-12 h-12 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </motion.div>

          <motion.div
            className="absolute -right-4 top-1/2 transform -translate-y-1/2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              className={`rounded-full w-12 h-12 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </motion.div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-green-500 scale-125'
                    : theme === 'dark'
                    ? 'bg-gray-600 hover:bg-gray-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
                      ))}
                    </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { number: "500+", label: language === 'en' ? "Coaches" : "Entrenadores" },
            { number: "98%", label: language === 'en' ? "Satisfaction" : "Satisfacción" },
            { number: "24/7", label: language === 'en' ? "Support" : "Soporte" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold text-green-600 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
              >
                {stat.number}
              </motion.div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};