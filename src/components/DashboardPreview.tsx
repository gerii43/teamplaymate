
import { BarChart, Calendar, Home, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const performanceData = [
  { month: "Ene", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 68 },
  { month: "Abr", score: 78 },
  { month: "May", score: 82 },
];

const upcomingTrainings = [
  { date: "24 Abril", time: "18:00", type: "Técnico" },
  { date: "26 Abril", time: "17:30", type: "Táctico" },
  { date: "28 Abril", time: "18:00", type: "Físico" },
];

export const DashboardPreview = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Dashboard Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-16 bg-primary min-h-[600px] flex flex-col items-center py-6 gap-8">
          <div className="text-white/90 hover:text-white cursor-pointer transition-colors">
            <Home size={24} />
          </div>
          <div className="text-white/90 hover:text-white cursor-pointer transition-colors">
            <Users size={24} />
          </div>
          <div className="text-white/90 hover:text-white cursor-pointer transition-colors">
            <Calendar size={24} />
          </div>
          <div className="text-white/90 hover:text-white cursor-pointer transition-colors">
            <BarChart size={24} />
          </div>
          <div className="text-white/90 hover:text-white cursor-pointer transition-colors">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Rendimiento del Equipo</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#1a365d" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Player Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Carlos Rodríguez</h3>
                    <p className="text-sm text-gray-500">Delantero</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Asistencia</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Goles</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Asistencias</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Trainings */}
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Próximos Entrenamientos</h3>
                <div className="space-y-4">
                  {upcomingTrainings.map((training, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{training.date}</p>
                          <p className="text-sm text-gray-500">{training.time}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {training.type}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Estado del Equipo</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-600">18/20 Disponibles</p>
                      <p className="text-sm text-green-500">Próximo partido</p>
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-yellow-600">85% Completado</p>
                      <p className="text-sm text-yellow-500">Objetivo mensual</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
