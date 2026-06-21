"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ExploreLoadingSkeleton } from "@/components/explore/loading-skeleton";
import { ErrorBoundary } from "@/components/shared/error-boundary";

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (active) {
            if (session) {
              setIsAuthenticated(true);
              localStorage.setItem("careerverse-active-user-id", session.user.id);
            } else {
              setIsAuthenticated(false);
              localStorage.removeItem("careerverse-active-user-id");
              router.push("/login");
            }
            setCheckingAuth(false);
          }
        } catch (e) {
          console.error("Auth check error, checking mock fallback:", e);
          verifyMockSession();
        }
      } else {
        verifyMockSession();
      }
    }

    function verifyMockSession() {
      if (!active) return;
      const mockSession = localStorage.getItem("careerverse-mock-session");
      if (mockSession) {
        setIsAuthenticated(true);
        try {
          const parsed = JSON.parse(mockSession);
          if (parsed?.id) {
            localStorage.setItem("careerverse-active-user-id", parsed.id);
          }
        } catch {}
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("careerverse-active-user-id");
        router.push("/login");
      }
      setCheckingAuth(false);
    }

    checkSession();

    // Listen for auth state updates
    let unsubscribe: (() => void) | null = null;
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (active) {
          if (session) {
            setIsAuthenticated(true);
            localStorage.setItem("careerverse-active-user-id", session.user.id);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("careerverse-active-user-id");
            router.push("/login");
          }
        }
      });
      unsubscribe = () => subscription.unsubscribe();
    }

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, [router, pathname]);

  if (checkingAuth) {
    return <ExploreLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null; // Redirecting
  }

  return (
    <ErrorBoundary>
      <AppShell>{children}</AppShell>
    </ErrorBoundary>
  );
}
