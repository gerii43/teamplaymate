
import { motion } from "framer-motion";

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
          <h2 className="text-4xl font-bold mb-4">El futuro del fútbol es ahora</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre cómo la tecnología y los datos están transformando el deporte rey
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="border-l-4 border-blue-600 pl-6">
              <blockquote className="text-xl font-medium text-gray-800 italic mb-2">
                "El fútbol moderno es también un juego de datos."
              </blockquote>
              <cite className="text-gray-600 font-semibold">— Soccer Interaction</cite>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <blockquote className="text-lg text-gray-800 mb-2">
                "Mediante la recopilación y el análisis sistemáticos de datos, los equipos pueden optimizar su rendimiento y tomar decisiones tácticas con mayor precisión."
              </blockquote>
              <cite className="text-gray-600 font-semibold">— Parm AG</cite>
            </div>

            <div className="border-l-4 border-blue-600 pl-6">
              <blockquote className="text-xl font-medium text-gray-800 italic mb-2">
                "La velocidad de la cabeza es más importante que la de las piernas."
              </blockquote>
              <cite className="text-gray-600 font-semibold">— Xavi Hernández</cite>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <blockquote className="text-lg text-gray-800 mb-2">
                "Cuanto más ricos sean los datos, mejores serán los análisis. La información algorítmica en la industria del fútbol es abundante."
              </blockquote>
              <cite className="text-gray-600 font-semibold">— Eric Bradlow (Wharton)</cite>
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
                src="/lovable-uploads/c998942f-3b15-4ea0-84d7-6c81ecf56aaa.jpg"
                alt="Entrenador analizando datos en tablet"
                className="rounded-xl shadow-lg w-full max-w-md h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
