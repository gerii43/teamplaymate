import { motion } from "framer-motion";
const testimonials = [{
  name: "Javier García",
  position: "Real Atlético | Dir. Deportivo",
  avatar: "JG",
  color: "bg-red-500",
  quote: "Como director deportivo, Statsor me permite supervisar todos nuestros equipos de manera eficiente. Los informes automáticos y la facilidad para compartir datos entre entrenadores son funcionalidades excepcionales.",
  rating: 5
}, {
  name: "Luisa Sanz",
  position: "Águilas Femenino | Entrenadora",
  avatar: "LS",
  color: "bg-purple-500",
  quote: "Lo que más me gusta de Statsor es la facilidad de uso. Puedo acceder desde cualquier dispositivo, incluso desde el campo, y tener toda la información de mi equipo a un clic de distancia.",
  rating: 5
}, {
  name: "Carlos Rodríguez",
  position: "Unión CF | Preparador Físico",
  avatar: "CR",
  color: "bg-yellow-500",
  quote: "Como preparador físico, las estadísticas y la gestión de carga de trabajo en Statsor son insuperables. Hemos reducido lesiones en un 30% gracias a los entrenamientos personalizados.",
  rating: 4
}];
export const Testimonials = () => {
  return <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto bg-gray-50">
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
          <h2 className="text-4xl font-bold mb-4">Testimonios</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre cómo entrenadores de todos los niveles han mejorado con Statsor
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} viewport={{
          once: true
        }} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
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
                {Array.from({
              length: 5
            }).map((_, i) => <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>)}
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};