import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (((import.meta as any).env?.VITE_SUPABASE_URL) || '').trim();
const supabaseAnonKey = (((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Use fallback placeholder values to prevent library crash during startup if keys aren't added yet
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

