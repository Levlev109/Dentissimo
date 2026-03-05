import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://misksdsiflcgekkbmxmj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc2tzZHNpZmxjZ2Vra2JteG1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Mjk5OTEsImV4cCI6MjA4ODMwNTk5MX0.LUGfq4aa9AwTLN6hE1o3lIaXMQtClttYqPbCUjcNkHw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          first_name: string;
          last_name: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          first_name: string;
          last_name: string;
          created_at?: string;
        };
        Update: {
          email?: string | null;
          phone?: string | null;
          first_name?: string;
          last_name?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: unknown;
          total: number;
          customer_info: unknown;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          items: unknown;
          total: number;
          customer_info: unknown;
          status?: string;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
      };
    };
  };
};
