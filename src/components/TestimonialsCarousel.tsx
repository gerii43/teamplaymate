import { motion } from "framer-motion";
import { useEffect, useCallback, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";

export const TestimonialsCarousel = () => {
  const { t } = useLanguage();
  const [api, setApi] = useState<CarouselApi>();
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      name: "Javier García",
      position: "Real Atlético | Dir. Deportivo",
      avatar: "JG",
      color: "bg-red-500",
      quote: t('testimonials.javier.quote'),
      rating: 5
    },
    {
      name: "Luisa Sanz",
      position: "Águilas Femenino | Entrenadora",
      avatar: "LS",
      color: "bg-purple-500",
      quote: t('testimonials.luisa.quote'),
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      position: "Unión CF | Preparador Físico",
      avatar: "CR",
      color: "bg-yellow-500",
      quote: t('testimonials.carlos.quote'),
      rating: 4
    },
    {
      name: "Ana Martínez",
      position: "Barcelona Femení | Analista",
      avatar: "AM",
      color: "bg-blue-500",
      quote: "La plataforma nos ha permitido mejorar significativamente nuestras decisiones tácticas. Los informes detallados son increíblemente útiles para el análisis post-partido.",
      rating: 5
    },
    {
      name: "Miguel Torres",
      position: "Valencia CF | Entrenador",
      avatar: "MT",
      color: "bg-orange-500",
      quote: "Statsor ha revolucionado la forma en que preparamos nuestros partidos. La integración de datos en tiempo real nos da una ventaja competitiva clara.",
      rating: 5
    }
  ];

  const scrollNext = useCallback(() => {
    if (!api) return;
    api.scrollNext();
  }, [api]);

  const handleCardClick = useCallback(() => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  }, []);

  useEffect(() => {
    if (!api || !isAutoPlaying) return;
    
    const interval = setInterval(() => {
      scrollNext();
    }, 3500);

    return () => clearInterval(interval);
  }, [api, isAutoPlaying, scrollNext]);

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{t('testimonials.title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={handleCardClick}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow h-full cursor-pointer bg-blue-50"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`w-14 h-14 rounded-full ${testimonial.color} flex items-center justify-center text-white text-xl font-bold`}>
                        {testimonial.avatar}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-xl">{testimonial.name}</h3>
                        <p className="text-gray-600">{testimonial.position}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};