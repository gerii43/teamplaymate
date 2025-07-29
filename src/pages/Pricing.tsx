
import { Check, Award, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-[#f0f4fa]">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-secondary mb-4">Plan de precios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre cómo Statsor se adapta perfectamente a tus necesidades, ya sea en fútbol 11 o futsal
          </p>
        </div>

        {/* Nueva sección de precios con el mismo diseño que la pantalla de inicio */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="bg-primary text-white rounded-3xl p-12 mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h2>
                <p className="text-xl text-white/90">
                  Unlock premium features to boost productivity and streamline your workflow. Choose the plan that suits you best!
                </p>
              </div>
              
              <div className="flex items-center justify-center mb-8">
                <span className={`mr-4 text-lg ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Monthly billing
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    isAnnual ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isAnnual ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`ml-4 text-lg ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Annual billing
                </span>
                <span className="ml-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                  Save up to 20%!
                </span>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">BASIC</h3>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    €{isAnnual ? '7' : '9'}
                  </div>
                  <p className="text-gray-500">per month</p>
                </div>
                
                <ul className="space-y-3 flex-grow mb-8">
                  <li className="text-gray-700">3 Projects</li>
                  <li className="text-gray-700">250 objects per project</li>
                  <li className="text-gray-700">One Active User</li>
                </ul>
                
                <Button className="w-full bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
                  Choose this plan
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-xl border-4 border-primary transform scale-105 flex flex-col h-full relative"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">PROFESSIONAL</h3>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    €{isAnnual ? '24' : '29'}
                  </div>
                  <p className="text-gray-500">per month</p>
                </div>
                
                <ul className="space-y-3 flex-grow mb-8">
                  <li className="text-gray-700">20 Projects</li>
                  <li className="text-gray-700">800 objects per project</li>
                  <li className="text-gray-700">10 Active Users</li>
                  <li className="text-gray-700">Team Collaboration</li>
                </ul>
                
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Choose this plan
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">ENTERPRISE</h3>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    €{isAnnual ? '79' : '99'}
                  </div>
                  <p className="text-gray-500">per month</p>
                </div>
                
                <ul className="space-y-3 flex-grow mb-8">
                  <li className="text-gray-700">Unlimited Projects</li>
                  <li className="text-gray-700">No object limit</li>
                  <li className="text-gray-700">Unlimited Users</li>
                  <li className="text-gray-700">Team Collaboration</li>
                  <li className="text-gray-700">Priority Support</li>
                </ul>
                
                <Button className="w-full bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
                  Choose this plan
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detailed Plan Explanations */}
        <div className="max-w-5xl mx-auto mt-24 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 animate-fadeIn flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4">Perfecto para equipos pequeños</h3>
              <p className="text-gray-600 max-w-2xl text-justify">
                El plan Starter es ideal para equipos pequeños o clubes que comienzan su camino con herramientas de gestión profesional. Accede a funciones esenciales que ayudan a organizar tu equipo y realizar un seguimiento básico del rendimiento.
              </p>
            </div>
            <Award className="text-primary flex-shrink-0 ml-6" size={48} />
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 animate-fadeIn [animation-delay:200ms] flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4">Equipos y clubes en crecimiento</h3>
              <p className="text-gray-600 max-w-2xl text-justify">
                Statsor Pro ofrece el equilibrio perfecto entre funciones y valor. Accede a análisis avanzados, seguimiento detallado del rendimiento y herramientas de entrenamiento completas. Ideal para equipos establecidos que buscan mejorar su rendimiento.
              </p>
            </div>
            <Star className="text-primary flex-shrink-0 ml-6" size={48} />
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 animate-fadeIn [animation-delay:400ms] flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4">Organizaciones profesionales</h3>
              <p className="text-gray-600 max-w-2xl text-justify">
                El plan Club ofrece todo lo que una organización profesional necesita. Capacidad ilimitada de jugadores, desarrollo de funciones personalizadas y soporte prioritario aseguran que tengas todas las herramientas necesarias para gestionar múltiples equipos o clubes profesionales.
              </p>
            </div>
            <Crown className="text-primary flex-shrink-0 ml-6" size={48} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
