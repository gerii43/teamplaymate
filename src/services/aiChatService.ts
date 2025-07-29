import { footballAnalysisService } from './footballAnalysisService';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  context?: any;
  messageType?: 'text' | 'analysis' | 'suggestion' | 'tactical';
}

interface UserContext {
  sport: 'soccer' | 'futsal';
  teamData?: {
    name: string;
    players: any[];
    recentMatches: any[];
  };
  userPreferences?: {
    language: string;
    experience: string;
  };
}

interface AIResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  followUpQuestions?: string[];
}

class AIChatService {
  private fallbackResponses: Record<string, string[]>;

  constructor() {
    this.initializeAI();
    this.fallbackResponses = {
      formation: [
        "For soccer, I recommend a 4-3-3 formation for balanced play. It provides width in attack and stability in defense.",
        "Try a 4-2-3-1 formation if you want more creative freedom in the attacking third while maintaining defensive solidity.",
        "A 3-5-2 formation can be effective if you have strong wing-backs and want to dominate the midfield."
      ],
      training: [
        "Focus on possession-based drills with quick passing combinations. Set up 7v7 games in a reduced space.",
        "Work on defensive transitions - practice winning the ball back within 6 seconds of losing possession.",
        "Small-sided games (4v4) are excellent for improving decision-making under pressure."
      ],
      tactics: [
        "High pressing can be very effective, but make sure your players have the fitness to maintain it for 90 minutes.",
        "Consider using a false 9 to create space for your wingers to cut inside and create chances.",
        "Defensive shape is crucial - maintain compact lines and don't let gaps appear between defense and midfield."
      ],
      futsal: [
        "In futsal, rotation is key. Players should constantly interchange positions to create numerical advantages.",
        "Use the pivot effectively - they should drop deep to receive the ball and create space for teammates.",
        "Quick one-two passes are essential in futsal due to the limited space and time on the ball."
      ]
    };
  }

  private async initializeAI(): Promise<void> {
    try {
      // Initialize connection to AI services
      console.log('AI Chat Service initialized');
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
    }
  }

  async sendMessage(message: string, userContext: UserContext): Promise<AIResponse> {
    try {
      // Try to use OpenAI API if available
      const openAIKey = import.meta.env?.VITE_OPENAI_API_KEY;
      
      if (openAIKey) {
        return await this.callOpenAI(message, userContext, openAIKey);
      } else if (this.isFootballAnalysisQuery(message)) {
        // Use football analysis service for tactical queries
        return await this.handleFootballAnalysis(message, userContext);
      } else {
        // Use intelligent fallback system
        return this.generateIntelligentResponse(message, userContext);
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      return this.generateIntelligentResponse(message, userContext);
    }
  }

  private isFootballAnalysisQuery(message: string): boolean {
    const footballKeywords = ['formation', 'tactic', 'strategy', 'analysis', 'player', 'match', 'team'];
    return footballKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  private async handleFootballAnalysis(message: string, userContext: UserContext): Promise<AIResponse> {
    try {
      // Use football analysis service for enhanced responses
      const analysisResult = await footballAnalysisService.analyzeMatch({
        homeTeam: 'User Team',
        awayTeam: 'Opponent',
        analysisType: 'detailed'
      });

      return {
        content: this.formatFootballAnalysis(analysisResult, message),
        confidence: 85,
        suggestions: ['Ask about formations', 'Request tactical advice'],
        followUpQuestions: ['What formation should I use?', 'How can I improve my defense?']
      };
    } catch (error) {
      return this.generateIntelligentResponse(message, userContext);
    }
  }

  private formatFootballAnalysis(analysis: any, originalMessage: string): string {
    return `Based on tactical analysis:

**Key Insights:**
• ${analysis.insights?.[0] || 'Strong tactical foundation recommended'}
• ${analysis.insights?.[1] || 'Focus on team coordination'}

**Recommendations:**
• ${analysis.recommendations?.[0] || 'Maintain current formation'}
• ${analysis.recommendations?.[1] || 'Improve passing accuracy'}

This analysis is based on current football tactics and your query: "${originalMessage}"`;
  }

  private async callOpenAI(message: string, userContext: UserContext, apiKey: string): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(userContext);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API call failed');
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      confidence: 85,
      suggestions: this.generateSuggestions(message, userContext),
      followUpQuestions: this.generateFollowUpQuestions(message, userContext)
    };
  }

  private generateIntelligentResponse(message: string, userContext: UserContext): AIResponse {
    const lowerMessage = message.toLowerCase();
    const sport = userContext.sport;
    
    let responseCategory = 'general';
    let confidence = 70;

    // Determine response category
    if (lowerMessage.includes('formation') || lowerMessage.includes('lineup')) {
      responseCategory = 'formation';
      confidence = 85;
    } else if (lowerMessage.includes('training') || lowerMessage.includes('drill') || lowerMessage.includes('practice')) {
      responseCategory = 'training';
      confidence = 80;
    } else if (lowerMessage.includes('tactic') || lowerMessage.includes('strategy') || lowerMessage.includes('defend') || lowerMessage.includes('attack')) {
      responseCategory = 'tactics';
      confidence = 82;
    } else if (sport === 'futsal' && (lowerMessage.includes('futsal') || lowerMessage.includes('indoor'))) {
      responseCategory = 'futsal';
      confidence = 88;
    }

    // Get base response
    let content = this.getRandomResponse(responseCategory);
    
    // Personalize based on context
    content = this.personalizeResponse(content, userContext, message);

    return {
      content,
      confidence,
      suggestions: this.generateSuggestions(message, userContext),
      followUpQuestions: this.generateFollowUpQuestions(message, userContext)
    };
  }

  private buildSystemPrompt(userContext: UserContext): string {
    const sportSpecific = userContext.sport === 'soccer' 
      ? "You are an expert soccer/football coach with 20+ years of experience."
      : "You are an expert futsal coach specializing in indoor football tactics.";

    return `${sportSpecific}

User Context:
- Sport: ${userContext.sport}
- Team: ${userContext.teamData?.name || 'Unknown'}
- Players: ${userContext.teamData?.players?.length || 'Unknown'} players
- Language: ${userContext.userPreferences?.language || 'Spanish'}

Instructions:
- Provide practical, actionable advice
- Keep responses under 200 words
- Be encouraging and supportive
- Use specific examples when possible
- Adapt advice to ${userContext.sport} specifically
- Respond in a conversational, human-like manner`;
  }

  private getRandomResponse(category: string): string {
    const responses = this.fallbackResponses[category] || this.fallbackResponses.tactics;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  private personalizeResponse(content: string, userContext: UserContext, originalMessage: string): string {
    // Add sport-specific context
    if (userContext.sport === 'futsal' && !content.includes('futsal')) {
      content = content.replace('soccer', 'futsal').replace('football', 'futsal');
    }

    // Add team context if available
    if (userContext.teamData?.name) {
      content = `For ${userContext.teamData.name}, ${content.toLowerCase()}`;
    }

    // Add encouraging elements
    const encouragements = [
      "Keep working hard and you'll see improvement!",
      "Remember, consistency in training leads to success.",
      "Every great team started with good fundamentals.",
      "Trust the process and stay focused on your goals."
    ];

    if (Math.random() > 0.7) {
      content += ` ${encouragements[Math.floor(Math.random() * encouragements.length)]}`;
    }

    return content;
  }

  private generateSuggestions(message: string, userContext: UserContext): string[] {
    const suggestions = [];
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('formation')) {
      suggestions.push("Analyze our current formation");
      suggestions.push("Suggest counter-formations");
    } else if (lowerMessage.includes('training')) {
      suggestions.push("Create a training plan");
      suggestions.push("Suggest specific drills");
    } else {
      suggestions.push("Analyze team performance");
      suggestions.push("Suggest tactical improvements");
    }

    return suggestions;
  }

  private generateFollowUpQuestions(message: string, userContext: UserContext): string[] {
    const questions = [];
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('formation')) {
      questions.push("What's your team's biggest weakness?");
      questions.push("Do you prefer attacking or defensive play?");
    } else if (lowerMessage.includes('training')) {
      questions.push("How many training sessions per week?");
      questions.push("What's your players' fitness level?");
    } else {
      questions.push("What's your next match situation?");
      questions.push("Any specific areas you want to improve?");
    }

    return questions;
  }

  // Method to save conversation history
  async saveConversation(messages: ChatMessage[], userId: string): Promise<void> {
    try {
      const conversationData = {
        userId,
        messages,
        timestamp: new Date().toISOString(),
        sport: 'soccer' // This should come from user context
      };

      // Save to localStorage for now, implement API call later
      const existingConversations = JSON.parse(localStorage.getItem('chat_history') || '[]');
      existingConversations.push(conversationData);
      
      // Keep only last 10 conversations
      if (existingConversations.length > 10) {
        existingConversations.splice(0, existingConversations.length - 10);
      }
      
      localStorage.setItem('chat_history', JSON.stringify(existingConversations));
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  // Method to load conversation history
  async loadConversationHistory(userId: string): Promise<ChatMessage[][]> {
    try {
      const conversations = JSON.parse(localStorage.getItem('chat_history') || '[]');
      return conversations
        .filter((conv: any) => conv.userId === userId)
        .map((conv: any) => conv.messages);
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      return [];
    }
  }

  // Method to get conversation analytics
  getConversationAnalytics(messages: ChatMessage[]): {
    totalMessages: number;
    userMessages: number;
    botMessages: number;
    averageResponseTime: number;
    topTopics: string[];
  } {
    const userMessages = messages.filter(m => m.type === 'user');
    const botMessages = messages.filter(m => m.type === 'bot');
    
    // Simple topic extraction
    const topics = userMessages
      .map(m => m.content.toLowerCase())
      .join(' ')
      .split(' ')
      .filter(word => ['formation', 'training', 'tactics', 'defense', 'attack', 'futsal', 'soccer'].includes(word));
    
    const topTopics = [...new Set(topics)].slice(0, 3);

    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      averageResponseTime: 1.5, // Mock value
      topTopics
    };
  }
}

export const aiChatService = new AIChatService();
export type { ChatMessage, UserContext, AIResponse };