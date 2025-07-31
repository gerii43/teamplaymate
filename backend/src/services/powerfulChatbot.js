import axios from 'axios';
import { supabase } from '../config/supabase.js';

class PowerfulChatbot {
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
        model: 'anthropic/claude-3.5-sonnet'
      },
      groq: {
        url: 'https://api.groq.com/openai/v1/chat/completions',
        apiKey: process.env.GROQ_API_KEY,
        model: 'llama3-70b-8192'
      }
    };
    
    this.conversationHistory = new Map();
  }

  async chat(userId, message, context = {}) {
    try {
      console.log(`🤖 Processing chat for user ${userId}: "${message}"`);

      // Get comprehensive user context
      const userContext = await this.getComprehensiveUserContext(userId);
      
      // Check if user is asking for internet search
      if (this.needsInternetSearch(message)) {
        const searchResults = await this.performInternetSearch(message);
        context.searchResults = searchResults;
      }

      // Build enhanced, human-like prompt
      const enhancedPrompt = this.buildHumanLikePrompt(message, userContext, context);
      
      // Get AI response with personality
      const response = await this.getAIResponseWithPersonality(enhancedPrompt, userId);
      
      // Save conversation for context
      await this.saveConversationContext(userId, message, response, context);
      
      // Save to database
      await this.saveConversation(userId, message, response, context);

      return response;

    } catch (error) {
      console.error('❌ AI chat error:', error);
      return this.getHumanFallbackResponse(message, context);
    }
  }

  async getComprehensiveUserContext(userId) {
    try {
      // Get user profile
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      // Get user's teams
      const { data: teams } = await supabase
        .from('teams')
        .select(`
          *,
          players(*)
        `)
        .eq('coach_id', userId);

      // Get recent matches
      const { data: recentMatches } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(name),
          away_team:teams!matches_away_team_id_fkey(name)
        `)
        .or(`home_team_id.in.(${teams?.map(t => t.id).join(',')}),away_team_id.in.(${teams?.map(t => t.id).join(',')})`)
        .order('date', { ascending: false })
        .limit(10);

      // Get today's attendance
      const today = new Date().toISOString().split('T')[0];
      const { data: todayAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', today)
        .in('player_id', teams?.flatMap(t => t.players?.map(p => p.id) || []) || []);

      // Get upcoming events
      const { data: upcomingEvents } = await supabase
        .from('matches')
        .select('*')
        .gte('date', new Date().toISOString())
        .or(`home_team_id.in.(${teams?.map(t => t.id).join(',')}),away_team_id.in.(${teams?.map(t => t.id).join(',')})`)
        .order('date', { ascending: true })
        .limit(5);

      return {
        user: user || {},
        teams: teams || [],
        recentMatches: recentMatches || [],
        todayAttendance: todayAttendance || [],
        upcomingEvents: upcomingEvents || [],
        currentDate: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error getting user context:', error);
      return { user: {}, teams: [], recentMatches: [], todayAttendance: [], upcomingEvents: [] };
    }
  }

  needsInternetSearch(message) {
    const searchKeywords = [
      'latest', 'news', 'update', 'recent', 'today', 'current', 'live', 'score',
      'transfer', 'injury', 'suspension', 'weather', 'forecast', 'statistics',
      'rankings', 'league table', 'championship', 'cup', 'tournament'
    ];
    
    const lowerMessage = message.toLowerCase();
    return searchKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  async performInternetSearch(query) {
    try {
      // Use DuckDuckGo API for search
      const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
      
      const response = await axios.get(searchUrl, {
        timeout: 5000
      });

      return {
        query: query,
        results: response.data?.AbstractText || 'No search results found',
        source: 'DuckDuckGo'
      };

    } catch (error) {
      console.warn('Search failed, continuing without search results:', error);
      return { query: query, results: 'Search temporarily unavailable', source: 'none' };
    }
  }

  buildHumanLikePrompt(message, userContext, additionalContext) {
    const userName = userContext.user?.name || 'Coach';
    const userSport = userContext.user?.sport_preference || 'soccer';
    const currentTime = new Date().toLocaleTimeString();
    const currentDate = new Date().toLocaleDateString();

    let prompt = `You are Alex, a friendly and knowledgeable football coach assistant. You're having a casual conversation with ${userName}, who coaches ${userSport}. 

Current time: ${currentTime} on ${currentDate}

Your personality:
- Be warm, encouraging, and supportive like a trusted friend
- Use casual, conversational language (avoid robotic responses)
- Show genuine interest in their teams and players
- Give practical, actionable advice
- Use emojis occasionally to be more engaging
- Reference their specific data when relevant
- Be enthusiastic about football and coaching

User's current situation:
- Name: ${userName}
- Sport: ${userSport}
- Teams: ${userContext.teams.map(t => t.name).join(', ') || 'No teams yet'}
- Recent matches: ${userContext.recentMatches.length} matches
- Today's attendance: ${userContext.todayAttendance.length} players present
- Upcoming events: ${userContext.upcomingEvents.length} scheduled

User's question: "${message}"

Please respond in a natural, conversational way. If they're asking about their data, provide specific insights. If they need advice, be encouraging and practical.`;

    // Add specific context based on what they're asking about
    if (message.toLowerCase().includes('attendance') || message.toLowerCase().includes('present')) {
      prompt += `\n\nToday's attendance data: ${JSON.stringify(userContext.todayAttendance)}`;
    }

    if (message.toLowerCase().includes('match') || message.toLowerCase().includes('game')) {
      prompt += `\n\nRecent matches: ${JSON.stringify(userContext.recentMatches.slice(0, 3))}`;
    }

    if (message.toLowerCase().includes('team') || message.toLowerCase().includes('player')) {
      prompt += `\n\nTeams and players: ${JSON.stringify(userContext.teams)}`;
    }

    if (message.toLowerCase().includes('upcoming') || message.toLowerCase().includes('next')) {
      prompt += `\n\nUpcoming events: ${JSON.stringify(userContext.upcomingEvents)}`;
    }

    if (additionalContext.searchResults) {
      prompt += `\n\nInternet search results: ${JSON.stringify(additionalContext.searchResults)}`;
    }

    return prompt;
  }

  async getAIResponseWithPersonality(prompt, userId) {
    // Try providers in order with fallback
    const providers = ['deepseek', 'openrouter', 'groq'];
    
    for (const provider of providers) {
      try {
        const response = await this.callProvider(provider, prompt);
        console.log(`✅ AI response from ${provider}`);
        return this.addPersonalityTouches(response, userId);
      } catch (error) {
        console.warn(`⚠️ ${provider} failed, trying next provider:`, error.message);
        continue;
      }
    }

    throw new Error('All AI providers failed');
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
          content: 'You are Alex, a friendly football coach assistant. Be conversational, encouraging, and practical. Use emojis occasionally and reference specific user data when relevant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    return response.data.choices[0].message.content;
  }

  addPersonalityTouches(response, userId) {
    let enhancedResponse = response;
    
    const encouragements = [
      'You\'re doing great!', 
      'Keep up the excellent work!', 
      'You\'ve got this!', 
      'That\'s the spirit!'
    ];
    
    const hour = new Date().getHours();
    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Good morning! ';
    else if (hour < 17) timeGreeting = 'Good afternoon! ';
    else timeGreeting = 'Good evening! ';
    
    if (Math.random() < 0.3) {
      enhancedResponse = `${timeGreeting}${enhancedResponse}`;
    }
    
    if (Math.random() < 0.2) {
      enhancedResponse += ` ${encouragements[Math.floor(Math.random() * encouragements.length)]}`;
    }
    
    return enhancedResponse;
  }

  async saveConversationContext(userId, message, response, context) {
    try {
      const conversation = this.conversationHistory.get(userId) || [];
      conversation.push({
        message,
        response,
        timestamp: new Date().toISOString(),
        context: context
      });
      
      if (conversation.length > 10) {
        conversation.splice(0, conversation.length - 10);
      }
      
      this.conversationHistory.set(userId, conversation);
    } catch (error) {
      console.error('Error saving conversation context:', error);
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

  getHumanFallbackResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('attendance') || lowerMessage.includes('present')) {
      return "Hey! I'd love to check your attendance data, but I'm having a moment. Can you try asking again in a few seconds? I'll make sure to pull up today's attendance info for you! 😊";
    }
    
    if (lowerMessage.includes('match') || lowerMessage.includes('game')) {
      return "I'd be happy to chat about your matches! Just give me a moment to access your match data. What specifically would you like to know about your recent games?";
    }
    
    if (lowerMessage.includes('team') || lowerMessage.includes('player')) {
      return "Your teams and players are important! Let me get that info for you. What would you like to know about your squad?";
    }
    
    return "Hey there! I'm here to help with all things football coaching! Ask me about your teams, matches, training, tactics, or anything else. I'm having a quick moment, but I'll be back to full speed in no time! ⚽";
  }

  async getUserSuggestions(userId) {
    try {
      const userContext = await this.getComprehensiveUserContext(userId);
      
      const suggestions = [];
      
      // Check attendance patterns
      if (userContext.todayAttendance.length < userContext.teams.flatMap(t => t.players || []).length * 0.8) {
        suggestions.push("📊 Attendance is a bit low today. Consider sending a motivational message to your players!");
      }
      
      // Check upcoming matches
      if (userContext.upcomingEvents.length > 0) {
        const nextMatch = userContext.upcomingEvents[0];
        suggestions.push(`⚽ You have a match coming up: ${nextMatch.home_team?.name || 'Home'} vs ${nextMatch.away_team?.name || 'Away'} on ${new Date(nextMatch.date).toLocaleDateString()}`);
      }
      
      return suggestions;
      
    } catch (error) {
      console.error('Error getting user suggestions:', error);
      return [];
    }
  }
}

export default new PowerfulChatbot(); 