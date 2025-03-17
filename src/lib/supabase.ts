import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gtowalbzuwhztxyvreut.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b3dhbGJ6dXdoenR4eXZyZXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NzUzMTgsImV4cCI6MjA1NzU1MTMxOH0.0ZELY6qbmJGToTKCoiFMK6mOtbY8YBR6pmWB07xZXNs';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);