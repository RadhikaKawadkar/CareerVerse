"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User as UserIcon, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionFadeIn } from "@/components/shared/motion";

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error, clearError, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!isLogin && !trimmedName) {
      setFormError("Please enter your name for signup.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmail(trimmedEmail, trimmedPassword);
      } else {
        await signUpWithEmail(trimmedEmail, trimmedPassword, trimmedName);
      }
    } catch {
      // AuthContext handles setting the error state
    }
  };

  const handleGoogleLogin = async () => {
    setFormError(null);
    clearError();
    try {
      await signInWithGoogle();
    } catch {
      // AuthContext handles error
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12 overflow-hidden">
      {/* Background gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b from-primary/8 via-violet-500/5 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-48 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="z-10 w-full max-w-md">
        <MotionFadeIn delay={0.05} className="text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Backend Sync Ready
          </div>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-extrabold tracking-tight sm:text-4xl">
            Career<span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Verse</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to synchronize your progress and career DNA.
          </p>
        </MotionFadeIn>

        <MotionFadeIn delay={0.12} className="mt-8">
          <div className="cv-card-elevated overflow-hidden p-6 sm:p-8">
            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
              <button
                type="button"
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors duration-200 ${
                  isLogin ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setIsLogin(true);
                  clearError();
                  setFormError(null);
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors duration-200 ${
                  !isLogin ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  setIsLogin(false);
                  clearError();
                  setFormError(null);
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Error alerts */}
            <AnimatePresence mode="wait">
              {(error || formError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>{error || formError}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence initial={false} mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
                    <div className="relative mt-1">
                      <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9"
                        required={!isLogin}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {/* Simple Google SVG Icon */}
              <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google Account
            </Button>
          </div>
        </MotionFadeIn>
      </div>
    </div>
  );
}
