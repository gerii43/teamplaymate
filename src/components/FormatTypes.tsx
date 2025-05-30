import { motion } from "framer-motion";
export const FormatTypes = () => {
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
          <h2 className="text-4xl font-bold mb-4">El futuro del fútbol es ahora</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre cómo la tecnología y los datos están transformando el deporte rey
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
        }} className="space-y-8">
            

            

            

            <div className="border-l-4 border-green-600 pl-6">
              <blockquote className="text-lg text-gray-900 mb-2 rounded-none">
                "Vivimos en un mundo donde los datos son muy importantes, y el siguiente paso será usar la inteligencia artificial para anticipar la toma de decisiones y el potencial de los jugadores. Los datos nos permiten analizar cada aspecto del juego y mejorar el rendimiento en todos los niveles."
              </blockquote>
              <cite className="text-gray-600 font-semibold">— Arsène Wenger</cite>
            </div>
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
        }} className="flex justify-center">
            <div className="relative">
              <img alt="Estadio y análisis de fútbol con inteligencia artificial" className="-lg w-full max-w-md h-auto object-cover" src="/lovable-uploads/5b85a203-3cbb-4fc0-893a-e30894d68760.jpg" />
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};