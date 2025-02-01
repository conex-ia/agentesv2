import { createClient } from '@supabase/supabase-js';

// Tentar obter do window.env primeiro
const env = (window as any).env || {};
const supabaseUrl = env.supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = env.supabaseKey || import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Env values:', {
    windowEnv: (window as any).env,
    supabaseUrl,
    supabaseKey
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);