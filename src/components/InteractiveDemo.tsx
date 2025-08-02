
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Users, 
  BarChart3, 
  Calendar, 
  Target, 
  Trophy, 
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Eye,
  Download
} from "lucide-react";

export const InteractiveDemo = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const demoData = {
    players: [
      { name: "Carlos Mendez", position: "Portero", status: "Disponible", avatar: "CM" },
      { name: "Luis Torres", position: "Defensa", status: "Disponible", avatar: "LT" },
      { name: "Miguel Silva", position: "Centrocampista", status: "Lesionado", avatar: "MS" },
      { name: "Javier Ruiz", position: "Delantero", status: "Disponible", avatar: "JR" }
    ],
    stats: {
      matches: 15,
      wins: 12,
      draws: 2,
      losses: 1,
      goalsFor: 45,
      goalsAgainst: 18
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Demo Header */}
      <div className={`p-4 border-b ${
        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-red-500' : 'bg-red-400'
            }`} />
            <div className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-yellow-500' : 'bg-yellow-400'
            }`} />
            <div className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-green-500' : 'bg-green-400'
            }`} />
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Statsor Panel de Control - Demo Interactiva
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Settings className={`h-4 w-4 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 border-r ${
          isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
        }`}>
          <nav className="p-4 space-y-2">
            {[
              { icon: Users, label: language === 'en' ? 'Players' : 'Jugadores', active: true },
              { icon: BarChart3, label: language === 'en' ? 'Statistics' : 'Estadísticas', active: false },
              { icon: Calendar, label: language === 'en' ? 'Matches' : 'Partidos', active: false },
              { icon: Target, label: language === 'en' ? 'Training' : 'Entrenamiento', active: false },
              { icon: Trophy, label: language === 'en' ? 'Competitions' : 'Competiciones', active: false }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                  item.active
                    ? isDark 
                      ? 'bg-green-600 text-white' 
                      : 'bg-green-100 text-green-700'
                    : isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Player Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'Player Management' : 'Gestión de Jugadores'}
              </h3>
              
              <div className="space-y-4">
                {demoData.players.map((player, index) => (
                  <motion.div
                    key={player.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        player.status === 'Lesionado' ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        {player.avatar}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {player.name}
                        </p>
                        <p className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {player.position}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      player.status === 'Disponible'
                        ? isDark ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                        : isDark ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                    }`}>
                      {player.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Statistics Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-6 rounded-xl border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {language === 'en' ? 'Statistics Overview' : 'Resumen de Estadísticas'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: language === 'en' ? 'Matches' : 'Partidos', value: demoData.stats.matches, icon: Calendar },
                  { label: language === 'en' ? 'Wins' : 'Victorias', value: demoData.stats.wins, icon: Trophy },
                  { label: language === 'en' ? 'Goals For' : 'Goles a Favor', value: demoData.stats.goalsFor, icon: Target },
                  { label: language === 'en' ? 'Win Rate' : 'Porcentaje', value: `${Math.round((demoData.stats.wins / demoData.stats.matches) * 100)}%`, icon: TrendingUp }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`p-4 rounded-lg text-center ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <stat.icon className={`h-6 w-6 mx-auto mb-2 ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <p className={`text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Live Match Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mt-6 p-6 rounded-xl border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <h3 className={`text-xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? 'Live Match Control' : 'Control de Partido en Vivo'}
            </h3>
            
            <div className="flex items-center justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full ${
                  isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                <Play className="h-6 w-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full ${
                  isDark ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white`}
              >
                <Pause className="h-6 w-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full ${
                  isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'
                } text-white`}
              >
                <RotateCcw className="h-6 w-6" />
              </motion.button>
            </div>
            
            <div className="mt-4 text-center">
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'Click to start recording match events' : 'Haz clic para comenzar a registrar eventos del partido'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
