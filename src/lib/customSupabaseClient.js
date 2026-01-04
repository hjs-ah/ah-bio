import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aydkiskmdiwwbpqlcecc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5ZGtpc2ttZGl3d2JwcWxjZWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDEwNDQsImV4cCI6MjA4MzExNzA0NH0.2HoQSjHqJjamxkxwlkEm_ylAhg-koPI7aSNb-gxomMg';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
