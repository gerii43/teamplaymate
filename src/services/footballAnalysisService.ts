import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface MatchAnalysisRequest {
  matchId?: string;
  homeTeam: string;
  awayTeam: string;
  date?: string;
  league?: string;
  analysisType: 'basic' | 'detailed' | 'expert';
}

export interface PlayerStatsRequest {
  playerName: string;
  season?: string;
  league?: string;
  position?: string;
  comparisonPlayers?: string[];
}

export interface TacticalAnalysisRequest {
  matchId: string;
  focusAreas: string[];
  depth: 'overview' | 'detailed' | 'expert';
}

export interface PredictionRequest {
  homeTeam: string;
  awayTeam: string;
  venue: 'home' | 'away' | 'neutral';
  historicalData: boolean;
  formAnalysis: boolean;
}

class FootballAnalysisService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.VITE_FOOTBALL_API_KEY || 'demo-key';
    this.baseUrl = process.env.VITE_FOOTBALL_API_URL || 'https://api.football-data.org/v4';
  }

  async analyzeMatch(request: MatchAnalysisRequest) {
    try {
      // In production, this would call real football APIs
      const response = await fetch(`${this.baseUrl}/matches/${request.matchId || 'latest'}`, {
        headers: {
          'X-Auth-Token': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Fallback to mock data for demo
        return this.generateMockMatchAnalysis(request);
      }

      const data = await response.json();
      return this.processMatchData(data, request.analysisType);
    } catch (error) {
      console.error('Match analysis error:', error);
      return this.generateMockMatchAnalysis(request);
    }
  }

  async getPlayerStats(request: PlayerStatsRequest) {
    try {
      // Mock implementation - in production, integrate with real APIs
      return this.generateMockPlayerStats(request);
    } catch (error) {
      console.error('Player stats error:', error);
      throw error;
    }
  }

  async getTacticalAnalysis(request: TacticalAnalysisRequest) {
    try {
      return this.generateMockTacticalAnalysis(request);
    } catch (error) {
      console.error('Tactical analysis error:', error);
      throw error;
    }
  }

  async getPredictions(request: PredictionRequest) {
    try {
      return this.generateMockPredictions(request);
    } catch (error) {
      console.error('Predictions error:', error);
      throw error;
    }
  }

  async getLeagueStandings(league: string, season?: string) {
    try {
      const response = await fetch(`${this.baseUrl}/competitions/${league}/standings`, {
        headers: {
          'X-Auth-Token': this.apiKey
        }
      });

      if (!response.ok) {
        return this.generateMockStandings(league);
      }

      return await response.json();
    } catch (error) {
      console.error('League standings error:', error);
      return this.generateMockStandings(league);
    }
  }

  async searchPlayers(query: string, filters?: any) {
    try {
      // Mock search implementation
      return this.generateMockPlayerSearch(query, filters);
    } catch (error) {
      console.error('Player search error:', error);
      throw error;
    }
  }

  async getHistoricalData(teamA: string, teamB: string, limit: number = 10) {
    try {
      return this.generateMockHistoricalData(teamA, teamB, limit);
    } catch (error) {
      console.error('Historical data error:', error);
      throw error;
    }
  }

  // Mock data generators for demo purposes
  private generateMockMatchAnalysis(request: MatchAnalysisRequest) {
    return {
      matchId: 'MATCH_' + Date.now(),
      teams: {
        home: request.homeTeam,
        away: request.awayTeam
      },
      score: {
        home: Math.floor(Math.random() * 4),
        away: Math.floor(Math.random() * 4)
      },
      date: request.date || new Date().toISOString().split('T')[0],
      league: request.league || 'Premier League',
      statistics: {
        possession: {
          home: Math.floor(Math.random() * 40) + 30,
          away: Math.floor(Math.random() * 40) + 30
        },
        shots: {
          home: Math.floor(Math.random() * 15) + 5,
          away: Math.floor(Math.random() * 15) + 5
        },
        shotsOnTarget: {
          home: Math.floor(Math.random() * 8) + 2,
          away: Math.floor(Math.random() * 8) + 2
        },
        corners: {
          home: Math.floor(Math.random() * 10) + 2,
          away: Math.floor(Math.random() * 10) + 2
        },
        fouls: {
          home: Math.floor(Math.random() * 15) + 5,
          away: Math.floor(Math.random() * 15) + 5
        },
        cards: {
          home: { yellow: Math.floor(Math.random() * 5), red: Math.floor(Math.random() * 2) },
          away: { yellow: Math.floor(Math.random() * 5), red: Math.floor(Math.random() * 2) }
        }
      },
      playerStats: this.generateMockPlayerStats({ playerName: 'Multiple Players' }),
      tacticalAnalysis: this.generateMockTacticalAnalysis({ matchId: 'MATCH_' + Date.now(), focusAreas: [], depth: 'detailed' }),
      predictions: this.generateMockPredictions({ homeTeam: request.homeTeam, awayTeam: request.awayTeam, venue: 'home', historicalData: true, formAnalysis: true }),
      confidence: Math.floor(Math.random() * 30) + 70,
      analysisDepth: request.analysisType
    };
  }

  private generateMockPlayerStats(request: PlayerStatsRequest) {
    const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
    const teams = ['Real Madrid', 'Barcelona', 'Manchester City', 'Liverpool', 'PSG', 'Bayern Munich'];
    
    return Array.from({ length: 5 }, (_, i) => ({
      name: request.playerName === 'Multiple Players' ? `Player ${i + 1}` : request.playerName,
      team: teams[Math.floor(Math.random() * teams.length)],
      position: request.position || positions[Math.floor(Math.random() * positions.length)],
      rating: +(Math.random() * 3 + 6).toFixed(1),
      goals: Math.floor(Math.random() * 25),
      assists: Math.floor(Math.random() * 15),
      passes: Math.floor(Math.random() * 50) + 20,
      passAccuracy: Math.floor(Math.random() * 30) + 70,
      tackles: Math.floor(Math.random() * 10),
      interceptions: Math.floor(Math.random() * 8),
      minutesPlayed: Math.floor(Math.random() * 2000) + 500,
      appearances: Math.floor(Math.random() * 30) + 10,
      yellowCards: Math.floor(Math.random() * 8),
      redCards: Math.floor(Math.random() * 2),
      cleanSheets: Math.floor(Math.random() * 15),
      saves: Math.floor(Math.random() * 50)
    }));
  }

  private generateMockTacticalAnalysis(request: TacticalAnalysisRequest) {
    return {
      formation: {
        home: ['4-3-3', '4-2-3-1', '3-5-2', '4-4-2'][Math.floor(Math.random() * 4)],
        away: ['4-3-3', '4-2-3-1', '3-5-2', '4-4-2'][Math.floor(Math.random() * 4)]
      },
      keyMoments: [
        {
          minute: 23,
          type: 'goal' as const,
          description: 'Clinical finish from close range',
          impact: 'high' as const
        },
        {
          minute: 45,
          type: 'tactical_change' as const,
          description: 'Formation change to 4-2-3-1',
          impact: 'medium' as const
        },
        {
          minute: 67,
          type: 'substitution' as const,
          description: 'Fresh legs in midfield',
          impact: 'medium' as const
        }
      ],
      strengths: {
        home: ['Strong midfield control', 'Effective pressing', 'Clinical finishing'],
        away: ['Solid defensive structure', 'Quick counter-attacks', 'Set piece threat']
      },
      weaknesses: {
        home: ['Vulnerable on flanks', 'Poor aerial defense'],
        away: ['Lack of creativity', 'Slow build-up play']
      },
      recommendations: [
        'Exploit wide areas more effectively',
        'Improve defensive transitions',
        'Better utilization of set pieces',
        'Increase tempo in final third'
      ],
      heatMaps: {
        home: 'Mock heat map data for home team',
        away: 'Mock heat map data for away team'
      },
      passNetworks: {
        home: 'Mock pass network data for home team',
        away: 'Mock pass network data for away team'
      }
    };
  }

  private generateMockPredictions(request: PredictionRequest) {
    return [
      {
        type: 'match_result' as const,
        confidence: Math.floor(Math.random() * 30) + 60,
        description: `${request.homeTeam} likely to win based on current form and home advantage`,
        factors: ['Home advantage', 'Better recent form', 'Head-to-head record', 'Key player availability'],
        probability: {
          homeWin: Math.floor(Math.random() * 40) + 30,
          draw: Math.floor(Math.random() * 30) + 20,
          awayWin: Math.floor(Math.random() * 40) + 20
        }
      },
      {
        type: 'goals' as const,
        confidence: Math.floor(Math.random() * 25) + 65,
        description: 'Expecting a high-scoring match with over 2.5 goals',
        factors: ['Both teams\' attacking form', 'Defensive vulnerabilities', 'Historical goal average'],
        prediction: {
          totalGoals: +(Math.random() * 2 + 2).toFixed(1),
          homeGoals: +(Math.random() * 2 + 1).toFixed(1),
          awayGoals: +(Math.random() * 2 + 1).toFixed(1)
        }
      },
      {
        type: 'player_performance' as const,
        confidence: Math.floor(Math.random() * 20) + 70,
        description: 'Key players likely to have significant impact',
        factors: ['Recent form', 'Historical performance', 'Opposition weaknesses'],
        players: [
          { name: 'Star Player 1', likelihood: 'High chance of scoring' },
          { name: 'Star Player 2', likelihood: 'Likely to provide assists' }
        ]
      }
    ];
  }

  private generateMockStandings(league: string) {
    const teams = [
      'Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Manchester United',
      'Newcastle', 'Brighton', 'Tottenham', 'Aston Villa', 'West Ham'
    ];

    return {
      league,
      season: '2023/24',
      standings: teams.map((team, index) => ({
        position: index + 1,
        team,
        played: Math.floor(Math.random() * 10) + 20,
        won: Math.floor(Math.random() * 15) + 10,
        drawn: Math.floor(Math.random() * 8) + 2,
        lost: Math.floor(Math.random() * 10) + 2,
        goalsFor: Math.floor(Math.random() * 30) + 30,
        goalsAgainst: Math.floor(Math.random() * 25) + 15,
        goalDifference: Math.floor(Math.random() * 20) + 5,
        points: Math.floor(Math.random() * 20) + 40 + (10 - index) * 3
      }))
    };
  }

  private generateMockPlayerSearch(query: string, filters?: any) {
    const mockPlayers = [
      'Lionel Messi', 'Cristiano Ronaldo', 'Kylian Mbappé', 'Erling Haaland',
      'Kevin De Bruyne', 'Mohamed Salah', 'Sadio Mané', 'Virgil van Dijk',
      'Luka Modrić', 'Karim Benzema', 'Robert Lewandowski', 'Neymar Jr.'
    ];

    return mockPlayers
      .filter(player => player.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10)
      .map(player => ({
        name: player,
        team: ['Real Madrid', 'Barcelona', 'PSG', 'Manchester City'][Math.floor(Math.random() * 4)],
        position: ['Forward', 'Midfielder', 'Defender'][Math.floor(Math.random() * 3)],
        age: Math.floor(Math.random() * 15) + 20,
        nationality: ['Argentina', 'Brazil', 'France', 'Spain'][Math.floor(Math.random() * 4)],
        marketValue: Math.floor(Math.random() * 100) + 20 + 'M€'
      }));
  }

  private generateMockHistoricalData(teamA: string, teamB: string, limit: number) {
    return Array.from({ length: limit }, (_, i) => ({
      date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      homeTeam: Math.random() > 0.5 ? teamA : teamB,
      awayTeam: Math.random() > 0.5 ? teamA : teamB,
      score: {
        home: Math.floor(Math.random() * 4),
        away: Math.floor(Math.random() * 4)
      },
      competition: ['Premier League', 'Champions League', 'FA Cup'][Math.floor(Math.random() * 3)],
      venue: 'Stadium Name',
      attendance: Math.floor(Math.random() * 50000) + 30000
    }));
  }

  // Data processing methods
  private processMatchData(rawData: any, analysisType: string) {
    // Process and enhance raw match data based on analysis type
    return {
      ...rawData,
      enhancedStats: this.calculateAdvancedStats(rawData),
      insights: this.generateInsights(rawData, analysisType),
      recommendations: this.generateRecommendations(rawData)
    };
  }

  private calculateAdvancedStats(matchData: any) {
    // Calculate advanced statistics like xG, pass completion rates, etc.
    return {
      expectedGoals: {
        home: +(Math.random() * 2 + 0.5).toFixed(2),
        away: +(Math.random() * 2 + 0.5).toFixed(2)
      },
      passCompletionRate: {
        home: Math.floor(Math.random() * 20) + 75,
        away: Math.floor(Math.random() * 20) + 75
      },
      pressureIntensity: {
        home: Math.floor(Math.random() * 30) + 60,
        away: Math.floor(Math.random() * 30) + 60
      }
    };
  }

  private generateInsights(matchData: any, analysisType: string) {
    const insights = [
      'Home team dominated possession in the first half',
      'Away team created better scoring opportunities',
      'Defensive mistakes led to crucial goals',
      'Midfield battle was key to the outcome'
    ];

    return analysisType === 'expert' 
      ? insights.concat(['Advanced tactical adjustments were effective', 'Set piece execution was decisive'])
      : insights.slice(0, analysisType === 'detailed' ? 3 : 2);
  }

  private generateRecommendations(matchData: any) {
    return [
      'Focus on defensive transitions',
      'Improve final third decision making',
      'Enhance set piece delivery',
      'Better utilization of wing play'
    ];
  }

  // Export functionality
  async exportAnalysis(data: any, format: 'pdf' | 'excel' | 'json') {
    try {
      // Mock export functionality
      const exportData = {
        ...data,
        exportedAt: new Date().toISOString(),
        format
      };

      // In production, this would generate actual files
      return {
        success: true,
        downloadUrl: `https://api.statsor.com/exports/${Date.now()}.${format}`,
        data: exportData
      };
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  // User preferences management
  async saveUserPreferences(userId: string, preferences: any) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Save preferences error:', error);
      throw error;
    }
  }

  async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preferences')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data?.preferences || {};
    } catch (error) {
      console.error('Get preferences error:', error);
      return {};
    }
  }
}

export const footballAnalysisService = new FootballAnalysisService();