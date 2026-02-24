import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  customer_name: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimated_cost: number | null;
  created_at: string;
  updated_at: string;
}
