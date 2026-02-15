import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Access environment variables that are injected via Vite config
const supabaseUrl = import.meta.env.SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
  console.error('Supabase environment variables not found');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
