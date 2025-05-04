
import { BarChart, Users, Calendar, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Abr', value: 71 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 78 },
  { name: 'Jul', value: 85 }
];

export const DashboardPreview = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="flex bg-gray-900 text-white p-3 items-center">
        <span className="font-medium mr-2">Statsor</span>
        <span className="text-gray-400 text-sm">Panel de Control</span>
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
            <div className="flex items-center space-x-3 p-3 bg-blue-600 rounded">
              <Home className="w-5 h-5" />
              <span className="font-medium">Inicio</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded cursor-pointer">
              <Users className="w-5 h-5" />
              <span className="font-medium">Jugadores</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded cursor-pointer">
              <BarChart className="w-5 h-5" />
              <span className="font-medium">Estadísticas</span>
            </div>
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded cursor-pointer">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Partidos</span>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 bg-white p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Vista general del equipo</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart section */}
            <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Rendimiento del equipo</h3>
                <span className="text-sm text-blue-600">Último mes</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4ADE80" barSize={20} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Player highlight */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Jugador destacado</h3>
                <span className="text-xs py-1 px-2 bg-green-100 text-green-800 rounded-full">En forma</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold text-xl">JL</span>
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
          
          {/* Upcoming trainings */}
          <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
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
      </div>
    </div>
  );
};
