"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, MessageSquare, ThumbsUp, Send, Plus, 
  Users, CheckCircle2, User, Search, BookOpen, ChevronDown, ChevronUp, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/layout/app-shell";
import { MotionFadeIn } from "@/components/shared/motion";
import { CAREER_LIBRARY } from "@/lib/career-library";
import { getGuestProfile } from "@/lib/profile-storage";
import { type GuestProfile } from "@/types/profile";
import { STUDENT_VOICES } from "@/lib/student-voices";
import { addXp, unlockBadge } from "@/lib/gamification";
import { cn } from "@/lib/utils";

type Reply = {
  id: string;
  author: string;
  role?: string;
  content: string;
  timestamp: string;
  isVerified: boolean;
};

type Discussion = {
  id: string;
  careerId: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
  views: number;
};

const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: "disc-1",
    careerId: "software-engineer",
    title: "Should I learn Web Development or AI/ML first in Grade 11?",
    content: "I enjoy coding simple scripts, but I'm torn between building frontends (Next.js/React) or diving straight into PyTorch and Neural Networks. Which pathway offers better foundations?",
    author: "Arjun Verma",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 18,
    views: 45,
    replies: [
      {
        id: "rep-1-1",
        author: "Rohit Sharma",
        role: "SDE-2 at Google",
        content: "Start with Web Development. Building frontends teaches you how software interacts with users, databases, and APIs. Once you understand the systems architecture, adding AI models to your apps is much easier than doing raw math models first.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isVerified: true
      }
    ]
  },
  {
    id: "disc-2",
    careerId: "lawyer",
    title: "How critical is CLAT Math? I really struggle with quantitative logic.",
    content: "I took Humanities in school because I love reading and writing. But I'm terrified of the quantitative techniques section in CLAT. Can I crack NLS Bangalore without solid math scores?",
    author: "Prisha Sen",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    likes: 24,
    views: 78,
    replies: [
      {
        id: "rep-2-1",
        author: "Rohan Advani",
        role: "Senior Associate at Khaitan & Co",
        content: "Don't panic! CLAT Math is only about 10% of the paper and covers high school data interpretation. Focus on reading comprehension, logical reasoning, and legal studies. You can easily compensate for a lower math score by dominating the verbal sections.",
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        isVerified: true
      }
    ]
  },
  {
    id: "disc-3",
    careerId: "fashion-designer",
    title: "Sourcing manufacturers for NIFT graduation collections - any advice?",
    content: "I'm sketching a sustainable collection using hemp-blended fabrics. Sourcing local manufacturers who can print custom designs in low yardages is proving to be a nightmare. Any Delhi/NCR recommendations?",
    author: "Kavya Goel",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    likes: 12,
    views: 38,
    replies: [
      {
        id: "rep-3-1",
        author: "Meera Sen",
        role: "Creative Director at Label Meera",
        content: "Try the textile printing clusters in Okhla Phase 3 or Shahpur Jat. Sourcing from large mills won't work for small volumes. Look for boutique digital printers; they have lower minimum orders and are highly receptive to design students.",
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        isVerified: true
      }
    ]
  }
];

export default function CommunityPage() {
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"discussions" | "stories">("discussions");

  // Discussions States
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"recent" | "popular" | "career-specific">("recent");
  const [selectedCareerId, setSelectedCareerId] = useState<string>("All");
  const [isPosting, setIsPosting] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCareerId, setPostCareerId] = useState(CAREER_LIBRARY[0].id);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Student Stories States
  const [storiesQuery, setStoriesQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Science" | "Commerce" | "Arts" | "Vocational">("All");
  const [readStories, setReadStories] = useState<string[]>([]);
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setProfile(getGuestProfile());

    // Load discussions
    const stored = localStorage.getItem("careerverse-discussions");
    if (stored) {
      try {
        setDiscussions(JSON.parse(stored));
      } catch {
        setDiscussions(INITIAL_DISCUSSIONS);
      }
    } else {
      setDiscussions(INITIAL_DISCUSSIONS);
      localStorage.setItem("careerverse-discussions", JSON.stringify(INITIAL_DISCUSSIONS));
    }

    // Load read stories
    try {
      const storedStories = localStorage.getItem("careerverse-read-stories");
      if (storedStories) {
        setReadStories(JSON.parse(storedStories));
      }
    } catch {}
  }, []);

  // Handle Post Creation
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newPost: Discussion = {
      id: `disc-${Date.now()}`,
      careerId: postCareerId,
      title: postTitle.trim(),
      content: postContent.trim(),
      author: profile?.firstName || "Student Explorer",
      timestamp: new Date().toISOString(),
      likes: 0,
      views: 1,
      replies: []
    };

    const nextDiscussions = [newPost, ...discussions];
    setDiscussions(nextDiscussions);
    localStorage.setItem("careerverse-discussions", JSON.stringify(nextDiscussions));

    setPostTitle("");
    setPostContent("");
    setIsPosting(false);

    // Increment exploration streak
    const storedScore = localStorage.getItem("exploration-streak") || "3";
    localStorage.setItem("exploration-streak", String(parseInt(storedScore) + 1));
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = discussions.map((d) => {
      if (d.id === id) {
        return { ...d, likes: d.likes + 1 };
      }
      return d;
    });
    setDiscussions(next);
    localStorage.setItem("careerverse-discussions", JSON.stringify(next));
  };

  const handleAddReply = (discussionId: string) => {
    if (!replyText.trim() || !profile) return;

    const newReply: Reply = {
      id: `rep-${Date.now()}`,
      author: `${profile.firstName} (Student)`,
      content: replyText.trim(),
      timestamp: new Date().toISOString(),
      isVerified: false
    };

    const next = discussions.map((d) => {
      if (d.id === discussionId) {
        return {
          ...d,
          replies: [...d.replies, newReply]
        };
      }
      return d;
    });

    setDiscussions(next);
    localStorage.setItem("careerverse-discussions", JSON.stringify(next));
    setReplyText("");
    setActiveReplyId(null);
  };

  const handleMarkAsRead = (careerId: string) => {
    if (readStories.includes(careerId)) return;
    const nextRead = [...readStories, careerId];
    setReadStories(nextRead);
    localStorage.setItem("careerverse-read-stories", JSON.stringify(nextRead));

    // Award 50 XP
    addXp(50, `Read Student Story: ${CAREER_LIBRARY.find(c => c.id === careerId)?.title || careerId}`);

    // If read 3 stories, unlock badge
    if (nextRead.length >= 3) {
      unlockBadge("skill_unlocked");
    }
  };

  if (!isClient || !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Filter and Sort Discussions
  const filteredDiscussions = discussions
    .filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCareer =
        selectedCareerId === "All" || d.careerId === selectedCareerId;

      return matchesSearch && matchesCareer;
    })
    .sort((a, b) => {
      if (selectedFilter === "popular") {
        return b.likes - a.likes;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  // Filter Student Stories
  const filteredCareers = Object.keys(STUDENT_VOICES).filter((careerId) => {
    const career = CAREER_LIBRARY.find(c => c.id === careerId);
    const title = career ? career.title : careerId;
    const stream = career ? career.stream : "Vocational";

    const matchesSearch = title.toLowerCase().includes(storiesQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || stream === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell className="pb-20">
      {/* Header */}
      <MotionFadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/explore" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Connected Network</p>
              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-black text-foreground mt-0.5">
                Career Community
              </h1>
            </div>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex rounded-xl bg-muted/60 p-1 border border-border/60 max-w-xs w-full">
            <button
              onClick={() => setActiveTab("discussions")}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center",
                activeTab === "discussions"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Discussion Board
            </button>
            <button
              onClick={() => setActiveTab("stories")}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center",
                activeTab === "stories"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Student Voices
            </button>
          </div>
        </div>
      </MotionFadeIn>

      {/* DISCUSSIONS TAB */}
      {activeTab === "discussions" && (
        <div className="space-y-6">
          {/* Community Banner */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-violet-500/[0.02] to-transparent">
            <div className="flex items-center gap-1.5 text-sky-600 font-bold text-sm">
              <Users className="h-5 w-5" />
              <span>Student Discussion Hub</span>
            </div>
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold text-foreground">
              Welcome to the Career Rooms
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ask questions, share experiences, and receive direct replies from verified industry mentors. Engage with peer students matching your career interests.
            </p>

            {!isPosting && (
              <Button 
                onClick={() => setIsPosting(true)} 
                className="w-full h-10 mt-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs gap-1.5 shadow-sm shadow-sky-500/20"
              >
                <Plus className="h-4 w-4" /> Ask a Question
              </Button>
            )}
          </div>

          {/* New Post Form */}
          {isPosting && (
            <MotionFadeIn>
              <form onSubmit={handleCreatePost} className="rounded-3xl border border-sky-500/20 bg-sky-500/[0.01] p-6 space-y-4 shadow-sm animate-in slide-in-from-top duration-300">
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-extrabold text-foreground">
                  New Discussion Thread
                </h3>

                {/* Career Room */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Select Career Room</label>
                  <select
                    value={postCareerId}
                    onChange={(e) => setPostCareerId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {CAREER_LIBRARY.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} Room
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Subject / Core Question</label>
                  <Input
                    placeholder="What is your main question or experience?"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="h-10 rounded-xl bg-card border-border/80 text-xs text-foreground"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Context / Details</label>
                  <textarea
                    placeholder="Describe your background, stream subjects, or details of what you want help with..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="flex min-h-[100px] w-full rounded-xl border border-border bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 text-foreground"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button type="submit" className="flex-1 h-10 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-sm">
                    Publish Thread
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsPosting(false)} className="h-10 px-4 rounded-xl text-xs text-muted-foreground">
                    Cancel
                  </Button>
                </div>
              </form>
            </MotionFadeIn>
          )}

          {/* Filters & Rooms */}
          <div className="space-y-3.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 text-foreground shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedFilter("recent")}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all",
                  selectedFilter === "recent"
                    ? "bg-sky-500 border-sky-500 text-white shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:bg-muted/50"
                )}
              >
                Recent
              </button>
              <button
                onClick={() => setSelectedFilter("popular")}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all",
                  selectedFilter === "popular"
                    ? "bg-sky-500 border-sky-500 text-white shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:bg-muted/50"
                )}
              >
                Popular
              </button>

              <div className="h-4 w-[1px] bg-border/60 mx-1" />

              <select
                value={selectedCareerId}
                onChange={(e) => setSelectedCareerId(e.target.value)}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold border bg-card border-border text-muted-foreground focus:outline-none"
              >
                <option value="All">All Career Rooms</option>
                {CAREER_LIBRARY.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} Room
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Discussion List */}
          <div className="space-y-4">
            {filteredDiscussions.length === 0 ? (
              <div className="text-center py-12 rounded-3xl border border-dashed border-border bg-muted/10 space-y-2">
                <MessageSquare className="h-8 w-8 text-muted-foreground/45 mx-auto" />
                <p className="text-xs font-semibold text-foreground">No discussions found</p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                  Try adjusting your filters or publish your own question to start the discussion!
                </p>
              </div>
            ) : (
              filteredDiscussions.map((disc) => {
                const roomName = CAREER_LIBRARY.find((c) => c.id === disc.careerId)?.title || disc.careerId;
                return (
                  <MotionFadeIn key={disc.id}>
                    <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm hover:border-sky-500/20 transition-all duration-200">
                      {/* Metadata */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                          {roomName} Room
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(disc.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      {/* Thread Question */}
                      <div className="space-y-1.5">
                        <h4 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-foreground leading-snug">
                          {disc.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {disc.content}
                        </p>
                        <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1 pt-1">
                          <User className="h-3.5 w-3.5" /> Posted by {disc.author}
                        </div>
                      </div>

                      {/* Thread Actions */}
                      <div className="flex items-center justify-between border-t border-b border-border/40 py-2.5">
                        <button
                          onClick={(e) => handleLike(e, disc.id)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-sky-600 transition-colors font-semibold"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{disc.likes} Upvotes</span>
                        </button>

                        <button
                          onClick={() => setActiveReplyId(activeReplyId === disc.id ? null : disc.id)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-sky-600 transition-colors font-semibold"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{disc.replies.length} {disc.replies.length === 1 ? "Reply" : "Replies"}</span>
                        </button>
                      </div>

                      {/* Replies */}
                      {disc.replies.length > 0 && (
                        <div className="space-y-3 pt-1">
                          {disc.replies.map((rep) => (
                            <div 
                              key={rep.id} 
                              className={cn(
                                "p-3.5 rounded-2xl text-xs leading-relaxed border",
                                rep.isVerified 
                                  ? "bg-violet-500/[0.02] border-violet-500/15" 
                                  : "bg-muted/30 border-border/60"
                              )}
                            >
                              <div className="flex items-start justify-between mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-foreground">{rep.author}</span>
                                  {rep.isVerified && (
                                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-violet-600 bg-violet-500/10 px-1.5 py-0.5 rounded-full border border-violet-500/20">
                                      <CheckCircle2 className="h-2.5 w-2.5 fill-violet-600 text-white" /> Mentor
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(rep.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                </span>
                              </div>
                              {rep.role && (
                                <div className="text-[10px] text-muted-foreground font-semibold -mt-1 mb-2">
                                  {rep.role}
                                </div>
                              )}
                              <p className="text-muted-foreground leading-relaxed">
                                {rep.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Form */}
                      {activeReplyId === disc.id && (
                        <div className="flex gap-2 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <Input
                            placeholder="Write a helpful response..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="h-10 rounded-xl bg-card border-border/80 text-xs text-foreground"
                          />
                          <Button
                            onClick={() => handleAddReply(disc.id)}
                            className="h-10 w-10 shrink-0 p-0 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </MotionFadeIn>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* STUDENT VOICES TAB */}
      {activeTab === "stories" && (
        <div className="space-y-6">
          {/* Voices Banner */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-background to-transparent space-y-2">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-extrabold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Hear Directly From Students
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Read authentic journals, struggles, myths, surprises, and raw advice written by students at top institutions like IIT Delhi, AIIMS, NLS, and NIFT. Unlocks skill nodes in your Growth Hub!
            </p>
          </div>

          {/* Search & Stream Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search student stories..."
                value={storiesQuery}
                onChange={(e) => setStoriesQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(["All", "Science", "Commerce", "Arts", "Vocational"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "h-8 px-4 rounded-full text-xs font-semibold border transition-all duration-200",
                    activeCategory === cat
                      ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCareers.length === 0 ? (
              <div className="col-span-full text-center py-12 rounded-3xl border border-dashed border-border bg-muted/10 space-y-2">
                <BookOpen className="h-8 w-8 text-muted-foreground/45 mx-auto" />
                <p className="text-xs font-semibold text-foreground">No stories match your filter</p>
              </div>
            ) : (
              filteredCareers.map((careerId) => {
                const career = CAREER_LIBRARY.find(c => c.id === careerId);
                const title = career ? career.title : careerId;
                const stream = career ? career.stream : "Vocational";
                const voices = STUDENT_VOICES[careerId];
                const voice = voices[0];
                const isRead = readStories.includes(careerId);
                const isExpanded = expandedCareer === careerId;

                return (
                  <div
                    key={careerId}
                    className={cn(
                      "rounded-3xl border bg-card p-5 space-y-4 shadow-sm transition-all relative overflow-hidden",
                      isRead ? "border-emerald-500/20 bg-emerald-500/[0.01]" : "border-border hover:border-primary/20"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className={cn(
                        "text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border",
                        stream === "Science" ? "bg-sky-500/10 border-sky-500/20 text-sky-600" :
                        stream === "Commerce" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                        stream === "Arts" ? "bg-pink-500/10 border-pink-500/20 text-pink-600" :
                        "bg-amber-500/10 border-amber-500/20 text-amber-600"
                      )}>
                        {stream}
                      </span>
                      {isRead && (
                        <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> READ (+50 XP)
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-extrabold text-foreground">
                        {title} Story
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xl">{voice.avatar}</span>
                        <div className="text-[10px] text-muted-foreground">
                          <span className="font-bold text-foreground block">{voice.name}</span>
                          <span>{voice.currentYear} &bull; {voice.school}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedCareer(isExpanded ? null : careerId)}
                      className="w-full h-8 flex items-center justify-between text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl px-3 transition-all"
                    >
                      <span>{isExpanded ? "Hide Story Details" : "Read Student Journal"}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-4 pt-3 border-t border-border/40 text-xs animate-in slide-in-from-top duration-300">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-primary block">Why I Chose This:</span>
                          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/10">
                            &ldquo;{voice.whyChose}&rdquo;
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-rose-500 block">Biggest Challenge:</span>
                          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/10">
                            &ldquo;{voice.challenge}&rdquo;
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] uppercase font-bold text-amber-500 block">What Nobody Tells You:</span>
                          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/10">
                            &ldquo;{voice.nobodyTellsYou}&rdquo;
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            Would I choose it again? <span className="font-extrabold text-foreground">{voice.chooseAgain}</span>
                          </span>
                          {!isRead && (
                            <button
                              onClick={() => handleMarkAsRead(careerId)}
                              className="h-8 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-[10px] flex items-center gap-1 shadow-sm transition-all"
                            >
                              <UserCheck className="h-3.5 w-3.5" /> Claim +50 XP
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
