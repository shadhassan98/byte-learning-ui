import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase credentials - these should be replaced with environment variables in production
const supabaseUrl = 'https://hzlkvkptgsjxsltbecwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bGt2a3B0Z3NqeHNsdGJlY3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1ODEwNjksImV4cCI6MjA1NTE1NzA2OX0.hLKBw3u2rHDfGPpPe9eLiXSaqonbCn-U4nj_WlEIB2M';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
