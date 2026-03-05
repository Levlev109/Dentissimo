import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://misksdsiflcgekkbmxmj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_wfeRYrhm7MWq1h4m54GpBA_bYgWaitI';

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
