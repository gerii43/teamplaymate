import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
export const PersonalizedDemoForm = () => {
  return <section className="py-16 bg-gray-50">
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
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Solicita tu demo personalizada</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre cómo Statsor puede transformar la gestión de tu equipo. Completa el formulario y te contactaremos para agendar una demostración.
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
          }} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <Input id="fullName" placeholder="Tu nombre completo" className="w-full h-12" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input id="email" type="email" placeholder="tu@email.com" className="w-full h-12" />
              </div>
              
              <div>
                <label htmlFor="club" className="block text-sm font-medium text-gray-700 mb-2">
                  Club o equipo *
                </label>
                <Input id="club" placeholder="Nombre de tu club o equipo" className="w-full h-12" />
              </div>
              
              <div>
                <label htmlFor="modality" className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidad *
                </label>
                <select id="modality" defaultValue="" className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                  <option value="" disabled>Selecciona la modalidad</option>
                  <option value="futbol11">Fútbol 11</option>
                  <option value="futbol7">Fútbol 7</option>
                  <option value="futsal">Futsal</option>
                </select>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg font-medium">
                Solicitar demo
              </Button>
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
          }} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Lo que incluye tu demo</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">Demo personalizada</span>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">14 días de prueba</span>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">Soporte técnico</span>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">Asesoría de implementación</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">¿Tienes preguntas específicas?</p>
                    <p className="text-sm text-gray-600">
                      Durante la demo podrás resolver todas tus dudas sobre funcionalidades, precios y adaptación a tu metodología de entrenamiento.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>;
};

export default PersonalizedDemoForm;