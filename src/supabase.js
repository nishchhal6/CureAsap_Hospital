import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Standard client - Iska storage default rahega
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client - ISME CHANGE HAI: storage key alag kar di aur storage access band kar diya
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false, // Ye session save nahi karega
    detectSessionInUrl: false,
    storageKey: "supabase-admin-auth", // <--- Ye line bahut zaroori hai
  },
});
