
import { useState, useEffect } from "react";
import { BarChart, Users, Calendar, Home, Trophy, TrendingUp, Activity } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const performanceData = [
  { name: 'Ene', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Abr', value: 71 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 78 },
  { name: 'Jul', value: 85 }
];

const playerStatsData = [
  { name: 'Goles', value: 12 },
  { name: 'Asistencias', value: 8 },
  { name: 'Tarjetas', value: 3 },
  { name: 'Minutos', value: 1240 }
];

const matchData = [
  { date: '15 Jul', opponent: 'FC Barcelona B', result: '2-1', location: 'Casa' },
  { date: '22 Jul', opponent: 'Real Madrid C', result: '1-3', location: 'Fuera' },
  { date: '29 Jul', opponent: 'Valencia CF B', result: '0-0', location: 'Casa' },
  { date: '05 Ago', opponent: 'Atlético B', result: '3-0', location: 'Casa' }
];

const COLORS = ['#4ADE80', '#60A5FA', '#F59E0B', '#EF4444'];

const menuItems = [
  { id: 'inicio', title: 'Inicio', icon: Home },
  { id: 'jugadores', title: 'Jugadores', icon: Users },
  { id: 'estadisticas', title: 'Estadísticas', icon: BarChart },
  { id: 'partidos', title: 'Partidos', icon: Calendar }
];

export const InteractiveDemo = () => {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotation functionality
  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      setActiveSection(current => {
        const currentIndex = menuItems.findIndex(item => item.id === current);
        const nextIndex = (currentIndex + 1) % menuItems.length;
        return menuItems[nextIndex].id;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleMenuClick = (sectionId: string) => {
    setIsAutoRotating(false);
    setActiveSection(sectionId);
    // Resume auto-rotation after 10 seconds of no interaction
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Vista general del equipo</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Rendimiento del equipo</h3>
                  <span className="text-sm text-primary">Último mes</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#4ADE80" barSize={20} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Jugador destacado</h3>
                  <span className="text-xs py-1 px-2 bg-green-100 text-green-800 rounded-full">En forma</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <span className="text-primary font-bold text-xl">JL</span>
                  </div>
                  <h4 className="font-bold">Javier López</h4>
                  <p className="text-sm text-gray-500 mb-4">Centrocampista</p>
                  
                  <div className="w-full grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xl font-bold text-primary">89%</div>
                      <div className="text-xs text-gray-500">Pases</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-xl font-bold text-primary">92%</div>
                      <div className="text-xs text-gray-500">Físico</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Próximos entrenamientos</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">Entrenamiento táctico</span>
                    <p className="text-sm text-gray-500">Enfoque en presión alta</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">Hoy</span>
                    <p className="text-sm text-gray-500">17:00 - 19:00</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">Físico + Recuperación</span>
                    <p className="text-sm text-gray-500">Grupo completo</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">Mañana</span>
                    <p className="text-sm text-gray-500">10:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'jugadores':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Jugadores</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Plantilla Actual</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Carlos Mendez', position: 'Portero', status: 'Disponible' },
                    { name: 'Javier López', position: 'Centrocampista', status: 'Titular' },
                    { name: 'Miguel Torres', position: 'Delantero', status: 'Lesionado' },
                    { name: 'David Silva', position: 'Defensa', status: 'Disponible' }
                  ].map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium text-sm">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-500">{player.position}</div>
                        </div>
                      </div>
                      <span className={`text-xs py-1 px-2 rounded-full ${
                        player.status === 'Titular' ? 'bg-green-100 text-green-800' :
                        player.status === 'Lesionado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {player.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Estadísticas por Posición</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Delanteros', value: 6 },
                          { name: 'Centrocampistas', value: 8 },
                          { name: 'Defensas', value: 7 },
                          { name: 'Porteros', value: 2 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {playerStatsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      case 'estadisticas':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Análisis Estadístico</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Partidos Jugados', value: '12', icon: Trophy },
                { label: 'Goles a Favor', value: '28', icon: TrendingUp },
                { label: 'Goles en Contra', value: '15', icon: Activity },
                { label: 'Posesión Media', value: '67%', icon: BarChart }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Evolución del Rendimiento</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#4ADE80" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'partidos':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Calendario y Resultados</h2>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Últimos Partidos</h3>
              <div className="space-y-3">
                {matchData.map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">{match.date}</div>
                      <div className="font-medium">{match.opponent}</div>
                      <span className={`text-xs py-1 px-2 rounded-full ${
                        match.location === 'Casa' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {match.location}
                      </span>
                    </div>
                    <div className={`font-bold text-lg ${
                      match.result.split('-')[0] > match.result.split('-')[1] ? 'text-green-600' :
                      match.result.split('-')[0] < match.result.split('-')[1] ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {match.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Próximo Partido</h3>
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-lg font-bold text-gray-800 mb-2">Real Sociedad B</div>
                  <div className="text-sm text-gray-500 mb-1">Domingo 12 Agosto</div>
                  <div className="text-sm text-gray-500">20:00 - Estadio Municipal</div>
                  <div className="mt-4">
                    <span className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Partido en Casa
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Estadísticas de Liga</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posición:</span>
                    <span className="font-medium">3º de 20</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Puntos:</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diferencia goles:</span>
                    <span className="font-medium text-green-600">+13</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Racha actual:</span>
                    <span className="font-medium text-green-600">3 victorias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex bg-gray-900 text-white p-3 items-center">
        <span className="font-medium mr-2">Statsor</span>
        <span className="text-gray-400 text-sm">Panel de Control - Demo Interactiva</span>
        <div className="ml-auto flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div className="flex h-[500px]">
        {/* Sidebar */}
        <div className="w-[240px] bg-gray-850 border-r border-gray-700 text-white p-4">
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 bg-white p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
