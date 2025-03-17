import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nrerkkitmxabzjddnoqc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZXJra2l0bXhhYnpqZGRub3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NjQxODYsImV4cCI6MjA1NDM0MDE4Nn0.rjc3DgLZqV2QakADrTdd5uYJ-rt72IAqIqGagNe_cU0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);