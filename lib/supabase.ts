import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isPlaceholder =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("placeholder") ||
  supabaseAnonKey.includes("placeholder") ||
  supabaseUrl === "https://your-supabase-project.supabase.co" ||
  supabaseAnonKey === "your-supabase-anon-key";

export const isSupabaseConfigured = !isPlaceholder;

// Create the client. If not configured, we pass fallback values.
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder-supabase-url.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
