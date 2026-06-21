# CareerVerse Future Architecture Blueprint (V11)

This document outlines the technical design, database schemas, and API integration paths required to transition CareerVerse from a client-side localStorage MVP to a distributed, scalable, and intelligent cloud ecosystem.

---

## 1. Relational Database Schema (Supabase / PostgreSQL)

To replace localStorage serialization, we will utilize a PostgreSQL database managed via Supabase or Firebase Firestore. Below is the proposed relational schema:

```mermaid
erDiagram
    USERS ||--o| PROFILES : "has"
    USERS ||--o{ SIMULATION_ATTEMPTS : "completes"
    USERS ||--o{ JOURNAL_ENTRIES : "writes"
    USERS ||--o{ SAVED_CAREERS : "bookmarks"
    USERS ||--o{ SAVED_MENTORS : "bookmarks"
    USERS ||--o{ COMPLETED_QUESTS : "claims"
    MENTORS ||--o{ MOCK_SESSIONS : "offers"
    USERS ||--o{ MOCK_SESSIONS : "books"

    USERS {
        uuid id PK
        string email
        timestamp created_at
    }
    PROFILES {
        uuid user_id FK
        string first_name
        int grade
        string career_pressure
        int xp_points
        int streak_days
        string explorer_rank
        jsonb dna_attributes
        timestamp updated_at
    }
    SIMULATION_ATTEMPTS {
        uuid id PK
        uuid user_id FK
        string career_id
        string current_step
        jsonb choice_log
        int interest_rating
        int confidence_rating
        boolean completed
        timestamp completed_at
    }
    JOURNAL_ENTRIES {
        uuid id PK
        uuid user_id FK
        string career_id
        string reflection_prompt
        text response_text
        timestamp created_at
    }
    SAVED_CAREERS {
        uuid id PK
        uuid user_id FK
        string career_id
    }
    SAVED_MENTORS {
        uuid id PK
        uuid user_id FK
        string mentor_id
    }
```

---

## 2. Authentication Flow (OAuth 2.0 / Passwordless)

```mermaid
sequenceDiagram
    participant Student as Client Browser
    participant Auth as Supabase Auth Server
    participant DB as PostgreSQL Database

    Student->>Auth: Request Passwordless Magic Link / Google OAuth
    Auth-->>Student: Return Redirect URL / Send Email Token
    Student->>Auth: Callback with token verification
    Auth->>DB: Check if user exists in database
    alt User is New
        DB->>DB: Create user row & initialize default profile
    end
    Auth-->>Student: Return JWT Session Token (AccessToken + RefreshToken)
    Note over Student: Store JWT in HttpOnly Cookie or Secure Session
```

---

## 3. Real AI API Streaming Integration (Gemini / OpenAI)

To replace mock AI Coach responses with real LLM streams, we will configure an Edge API route:

```typescript
// File: /app/api/coaching/chat/route.ts
import { GoogleGenAI } from "@google/genai";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, userProfile } = await req.json();

  // Inject user profile memory to establish context
  const systemInstruction = `
    You are the CareerVerse AI Coach. You help high school students (Grade 9-12) explore streams.
    Reference their unified profile stats:
    - Name: ${userProfile.name}
    - Grade: ${userProfile.grade}
    - DNA Style: ${userProfile.dna.workStyle} (Analytical: ${userProfile.dna.analytical}%, Creative: ${userProfile.dna.creativity}%)
    - Completed Journeys: ${userProfile.completedSimulations.join(", ")}
    - Bookmarked Goals: ${userProfile.goals.join(", ")}
    - Unlocked Skills: ${userProfile.unlockedSkills.join(", ")}

    Provide actionable steps, encourage self-reflection, and speak like a supportive startup mentor. Keep answers under 150 words.
  `;

  // Request streaming completion
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: messages,
    config: {
      systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 800,
    }
  });

  // Convert response to standard web stream
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.text;
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    }
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream" }
  });
}
```

---

## 4. Mentor Marketplace Webhooks & Real Booking

To transition mock booking sessions to real calls (using Cal.com or Calendly widgets + Stripe payments):

```mermaid
sequenceDiagram
    participant Student as Student Browser
    participant Cal as Cal.com Widget API
    participant Hub as NextJS Serverless API
    participant Stripe as Stripe Payment Gateway
    participant Zoom as Zoom / Google Meet API

    Student->>Cal: Select Mentor slot & click Book
    Cal->>Stripe: Trigger payment authorization
    Stripe-->>Student: Prompt payment confirmation
    Stripe->>Hub: Webhook: Payment Succeeded
    Hub->>Cal: Confirm booking slot
    Cal->>Zoom: Generate Google Meet video link
    Cal->>Hub: Trigger webhook with booking details
    Hub->>Student: Send Confirmation Email + Calendar Invite
```

---

## 5. Real-Time Community Discussion Rooms

For real-time user-to-user community threads, we will integrate Supabase Realtime Channels:

```typescript
// File: /hooks/use-community-room.ts
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export function useCommunityRoom(roomName: string) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch historical thread records
    supabase
      .from("posts")
      .select("*")
      .eq("room_id", roomName)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data);
      });

    // 2. Subscribe to realtime broadcast events
    const channel = supabase
      .channel(`room:${roomName}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts", filter: `room_id=eq.${roomName}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomName]);

  const sendMessage = async (userId: string, username: string, content: string) => {
    await supabase.from("posts").insert({
      room_id: roomName,
      user_id: userId,
      author_name: username,
      content_text: content,
      created_at: new Date().toISOString()
    });
  };

  return { messages, sendMessage };
}
```
