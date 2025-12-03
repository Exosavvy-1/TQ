import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface Image {
  id: string;
  file_path: string;
  file_name: string;
  uploaded_by: string;
  created_at: string;
}

export interface UserImage {
  id: string;
  image_id: string;
  user_id: string;
  assigned_at: string;
}
