import { createClient } from '@supabase/supabase-js';

// Access environment variables safely (supports Vite)
// Casting import.meta to any to resolve TypeScript error: Property 'env' does not exist on type 'ImportMeta'
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Only create the client if keys are present
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;