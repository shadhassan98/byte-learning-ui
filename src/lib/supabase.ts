import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

console.log('[v0] Supabase URL:', supabaseUrl);
console.log('[v0] Has Supabase Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
