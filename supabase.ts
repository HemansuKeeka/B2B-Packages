
import { createClient } from '@supabase/supabase-js';

// Derived from the provided key: ref "prcgulemrhoivsaoqmzq"
const supabaseUrl = 'https://prcgulemrhoivsaoqmzq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2d1bGVtcmhvaXZzYW9xbXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA0NTMsImV4cCI6MjA4NjY0NjQ1M30.SNnQc497-fERmg6wD8y0qC1vS9Xf_oIuuN9L8mzK11A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
