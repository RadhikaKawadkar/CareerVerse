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

// ----------------------------------------------------
// Service Types
// ----------------------------------------------------

export type DbProfile = {
  id: string;
  name: string;
  grade: number | null;
  suggested_path: string | null;
  career_pressure: string | null;
  onboarding_completed: boolean;
  xp: number;
  achievements: string[];
  interests: string[];
};

export type DbCareerDna = {
  user_id: string;
  analytical: number;
  creativity: number;
  collaboration: number;
  risk_tolerance: number;
  archetype: string;
};

export type DbSimulation = {
  id?: string;
  user_id: string;
  career_name: string;
  choices_made: Record<string, SweSceneChoice | null>;
  completion_status: string;
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
  created_at?: string;
};

export type DbBookmark = {
  id?: string;
  user_id: string;
  career_name: string;
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
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Record not found, create one
          return await this.createProfile(userId, { name: "" });
        }
        console.error("Error fetching profile from Supabase:", error.message);
        throw error;
      }
      return {
        id: data.id,
        name: data.name,
        grade: data.grade,
        suggested_path: data.suggested_path,
        career_pressure: data.career_pressure,
        onboarding_completed: data.onboarding_completed,
        xp: data.xp,
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
        interests: Array.isArray(data.interests) ? data.interests : [],
      };
    });
  },

  async createProfile(userId: string, updates: Partial<DbProfile>): Promise<DbProfile> {
    return withRetry(async () => {
      const dbData = {
        id: userId,
        name: updates.name ?? "",
        grade: updates.grade ?? null,
        suggested_path: updates.suggested_path ?? null,
        career_pressure: updates.career_pressure ?? null,
        onboarding_completed: updates.onboarding_completed ?? false,
        xp: updates.xp ?? 0,
        achievements: updates.achievements ?? [],
        interests: updates.interests ?? [],
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert(dbData)
        .select()
        .single();

      if (error) {
        console.error("Error creating/updating profile in Supabase:", error.message);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        grade: data.grade,
        suggested_path: data.suggested_path,
        career_pressure: data.career_pressure,
        onboarding_completed: data.onboarding_completed,
        xp: data.xp,
        achievements: data.achievements || [],
        interests: data.interests || [],
      };
    });
  },

  async updateProfile(userId: string, updates: Partial<DbProfile>): Promise<DbProfile | null> {
    if (!isSupabaseConfigured) return null;
    return withRetry(async () => {
      // Convert fields to snake_case for DB
      const dbUpdates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.grade !== undefined) dbUpdates.grade = updates.grade;
      if (updates.suggested_path !== undefined) dbUpdates.suggested_path = updates.suggested_path;
      if (updates.career_pressure !== undefined) dbUpdates.career_pressure = updates.career_pressure;
      if (updates.onboarding_completed !== undefined) dbUpdates.onboarding_completed = updates.onboarding_completed;
      if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
      if (updates.achievements !== undefined) dbUpdates.achievements = updates.achievements;
      if (updates.interests !== undefined) dbUpdates.interests = updates.interests;

      const { data, error } = await supabase
        .from("profiles")
        .update(dbUpdates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile in Supabase:", error.message);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        grade: data.grade,
        suggested_path: data.suggested_path,
        career_pressure: data.career_pressure,
        onboarding_completed: data.onboarding_completed,
        xp: data.xp,
        achievements: data.achievements || [],
        interests: data.interests || [],
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
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return await this.upsertCareerDna(userId, {
            analytical: 0,
            creativity: 0,
            collaboration: 0,
            risk_tolerance: 0,
            archetype: "Explorer",
          });
        }
        console.error("Error fetching Career DNA:", error.message);
        throw error;
      }
      return data;
    });
  },

  async upsertCareerDna(userId: string, dna: Partial<DbCareerDna>): Promise<DbCareerDna> {
    return withRetry(async () => {
      const dbData = {
        user_id: userId,
        analytical: dna.analytical ?? 0,
        creativity: dna.creativity ?? 0,
        collaboration: dna.collaboration ?? 0,
        risk_tolerance: dna.risk_tolerance ?? 0,
        archetype: dna.archetype ?? "Explorer",
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("career_dna")
        .upsert(dbData)
        .select()
        .single();

      if (error) {
        console.error("Error upserting Career DNA:", error.message);
        throw error;
      }
      return data;
    });
  },

  /**
   * Simulations (Resume functionality included)
   */
  async getSimulations(userId: string): Promise<DbSimulation[]> {
    if (!isSupabaseConfigured) return [];
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("simulations")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching simulations:", error.message);
        throw error;
      }
      return data || [];
    });
  },

  async getSimulation(userId: string, careerName: string): Promise<DbSimulation | null> {
    if (!isSupabaseConfigured) return null;
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("simulations")
        .select("*")
        .eq("user_id", userId)
        .eq("career_name", careerName)
        .maybeSingle();

      if (error) {
        console.error("Error fetching simulation:", error.message);
        throw error;
      }
      return data;
    });
  },

  async upsertSimulation(userId: string, sim: Partial<DbSimulation> & { career_name: string }): Promise<DbSimulation> {
    return withRetry(async () => {
      const dbData = {
        user_id: userId,
        career_name: sim.career_name,
        choices_made: sim.choices_made ?? {},
        completion_status: sim.completion_status ?? "in_progress",
        ending_unlocked: sim.ending_unlocked ?? null,
        reflection_interest: sim.reflection_interest ?? null,
        reflection_confidence: sim.reflection_confidence ?? null,
        current_step: sim.current_step ?? null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("simulations")
        .upsert(dbData, { onConflict: "user_id,career_name" })
        .select()
        .single();

      if (error) {
        console.error("Error upserting simulation:", error.message);
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
        .from("journal")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching journal entries:", error.message);
        throw error;
      }
      return data || [];
    });
  },

  async addJournalEntry(userId: string, reflectionText: string, careerReference: string): Promise<DbJournalEntry> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("journal")
        .insert({
          user_id: userId,
          reflection_text: reflectionText,
          career_reference: careerReference,
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting journal entry:", error.message);
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
        console.error("Error fetching bookmarks:", error.message);
        throw error;
      }
      return data || [];
    });
  },

  async addBookmark(userId: string, careerName: string): Promise<DbBookmark> {
    return withRetry(async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .upsert({ user_id: userId, career_name: careerName }, { onConflict: "user_id,career_name" })
        .select()
        .single();

      if (error) {
        console.error("Error adding bookmark:", error.message);
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
        .eq("career_name", careerName);

      if (error) {
        console.error("Error removing bookmark:", error.message);
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
        console.error("Error fetching AI mentor memory:", error.message);
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
        console.error("Error upserting AI mentor memory:", error.message);
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
        this.getProfile(userId),
        this.getCareerDna(userId),
        this.getSimulations(userId),
        this.getJournalEntries(userId),
        this.getBookmarks(userId),
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
      console.error("Failed to load dashboard data:", e);
      throw e;
    }
  },

  /**
   * Migration Layer: Safe sync from LocalStorage data structure to Supabase DB.
   * Merges safely, avoiding duplicates using constraints.
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
      const achievements: string[] = [];

      // 2. Migrate Science experience to simulations table
      if (localData.science.completed || localData.science.step) {
        initialXp += localData.science.completed ? 100 : 20;
        if (localData.science.completed) achievements.push("science_pioneer");

        await this.upsertSimulation(userId, {
          career_name: "science",
          choices_made: {},
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
        if (localData.simulation.completed) achievements.push("swe_explorer");

        const choices: Record<string, SweSceneChoice | null> = {};
        if (localData.simulation.choices.scene1) choices.scene1 = localData.simulation.choices.scene1;
        if (localData.simulation.choices.scene2) choices.scene2 = localData.simulation.choices.scene2;
        if (localData.simulation.choices.scene3) choices.scene3 = localData.simulation.choices.scene3;

        await this.upsertSimulation(userId, {
          career_name: "software-engineer",
          choices_made: choices,
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
      if (initialXp > 0 || achievements.length > 0) {
        const currentProfile = await this.getProfile(userId);
        if (currentProfile) {
          const newXp = (currentProfile.xp || 0) + initialXp;
          const mergedAchievements = Array.from(new Set([...(currentProfile.achievements || []), ...achievements]));
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
        if (choices.scene1 === "b") { analytical += 1; collaboration -= 1; } // Alone
        if (choices.scene2 === "a") analytical += 2; // Logs methodically
        if (choices.scene2 === "b") { riskTolerance += 2; analytical -= 1; } // Ship quick patch
        if (choices.scene3 === "a") { creativity += 2; riskTolerance += 1; } // Polish UI
        if (choices.scene3 === "b") analytical += 1; // Ship functional

        await this.upsertCareerDna(userId, {
          analytical: Math.min(10, analytical),
          creativity: Math.min(10, creativity),
          collaboration: Math.min(10, collaboration),
          risk_tolerance: Math.min(10, riskTolerance),
          archetype: analytical > collaboration ? "Builder" : collaboration > creativity ? "Team Catalyst" : "Explorer",
        });
      }

      console.log("Localstorage migration completed successfully.");
    } catch (e) {
      console.error("Migration failed:", e);
    }
  },

  async resetUserData(userId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    return withRetry(async () => {
      // 1. Delete simulations
      await supabase.from("simulations").delete().eq("user_id", userId);
      // 2. Delete bookmarks
      await supabase.from("bookmarks").delete().eq("user_id", userId);
      // 3. Delete DNA
      await supabase.from("career_dna").delete().eq("user_id", userId);
      // 4. Delete journal entries
      await supabase.from("journal").delete().eq("user_id", userId);
      // 5. Delete AI memory
      await supabase.from("ai_mentor_memory").delete().eq("user_id", userId);
      
      // 6. Reset profile to default
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
