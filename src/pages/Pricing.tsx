
import { Check, Award, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-[#f0f4fa]">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-secondary mb-4">Plan de precios</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre cómo Statsor se adapta perfectamente a tus necesidades, ya sea en fútbol 11 o futsal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Statsor Starter */}
          <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg border-4 border-blue-400 hover:border-primary transition-all duration-300 flex flex-col">
            <div className="flex-grow">
              <h3 className="text-2xl font-semibold text-white mb-2">Statsor Starter</h3>
              <div className="mb-6">
                <span className="text-center">Prueba gratuita de 7 días</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Registro táctico de partidos (acciones + jugadores)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Edición y corrección de jugadas en tiempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Visualización básica de estadísticas por partido</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Hasta 1 equipo / 2 partidos activos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-blue-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Exportación PDF limitada</span>
                </li>
              </ul>
            </div>
            <Button className="w-full mt-auto bg-white text-blue-600 hover:bg-blue-100 font-semibold">
              Empieza gratis
            </Button>
          </div>

          {/* Statsor Pro */}
          <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg border-4 border-gray-700 relative transform hover:scale-105 transition-all duration-300 flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-white px-4 py-1 rounded-full text-sm">Popular</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-semibold text-white mb-2">Statsor Pro</h3>
              <div className="mb-6">
                <span className="text-gray-300">€29,99/mes</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Todo lo del plan Starter</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Estadísticas individuales y evolución por jugador</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Informes automáticos por partido / temporada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Calendario de partidos y entrenamientos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Control de asistencia y minutos jugados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Sin límite de equipos ni partidos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Modo offline completo y sincronización</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Acceso desde web y tablet</span>
                </li>
              </ul>
            </div>
            <Button className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white font-semibold">
              Suscríbete ahora
            </Button>
          </div>

          {/* Statsor Club */}
          <div className="bg-green-600 text-white p-8 rounded-lg shadow-lg border-4 border-green-400 hover:border-primary transition-all duration-300 flex flex-col">
            <div className="flex-grow">
              <h3 className="text-2xl font-semibold text-white mb-2">Statsor Club</h3>
              <div className="mb-6">
                <span className="text-white">Precio a medida</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Todo lo del plan Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Multiusuario y roles (entrenador, analista, coordinador)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Soporte prioritario y asistencia técnica personalizada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Formación inicial al staff (remoto o presencial)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Informes agregados por categoría o club</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Integración con otras plataformas (vídeo, GPS...)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Posibilidad de incluir tablet preconfigurada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-green-300 mt-0.5 flex-shrink-0" size={20} />
                  <span className="text-white">Facturación adaptada a clubes o escuelas</span>
                </li>
              </ul>
            </div>
            <Button className="w-full mt-auto bg-white text-green-600 hover:bg-green-100 font-semibold">
              Solicita propuesta
            </Button>
          </div>
        </div>

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
