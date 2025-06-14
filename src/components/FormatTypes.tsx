
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
          <h2 className="text-5xl font-bold mb-4 text-center">El futuro del fútbol es AHORA</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="border-l-4 border-green-600 pl-6">
              <blockquote className="text-2xl text-gray-900 mb-4 rounded-none leading-relaxed">
                "Vivimos en un mundo donde los datos son muy importantes, y el siguiente paso será usar la inteligencia artificial para anticipar la toma de decisiones y el potencial de los jugadores. Los datos nos permiten analizar cada aspecto del juego y mejorar el rendimiento en todos los niveles."
              </blockquote>
              <cite className="text-xl text-gray-600 font-semibold">— Arsène Wenger</cite>
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
              <svg
                width="400"
                height="400"
                viewBox="0 0 400 400"
                className="w-full max-w-lg h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Campo de fútbol base */}
                <rect x="50" y="150" width="300" height="200" fill="#22c55e" stroke="#16a34a" strokeWidth="3" rx="15"/>
                
                {/* Líneas del campo */}
                <line x1="200" y1="150" x2="200" y2="350" stroke="#ffffff" strokeWidth="2"/>
                <circle cx="200" cy="250" r="30" fill="none" stroke="#ffffff" strokeWidth="2"/>
                <rect x="50" y="200" width="40" height="100" fill="none" stroke="#ffffff" strokeWidth="2"/>
                <rect x="310" y="200" width="40" height="100" fill="none" stroke="#ffffff" strokeWidth="2"/>
                
                {/* Datos estadísticos flotantes en 3D */}
                <g transform="translate(100,100) scale(0.8)">
                  <rect x="0" y="0" width="80" height="50" fill="#3b82f6" rx="8" opacity="0.9" transform="skew(-5,0)"/>
                  <text x="40" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">95%</text>
                  <text x="40" y="35" textAnchor="middle" fill="white" fontSize="10">Precisión</text>
                </g>
                
                <g transform="translate(280,80) scale(0.8)">
                  <rect x="0" y="0" width="80" height="50" fill="#f59e0b" rx="8" opacity="0.9" transform="skew(5,0)"/>
                  <text x="40" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">45</text>
                  <text x="40" y="35" textAnchor="middle" fill="white" fontSize="10">Pases/min</text>
                </g>
                
                <g transform="translate(120,350) scale(0.8)">
                  <rect x="0" y="0" width="80" height="50" fill="#ef4444" rx="8" opacity="0.9" transform="skew(-3,0)"/>
                  <text x="40" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">12</text>
                  <text x="40" y="35" textAnchor="middle" fill="white" fontSize="10">Disparos</text>
                </g>
                
                <g transform="translate(250,370) scale(0.8)">
                  <rect x="0" y="0" width="80" height="50" fill="#8b5cf6" rx="8" opacity="0.9" transform="skew(3,0)"/>
                  <text x="40" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">78%</text>
                  <text x="40" y="35" textAnchor="middle" fill="white" fontSize="10">Posesión</text>
                </g>
                
                {/* Gráfico de barras 3D */}
                <g transform="translate(30,30)">
                  <rect x="0" y="20" width="15" height="40" fill="#10b981" transform="skew(-10,0)"/>
                  <rect x="20" y="10" width="15" height="50" fill="#06d6a0" transform="skew(-10,0)"/>
                  <rect x="40" y="25" width="15" height="35" fill="#059669" transform="skew(-10,0)"/>
                  <rect x="60" y="5" width="15" height="55" fill="#34d399" transform="skew(-10,0)"/>
                </g>
                
                {/* Pelota de fútbol */}
                <circle cx="200" cy="250" r="8" fill="#ffffff" stroke="#000000" strokeWidth="1"/>
                <path d="M 195 245 L 200 240 L 205 245 L 203 252 L 197 252 Z" fill="#000000"/>
                
                {/* Líneas de conexión de datos */}
                <line x1="140" y1="125" x2="180" y2="180" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" opacity="0.7"/>
                <line x1="320" y1="105" x2="280" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" opacity="0.7"/>
                <line x1="160" y1="375" x2="200" y2="320" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" opacity="0.7"/>
                <line x1="290" y1="395" x2="250" y2="340" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" opacity="0.7"/>
                
                {/* Efectos de profundidad */}
                <defs>
                  <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e"/>
                    <stop offset="100%" stopColor="#16a34a"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
