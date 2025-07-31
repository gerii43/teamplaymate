import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Create Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://pctcelpowelnxppqqogz.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdGNlbHBvd2VsbnhwcHFxb2d6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTExNTUwMSwiZXhwIjoyMDY2NjkxNTAxfQ.3c14Y4WmC66BAl7kHTt1necReUcXoiWn9p39jRqqiNg'
);

// Create anon client for public operations
export const supabaseAnon = createClient(
  process.env.SUPABASE_URL || 'https://pctcelpowelnxppqqogz.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdGNlbHBvd2VsbnhwcHFxb2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTU1MDEsImV4cCI6MjA2NjY5MTUwMX0.KO7mW37noYP8JsVNjvlhqjJwoweOkxMEtCloN3mQuS8'
);

// Database service instance
export const dbService = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Team operations
  async createTeam(teamData) {
    const { data, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserTeams(userId) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('coach_id', userId);
    
    if (error) throw error;
    return data || [];
  },

  // Match operations
  async createMatch(matchData) {
    const { data, error } = await supabase
      .from('matches')
      .insert(matchData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMatchById(id) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey(name, coach_id),
        away_team:teams!matches_away_team_id_fkey(name, coach_id)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Chat operations
  async saveChatMessage(messageData) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getChatHistory(userId, limit = 50) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }
};

export default supabase;