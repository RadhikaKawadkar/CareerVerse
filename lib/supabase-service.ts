import { supabase } from "./supabase";
import { type UnifiedProfileV12, type JournalReflection } from "./global-state";
import { formatSupabaseError } from "./database";

// Profiles table helpers
export async function getProfile(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching profile:", formatSupabaseError(error));
    return null;
  }
  return data;
}

export async function saveProfile(userId: string, data: Partial<UnifiedProfileV12>) {
  if (!supabase) return null;
  const profilePayload = {
    id: userId,
    name: data.name,
    grade: data.grade,
    xp: data.xp,
    level: data.level,
    streak: data.streak,
    rank: data.rank,
    badges: data.badges,
    interests: data.interests,
    personality_signals: data.personalitySignals,
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("profiles")
    .upsert(profilePayload)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error upserting profile:", formatSupabaseError(error));
    return null;
  }
  return result;
}

// Career DNA helpers
export async function getCareerDNA(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("career_dna")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching career DNA:", formatSupabaseError(error));
    return null;
  }
  return data;
}

export async function saveCareerDNA(userId: string, dna: UnifiedProfileV12["dna"]) {
  if (!supabase) return null;
  const dnaPayload = {
    user_id: userId,
    analytical: dna.analytical,
    creativity: dna.creativity,
    collaboration: dna.collaboration,
    risk: dna.risk,
    risk_tolerance: dna.risk,
    work_style: dna.workStyle,
    learning_style: dna.learningStyle,
    communication_score: dna.communicationScore,
    creativity_score: dna.creativityScore,
    leadership_score: dna.leadershipScore,
    analytical_score: dna.analyticalScore,
    confidence_score: dna.confidenceScore,
    communication: dna.communicationScore,
    leadership: dna.leadershipScore,
    confidence: dna.confidenceScore,
    empathy: 50,
    decision_patterns: dna.decisionPatterns,
    strength_clusters: dna.strengthClusters,
    growth_history: dna.growthHistory,
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("career_dna")
    .upsert(dnaPayload)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error upserting career DNA:", formatSupabaseError(error));
    return null;
  }
  return result;
}

// Simulations helpers
export async function getSimulations(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("simulations")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching simulations:", formatSupabaseError(error));
    return [];
  }
  return data;
}

export async function saveSimulation(
  userId: string,
  careerId: string,
  completed: boolean,
  currentSceneIndex: number,
  choices: Record<string, unknown>
) {
  if (!supabase) return null;
  const payload = {
    user_id: userId,
    career_id: careerId,
    completed,
    current_scene_index: currentSceneIndex,
    choices,
    choices_made: choices,
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("simulations")
    .upsert(payload, { onConflict: "user_id,career_id" })
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error upserting simulation:", formatSupabaseError(error));
    return null;
  }
  return result;
}

// Journal entries helpers
export async function getJournalEntries(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching journal entries:", formatSupabaseError(error));
    return [];
  }
  return data;
}

export async function saveJournalEntry(userId: string, entry: JournalReflection) {
  if (!supabase) return null;
  const payload = {
    id: entry.id.includes("ref-") ? undefined : entry.id,
    user_id: userId,
    career_id: entry.careerId,
    excited: entry.excited,
    difficult: entry.difficult,
    surprised: entry.surprised,
    feeling: entry.feeling,
    timestamp: entry.timestamp,
    created_at: entry.timestamp || new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("journal_entries")
    .upsert(payload)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error saving journal entry:", formatSupabaseError(error));
    return null;
  }
  return result;
}

// Bookmarks helpers
export async function getBookmarks(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching bookmarks:", formatSupabaseError(error));
    return [];
  }
  return data;
}

export async function saveBookmark(userId: string, careerId: string, bookmarked: boolean) {
  if (!supabase) return null;
  if (bookmarked) {
    const { data: result, error } = await supabase
      .from("bookmarks")
      .upsert({ user_id: userId, career_id: careerId, career_name: careerId }, { onConflict: "user_id,career_id" })
      .select()
      .maybeSingle();
    if (error) console.error("Error bookmarking:", formatSupabaseError(error));
    return result;
  } else {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .match({ user_id: userId, career_id: careerId });
    if (error) console.error("Error removing bookmark:", formatSupabaseError(error));
    return null;
  }
}

// Mentor Chats helpers
export async function getMentorChats(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("mentor_chats")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching chats:", formatSupabaseError(error));
    return [];
  }
  return data;
}

export async function saveMentorChat(userId: string, mentorName: string, messages: unknown[]) {
  if (!supabase) return null;
  const payload = {
    user_id: userId,
    mentor_name: mentorName,
    messages,
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("mentor_chats")
    .upsert(payload, { onConflict: "user_id,mentor_name" })
    .select()
    .maybeSingle();
  if (error) console.error("Error saving mentor chat:", formatSupabaseError(error));
  return result;
}

// Achievements helpers
export async function getAchievements(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching achievements:", formatSupabaseError(error));
    return [];
  }
  return data;
}

export async function saveAchievement(userId: string, badgeName: string) {
  if (!supabase) return null;
  const payload = {
    user_id: userId,
    badge_name: badgeName,
    earned_at: new Date().toISOString(),
    unlocked_at: new Date().toISOString(),
  };
  const { data: result, error } = await supabase
    .from("achievements")
    .upsert(payload, { onConflict: "user_id,badge_name" })
    .select()
    .maybeSingle();
  if (error) console.error("Error saving achievement:", formatSupabaseError(error));
  return result;
}

// Quest progress helpers
export async function getQuestProgress(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("quest_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching quest progress:", formatSupabaseError(error));
    return null;
  }
  return data;
}

export async function saveQuestProgress(
  userId: string,
  active: string[],
  completed: string[],
  milestones: string[]
) {
  if (!supabase) return null;
  const payload = {
    user_id: userId,
    active,
    completed,
    milestones,
    progress: {},
    claimed_milestones: milestones,
    updated_at: new Date().toISOString(),
  };
  const { data: result, error } = await supabase
    .from("quest_progress")
    .upsert(payload)
    .select()
    .maybeSingle();
  if (error) console.error("Error saving quest progress:", formatSupabaseError(error));
  return result;
}

// Skill progress helpers
export async function getSkillProgress(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("skill_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Error fetching skill progress:", formatSupabaseError(error));
    return null;
  }
  return data;
}

export async function saveSkillProgress(userId: string, unlockedSkills: string[]) {
  if (!supabase) return null;
  const payload = {
    user_id: userId,
    unlocked_skills: unlockedSkills,
    claimed_skills: unlockedSkills,
    updated_at: new Date().toISOString(),
  };
  const { data: result, error } = await supabase
    .from("skill_progress")
    .upsert(payload)
    .select()
    .maybeSingle();
  if (error) console.error("Error saving skill progress:", formatSupabaseError(error));
  return result;
}
