import { createClient } from '@supabase/supabase-js';

// Support both SUPABASE_URL and legacy SUPABASE_API names
const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_API || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Missing Supabase environment variables');
  console.error('SUPABASE_URL:', supabaseUrl ? 'Present' : 'MISSING');
  console.error('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'MISSING');
} else {
  if (!supabaseUrl.startsWith('https://')) {
    console.error('CRITICAL: SUPABASE_URL is invalid (must start with https://). Current value:', supabaseUrl);
  }
}

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  tier: 'free' | 'starter' | 'professional' | 'team';
  card_history: any[];
  favorites: string[];
  show_advanced: boolean;
  created_at?: string;
  updated_at?: string;
}
