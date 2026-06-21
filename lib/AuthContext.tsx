"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";
import { db } from "./database";
import { getCareerVerseData, pullDatabaseToLocal } from "./profile-storage";
import { useRouter, usePathname } from "next/navigation";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const clearError = () => setError(null);

  // Sign up with Email and Password
  const signUpWithEmail = async (email: string, password: string, name: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase is not configured. Please add your credentials to env files.");
      }
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signupError) throw signupError;
      
      if (data.user) {
        // Automatically create their database profile
        await db.createProfile(data.user.id, {
          name,
          onboarding_completed: false,
          xp: 0,
          achievements: [],
          interests: [],
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up.");
      setLoading(false);
      throw err;
    }
  };

  // Sign in with Email and Password
  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase is not configured. Please add your credentials to env files.");
      }
      const { error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signinError) throw signinError;
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
      setLoading(false);
      throw err;
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        throw new Error("Supabase is not configured. Please add your credentials to env files.");
      }
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/explore`,
        },
      });

      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message || "An error occurred during Google OAuth.");
      setLoading(false);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { error: signoutError } = await supabase.auth.signOut();
        if (signoutError) throw signoutError;
      }
      setUser(null);
      setSession(null);
      setLoading(false);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "An error occurred during logout.");
      setLoading(false);
    }
  };

  // 1. Fetch user session and handle auth state changes
  useEffect(() => {
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      if (!isSupabaseConfigured) {
        // Safe fallback when Supabase is not configured
        setLoading(false);
        return;
      }

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Run local migration or sync if logged in
        if (currentSession?.user) {
          const isMigrated = typeof window !== "undefined" && window.localStorage.getItem("careerverse-migrated");
          if (isMigrated === "true") {
            await pullDatabaseToLocal(currentSession.user.id);
          } else {
            await handleMigration(currentSession.user.id);
          }
        }
      } catch (err: any) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (event === "SIGNED_IN" && newSession?.user) {
            const isMigrated = typeof window !== "undefined" && window.localStorage.getItem("careerverse-migrated");
            if (isMigrated === "true") {
              await pullDatabaseToLocal(newSession.user.id);
            } else {
              await handleMigration(newSession.user.id);
            }
            router.push("/explore");
          } else if (event === "SIGNED_OUT") {
            router.push("/login");
          }
          setLoading(false);
        }
      );


      unsubscribe = () => subscription.unsubscribe();
    };

    initializeAuth();

    return () => {
      unsubscribe();
    };
  }, [router]);

  // Migration layer invocation
  const handleMigration = async (userId: string) => {
    const isMigrated = window.localStorage.getItem("careerverse-migrated");
    if (isMigrated === "true") return;

    const localData = getCareerVerseData();
    // If the local profile has a name, it means the user played the game/filled profile
    if (localData.profile.name.trim()) {
      try {
        await db.migrateLocalToSupabase(userId, localData);
        window.localStorage.setItem("careerverse-migrated", "true");
      } catch (err) {
        console.error("Migration during login failed:", err);
      }
    } else {
      window.localStorage.setItem("careerverse-migrated", "true");
    }
  };

  // 2. Client-side route protection & redirects
  useEffect(() => {
    if (loading) return;

    const publicPaths = ["/", "/login"];
    const isPublicPath = publicPaths.includes(pathname || "");

    if (!user && !isPublicPath) {
      // Redirect to /login if unauthenticated and trying to access a protected route
      router.replace("/login");
    } else if (user && pathname === "/login") {
      // Redirect to /explore if authenticated and trying to access /login
      router.replace("/explore");
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
