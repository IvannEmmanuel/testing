import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xupicgorjngvrpcuuyda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cGljZ29yam5ndnJwY3V1eWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODA4MDAsImV4cCI6MjA2NDc1NjgwMH0.YIaffMQp6gmJPFht4wRnH3hlTL1YrBM9pJVmflSpiqY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);