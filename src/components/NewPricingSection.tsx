import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const NewPricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { t } = useLanguage();

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
          <div className="text-white rounded-3xl p-12 mb-12 max-w-4xl mx-auto bg-blue-500">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('pricing.title')}</h2>
            <p className="text-xl text-center text-white">{t('pricing.subtitle')}
          </p>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-4 text-lg ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {t('pricing.monthly')}
            </span>
            <button onClick={() => setIsAnnual(!isAnnual)} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${isAnnual ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`ml-4 text-lg ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {t('pricing.annual')}
            </span>
            {isAnnual && <span className="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {t('pricing.save')}
              </span>}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }} viewport={{
          once: true
        }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{t('pricing.starter.title')}</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {t('pricing.starter.price')}
              </div>
              <p className="text-gray-500">{t('pricing.starter.period')}</p>
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
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="p-8 rounded-2xl shadow-xl border-4 transform scale-105 flex flex-col h-full relative hover:shadow-2xl hover:scale-[1.07] transition-all duration-300 ease-out cursor-pointer" style={{
          backgroundColor: '#F0FDF4',
          borderColor: '#22C55E'
        }}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{t('pricing.pro.title')}</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {isAnnual ? '€299' : '€29,99'}
              </div>
              <p className="text-gray-500">{isAnnual ? 'por año' : t('pricing.pro.period')}</p>
              {isAnnual && <p className="text-sm text-green-600 font-medium mt-1">Ahorras 60€</p>}
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
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} viewport={{
          once: true
        }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{t('pricing.club.title')}</h3>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {t('pricing.club.price')}
              </div>
              <p className="text-gray-500">{t('pricing.club.period')}</p>
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
    </section>;
};