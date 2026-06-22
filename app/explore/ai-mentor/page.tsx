"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/lib/database";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkles, Brain, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getUnifiedProfileV12 } from "@/lib/global-state";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
};

const MENTOR_TYPES = [
  { id: "tech", name: "Software & Technology Coach", desc: "For coding, software engineering, and tech careers", icon: Brain },
  { id: "science", name: "Pure Science Coach", desc: "For physics, research, and scientific careers", icon: Sparkles },
  { id: "general", name: "General Career Coach", desc: "For comparing streams (Science vs Commerce vs Arts)", icon: Bot },
];

export default function AiMentorPage() {
  const { user } = useAuth();
  const [selectedMentor, setSelectedMentor] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation memory from database on mount or mentor type change
  useEffect(() => {
    async function loadMemory() {
      if (!user) {
        setMessages([
          {
            role: "assistant",
            content: getWelcomeMessage(selectedMentor),
            timestamp: new Date().toISOString(),
          },
        ]);
        setInitializing(false);
        return;
      }
      setInitializing(true);
      try {
        const memory = await db.getAiMentorMemory(user.id, selectedMentor);
        if (memory && Array.isArray(memory.conversation_history) && memory.conversation_history.length > 0) {
          setMessages(memory.conversation_history as Message[]);
        } else {
          // Welcome message
          const welcome: Message = {
            role: "assistant",
            content: getWelcomeMessage(selectedMentor),
            timestamp: new Date().toISOString(),
          };
          setMessages([welcome]);
        }
      } catch (err) {
        console.error("Failed to load mentor memory:", err);
      } finally {
        setInitializing(false);
      }
    }

    loadMemory();
  }, [user, selectedMentor]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getWelcomeMessage = (type: string) => {
    switch (type) {
      case "tech":
        return "Hi! I am your Software & Technology Mentor. Ask me about coding, standups, bug fixing, or what a typical day is like for a developer at a tech company.";
      case "science":
        return "Welcome! I am your Pure Science Mentor. Let's discuss Physics experiments, scientific careers, academic research, or stream decisions.";
      default:
        return "Hello! I am your AI Career Coach. I can help you evaluate your simulated experiences, compare the Science stream vs other paths, and figure out what fits you best.";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const mentor = MENTOR_TYPES.find((item) => item.id === selectedMentor);
      const profile = getUnifiedProfileV12();
      const response = await fetch("/api/coaching/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: nextMessages.map((item) => ({
            role: item.role,
            content: item.content,
          })),
          mentor: {
            name: mentor?.name,
            description: mentor?.desc,
          },
          profile: {
            name: profile.name,
            grade: profile.grade,
            interests: profile.interests,
            favoriteCareers: profile.favoriteCareers,
            completedSimulations: profile.completedSimulations,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "The AI coach could not answer right now.");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.text,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...nextMessages, assistantMessage];
      setMessages(finalMessages);

      if (user) {
        try {
          await db.upsertAiMentorMemory(user.id, selectedMentor, finalMessages);
        } catch (err) {
          console.error("Failed to save memory to Supabase:", err);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The AI coach could not answer right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-lg px-4 py-6 sm:px-5 sm:py-8 flex flex-col bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-primary/5 via-violet-500/3 to-transparent" />

      {/* Header */}
      <header className="mb-6 flex items-center gap-3 justify-between z-10">
        <Link href="/explore" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Hub
        </Link>
        <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold">
          AI Career Coach
        </span>
      </header>

      {/* Mentor Selection */}
      <div className="mb-4 grid grid-cols-3 gap-2 z-10">
        {MENTOR_TYPES.map((mentor) => {
          const Icon = mentor.icon;
          const active = selectedMentor === mentor.id;
          return (
            <button
              key={mentor.id}
              onClick={() => setSelectedMentor(mentor.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-300 ${
                active
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 mb-1" />
              <span className="text-[10px] font-bold tracking-tight line-clamp-1">{mentor.name.split(" ")[0]} Coach</span>
            </button>
          );
        })}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-[400px] border border-border rounded-2xl bg-card/60 backdrop-blur-md overflow-hidden z-10 shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
          {initializing ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs">Loading conversations...</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isAi = msg.role === "assistant";
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {!isAi && (
                      <div className="flex-1 max-w-[80%] rounded-2xl bg-primary text-primary-foreground p-3.5 text-sm shadow-sm rounded-tr-none">
                        {msg.content}
                      </div>
                    )}
                    {isAi && (
                      <div className="flex gap-2 max-w-[80%] items-start">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-inner">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="rounded-2xl border border-border bg-background p-3.5 text-sm leading-relaxed text-foreground shadow-sm rounded-tl-none">
                          {msg.content}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-start justify-start"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground shadow-sm rounded-tl-none flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Thinking...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-border bg-background">
          {error && <p className="px-3 pt-2 text-xs text-destructive">{error}</p>}
          <form onSubmit={handleSend} className="p-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask the ${MENTOR_TYPES.find(m => m.id === selectedMentor)?.name.split(" ")[0]} Coach...`}
              disabled={initializing || loading}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={initializing || loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
