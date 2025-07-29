import axios from 'axios';
import { config } from '../config/config';
import { DatabaseService } from './database.service';
import { logger } from '../utils/logger';

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  context: any;
  timestamp: Date;
}

export interface UserContext {
  id: string;
  name: string;
  sport: 'soccer' | 'futsal';
  teams: any[];
  players: any[];
  matches: any[];
  statistics: any;
  preferences: any;
}

export class ChatbotService {
  private databaseService: DatabaseService;
  private deepseekClient: any;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async initialize(): Promise<void> {
    try {
      // Initialize DeepSeek client
      this.deepseekClient = axios.create({
        baseURL: config.deepseek.baseUrl,
        headers: {
          'Authorization': `Bearer ${config.deepseek.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info('Chatbot service initialized with DeepSeek');
    } catch (error) {
      logger.error('Failed to initialize chatbot service:', error);
      throw error;
    }
  }

  async processMessage(userId: string, message: string): Promise<string> {
    try {
      // Get user context
      const userContext = await this.getUserContext(userId);
      
      // Analyze message intent
      const intent = await this.analyzeIntent(message, userContext);
      
      // Generate contextual response
      const response = await this.generateResponse(message, userContext, intent);
      
      // Save conversation
      await this.saveConversation(userId, message, response, userContext);
      
      return response;
    } catch (error) {
      logger.error('Error processing chatbot message:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }
  }

  private async getUserContext(userId: string): Promise<UserContext> {
    try {
      const user = await this.databaseService.getUserById(userId);
      const teams = await this.databaseService.getUserTeams(userId);
      const players = await this.databaseService.getUserPlayers(userId);
      const matches = await this.databaseService.getUserMatches(userId);
      const statistics = await this.databaseService.getUserStatistics(userId);

      return {
        id: user.id,
        name: user.name,
        sport: user.sport || 'soccer',
        teams,
        players,
        matches,
        statistics,
        preferences: user.preferences || {}
      };
    } catch (error) {
      logger.error('Error getting user context:', error);
      throw error;
    }
  }

  private async analyzeIntent(message: string, context: UserContext): Promise<string> {
    const lowerMessage = message.toLowerCase();
    
    // Match analysis
    if (lowerMessage.includes('match') || lowerMessage.includes('game') || lowerMessage.includes('partido')) {
      if (lowerMessage.includes('last') || lowerMessage.includes('recent') || lowerMessage.includes('último')) {
        return 'recent_matches';
      }
      if (lowerMessage.includes('next') || lowerMessage.includes('upcoming') || lowerMessage.includes('próximo')) {
        return 'upcoming_matches';
      }
      return 'match_general';
    }

    // Player analysis
    if (lowerMessage.includes('player') || lowerMessage.includes('best') || lowerMessage.includes('jugador') || lowerMessage.includes('mejor')) {
      if (lowerMessage.includes('best') || lowerMessage.includes('top') || lowerMessage.includes('mejor')) {
        return 'best_players';
      }
      return 'player_analysis';
    }

    // Performance and suggestions
    if (lowerMessage.includes('suggest') || lowerMessage.includes('improve') || lowerMessage.includes('recommendation') || 
        lowerMessage.includes('sugerir') || lowerMessage.includes('mejorar') || lowerMessage.includes('recomendación')) {
      return 'performance_suggestions';
    }

    // Statistics
    if (lowerMessage.includes('stat') || lowerMessage.includes('number') || lowerMessage.includes('estadística')) {
      return 'statistics';
    }

    // Tactical advice
    if (lowerMessage.includes('tactic') || lowerMessage.includes('formation') || lowerMessage.includes('strategy') ||
        lowerMessage.includes('táctica') || lowerMessage.includes('formación') || lowerMessage.includes('estrategia')) {
      return 'tactical_advice';
    }

    return 'general';
  }

  private async generateResponse(message: string, context: UserContext, intent: string): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(context, intent);
      const userPrompt = this.buildUserPrompt(message, context, intent);

      const response = await this.deepseekClient.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error('Error generating AI response:', error);
      return this.getFallbackResponse(intent, context);
    }
  }

  private buildSystemPrompt(context: UserContext, intent: string): string {
    return `You are a professional ${context.sport} coach assistant for ${context.name}. 
    
    User Context:
    - Name: ${context.name}
    - Sport: ${context.sport}
    - Teams: ${context.teams.length}
    - Players: ${context.players.length}
    - Recent matches: ${context.matches.slice(0, 5).length}
    
    Instructions:
    - Provide natural, conversational responses
    - Use specific data from the user's context when available
    - Offer actionable insights and suggestions
    - Be encouraging and professional
    - Respond in a mix of English and Spanish when appropriate
    - Focus on ${context.sport}-specific advice
    - Avoid robotic or template-like responses
    
    Intent: ${intent}`;
  }

  private buildUserPrompt(message: string, context: UserContext, intent: string): string {
    let prompt = `User message: "${message}"\n\n`;

    switch (intent) {
      case 'recent_matches':
        prompt += `Recent matches data: ${JSON.stringify(context.matches.slice(0, 3))}`;
        break;
      case 'best_players':
        prompt += `Players data: ${JSON.stringify(context.players)}`;
        break;
      case 'performance_suggestions':
        prompt += `Team statistics: ${JSON.stringify(context.statistics)}`;
        break;
      case 'statistics':
        prompt += `Full statistics: ${JSON.stringify(context.statistics)}`;
        break;
    }

    return prompt;
  }

  private getFallbackResponse(intent: string, context: UserContext): string {
    const responses = {
      recent_matches: `Based on your recent matches, I can see you've been active! Let me analyze your team's performance and provide some insights.`,
      best_players: `Looking at your squad, you have some talented players. Let me highlight the top performers for you.`,
      performance_suggestions: `I'd be happy to help improve your team's performance. Based on your ${context.sport} style, here are some suggestions.`,
      statistics: `Your team statistics show interesting patterns. Let me break down the key metrics for you.`,
      tactical_advice: `For ${context.sport}, I can provide tactical insights based on your team's playing style.`,
      general: `I'm here to help you with your ${context.sport} team management. Feel free to ask about matches, players, tactics, or performance analysis!`
    };

    return responses[intent as keyof typeof responses] || responses.general;
  }

  private async saveConversation(userId: string, message: string, response: string, context: any): Promise<void> {
    try {
      await this.databaseService.saveChatMessage({
        id: require('uuid').v4(),
        userId,
        message,
        response,
        context,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error saving conversation:', error);
    }
  }
}