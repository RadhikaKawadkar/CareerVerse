import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

if (process.env.NODE_ENV === "development") {
  console.log("\n=== CareerVerse Startup Diagnostics ===");
  console.log(`✓ Gemini key found: ${Boolean(process.env.GEMINI_API_KEY)}`);
  console.log(`✓ Supabase configured: ${Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}`);
  console.log(`✓ Auth configured: ${Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}`);
  console.log("=======================================\n");
}

export default nextConfig;
