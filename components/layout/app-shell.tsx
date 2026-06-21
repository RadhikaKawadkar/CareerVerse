"use client";

import { useEffect, useState, useRef, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Compass,
  Activity,
  Users,
  UserCheck,
  Brain,
  Sparkles,
  BrainCircuit,
  Target,
  Award,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Bell,
  Trash2,
  Check,
  BookOpenCheck,
  LogOut,
  Mic
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { GamificationOverlay } from "@/components/shared/gamification-overlay";
import { useGlobalProfile, useNotifications, type CareerVerseNotification } from "@/lib/global-state";
import { motion, AnimatePresence } from "framer-motion";

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export const AppShellContext = createContext<boolean>(false);

export function AppShell({ children, className }: AppShellProps) {
  const isNested = useContext(AppShellContext);
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement | null>(null);

  // V12 Global State Hooks
  const { profile } = useGlobalProfile();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();
  const [activeToast, setActiveToast] = useState<CareerVerseNotification | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Watch for new notifications to trigger a visual Toast Alert
    const handleNewNotification = (e: Event) => {
      const customEvent = e as CustomEvent<CareerVerseNotification>;
      setActiveToast(customEvent.detail);
      // Automatically clear toast after 4 seconds
      const timer = setTimeout(() => {
        setActiveToast((prev) => (prev?.id === customEvent.detail.id ? null : prev));
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("careerverse-notification-added", handleNewNotification);
    return () => {
      window.removeEventListener("careerverse-notification-added", handleNewNotification);
    };
  }, []);

  // Handle click outside Bell dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("careerverse-active-user-id");
    localStorage.removeItem("careerverse-mock-session");
    window.location.href = "/login";
  }

  if (isNested) {
    return <div className={cn("w-full h-full", className)}>{children}</div>;
  }

  if (!isMounted || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Bypass dashboard layout for landing page or onboarding
  const isBypass = pathname === "/" || pathname?.startsWith("/onboarding");
  if (isBypass) {
    return (
      <main className={cn("mx-auto min-h-screen w-full max-w-4xl px-6 py-8 sm:px-10 sm:py-14", className)}>
        {children}
      </main>
    );
  }

  const phases = [
    {
      title: "Discover",
      items: [
        { name: "Home", href: "/explore", icon: Compass }
      ]
    },
    {
      title: "Experience",
      items: [
        { name: "Simulations", href: "/explore/simulator", icon: Activity },
        { name: "Voice Roleplay", href: "/explore/roleplay", icon: Mic },
        { name: "Community", href: "/explore/community", icon: Users }
      ]
    },
    {
      title: "Guidance",
      items: [
        { name: "AI Mentor", href: "/explore/ai-mentor", icon: Sparkles },
        { name: "Career DNA", href: "/results", icon: Brain }
      ]
    },
    {
      title: "Growth",
      items: [
        { name: "Growth Hub", href: "/explore/growth-hub", icon: BrainCircuit }
      ]
    },
    {
      title: "Profile",
      items: [
        { name: "Dashboard", href: "/explore/dashboard", icon: Target }
      ]
    }
  ];


  const isActive = (href: string) => {
    if (href === "/explore") {
      return pathname === "/explore";
    }
    if (href === "/explore/simulator") {
      return pathname?.startsWith("/explore/simulator") || pathname?.startsWith("/explore/story") || pathname?.startsWith("/explore/decision-simulator") || pathname?.startsWith("/explore/science") || pathname?.startsWith("/explore/software-engineer");
    }
    return pathname === href || pathname?.startsWith(href + "/");
  };



  const getNotifIcon = (type: CareerVerseNotification["type"]) => {
    switch (type) {
      case "achievement":
        return <Award className="h-4 w-4 text-amber-500" />;
      case "mentor":
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      case "quest":
        return <Target className="h-4 w-4 text-pink-500" />;
      case "skill":
        return <BrainCircuit className="h-4 w-4 text-emerald-500" />;
      case "recommendation":
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Notification Bell Dropdown component
  const NotificationBellDropdown = () => (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setIsBellOpen(!isBellOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-background animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isBellOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
              <span className="text-xs font-bold text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground flex flex-col items-center justify-center gap-1">
                  <BookOpenCheck className="h-8 w-8 opacity-30 text-muted-foreground mb-1" />
                  <span className="text-[11px] font-bold">Inbox is empty</span>
                  <span className="text-[9px] opacity-75">Simulations, skills and quests trigger live updates here.</span>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex gap-3 p-2.5 rounded-xl border transition-colors text-left relative",
                      notif.read ? "bg-muted/10 border-border/30" : "bg-primary/[0.02] border-primary/10 shadow-sm"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{getNotifIcon(notif.type)}</div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-foreground block truncate">{notif.title}</span>
                      <span className="text-[10px] text-muted-foreground leading-normal block">{notif.message}</span>
                      <span className="text-[8px] text-muted-foreground opacity-60 block mt-1">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!notif.read && (
                      <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-border/40 pt-2 mt-2 flex justify-end">
                <button
                  onClick={clearAll}
                  className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-card/65 backdrop-blur-md border-r border-border py-6">
      {/* Brand logo at the top of the sidebar */}
      {!isCollapsed ? (
        <div className="px-6 pb-6 mb-2 border-b border-border/40 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black tracking-tight text-slate-900">
            Career<span className="text-primary">Verse</span>
          </span>
        </div>
      ) : (
        <div className="px-4 pb-6 mb-2 border-b border-border/40 flex justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
          </div>
        </div>
      )}

      {/* Categorized Journey Phases Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {phases.map((phase) => (
          <div key={phase.title} className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-2 text-[9px] font-extrabold uppercase text-muted-foreground tracking-widest block opacity-70">
                {phase.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {phase.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-all duration-200 group relative",
                      active
                        ? "bg-primary/10 font-bold text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-105", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}

                    {/* CollapsedTooltip */}
                    {isCollapsed && (
                      <div className="absolute left-16 z-50 rounded-md bg-foreground text-background px-2.5 py-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Log Out Button */}
      <div className="px-3 border-t border-border/40 pt-4 pb-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-all duration-200 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 group relative"
          title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
          {!isCollapsed && <span className="font-semibold">Log Out</span>}
          {isCollapsed && (
            <div className="absolute left-16 z-50 rounded-md bg-rose-600 text-white px-2.5 py-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
              Log Out
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <div className="px-4 border-t border-border/40 pt-4 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          {isCollapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
        </button>
      </div>
    </div>
  );

  return (
    <AppShellContext.Provider value={true}>
      <div className="flex min-h-screen bg-background">
      {/* Gamification Floating FX & celebration overlay */}
      <GamificationOverlay />

      {/* New Live Notification Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="pointer-events-auto flex gap-3 rounded-2xl bg-card border border-primary/20 p-4 shadow-2xl backdrop-blur-md bg-gradient-to-r from-primary/[0.02] to-transparent"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
                {getNotifIcon(activeToast.type)}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className="text-xs font-black text-foreground block">{activeToast.title}</span>
                <span className="text-[11px] text-muted-foreground leading-normal block">{activeToast.message}</span>
              </div>
              <button
                onClick={() => setActiveToast(null)}
                className="text-muted-foreground hover:text-foreground self-start p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar (Left) */}
      <aside
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300 ease-in-out fixed top-0 bottom-0 left-0 z-30",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer (Left) */}
      <div className={cn("fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm transition-opacity duration-300 pointer-events-none opacity-0", isMobileOpen && "opacity-100 pointer-events-auto")}>
        <aside
          className={cn(
            "w-64 h-full transition-transform duration-300 transform -translate-x-full",
            isMobileOpen && "translate-x-0"
          )}
        >
          <div className="relative h-full">
            <SidebarContent />
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-[-48px] h-10 w-10 flex items-center justify-center rounded-xl bg-card border border-border text-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </aside>
      </div>

      {/* Main Container */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          "md:pl-0",
          isCollapsed ? "md:ml-20" : "md:ml-64"
        )}
      >
        {/* Mobile Sticky Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/40 bg-background/70 backdrop-blur-md px-4 md:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/explore" className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
              <span>CareerVerse</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/15">
              <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
              <span>{profile.streak}</span>
            </div>
            <NotificationBellDropdown />
          </div>
        </header>

        {/* Desktop Sticky Header */}
        <header className="hidden md:flex sticky top-0 z-20 h-16 items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-md px-8 md:px-12">
          <div className="flex items-center gap-2">
            {isCollapsed && (
              <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground flex items-center gap-1.5 animate-in fade-in duration-200">
                <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                <span>CareerVerse</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Streak indicator */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-2xl text-amber-600 font-extrabold text-xs shadow-sm">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{profile.streak} Day Streak</span>
            </div>
            
            {/* Notification Bell Dropdown */}
            <NotificationBellDropdown />
            
            {/* User Profile Info Mini */}
            <div className="flex items-center gap-2.5 border-l border-border/40 pl-4">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-primary text-white font-bold text-xs shadow-sm">
                {profile.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-none">{profile.name}</span>
                <span className="text-[9px] text-muted-foreground font-bold mt-1">Level {profile.level}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={cn("flex-1 p-4 sm:p-6 md:p-8 md:px-12 w-full max-w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] bg-slate-50/30", className)}>
          {children}
        </main>
      </div>
    </div>
    </AppShellContext.Provider>
  );
}
