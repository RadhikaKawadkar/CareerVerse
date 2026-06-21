"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, BookOpen, Plus, Heart, AlertCircle, Sparkles, 
  Trash2, Calendar 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { MotionFadeIn } from "@/components/shared/motion";
import { getGuestProfile } from "@/lib/profile-storage";
import { CAREER_LIBRARY } from "@/lib/career-library";
import { type GuestProfile } from "@/types/profile";

type JournalEntry = {
  id: string;
  timestamp: string; // ISO
  careerId: string;
  excited: string;
  difficult: string;
  surprised: string;
  feeling: number; // 1-5
};

export default function JournalPage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  
  // Form state
  const [careerId, setCareerId] = useState(CAREER_LIBRARY[0].id);
  const [excited, setExcited] = useState("");
  const [difficult, setDifficult] = useState("");
  const [surprised, setSurprised] = useState("");
  const [feeling, setFeeling] = useState(4);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setProfile(getGuestProfile());

    const stored = localStorage.getItem("careerverse-journal-entries");
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {}
    }
  }, []);

  if (!isClient || !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  function handleSaveEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!excited.trim() && !difficult.trim() && !surprised.trim()) return;

    const newEntry: JournalEntry = {
      id: String(Date.now()),
      timestamp: new Date().toISOString(),
      careerId,
      excited: excited.trim(),
      difficult: difficult.trim(),
      surprised: surprised.trim(),
      feeling
    };

    const nextEntries = [newEntry, ...entries];
    setEntries(nextEntries);
    localStorage.setItem("careerverse-journal-entries", JSON.stringify(nextEntries));

    // Clear form
    setExcited("");
    setDifficult("");
    setSurprised("");
    setFeeling(4);
    setIsAdding(false);
  }

  function handleDeleteEntry(id: string) {
    if (confirm("Are you sure you want to delete this reflection?")) {
      const nextEntries = entries.filter(e => e.id !== id);
      setEntries(nextEntries);
      localStorage.setItem("careerverse-journal-entries", JSON.stringify(nextEntries));
    }
  }

  const feelingEmojis = ["😩", "😕", "😐", "🙂", "😍"];

  return (
    <AppShell className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold">
          Career Decision Journal
        </h1>
        <div className="w-9 h-9" aria-hidden /> {/* Spacer */}
      </div>

      {/* Intro */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
          <BookOpen className="h-4 w-4" />
          <span>Your Evolving Perspectives</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Record your honest reflections after trying simulations or lessons. Track how your alignment with different paths changes over time.
        </p>
        
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="w-full h-10 mt-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs gap-1.5">
            <Plus className="h-4 w-4" /> Add New Journal Reflection
          </Button>
        )}
      </div>

      {/* New Reflection Form */}
      {isAdding && (
        <MotionFadeIn>
          <form onSubmit={handleSaveEntry} className="rounded-3xl border border-primary/20 bg-primary/[0.01] p-6 space-y-4 shadow-sm">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-foreground">
              New Journal Reflection
            </h2>

            {/* Career Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Select Career Path</label>
              <select
                value={careerId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCareerId(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CAREER_LIBRARY.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.stream})
                  </option>
                ))}
              </select>
            </div>

            {/* Slider / Feeling */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">Overall alignment feeling?</span>
                <span className="text-lg font-bold">{feelingEmojis[feeling - 1]} {feeling}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={feeling}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFeeling(parseInt(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Prompt 1 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                <Heart className="h-3 w-3" /> What excited you?
              </label>
              <textarea
                placeholder="Mention tasks, skills, or dynamic moments that felt rewarding..."
                value={excited}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExcited(e.target.value)}
                className="flex min-h-[70px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              />
            </div>

            {/* Prompt 2 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> What felt difficult?
              </label>
              <textarea
                placeholder="List code blockers, heavy reading, design critiques, or tiring details..."
                value={difficult}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDifficult(e.target.value)}
                className="flex min-h-[70px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              />
            </div>

            {/* Prompt 3 */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-amber-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> What surprised you?
              </label>
              <textarea
                placeholder="Share any myth-busting moments, daily timelines, or automation findings..."
                value={surprised}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSurprised(e.target.value)}
                className="flex min-h-[70px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-2">
              <Button type="submit" className="flex-1 h-10 bg-primary text-primary-foreground font-semibold rounded-xl text-xs">
                Save Reflection
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="h-10 px-4 rounded-xl text-xs text-muted-foreground">
                Cancel
              </Button>
            </div>
          </form>
        </MotionFadeIn>
      )}

      {/* Reflections Timeline */}
      <div className="space-y-4">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Reflection Timeline ({entries.length})
        </h2>

        {entries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center space-y-2">
            <BookOpen className="h-8 w-8 text-muted-foreground/45 mx-auto" />
            <p className="text-xs font-semibold text-foreground">Your journal is empty</p>
            <p className="text-[11px] text-muted-foreground leading-normal max-w-xs mx-auto">
              Simulate a career or sample a stream lesson, then document your thoughts here to construct your visual timeline.
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {entries.map((entry) => {
              const career = CAREER_LIBRARY.find(c => c.id === entry.careerId);
              if (!career) return null;
              
              return (
                <div key={entry.id} className="relative pl-7 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
                  {/* Timeline Node */}
                  <div className="absolute left-[11px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background -translate-x-1/2 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                  </div>

                  <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm relative overflow-hidden">
                    {/* Entry Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">{career.category}</span>
                        <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground mt-0.5">
                          {career.title}
                        </h3>
                        
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground font-semibold">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(entry.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-lg">{feelingEmojis[entry.feeling - 1]}</span>
                        <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md border border-border">
                          {entry.feeling}/5 Fit
                        </span>
                      </div>
                    </div>

                    {/* Prompts Answers Timeline */}
                    <div className="space-y-3 pt-3 border-t border-border/45 text-xs relative before:absolute before:left-[9px] before:top-3 before:bottom-3 before:w-0.5 before:bg-border/60">
                      {entry.excited && (
                        <div className="relative pl-6">
                          <div className="absolute left-[9px] top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 -translate-x-1/2" />
                          <span className="font-bold text-emerald-600 block">What Excited Me</span>
                          <p className="text-muted-foreground mt-0.5 leading-relaxed">{entry.excited}</p>
                        </div>
                      )}

                      {entry.difficult && (
                        <div className="relative pl-6">
                          <div className="absolute left-[9px] top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 -translate-x-1/2" />
                          <span className="font-bold text-rose-500 block">What Felt Difficult</span>
                          <p className="text-muted-foreground mt-0.5 leading-relaxed">{entry.difficult}</p>
                        </div>
                      )}

                      {entry.surprised && (
                        <div className="relative pl-6">
                          <div className="absolute left-[9px] top-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 -translate-x-1/2" />
                          <span className="font-bold text-amber-600 block">What Surprised Me</span>
                          <p className="text-muted-foreground mt-0.5 leading-relaxed">{entry.surprised}</p>
                        </div>
                      )}
                    </div>

                    {/* Delete Trigger */}
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="absolute right-4 bottom-4 p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-muted transition-all"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
