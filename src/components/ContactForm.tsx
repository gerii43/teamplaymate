
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ContactForm = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Transforma la gestión de tu equipo hoy</h2>
          <p className="text-xl max-w-3xl mx-auto">
            Únete a cientos de entrenadores que ya están optimizando el rendimiento de sus equipos con Statsor.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">¿Listo para elevar el nivel de tu equipo?</h3>
            <p className="text-gray-600 mb-8 text-center">
              Agenda una demo personalizada y descubre cómo Statsor puede adaptarse a tus necesidades específicas.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <Input 
                    id="name" 
                    placeholder="Tu nombre" 
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Tu email" 
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="club" className="block text-sm font-medium text-gray-700 mb-1">Club o equipo</label>
                  <Input 
                    id="club" 
                    placeholder="Nombre de tu club o equipo" 
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="modality" className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                  <select 
                    id="modality" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="" disabled selected>Selecciona una modalidad</option>
                    <option value="futbol11">Fútbol 11</option>
                    <option value="futbol7">Fútbol 7</option>
                    <option value="futsal">Futsal</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <h4 className="font-semibold text-xl text-gray-800">Incluye</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Demo personalizada de 30 minutos</span>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Período de prueba gratuito de 14 días</span>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Consultoría inicial de implementación</span>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-gray-700">Soporte técnico dedicado</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <p className="font-medium text-gray-800">¿Ya tienes un equipo grande?</p>
                      <p className="text-sm text-gray-600">Consulta nuestros planes para clubes con múltiples equipos y obtén descuentos exclusivos.</p>
                      <a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center mt-2">
                        Ver planes para clubes
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button className="bg-primary text-white px-8 py-6 text-lg rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Solicitar Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
