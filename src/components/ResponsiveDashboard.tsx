import React from 'react';
import ResponsiveGrid from './ResponsiveGrid';
import ResponsiveCard from './ResponsiveCard';
import ResponsiveTable from './ResponsiveTable';
import { 
  Users, 
  Trophy, 
  BarChart3, 
  Calendar,
  TrendingUp,
  Activity,
  Target,
  Award
} from 'lucide-react';

const ResponsiveDashboard: React.FC = () => {
  const stats = [
    { title: 'Total Players', value: '24', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Active Teams', value: '3', icon: Trophy, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Matches Won', value: '12', icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Win Rate', value: '75%', icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  const recentMatches = [
    { id: 1, home: 'Team Alpha', away: 'Team Beta', score: '3-1', date: '2024-01-15', status: 'Won' },
    { id: 2, home: 'Team Gamma', away: 'Team Alpha', score: '2-2', date: '2024-01-12', status: 'Draw' },
    { id: 3, home: 'Team Alpha', away: 'Team Delta', score: '1-0', date: '2024-01-10', status: 'Won' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Training Session', date: '2024-01-16', time: '18:00', type: 'Training' },
    { id: 2, title: 'Match vs Team Echo', date: '2024-01-18', time: '20:00', type: 'Match' },
    { id: 3, title: 'Team Meeting', date: '2024-01-17', time: '19:00', type: 'Meeting' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your teams.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Quick Actions
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <ResponsiveGrid cols={{ sm: 2, md: 2, lg: 4, xl: 4 }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <ResponsiveCard key={index} hover>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </ResponsiveCard>
          );
        })}
      </ResponsiveGrid>

      {/* Main Content Grid */}
      <ResponsiveGrid cols={{ sm: 1, md: 1, lg: 2, xl: 2 }} gap={{ sm: 6, md: 6, lg: 8 }}>
        {/* Recent Matches */}
        <ResponsiveCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Matches</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </button>
          </div>
          
          <ResponsiveTable headers={['Match', 'Score', 'Date', 'Status']}>
            {recentMatches.map((match) => (
              <tr key={match.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {match.home} vs {match.away}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                  {match.score}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(match.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    match.status === 'Won' 
                      ? 'bg-green-100 text-green-800' 
                      : match.status === 'Draw'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {match.status}
                  </span>
                </td>
              </tr>
            ))}
          </ResponsiveTable>
        </ResponsiveCard>

        {/* Upcoming Events */}
        <ResponsiveCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View Calendar
            </button>
          </div>
          
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  event.type === 'Match' ? 'bg-red-100' :
                  event.type === 'Training' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <Calendar className={`w-4 h-4 ${
                    event.type === 'Match' ? 'text-red-600' :
                    event.type === 'Training' ? 'text-blue-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.type === 'Match' ? 'bg-red-100 text-red-800' :
                  event.type === 'Training' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>

      {/* Performance Chart */}
      <ResponsiveCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          <div className="flex space-x-2">
            <button className="text-sm text-gray-600 hover:text-gray-900">Week</button>
            <button className="text-sm text-gray-600 hover:text-gray-900">Month</button>
            <button className="text-sm text-primary font-medium">Year</button>
          </div>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Performance chart will be displayed here</p>
          </div>
        </div>
      </ResponsiveCard>

      {/* Quick Actions */}
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
        <ResponsiveCard hover onClick={() => console.log('Add Player')}>
          <div className="text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Add Player</h3>
            <p className="text-sm text-gray-600">Register new team member</p>
          </div>
        </ResponsiveCard>
        
        <ResponsiveCard hover onClick={() => console.log('Schedule Match')}>
          <div className="text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Schedule Match</h3>
            <p className="text-sm text-gray-600">Plan upcoming games</p>
          </div>
        </ResponsiveCard>
        
        <ResponsiveCard hover onClick={() => console.log('View Analytics')}>
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-600">Detailed performance data</p>
          </div>
        </ResponsiveCard>
        
        <ResponsiveCard hover onClick={() => console.log('Set Goals')}>
          <div className="text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Set Goals</h3>
            <p className="text-sm text-gray-600">Define team objectives</p>
          </div>
        </ResponsiveCard>
      </ResponsiveGrid>
    </div>
  );
};

export default ResponsiveDashboard; 