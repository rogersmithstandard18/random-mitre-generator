import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  tier: 'free' | 'starter' | 'professional' | 'team';
  card_history: unknown[];
  favorites: string[];
  show_advanced: boolean;
  created_at: string;
  updated_at: string;
}
