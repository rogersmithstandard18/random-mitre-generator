import { createClient } from '@supabase/supabase-js';

// Helper to get env var with case-insensitive names
const getEnv = (name: string) => {
  return process.env[name] || process.env[name.toLowerCase()] || process.env[name.toUpperCase()] || '';
};

// Support both SUPABASE_URL and legacy SUPABASE_API names
const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('SUPABASE_API');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Missing Supabase environment variables');
  const envKeys = Object.keys(process.env);
  console.log('Available environment variable keys:', envKeys.filter(k =>
    k.toLowerCase().includes('supabase') ||
    k.toLowerCase().includes('jwt') ||
    k.toLowerCase().includes('google')
  ));
} else {
  if (!supabaseUrl.startsWith('https://')) {
    console.error('CRITICAL: SUPABASE_URL is invalid (must start with https://). Current value:', supabaseUrl);
    console.error('Note: Supabase URL should look like https://xyz.supabase.co');
  }
}

let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e: any) {
    console.error('FAILED TO INITIALIZE SUPABASE CLIENT:', e.message);
  }
}

export const supabase = supabaseClient as any;

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
