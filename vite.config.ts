import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    '__WS_TOKEN__': JSON.stringify(process.env.WS_TOKEN || ''),
    'import.meta.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
    'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  },
});
