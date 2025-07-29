import axios from 'axios';

class EnhancedAIService {
  constructor() {
    this.providers = {
      deepseek: {
        url: 'https://api.deepseek.com/v1/chat/completions',
        apiKey: process.env.DEEPSEEK_API_KEY,
        model: 'deepseek-chat'
      },
      openrouter: {
        url: 'https://openrouter.ai/api/v1/chat/completions',
        apiKey: process.env.OPENROUTER_API_KEY,
        model: 'deepseek/deepseek-chat'
      },
      groq: {
        url: 'https://api.groq.com/openai/v1/chat/completions',
        apiKey: process.env.GROQ_API_KEY,
        model: 'mixtral-8x7b-32768'
      }
    };
    
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async chat(userId, message, context = {}) {
    try {
      // Check cache first
      const cacheKey = `${userId}:${message}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('✅ Cache hit for AI response');
        return cached.response;
      }

      // Get user context from database
      const userContext = await this.getUserContext(userId);
      
      // Build enhanced prompt
      const enhancedPrompt = this.buildPrompt(message, userContext, context);
      
      // Try providers in order with fallback
      let response = null;
      const providers = ['deepseek', 'openrouter', 'groq'];
      
      for (const provider of providers) {
        try {
          response = await this.callProvider(provider, enhancedPrompt);
          console.log(`✅ AI response from ${provider}`);
          break;
        } catch (error) {
          console.warn(`⚠️ ${provider} failed, trying next provider:`, error.message);
          continue;
        }
      }

      if (!response) {
        throw new Error('All AI providers failed');
      }

      // Cache the response
      this.cache.set(cacheKey, {
        response: response,
        timestamp: Date.now()
      });

      // Save conversation to database
      await this.saveConversation(userId, message, response, context);

      return response;

    } catch (error) {
      console.error('❌ AI chat error:', error);
      
      // Return fallback response
      return this.getFallbackResponse(message, context);
    }
  }

  async callProvider(providerName, prompt) {
    const provider = this.providers[providerName];
    
    if (!provider.apiKey) {
      throw new Error(`${providerName} API key not configured`);
    }

    const response = await axios.post(provider.url, {
      model: provider.model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional football/soccer coach assistant. Provide tactical advice, training suggestions, and match analysis. Keep responses concise and actionable.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    return response.data.choices[0].message.content;
  }

  buildPrompt(message, userContext, additionalContext) {
    let prompt = `User Question: ${message}\n\n`;
    
    if (userContext.sport) {
      prompt += `Sport: ${userContext.sport}\n`;
    }
    
    if (userContext.teams && userContext.teams.length > 0) {
      prompt += `Teams: ${userContext.teams.map(t => t.name).join(', ')}\n`;
    }
    
    if (userContext.recentMatches && userContext.recentMatches.length > 0) {
      prompt += `Recent Matches: ${userContext.recentMatches.length} matches\n`;
    }
    
    if (additionalContext.matchData) {
      prompt += `Current Match Context: ${JSON.stringify(additionalContext.matchData)}\n`;
    }
    
    prompt += '\nPlease provide a helpful, tactical response based on this context.';
    
    return prompt;
  }

  async getUserContext(userId) {
    try {
      // Get user data from Supabase
      const { data: user } = await supabase
        .from('users')
        .select('sport, name')
        .eq('id', userId)
        .single();

      // Get user's teams
      const { data: teams } = await supabase
        .from('teams')
        .select('id, name, sport')
        .eq('coach_id', userId);

      // Get recent matches
      const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .or(`home_team_id.in.(${teams?.map(t => t.id).join(',')}),away_team_id.in.(${teams?.map(t => t.id).join(',')})`)
        .order('date', { ascending: false })
        .limit(5);

      return {
        sport: user?.sport || 'soccer',
        teams: teams || [],
        recentMatches: matches || []
      };

    } catch (error) {
      console.error('Error getting user context:', error);
      return { sport: 'soccer', teams: [], recentMatches: [] };
    }
  }

  async saveConversation(userId, message, response, context) {
    try {
      await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          message: message,
          response: response,
          context: context,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  getFallbackResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('formation')) {
      return "For soccer, I recommend a 4-3-3 formation for balanced play. It provides good width in attack and stability in defense. For futsal, try a 2-2 formation with constant rotation.";
    }
    
    if (lowerMessage.includes('training')) {
      return "Focus on possession-based drills with quick passing. Set up small-sided games (7v7 for soccer, 3v3 for futsal) to improve decision-making under pressure.";
    }
    
    if (lowerMessage.includes('tactic')) {
      return "Key tactical principles: maintain team shape, press as a unit, and transition quickly between attack and defense. Adapt your approach based on the opponent's weaknesses.";
    }
    
    return "I'm here to help with football tactics and strategy! Ask me about formations, training drills, match analysis, or tactical advice.";
  }

  // Analyze sentiment for feedback processing
  async analyzeSentiment(text) {
    try {
      // Simple keyword-based sentiment analysis
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'awesome'];
      const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'broken', 'useless'];
      
      const words = text.toLowerCase().split(/\s+/);
      const positiveCount = words.filter(word => positiveWords.includes(word)).length;
      const negativeCount = words.filter(word => negativeWords.includes(word)).length;
      
      const score = (positiveCount - negativeCount) / Math.max(words.length, 1);
      
      return {
        score: score,
        label: score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral',
        confidence: Math.min(Math.abs(score) * 2, 1)
      };
      
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return { score: 0, label: 'neutral', confidence: 0 };
    }
  }

  // Clear cache periodically
  clearCache() {
    this.cache.clear();
    console.log('✅ AI response cache cleared');
  }
}

export default new EnhancedAIService();