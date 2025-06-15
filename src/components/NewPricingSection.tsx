import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const NewPricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  return (
    <section className="py-16 bg-card-DEFAULT">
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
              Mensual Billing
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
              Anual Billing
            </span>
            {isAnnual && (
              <span className="ml-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                Ahorras hasta 60€!
              </span>
            )}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">STARTER</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                €0
              </div>
              <p className="text-gray-500">por mes</p>
            </div>
            
            <ul className="space-y-3 flex-grow mb-8">
              <li className="text-gray-700">Prueba gratuita de 7 días</li>
              <li className="text-gray-700">1 equipo</li>
              <li className="text-gray-700">Máx. 20 acciones por partido</li>
              <li className="text-gray-700">Sin acceso al chat IA</li>
              <li className="text-gray-700">Soporte básico por email</li>
            </ul>
            
            <Button className="w-full bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
              Probar gratis
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-xl border-4 border-primary transform scale-105 flex flex-col h-full relative hover:shadow-2xl hover:scale-[1.07] transition-all duration-300 ease-out cursor-pointer"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">PRO</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {isAnnual ? '€299' : '€29,99'}
              </div>
              <p className="text-gray-500">{isAnnual ? 'por año' : 'por mes'}</p>
              {isAnnual && (
                <p className="text-sm text-green-600 font-medium mt-1">Ahorras 60€</p>
              )}
            </div>
            
            <ul className="space-y-3 flex-grow mb-8">
              <li className="text-gray-700">1 equipo incluido</li>
              <li className="text-gray-700">
                Equipos adicionales: {isAnnual ? '+150€/año' : '+15€/mes'}
              </li>
              <li className="text-gray-700">Hasta 2 usuarios por equipo</li>
              <li className="text-gray-700">Registro sin Wi-Fi</li>
              <li className="text-gray-700">Estadísticas en tiempo real</li>
              <li className="text-gray-700">Acceso al asistente IA táctico</li>
              <li className="text-gray-700">Soporte estándar</li>
            </ul>
            
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Empezar ahora
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">CLUB</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                Desde €250
              </div>
              <p className="text-gray-500">por mes</p>
              <p className="text-xs text-gray-400 mt-1">Facturación personalizada</p>
            </div>
            
            <ul className="space-y-3 flex-grow mb-8">
              <li className="text-gray-700">A partir de 6 equipos</li>
              <li className="text-gray-700">Multiusuario y control de roles</li>
              <li className="text-gray-700">Informes comparativos y panel global</li>
              <li className="text-gray-700">Onboarding personalizado</li>
              <li className="text-gray-700">Soporte prioritario</li>
            </ul>
            
            <Button className="w-full bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
              Solicitar demo
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
