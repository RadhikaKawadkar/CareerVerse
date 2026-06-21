import { 
  saveProfile, 
  saveCareerDNA, 
  saveSimulation, 
  saveJournalEntry, 
  saveBookmark, 
  saveQuestProgress, 
  saveSkillProgress,
  saveMentorChat
} from "./supabase-service";
import { getUnifiedProfileV12 } from "./global-state";

export async function migrateLocalDataToSupabase(userId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  const migrationStatusKey = `careerverse-migrated-to-supabase-${userId}`;
  if (localStorage.getItem(migrationStatusKey) === "true") {
    return false; // Already migrated
  }

  console.log(`Starting Supabase data migration for user: ${userId}`);

  try {
    // 1. Fetch current Unified Profile from localStorage
    const localProfile = getUnifiedProfileV12();

    // 2. Migrate Profile Base
    await saveProfile(userId, localProfile);

    // 3. Migrate Career DNA
    if (localProfile.dna) {
      await saveCareerDNA(userId, localProfile.dna);
    }

    // 4. Migrate Bookmarks
    const bookmarks = localProfile.favoriteCareers || [];
    for (const careerId of bookmarks) {
      await saveBookmark(userId, careerId, true);
    }

    // 5. Migrate Journal Reflections
    const reflections = localProfile.journalReflections || [];
    for (const reflection of reflections) {
      await saveJournalEntry(userId, reflection);
    }

    // 6. Migrate Simulations
    // Find all simulation-* keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("simulation-")) {
        const careerId = key.replace("simulation-", "");
        try {
          const simData = JSON.parse(localStorage.getItem(key) || "{}");
          await saveSimulation(
            userId,
            careerId,
            Boolean(simData.completed),
            Number(simData.currentSceneIndex || 0),
            simData.choices || {}
          );
        } catch (e) {
          console.error(`Failed to migrate simulation key ${key}:`, e);
        }
      }
    }

    // 7. Migrate Quest Progress
    const questProg = localProfile.questProgress || { active: [], completed: [], milestones: [] };
    await saveQuestProgress(
      userId,
      questProg.active || [],
      questProg.completed || [],
      questProg.milestones || []
    );

    // 8. Migrate Skill Progress
    const unlockedSkills = localProfile.unlockedSkills || [];
    await saveSkillProgress(userId, unlockedSkills);

    // 9. Migrate Mentor Chats if any exist locally
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("careerverse-ai-mentor-chats-")) {
        const mentorSlug = key.replace("careerverse-ai-mentor-chats-", "");
        // Map slug back to title case roughly or use key value
        const mentorName = mentorSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        try {
          const chats = JSON.parse(localStorage.getItem(key) || "[]");
          if (chats.length > 0) {
            await saveMentorChat(userId, mentorName, chats);
          }
        } catch {}
      }
    }

    // Mark migration as successful
    localStorage.setItem(migrationStatusKey, "true");
    console.log(`Supabase migration completed successfully for user: ${userId}`);
    return true;
  } catch (err) {
    console.error("Migration failed:", err);
    return false;
  }
}
