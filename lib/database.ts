/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase, isSupabaseConfigured } from "./supabase";
import type { CareerVerseData, SweSceneChoice } from "@/types/profile";

// Helper for retry operations
async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 1.5);
  }
}

// Format Supabase error cleanly
export function formatSupabaseError(error: any): string {
  if (!error) return "Unknown database error";
  return `[Supabase Error] Code: ${error.code || "N/A"} | Message: ${error.message || "Unknown"} | Details: ${error.details || "None"} | Hint: ${error.hint || "None"}`;
}

// ----------------------------------------------------
// Service Types
// ----------------------------------------------------

export type DbProfile = {
  id: string;
  email?: string | null;
  name: string;
  grade: number | null;
  suggested_path: string | null;
  career_pressure: string | null;
  onboarding_completed: boolean;
  xp: number;
  level?: number;
  streak?: number;
  rank?: string;
  badges?: string[];
  interests: string[];
  personality_signals?: string[];
  achievements: string[];
};

export type DbCareerDna = {
  user_id: string;
  analytical: number;
  creativity: number;
  collaboration: number;
  risk_tolerance: number;
  risk?: number;
  archetype: string;
};

export type DbSimulation = {
  id?: string;
  user_id: string;
  career_name: string;
  career_id?: string;
  choices: Record<string, SweSceneChoice | null>;
  choices_made?: Record<string, SweSceneChoice | null>;
  completion_status: string;
  completed?: boolean;
  ending_unlocked: string | null;
  reflection_interest: number | null;
  reflection_confidence: number | null;
  current_step: string | null;
  updated_at?: string;
};

export type DbJournalEntry = {
  id?: string;
  user_id: string;
  reflection_text: string;
  career_reference: string;
  career_id?: string;
  content?: string;
  excited?: string;
  difficult?: string;
  surprised?: string;
  feeling?: number;
  created_at?: string;
  timestamp?: string;
};

export type DbBookmark = {
  id?: string;
  user_id: string;
  career_name: string;
  career_id?: string;
  created_at?: string;
};

export type DbAiMentorMemory = {
  id?: string;
  user_id: string;
  mentor_type: string;
  conversation_history: Array<{
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
  }>;
  updated_at?: string;
};

export type DashboardData = {
  profile: DbProfile | null;
  careerDna: DbCareerDna | null;
  simulations: DbSimulation[];
  journalEntries: DbJournalEntry[];
  bookmarks: DbBookmark[];
  xp: number;
  achievements: string[];
};

// ----------------------------------------------------
// Database Service Layer
// ----------------------------------------------------

export const db = {
  /**
   * Profiles
   */
  async getProfile(userId: string): Promise<DbProfile | null> {
    if (!isSupabaseConfigured) return null;
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile from Supabase:", formatSupabaseError(error));
        throw error;
      }
      
      if (!data) {
        return null;
      }

      return {
        id: data.id,
        email: data.email || null,
        name: data.name || "",
        grade: data.grade,
        suggested_path: data.suggested_path || data.career_pressure || null,
        career_pressure: data.career_pressure || data.suggested_path || null,
        onboarding_completed: data.onboarding_completed || false,
        xp: data.xp || 0,
        level: data.level || 1,
        streak: data.streak || 3,
        rank: data.rank || "Novice",
        badges: Array.isArray(data.badges) ? data.badges : [],
        interests: Array.isArray(data.interests) ? data.interests : [],
        personality_signals: Array.isArray(data.personality_signals) ? data.personality_signals : [],
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
      };
    });
  },

  async createProfile(userId: string, updates: Partial<DbProfile>): Promise<DbProfile> {
    return withRetry(async () => {
      const dbData = {
        id: userId,
        email: updates.email ?? null,
        name: updates.name ?? "Student",
        grade: updates.grade ?? null,
        suggested_path: updates.suggested_path ?? null,
        career_pressure: updates.career_pressure ?? null,
        onboarding_completed: updates.onboarding_completed ?? false,
        xp: updates.xp ?? 0,
        level: updates.level ?? 1,
        streak: updates.streak ?? 3,
        rank: updates.rank ?? "Novice",
        badges: updates.badges ?? [],
        interests: updates.interests ?? [],
        personality_signals: updates.personality_signals ?? [],
        achievements: updates.achievements ?? [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert(dbData)
        .select()
        .single();

      if (error) {
        console.error("Error creating profile in Supabase:", formatSupabaseError(error));
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        grade: data.grade,
        suggested_path: data.suggested_path,
        career_pressure: data.career_pressure,
        onboarding_completed: data.onboarding_completed,
        xp: data.xp,
        level: data.level,
        streak: data.streak,
        rank: data.rank,
        badges: data.badges || [],
        interests: data.interests || [],
        personality_signals: data.personality_signals || [],
        achievements: data.achievements || [],
      };
    });
  },

  async updateProfile(userId: string, updates: Partial<DbProfile>): Promise<DbProfile | null> {
    if (!isSupabaseConfigured) return null;
    return withRetry(async () => {
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.grade !== undefined) dbUpdates.grade = updates.grade;
      if (updates.suggested_path !== undefined) {
        dbUpdates.suggested_path = updates.suggested_path;
        dbUpdates.career_pressure = updates.suggested_path;
      }
      if (updates.onboarding_completed !== undefined) dbUpdates.onboarding_completed = updates.onboarding_completed;
      if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
      if (updates.level !== undefined) dbUpdates.level = updates.level;
      if (updates.streak !== undefined) dbUpdates.streak = updates.streak;
      if (updates.rank !== undefined) dbUpdates.rank = updates.rank;
      if (updates.badges !== undefined) dbUpdates.badges = updates.badges;
      if (updates.interests !== undefined) dbUpdates.interests = updates.interests;
      if (updates.personality_signals !== undefined) dbUpdates.personality_signals = updates.personality_signals;
      if (updates.achievements !== undefined) dbUpdates.achievements = updates.achievements;

      const { data, error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile in Supabase:", formatSupabaseError(error));
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        grade: data.grade,
        suggested_path: data.suggested_path,
        career_pressure: data.career_pressure,
        onboarding_completed: data.onboarding_completed,
        xp: data.xp,
        level: data.level,
        streak: data.streak,
        rank: data.rank,
        badges: data.badges || [],
        interests: data.interests || [],
        personality_signals: data.personality_signals || [],
        achievements: data.achievements || [],
      };
    });
  },

  /**
   * Career DNA
   */
  async getCareerDna(userId: string): Promise<DbCareerDna | null> {
    if (!isSupabaseConfigured) return null;
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("career_dna")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching Career DNA:", formatSupabaseError(error));
        throw error;
      }
      if (!data) {
        return await this.upsertCareerDna(userId, {
          analytical: 50,
          creativity: 50,
          collaboration: 50,
          risk_tolerance: 50,
          archetype: "Explorer",
        });
      }
      return {
        user_id: data.user_id,
        analytical: data.analytical,
        creativity: data.creativity,
        collaboration: data.collaboration,
        risk_tolerance: data.risk_tolerance ?? data.risk ?? 50,
        risk: data.risk ?? data.risk_tolerance ?? 50,
        archetype: data.archetype || "Explorer",
      };
    });
  },

  async upsertCareerDna(userId: string, dna: Partial<DbCareerDna>): Promise<DbCareerDna> {
    return withRetry(async () => {
      const riskVal = dna.risk_tolerance ?? dna.risk ?? 50;
      const dbData = {
        user_id: userId,
        analytical: dna.analytical ?? 50,
        creativity: dna.creativity ?? 50,
        collaboration: dna.collaboration ?? 50,
        risk: riskVal,
        risk_tolerance: riskVal,
        work_style: (dna as any).work_style ?? (dna as any).workStyle ?? "Balanced",
        learning_style: (dna as any).learning_style ?? (dna as any).learningStyle ?? "Visual",
        communication_score: (dna as any).communication_score ?? (dna as any).communicationScore ?? 50,
        communication: (dna as any).communication ?? (dna as any).communicationScore ?? 50,
        creativity_score: (dna as any).creativity_score ?? (dna as any).creativityScore ?? 50,
        leadership_score: (dna as any).leadership_score ?? (dna as any).leadershipScore ?? 50,
        leadership: (dna as any).leadership ?? (dna as any).leadershipScore ?? 50,
        analytical_score: (dna as any).analytical_score ?? (dna as any).analyticalScore ?? 50,
        confidence_score: (dna as any).confidence_score ?? (dna as any).confidenceScore ?? 75,
        confidence: (dna as any).confidence ?? (dna as any).confidenceScore ?? 75,
        decision_patterns: (dna as any).decision_patterns ?? (dna as any).decisionPatterns ?? [],
        strength_clusters: (dna as any).strength_clusters ?? (dna as any).strengthClusters ?? [],
        growth_history: (dna as any).growth_history ?? (dna as any).growthHistory ?? [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("career_dna")
        .upsert(dbData)
        .select()
        .single();

      if (error) {
        console.error("Error upserting Career DNA:", formatSupabaseError(error));
        throw error;
      }
      return data;
    });
  },

  /**
   * Simulations
   */
  async getSimulations(userId: string): Promise<DbSimulation[]> {
    if (!isSupabaseConfigured) return [];
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("simulations")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching simulations:", formatSupabaseError(error));
        throw error;
      }
      return (data || []).map((sim) => ({
        id: sim.id,
        user_id: sim.user_id,
        career_name: sim.career_name || sim.career_id || "",
        career_id: sim.career_id || sim.career_name || "",
        choices: sim.choices || sim.choices_made || {},
        choices_made: sim.choices_made || sim.choices || {},
        completion_status: sim.completion_status || (sim.completed ? "completed" : "in_progress"),
        completed: sim.completed ?? (sim.completion_status === "completed"),
        ending_unlocked: sim.ending_unlocked,
        reflection_interest: sim.reflection_interest,
        reflection_confidence: sim.reflection_confidence,
        current_step: sim.current_step,
        updated_at: sim.updated_at,
      }));
    });
  },

  async getSimulation(userId: string, careerName: string): Promise<DbSimulation | null> {
    if (!isSupabaseConfigured) return null;
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("simulations")
        .select("*")
        .eq("user_id", userId)
        .or(`career_name.eq.${careerName},career_id.eq.${careerName}`)
        .maybeSingle();

      if (error) {
        console.error("Error fetching simulation:", formatSupabaseError(error));
        throw error;
      }
      if (!data) return null;
      return {
        id: data.id,
        user_id: data.user_id,
        career_name: data.career_name || data.career_id || "",
        career_id: data.career_id || data.career_name || "",
        choices: data.choices || data.choices_made || {},
        choices_made: data.choices_made || data.choices || {},
        completion_status: data.completion_status || (data.completed ? "completed" : "in_progress"),
        completed: data.completed ?? (data.completion_status === "completed"),
        ending_unlocked: data.ending_unlocked,
        reflection_interest: data.reflection_interest,
        reflection_confidence: data.reflection_confidence,
        current_step: data.current_step,
        updated_at: data.updated_at,
      };
    });
  },

  async upsertSimulation(userId: string, sim: Partial<DbSimulation> & { career_name: string }): Promise<DbSimulation> {
    return withRetry(async () => {
      const careerId = sim.career_id || sim.career_name;
      const choicesVal = sim.choices ?? sim.choices_made ?? {};
      const completedVal = sim.completed ?? (sim.completion_status === "completed");
      const completionStatusVal = sim.completion_status ?? (completedVal ? "completed" : "in_progress");

      const dbData = {
        user_id: userId,
        career_id: careerId,
        career_name: sim.career_name,
        choices: choicesVal,
        choices_made: choicesVal,
        completed: completedVal,
        completion_status: completionStatusVal,
        ending_unlocked: sim.ending_unlocked ?? null,
        reflection_interest: sim.reflection_interest ?? null,
        reflection_confidence: sim.reflection_confidence ?? null,
        current_step: sim.current_step ?? null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("simulations")
        .upsert(dbData, { onConflict: "user_id,career_id" })
        .select()
        .single();

      if (error) {
        console.error("Error upserting simulation:", formatSupabaseError(error));
        throw error;
      }
      return data;
    });
  },

  /**
   * Journal System
   */
  async getJournalEntries(userId: string): Promise<DbJournalEntry[]> {
    if (!isSupabaseConfigured) return [];
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching journal entries:", formatSupabaseError(error));
        throw error;
      }
      return (data || []).map((j) => ({
        id: j.id,
        user_id: j.user_id,
        reflection_text: j.reflection_text || j.content || "",
        career_reference: j.career_reference || j.career_id || "",
        career_id: j.career_id || j.career_reference || "",
        content: j.content || j.reflection_text || "",
        excited: j.excited,
        difficult: j.difficult,
        surprised: j.surprised,
        feeling: j.feeling,
        created_at: j.created_at || j.timestamp,
        timestamp: j.timestamp || j.created_at,
      }));
    });
  },

  async addJournalEntry(userId: string, reflectionText: string, careerReference: string): Promise<DbJournalEntry> {
    return withRetry(async () => {
      const payload = {
        user_id: userId,
        career_id: careerReference,
        career_reference: careerReference,
        reflection_text: reflectionText,
        content: reflectionText,
        excited: "",
        difficult: "",
        surprised: "",
        feeling: 3,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("journal_entries")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error("Error inserting journal entry:", formatSupabaseError(error));
        throw error;
      }
      return data;
    });
  },

  /**
   * Bookmarks
   */
  async getBookmarks(userId: string): Promise<DbBookmark[]> {
    if (!isSupabaseConfigured) return [];
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching bookmarks:", formatSupabaseError(error));
        throw error;
      }
      return (data || []).map((b) => ({
        id: b.id,
        user_id: b.user_id,
        career_name: b.career_name || b.career_id || "",
        career_id: b.career_id || b.career_name || "",
        created_at: b.created_at,
      }));
    });
  },

  async addBookmark(userId: string, careerName: string): Promise<DbBookmark> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .upsert(
          { user_id: userId, career_id: careerName, career_name: careerName },
          { onConflict: "user_id,career_id" }
        )
        .select()
        .single();

      if (error) {
        console.error("Error adding bookmark:", formatSupabaseError(error));
        throw error;
      }
      return data;
    });
  },

  async removeBookmark(userId: string, careerName: string): Promise<boolean> {
    return withRetry(async () => {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .or(`career_name.eq.${careerName},career_id.eq.${careerName}`);

      if (error) {
        console.error("Error removing bookmark:", formatSupabaseError(error));
        throw error;
      }
      return true;
    });
  },

  /**
   * AI Mentor Memory
   */
  async getAiMentorMemory(userId: string, mentorType: string): Promise<DbAiMentorMemory | null> {
    if (!isSupabaseConfigured) return null;
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("ai_mentor_memory")
        .select("*")
        .eq("user_id", userId)
        .eq("mentor_type", mentorType)
        .maybeSingle();

      if (error) {
        console.error("Error fetching AI mentor memory:", formatSupabaseError(error));
        throw error;
      }
      return data;
    });
  },

  async upsertAiMentorMemory(
    userId: string,
    mentorType: string,
    history: DbAiMentorMemory["conversation_history"]
  ): Promise<DbAiMentorMemory> {
    return withRetry(async () => {
      const dbData = {
        user_id: userId,
        mentor_type: mentorType,
        conversation_history: history,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("ai_mentor_memory")
        .upsert(dbData, { onConflict: "user_id,mentor_type" })
        .select()
        .single();

      if (error) {
        console.error("Error upserting AI mentor memory:", formatSupabaseError(error));
        throw error;
      }
      return data;
    });
  },

  /**
   * Dashboard Data Loader
   */
  async getDashboardData(userId: string): Promise<DashboardData> {
    if (!isSupabaseConfigured) {
      return {
        profile: null,
        careerDna: null,
        simulations: [],
        journalEntries: [],
        bookmarks: [],
        xp: 0,
        achievements: [],
      };
    }

    try {
      const [profile, careerDna, simulations, journalEntries, bookmarks] = await Promise.all([
        this.getProfile(userId).catch((err) => {
          console.warn("Profile fetch failed, returning null:", formatSupabaseError(err));
          return null;
        }),
        this.getCareerDna(userId).catch((err) => {
          console.warn("Career DNA fetch failed, returning null:", formatSupabaseError(err));
          return null;
        }),
        this.getSimulations(userId).catch((err) => {
          console.warn("Simulations fetch failed, returning empty list:", formatSupabaseError(err));
          return [];
        }),
        this.getJournalEntries(userId).catch((err) => {
          console.warn("Journal entries fetch failed, returning empty list:", formatSupabaseError(err));
          return [];
        }),
        this.getBookmarks(userId).catch((err) => {
          console.warn("Bookmarks fetch failed, returning empty list:", formatSupabaseError(err));
          return [];
        }),
      ]);

      return {
        profile,
        careerDna,
        simulations,
        journalEntries,
        bookmarks,
        xp: profile?.xp ?? 0,
        achievements: profile?.achievements ?? [],
      };
    } catch (e) {
      console.error("Critical error loading dashboard data:", e);
      return {
        profile: null,
        careerDna: null,
        simulations: [],
        journalEntries: [],
        bookmarks: [],
        xp: 0,
        achievements: [],
      };
    }
  },

  /**
   * Ensure user record rows exist in Supabase
   */
  async ensureUserProfile(userId: string, email?: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const profile = await this.getProfile(userId).catch(() => null);
      if (!profile) {
        await this.createProfile(userId, {
          email: email || null,
          name: email ? email.split("@")[0] : "Student",
          onboarding_completed: false,
          xp: 0,
          achievements: [],
          interests: [],
        }).catch((err) => console.error("ensureUserProfile profiles error:", formatSupabaseError(err)));
      } else if (email && !profile.email) {
        // Update email if missing
        await this.updateProfile(userId, { email }).catch(() => null);
      }

      const dna = await this.getCareerDna(userId).catch(() => null);
      if (!dna) {
        await this.upsertCareerDna(userId, {
          analytical: 50,
          creativity: 50,
          collaboration: 50,
          risk_tolerance: 50,
          archetype: "Explorer",
        }).catch((err) => console.error("ensureUserProfile DNA error:", formatSupabaseError(err)));
      }

      // Ensure quest progress row
      const { data: questData, error: questGetErr } = await supabase
        .from("quest_progress")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (questGetErr) {
        console.error("ensureUserProfile quest progress get error:", formatSupabaseError(questGetErr));
      } else if (!questData) {
        const { error: questInsErr } = await supabase.from("quest_progress").insert({
          user_id: userId,
          active: [],
          completed: [],
          milestones: [],
          progress: {},
          claimed_milestones: [],
          updated_at: new Date().toISOString(),
        });
        if (questInsErr) {
          console.error("ensureUserProfile quest progress insert error:", formatSupabaseError(questInsErr));
        }
      }

      // Ensure skill progress row
      const { data: skillData, error: skillGetErr } = await supabase
        .from("skill_progress")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (skillGetErr) {
        console.error("ensureUserProfile skill progress get error:", formatSupabaseError(skillGetErr));
      } else if (!skillData) {
        const { error: skillInsErr } = await supabase.from("skill_progress").insert({
          user_id: userId,
          unlocked_skills: [],
          claimed_skills: [],
          updated_at: new Date().toISOString(),
        });
        if (skillInsErr) {
          console.error("ensureUserProfile skill progress insert error:", formatSupabaseError(skillInsErr));
        }
      }
    } catch (e) {
      console.warn("Failed during ensureUserProfile checks:", e);
    }
  },

  /**
   * Migration Layer: Safe sync from LocalStorage data structure to Supabase DB.
   */
  async migrateLocalToSupabase(userId: string, localData: CareerVerseData): Promise<void> {
    if (!isSupabaseConfigured) return;

    try {
      // 1. Migrate profile
      const hasOnboarding =
        Boolean(localData.profile.name) &&
        localData.profile.grade !== null &&
        localData.profile.suggestedPath !== null;

      await this.createProfile(userId, {
        name: localData.profile.name || "",
        grade: localData.profile.grade,
        suggested_path: localData.profile.suggestedPath || null,
        career_pressure: localData.profile.suggestedPath || null,
        onboarding_completed: hasOnboarding,
      });

      // Calculate XP and achievements based on experiences completed
      let initialXp = 0;
      const achievementsList: string[] = [];

      // 2. Migrate Science experience to simulations table
      if (localData.science.completed || localData.science.step) {
        initialXp += localData.science.completed ? 100 : 20;
        if (localData.science.completed) achievementsList.push("science_pioneer");

        await this.upsertSimulation(userId, {
          career_name: "science",
          choices: {},
          completion_status: localData.science.completed ? "completed" : "in_progress",
          ending_unlocked: localData.science.completed ? "Completed Physics Lesson" : null,
          reflection_interest: localData.science.enjoyment,
          reflection_confidence: localData.science.fit,
          current_step: localData.science.step || "intro",
        });

        // Add to journal if finished
        if (localData.science.completed && localData.science.enjoyment !== null) {
          await this.addJournalEntry(
            userId,
            `Completed the grade 11 Physics lesson. Rated interest: ${localData.science.enjoyment}/5, confidence: ${localData.science.fit}/5.`,
            "science"
          );
        }
      }

      // 3. Migrate SWE Simulation
      if (localData.simulation.completed || localData.simulation.step) {
        initialXp += localData.simulation.completed ? 100 : 20;
        if (localData.simulation.completed) achievementsList.push("swe_explorer");

        const choices: Record<string, SweSceneChoice | null> = {};
        if (localData.simulation.choices.scene1) choices.scene1 = localData.simulation.choices.scene1;
        if (localData.simulation.choices.scene2) choices.scene2 = localData.simulation.choices.scene2;
        if (localData.simulation.choices.scene3) choices.scene3 = localData.simulation.choices.scene3;

        await this.upsertSimulation(userId, {
          career_name: "software-engineer",
          choices: choices,
          completion_status: localData.simulation.completed ? "completed" : "in_progress",
          ending_unlocked: localData.simulation.completed ? "Finished SWE Day" : null,
          reflection_interest: localData.simulation.enjoyment,
          reflection_confidence: localData.simulation.fit,
          current_step: localData.simulation.step || "intro",
        });

        if (localData.simulation.completed && localData.simulation.enjoyment !== null) {
          await this.addJournalEntry(
            userId,
            `Completed the Software Engineer simulation. Choices: Standup: ${choices.scene1}, Bug: ${choices.scene2}, Deadline: ${choices.scene3}. Interest: ${localData.simulation.enjoyment}/5, confidence: ${localData.simulation.fit}/5.`,
            "software-engineer"
          );
        }
      }

      // Update XP & Achievements in profile
      if (initialXp > 0 || achievementsList.length > 0) {
        const currentProfile = await this.getProfile(userId);
        if (currentProfile) {
          const newXp = (currentProfile.xp || 0) + initialXp;
          const mergedAchievements = Array.from(new Set([...(currentProfile.achievements || []), ...achievementsList]));
          await this.updateProfile(userId, {
            xp: newXp,
            achievements: mergedAchievements,
          });
        }
      }

      // 4. Update DNA values based on simulation choices
      if (localData.simulation.completed) {
        const choices = localData.simulation.choices;
        let analytical = 3;
        let creativity = 3;
        let collaboration = 3;
        let riskTolerance = 3;

        // Simple scoring algorithm based on selections
        if (choices.scene1 === "a") collaboration += 2; // Ask for help
        if (choices.scene1 === "b") { analytical += 1; collaboration -= 1; }
        if (choices.scene2 === "a") analytical += 2; // Logs methodically
        if (choices.scene2 === "b") { riskTolerance += 2; analytical -= 1; }
        if (choices.scene3 === "a") { creativity += 2; riskTolerance += 1; } // Polish UI
        if (choices.scene3 === "b") analytical += 1; // Ship functional

        await this.upsertCareerDna(userId, {
          analytical: Math.min(10, analytical) * 10,
          creativity: Math.min(10, creativity) * 10,
          collaboration: Math.min(10, collaboration) * 10,
          risk_tolerance: Math.min(10, riskTolerance) * 10,
          archetype: analytical > collaboration ? "Builder" : collaboration > creativity ? "Team Catalyst" : "Explorer",
        });
      }

      console.log("LocalStorage migration completed successfully.");
    } catch (e) {
      console.error("Migration failed:", e);
    }
  },

  async resetUserData(userId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    return withRetry(async () => {
      await supabase.from("simulations").delete().eq("user_id", userId);
      await supabase.from("bookmarks").delete().eq("user_id", userId);
      await supabase.from("career_dna").delete().eq("user_id", userId);
      await supabase.from("journal_entries").delete().eq("user_id", userId);
      await supabase.from("ai_mentor_memory").delete().eq("user_id", userId);
      await supabase.from("mentor_chats").delete().eq("user_id", userId);
      await supabase.from("quest_progress").delete().eq("user_id", userId);
      await supabase.from("skill_progress").delete().eq("user_id", userId);
      
      await supabase
        .from("profiles")
        .update({
          name: "",
          grade: null,
          suggested_path: null,
          career_pressure: null,
          onboarding_completed: false,
          xp: 0,
          achievements: [],
          interests: [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    });
  },
};
