"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";
import { 
  Mic, MicOff, Scale, HeartPulse, Send, Play, RefreshCw, 
  ChevronRight, Volume2, VolumeX, ShieldAlert, Award, CheckCircle2, ArrowLeft, Brain, Pause
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalProfile } from "@/lib/global-state";
import { db } from "@/lib/database";
import { cn } from "@/lib/utils";

// TypeScript type interfaces
type Message = {
  id: string;
  sender: "user" | "character";
  text: string;
};

type RoleplayReport = {
  strengths: string;
  improvement: string;
  communicationScore: number;
  confidenceScore: number;
  reasoningScore: number;
  empathyScore?: number;
  persuasionScore?: number;
  careerFitScore: number;
  careerFitInsight: string;
  nextAction: string;
};

export default function VoiceRoleplayPage() {
  const { profile, updateProfile } = useGlobalProfile();
  
  // App state
  const [career, setCareer] = useState<"lawyer" | "doctor" | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  
  // Voice API state
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [isCharacterSpeaking, setIsCharacterSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [micStatus, setMicStatus] = useState<"ready" | "listening" | "processing" | "no-speech" | "blocked" | "unsupported" | "not-secure">("ready");
  
  // Two-way voice loop states
  const [isTwoWayMode, setIsTwoWayMode] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [turnCount, setTurnCount] = useState(0);

  // Recognition Ref
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  
  // Feedback evaluation report state
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<RoleplayReport | null>(null);

  // Refs to prevent stale closures inside event listeners
  const isTwoWayModeRef = useRef(isTwoWayMode);
  const isPausedRef = useRef(isPaused);
  const isProcessingRef = useRef(false);
  const isListeningRef = useRef(isListening);
  const isCharacterSpeakingRef = useRef(isCharacterSpeaking);
  const isThinkingRef = useRef(isThinking);
  const careerRef = useRef(career);
  const historyRef = useRef(history);
  const turnCountRef = useRef(turnCount);
  const isPlayingRef = useRef(isPlaying);

  // Sync refs with state updates
  useEffect(() => { isTwoWayModeRef.current = isTwoWayMode; }, [isTwoWayMode]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { isCharacterSpeakingRef.current = isCharacterSpeaking; }, [isCharacterSpeaking]);
  useEffect(() => { isThinkingRef.current = isThinking; }, [isThinking]);
  useEffect(() => { careerRef.current = career; }, [career]);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { turnCountRef.current = turnCount; }, [turnCount]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Save session state to localStorage
  const saveSessionToLocalStorage = (
    activeCareer: "lawyer" | "doctor" | null,
    activeHistory: Message[],
    activeTurnCount: number,
    activeIsPlaying: boolean
  ) => {
    if (typeof window !== "undefined") {
      if (activeIsPlaying && activeCareer) {
        const sessionData = {
          career: activeCareer,
          history: activeHistory,
          turnCount: activeTurnCount,
          isPlaying: activeIsPlaying,
          timestamp: Date.now()
        };
        localStorage.setItem("careerverse-active-roleplay-session", JSON.stringify(sessionData));
      } else {
        localStorage.removeItem("careerverse-active-roleplay-session");
      }
    }
  };

  // Sync state changes with localStorage
  useEffect(() => {
    if (isPlaying && career) {
      saveSessionToLocalStorage(career, history, turnCount, isPlaying);
    }
  }, [career, history, turnCount, isPlaying]);

  // Load session from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("careerverse-active-roleplay-session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Restore if it's less than 2 hours old
          if (Date.now() - parsed.timestamp < 2 * 60 * 60 * 1000) {
            setCareer(parsed.career);
            setHistory(parsed.history);
            setTurnCount(parsed.turnCount);
            setIsPlaying(parsed.isPlaying);
            // Sync refs
            careerRef.current = parsed.career;
            historyRef.current = parsed.history;
            turnCountRef.current = parsed.turnCount;
            isPlayingRef.current = parsed.isPlaying;
          }
        } catch (e) {
          console.error("Failed to restore saved roleplay session:", e);
        }
      }
    }
  }, []);

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;

      const isSecure = window.location.hostname === "localhost" ||
                       window.location.hostname === "127.0.0.1" ||
                       window.location.protocol === "https:";

      if (!isSecure) {
        setMicStatus("not-secure");
        return;
      }
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMicStatus("unsupported");
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-IN";

      rec.onstart = () => {
        setIsListening(true);
        setMicStatus("listening");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        if (interimTranscript) {
          setCurrentInput(interimTranscript);
          setMicStatus("processing");
        }
        
        if (finalTranscript) {
          const cleanFinal = finalTranscript.trim();
          if (cleanFinal) {
            setCurrentInput(cleanFinal);
            
            // Auto-send in continuous voice loop mode
            if (isTwoWayModeRef.current && !isPausedRef.current && !isProcessingRef.current) {
              isProcessingRef.current = true;
              
              // Stop recognition immediately to prevent duplicate sends
              try {
                rec.abort();
              } catch {}
              
              handleSendMessage(cleanFinal);
            }
          }
        }
      };

      rec.onerror = (e: any) => {
        setIsListening(false);
        const errType = e.error;
        console.error("Speech Recognition Error:", errType, e);

        if (errType === "not-allowed" || errType === "permission-denied") {
          setMicStatus("blocked");
        } else if (errType === "no-speech") {
          setMicStatus("no-speech");
        } else if (errType === "audio-capture") {
          setMicStatus("unsupported");
        } else {
          setMicStatus("ready");
        }
      };

      rec.onend = () => {
        setIsListening(false);
        if (!isProcessingRef.current) {
          setMicStatus("ready");
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isThinking]);

  // Automatically start the mic for next student turn in Two-Way Loop
  const startListeningAutomatically = async () => {
    if (!recognitionRef.current) return;
    
    // Ensure synthesis is completely cleared first
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsCharacterSpeaking(false);
    
    if (isListeningRef.current) return;

    setMicStatus("processing");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Double check states before starting
      if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current) {
        recognitionRef.current.start();
      }
    } catch (err: any) {
      console.error("Microphone auto-start error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicStatus("blocked");
      } else {
        setMicStatus("ready");
      }
      setIsListening(false);
    }
  };

  // Voice Speech synthesis reader helper
  const speakText = (text: string) => {
    if (!synthesisRef.current || !voiceOutputEnabled) {
      setIsCharacterSpeaking(false);
      // Muted fallback: wait 2 seconds for user to read then start listening
      if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current) {
        setTimeout(() => {
          if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current) {
            startListeningAutomatically();
          }
        }, 2000);
      }
      return;
    }
    
    synthesisRef.current.cancel(); // Stop current speech
    
    const cleanText = text.replace(/\[[^\]]*\]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    
    // Choose appropriate voice
    const voices = synthesisRef.current.getVoices();
    if (careerRef.current === "lawyer") {
      const maleVoice = voices.find(v => 
        v.name.toLowerCase().includes("male") || 
        v.name.toLowerCase().includes("google uk english male") || 
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("microsoft")
      );
      if (maleVoice) utterance.voice = maleVoice;
    } else {
      const naturalVoice = voices.find(v => 
        v.name.toLowerCase().includes("natural") || 
        v.name.toLowerCase().includes("google") || 
        v.name.toLowerCase().includes("zira")
      );
      if (naturalVoice) utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsCharacterSpeaking(true);
    utterance.onend = () => {
      setIsCharacterSpeaking(false);
      // Auto-restart mic in Two-Way Mode
      if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current) {
        startListeningAutomatically();
      }
    };
    utterance.onerror = () => {
      setIsCharacterSpeaking(false);
      if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current) {
        startListeningAutomatically();
      }
    };
    
    synthesisRef.current.speak(utterance);
  };

  // Start a roleplay session
  const startSession = async (selectedCareer: "lawyer" | "doctor") => {
    setCareer(selectedCareer);
    setIsPlaying(true);
    setTurnCount(0);
    setHistory([]);
    setCurrentInput("");
    setShowReport(false);
    setReport(null);
    setIsThinking(true);
    setIsPaused(false);
    isProcessingRef.current = false;

    careerRef.current = selectedCareer;
    isPlayingRef.current = true;
    historyRef.current = [];
    turnCountRef.current = 0;
    isPausedRef.current = false;

    if (selectedCareer === "lawyer") {
      const intro = "Welcome, counselor. The Court of CareerVerse is now in session. You represent the defendant. Please present your opening statement outlining why your client is not guilty of these charges.";
      setHistory([{ id: "init", sender: "character", text: intro }]);
      setIsThinking(false);
      setTimeout(() => speakText(intro), 300);
    } else {
      const intro = "Hello doctor... I'm really glad you could see me. For the last couple of days, I've had this persistent squeezing sensation right in the middle of my chest. It gets worse whenever I walk up a hill or carry anything heavy, and I feel really anxious and short of breath. Do you think I'm having a heart attack?";
      setHistory([{ id: "init", sender: "character", text: intro }]);
      setIsThinking(false);
      setTimeout(() => speakText(intro), 300);
    }
  };

  // Toggle Voice Capture manually
  const toggleListening = async () => {
    const isSecure = window.location.hostname === "localhost" ||
                     window.location.hostname === "127.0.0.1" ||
                     window.location.protocol === "https:";
    if (!isSecure) {
      setMicStatus("not-secure");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || !recognitionRef.current) {
      setMicStatus("unsupported");
      return;
    }

    // Stop speaking if characters are talking
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsCharacterSpeaking(false);

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
      setIsListening(false);
      setMicStatus("ready");
    } else {
      setMicStatus("processing");
      try {
        // Microphone permission check
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // If granted, start recognition
        recognitionRef.current.start();
      } catch (err: any) {
        console.error("Microphone access error:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setMicStatus("blocked");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setMicStatus("unsupported");
          alert("No microphone found. Please connect a microphone and try again.");
        } else {
          setMicStatus("blocked");
        }
        setIsListening(false);
      }
    }
  };

  // Toggle continuous voice loop mode
  const toggleTwoWayMode = () => {
    const nextMode = !isTwoWayMode;
    setIsTwoWayMode(nextMode);
    isTwoWayModeRef.current = nextMode;
    
    if (!nextMode) {
      // Abort active listening if continuous loop turned off
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        setIsListening(false);
        setMicStatus("ready");
      }
    } else {
      // Start listening if toggling continuous voice back on
      if (isPlaying && !isCharacterSpeaking && !isThinking && !isPaused && !isProcessingRef.current) {
        startListeningAutomatically();
      }
    }
  };

  // Toggle microphone pause state during session
  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    isPausedRef.current = nextPaused;
    
    if (nextPaused) {
      // Stop active listening immediately
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
        setIsListening(false);
        setMicStatus("ready");
      }
    } else {
      // Resume listening if appropriate
      if (isTwoWayMode && isPlaying && !isCharacterSpeaking && !isThinking && !isProcessingRef.current) {
        startListeningAutomatically();
      }
    }
  };

  // Get contextual fallback response if Gemini is unavailable
  const getContextualFallbackResponse = (userMsg: string, currentHistory: Message[], selectedCareer: "lawyer" | "doctor" | null) => {
    const cleanMsg = userMsg.toLowerCase();
    
    if (selectedCareer === "lawyer") {
      if (cleanMsg.includes("innocent") || cleanMsg.includes("not guilty")) {
        return "The defense claims innocence. However, counselor, the prosecution's evidence stands. What specific alibi or record can you show to disprove their presence at the scene?";
      }
      if (cleanMsg.includes("evidence") || cleanMsg.includes("proof") || cleanMsg.includes("alibi")) {
        return "The Court notes your reference to the evidence. But counselor, the security footage is clear. How do you explain your client's flight response when the alarm sounded?";
      }
      if (cleanMsg.includes("flight") || cleanMsg.includes("ran") || cleanMsg.includes("scared")) {
        return "An innocent person has no reason to run. The court remains skeptical of this explanation. Please summarize your final defense argument counselor.";
      }
      return `You argued: "${userMsg}". How does this address the main charge of trespass and felony theft? Explain your reasoning counselor.`;
    } else {
      if (cleanMsg.includes("pain") || cleanMsg.includes("constriction") || cleanMsg.includes("hurt")) {
        return "Yes, doctor. It is a squeezing, heavy weight right in my chest. It doesn't get better when I rest, and I feel quite sweaty. Do you think this is a heart issue?";
      }
      if (cleanMsg.includes("family") || cleanMsg.includes("father") || cleanMsg.includes("history")) {
        return "My father actually had heart surgery when he was fifty. That's why I'm so worried, doctor. What is your initial diagnosis?";
      }
      if (cleanMsg.includes("diagnose") || cleanMsg.includes("think") || cleanMsg.includes("angina") || cleanMsg.includes("heart")) {
        return "Angina... wow, that sounds scary. What tests do I need to confirm this, and should I go to the emergency room if the pain returns tonight?";
      }
      if (cleanMsg.includes("emergency") || cleanMsg.includes("ecg") || cleanMsg.includes("test")) {
        return "Thank you for explaining that, doctor. I feel much more reassured. I will schedule the ECG test first thing tomorrow. Thank you for your care.";
      }
      return `I understand, doctor. Regarding my chest discomfort, you asked about that. I also feel quite short of breath. What should my next step be?`;
    }
  };

  // Submit User Message
  const handleSendMessage = async (textToSend?: string) => {
    const userText = textToSend !== undefined ? textToSend : currentInput.trim();
    if (!userText.trim()) {
      isProcessingRef.current = false;
      return;
    }

    isProcessingRef.current = true;
    setCurrentInput("");

    const newUserMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText
    };

    setHistory((prev) => [...prev, newUserMsg]);
    setIsThinking(true);
    setTurnCount((prev) => prev + 1);

    // Stop speaking if characters are talking
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsCharacterSpeaking(false);

    // Use current history plus the new message
    const activeHistory = [...historyRef.current, newUserMsg];

    try {
      const response = await fetch("/api/roleplay/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career: careerRef.current,
          scenario: careerRef.current === "lawyer" ? "Courtroom Trial" : "Clinical intake",
          message: userText,
          history: activeHistory.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
          profile: { name: profile?.name, grade: profile?.grade }
        })
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let characterText = "";
          
          const placeholderId = `msg-stream-${Date.now()}`;
          setHistory((prev) => [...prev, { id: placeholderId, sender: "character", text: "" }]);
          setIsThinking(false);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            characterText += chunk;
            
            setHistory((prev) => 
              prev.map(m => m.id === placeholderId ? { ...m, text: characterText } : m)
            );
          }
          
          // AI Response speaks aloud
          speakText(characterText);
        } else {
          throw new Error("No reader");
        }
      } else {
        throw new Error("API failed");
      }
    } catch (e) {
      console.warn("Falling back to local character dialogue engine.", e);
      const fallbackText = getContextualFallbackResponse(userText, activeHistory, careerRef.current);
      
      setIsThinking(false);
      
      const responseId = `msg-fallback-${Date.now()}`;
      setHistory((prev) => [...prev, { id: responseId, sender: "character", text: "" }]);
      
      const words = fallbackText.split(" ");
      let typedText = "";
      for (let i = 0; i < words.length; i++) {
        typedText += words[i] + (i === words.length - 1 ? "" : " ");
        setHistory((prev) => 
          prev.map(m => m.id === responseId ? { ...m, text: typedText } : m)
        );
        await new Promise(r => setTimeout(r, 20 + Math.random() * 20));
      }
      
      speakText(fallbackText);
    } finally {
      // Clear input and unlock processing
      setCurrentInput("");
      isProcessingRef.current = false;
    }
  };

  // Compile final feedback report card
  const generateFeedbackReport = async () => {
    setIsThinking(true);
    const evaluationHistory = [...history];

    try {
      const response = await fetch("/api/roleplay/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career,
          scenario: career === "lawyer" ? "Courtroom Trial" : "Clinical intake",
          history: evaluationHistory.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
          profile: { name: profile?.name },
          isFeedback: true
        })
      });

      if (response.ok) {
        const feedback = await response.json();
        const scoreReport: RoleplayReport = {
          strengths: feedback.strengths || "Strong active listening and direct response structure.",
          improvement: feedback.improvement || "Elaborate more on background context variables.",
          communicationScore: feedback.communicationScore || 80,
          confidenceScore: feedback.confidenceScore || 90,
          reasoningScore: feedback.reasoningScore || 85,
          empathyScore: feedback.empathyScore,
          persuasionScore: feedback.persuasionScore,
          careerFitScore: feedback.careerFitScore || 85,
          careerFitInsight: feedback.careerFitInsight || "Demonstrates strong professional traits.",
          nextAction: feedback.nextAction || (career === "lawyer" ? "Read up on court rules of evidence." : "Review cardiology diagnostic checklists.")
        };
        saveReportAndSync(scoreReport);
      } else {
        throw new Error("API failed");
      }
    } catch {
      // Local fallback metrics based on session history
      const wordCounts = history
        .filter(m => m.sender === "user")
        .map(m => m.text.split(" ").length);
      const avgWords = wordCounts.reduce((a, b) => a + b, 0) / (wordCounts.length || 1);
      
      // Calculate scores based on speech depth
      const confidence = Math.min(100, Math.max(60, Math.round(55 + avgWords * 1.5)));
      const communication = Math.min(100, Math.max(60, Math.round(50 + avgWords * 1.8)));
      const reasoning = Math.min(100, Math.max(60, Math.round(58 + avgWords * 1.3)));
      const empathy = career === "doctor" ? Math.min(100, Math.max(65, Math.round(62 + avgWords * 1.4))) : undefined;
      const persuasion = career === "lawyer" ? Math.min(100, Math.max(60, Math.round(55 + avgWords * 1.6))) : undefined;
      const fit = Math.min(100, Math.max(65, Math.round(60 + avgWords * 1.2)));

      const offlineFeedback: RoleplayReport = {
        strengths: career === "lawyer" 
          ? "You presented clear statements and maintained logical consistency under pushback." 
          : "Great empathetic patient intake, you asked helpful symptom questions to narrow down options.",
        improvement: career === "lawyer"
          ? "Strengthen statutory citations and address eyewitness timelines directly."
          : "Work on structuring your diagnosis explanation with clear symptom correlations.",
        communicationScore: communication,
        confidenceScore: confidence,
        reasoningScore: reasoning,
        empathyScore: empathy,
        persuasionScore: persuasion,
        careerFitScore: fit,
        careerFitInsight: career === "lawyer"
          ? "Demonstrates a strong aptitude for quick structural reasoning and courtroom etiquette."
          : "Shows strong clinical compassion and structured diagnostics necessary for client consulting.",
        nextAction: career === "lawyer" 
          ? "Check the mock trial simulated cases in the library." 
          : "Review the cardio-pulmonary symptom trees in Growth Hub."
      };
      saveReportAndSync(offlineFeedback);
    }
  };

  const saveReportAndSync = (evalReport: RoleplayReport) => {
    setReport(evalReport);
    setIsThinking(false);
    setShowReport(true);

    // Sync XP gain and update Career DNA
    if (profile) {
      const addedXp = 150; // High bonus for flagship feature completion
      const originalDna = profile.dna;
      
      // Calculate new averages
      const newComm = Math.round((originalDna.communicationScore + evalReport.communicationScore) / 2);
      const newConf = Math.round((originalDna.confidenceScore + evalReport.confidenceScore) / 2);
      
      const updatedDna = { ...originalDna, communicationScore: newComm, confidenceScore: newConf };
      
      if (career === "lawyer") {
        const newAnalytical = Math.round((originalDna.analyticalScore + evalReport.careerFitScore) / 2);
        updatedDna.analyticalScore = newAnalytical;
      } else {
        const newCollaboration = Math.round((originalDna.collaboration + evalReport.communicationScore) / 2);
        updatedDna.collaboration = newCollaboration;
      }

      // Add to completed simulations list
      const completedSims = [...profile.completedSimulations];
      const roleplayId = `roleplay-${career}`;
      if (!completedSims.includes(roleplayId)) {
        completedSims.push(roleplayId);
      }

      updateProfile({
        xp: profile.xp + addedXp,
        level: Math.floor((profile.xp + addedXp) / 400) + 1,
        completedSimulations: completedSims,
        dna: updatedDna
      });

      // Sync simulation record details optionally to Supabase
      const userId = typeof window !== "undefined" ? localStorage.getItem("careerverse-active-user-id") : null;
      if (userId) {
        db.upsertSimulation(userId, {
          career_name: `roleplay-${career}`,
          choices: {
            history: history.map(m => ({ sender: m.sender, text: m.text })),
            report: evalReport,
            turnCount: turnCount
          } as any,
          completion_status: "completed",
          ending_unlocked: `Completed ${career === "lawyer" ? "Judge Sterling" : "Alex Mercer"} Roleplay`,
          reflection_interest: evalReport.careerFitScore / 20, 
          reflection_confidence: evalReport.confidenceScore / 20, 
        }).catch((err: any) => console.error("Error syncing roleplay simulation to Supabase:", err));
      }

      // Dispatch XP event for visual effect
      window.dispatchEvent(
        new CustomEvent("careerverse-notification-added", {
          detail: {
            id: `notif-${Date.now()}`,
            type: "achievement",
            title: "Flagship Roleplay Completed!",
            message: `Earned +150 XP! Your Career DNA scores have been recalculated.`,
            timestamp: new Date().toISOString(),
            read: false
          }
        })
      );
    }
    // Remove localStorage session as it is now successfully finalized and scored
    if (typeof window !== "undefined") {
      localStorage.removeItem("careerverse-active-roleplay-session");
    }
  };

  const endSession = async () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsCharacterSpeaking(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsListening(false);
    setMicStatus("ready");
    
    await generateFeedbackReport();
  };

  const exitRoleplay = () => {
    setIsPlaying(false);
    setCareer(null);
    setHistory([]);
    setShowReport(false);
    setReport(null);
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsCharacterSpeaking(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("careerverse-active-roleplay-session");
    }
  };

  return (
    <AppShell className="pb-16">
      <div className="max-w-6xl mx-auto px-2">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-5">
          <div className="flex items-center gap-3">
            {isPlaying && (
              <button 
                onClick={exitRoleplay}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Interactive Suite</p>
              <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-black text-slate-900 mt-0.5">
                AI Voice Roleplay <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold ml-1">Live</span>
              </h1>
            </div>
          </div>

          {isPlaying && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
                className="rounded-xl h-9 px-3 border-border hover:bg-muted"
                title={voiceOutputEnabled ? "Mute AI speech output" : "Unmute AI speech output"}
              >
                {voiceOutputEnabled ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
                <span className="hidden sm:inline ml-1.5 text-xs font-bold">{voiceOutputEnabled ? "Voice Output" : "Text Fallback"}</span>
              </Button>
            </div>
          )}
        </div>

        {/* 1. SELECTION SCREEN */}
        {!isPlaying && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="max-w-2xl">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Select a Career Roleplay</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Step into a high-stakes professional encounter. Practice oral defense under a Judge or evaluate diagnostic symptoms with an anxious patient. Tap the microphone to talk or type manually.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Card 1: Lawyer */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-sm flex flex-col justify-between min-h-[380px] group bg-gradient-to-b from-indigo-500/[0.02] to-transparent hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/[0.02] transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center shadow-sm">
                      <Scale className="h-7 w-7" />
                    </div>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-700 font-extrabold uppercase px-3 py-1 rounded-full border border-indigo-500/20 tracking-wider">
                      Courtroom Trial
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-black text-slate-900 mt-6">
                    Defense Lawyer
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Defend your client before Judge Sterling. Map out your argument, answer hard questions, defend your client&apos;s flight response, and hear the final verdict.
                  </p>

                  <div className="mt-6 border-t border-border/40 pt-4 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Flow Process</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-indigo-700 font-bold">
                      <span>Opening</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <span>Inquiry</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <span>Pushback</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <span>Verdict</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button 
                    onClick={() => startSession("lawyer")}
                    className="w-full rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-700 font-bold tracking-tight shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Start Lawyer Session <Play className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </motion.div>

              {/* Card 2: Doctor */}
              <motion.div 
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-sm flex flex-col justify-between min-h-[380px] group bg-gradient-to-b from-teal-500/[0.02] to-transparent hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/[0.02] transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center shadow-sm">
                      <HeartPulse className="h-7 w-7" />
                    </div>
                    <span className="text-[9px] bg-teal-500/10 text-teal-700 font-extrabold uppercase px-3 py-1 rounded-full border border-teal-500/20 tracking-wider">
                      Clinical intake
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-black text-slate-900 mt-6">
                    Medical Doctor
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Diagnose Alex Mercer, an anxious marketing professional describing symptoms of chest constriction. Ask intake questions, analyze risk metrics, and recommend a clear care plan.
                  </p>

                  <div className="mt-6 border-t border-border/40 pt-4 space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Flow Process</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-teal-700 font-bold">
                      <span>Symptoms</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <span>Diagnosis</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <span>Reassurance</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      <span>Intake Report</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button 
                    onClick={() => startSession("doctor")}
                    className="w-full rounded-2xl h-12 bg-teal-600 hover:bg-teal-700 font-bold tracking-tight shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Start Doctor Session <Play className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>
              </motion.div>

            </div>
          </div>
        )}

        {/* 2. PLAYING / INTERACTIVE SCREEN */}
        {isPlaying && !showReport && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            
            {/* Left: Character Card & Speaking Status (Col Span 4) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center space-y-4">
                
                {/* Large visual Avatar */}
                <div className="relative">
                  <div className={cn(
                    "h-32 w-32 rounded-3xl flex items-center justify-center text-4xl shadow-md border",
                    career === "lawyer" 
                      ? "bg-gradient-to-br from-slate-700 to-indigo-900 border-indigo-500/25 text-white" 
                      : "bg-gradient-to-br from-teal-500 to-slate-800 border-teal-500/25 text-white"
                  )}>
                    {career === "lawyer" ? "⚖️" : "🤕"}
                    
                    {/* Ring animation if speaking */}
                    {isCharacterSpeaking && (
                      <motion.div 
                        className={cn(
                          "absolute inset-0 rounded-3xl border-2 pointer-events-none",
                          career === "lawyer" ? "border-indigo-400" : "border-teal-400"
                        )}
                        animate={{ scale: [1, 1.15, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-black text-slate-800">
                    {career === "lawyer" ? "Judge Sterling" : "Patient: Alex Mercer"}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">
                    {career === "lawyer" ? "Presiding Magistrate" : "Clinical Client · Age 28"}
                  </p>
                </div>

                {/* Flow Stage Indicator */}
                <div className="w-full bg-slate-50 border border-border/40 rounded-2xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                    <span>CONVERSATION TURNS</span>
                    <span>{turnCount} / 6</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        career === "lawyer" ? "bg-indigo-600" : "bg-teal-600"
                      )}
                      style={{ width: `${Math.min(100, (turnCount / 6) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Speaking indicator and dynamic SVG wave */}
                <div className="w-full pt-2 border-t border-border/40 mt-3">
                  {isCharacterSpeaking ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-indigo-600 animate-pulse uppercase tracking-wider block">AI Speaking...</span>
                      <div className="flex items-center gap-1 h-5 justify-center">
                        {[...Array(8)].map((_, idx) => (
                          <motion.div
                            key={idx}
                            className={cn("w-1 rounded-full", career === "lawyer" ? "bg-indigo-600" : "bg-teal-600")}
                            animate={{ height: [6, 18, 6] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: idx * 0.08 }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : isListening ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-rose-500 animate-pulse uppercase tracking-wider block">Listening... Speak now</span>
                      <div className="flex items-center gap-1 h-5 justify-center">
                        {[...Array(8)].map((_, idx) => (
                          <motion.div
                            key={idx}
                            className="w-1 bg-rose-500 rounded-full"
                            animate={{ height: [6, 22, 6] }}
                            transition={{ duration: 0.4, repeat: Infinity, delay: idx * 0.06 }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : isThinking ? (
                    <div className="space-y-1.5 flex flex-col items-center">
                      <span className="text-[10px] font-black text-amber-500 animate-pulse uppercase tracking-wider block">Thinking...</span>
                      <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />
                    </div>
                  ) : isPaused ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">Voice Loop Paused</span>
                      <div className="flex items-center gap-1 h-5 justify-center">
                        {[...Array(8)].map((_, idx) => (
                          <div key={idx} className="w-1 h-1.5 bg-slate-300 rounded-full" />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block">Ready to speak or type</span>
                      <div className="flex items-center gap-1 h-5 justify-center">
                        {[...Array(8)].map((_, idx) => (
                          <div key={idx} className="w-1 h-1.5 bg-slate-200 rounded-full" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Right: Immersive Dialogue Visual Novel & Controls (Col Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Glassmorphic conversation bubbles container */}
              <div className="rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-sm p-6 shadow-inner h-[420px] overflow-y-auto flex flex-col space-y-4 pr-2">
                <AnimatePresence initial={false}>
                  {history.map((msg) => {
                    const isCharacter = msg.sender === "character";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex max-w-[85%] flex-col rounded-2xl p-4 text-xs leading-relaxed",
                          isCharacter
                            ? "bg-slate-100 border border-slate-200/40 text-slate-800 self-start rounded-tl-none font-[family-name:var(--font-plus-jakarta)]"
                            : "bg-primary text-white self-end rounded-tr-none font-semibold font-sans"
                        )}
                      >
                        <span className="text-[8px] uppercase tracking-widest opacity-60 mb-1.5 block font-black">
                          {isCharacter ? (career === "lawyer" ? "Judge Sterling" : "Alex Mercer") : "You"}
                        </span>
                        <p>{msg.text}</p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {isThinking && (
                  <div className="flex items-center gap-1.5 self-start bg-slate-100 p-4 rounded-2xl rounded-tl-none text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Controls bar */}
              <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  
                  {/* Microphone active button */}
                  <motion.button
                    onClick={toggleListening}
                    whileTap={{ scale: 0.95 }}
                    disabled={micStatus === "unsupported" || micStatus === "not-secure" || isPaused}
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 relative shadow-sm",
                      isListening
                        ? "bg-rose-500 border-rose-600 text-white animate-pulse"
                        : "bg-muted text-muted-foreground border-border hover:bg-slate-200 hover:text-foreground",
                      (micStatus === "unsupported" || micStatus === "not-secure" || isPaused) && "opacity-50 cursor-not-allowed"
                    )}
                    title="Toggle microphone"
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </motion.button>

                  {/* Text inputs */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isThinking && !isProcessingRef.current) {
                          handleSendMessage();
                        }
                      }}
                      disabled={isThinking || isProcessingRef.current}
                      placeholder={
                        isListening 
                          ? "Speaking... (transcribing live)" 
                          : isPaused 
                          ? "Microphone is paused. Type your response..." 
                          : "Speak or type your response..."
                      }
                      className="w-full h-12 rounded-xl border border-border/80 px-4 pr-12 text-xs bg-muted/30 focus:bg-background outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={isThinking || isProcessingRef.current || !currentInput.trim()}
                      className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-primary hover:bg-primary/95 text-white flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                </div>

                {/* Session Loop Mode Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3">
                  <div className="flex items-center gap-3">
                    {/* Continuous Mode Toggle */}
                    <button
                      onClick={toggleTwoWayMode}
                      className={cn(
                        "text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all duration-300",
                        isTwoWayMode
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                          : "bg-muted border-border text-muted-foreground hover:bg-slate-200"
                      )}
                    >
                      {isTwoWayMode ? "🔁 Two-Way Voice Loop Active" : "💬 Manual Send Mode"}
                    </button>

                    {/* Pause/Resume Mic Button */}
                    {isTwoWayMode && (
                      <button
                        onClick={togglePause}
                        className={cn(
                          "text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all duration-300",
                          isPaused
                            ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 animate-pulse"
                            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                        )}
                      >
                        {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                        {isPaused ? "Resume Mic" : "Pause Mic"}
                      </button>
                    )}
                  </div>

                  {/* End Session Button */}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={endSession}
                    className="rounded-lg text-xs font-bold h-8 px-3 tracking-tight bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    End Session
                  </Button>
                </div>

                {/* Visible mic status UI */}
                <div className="text-[11px] font-bold px-1 select-none flex items-center justify-between">
                  <div>
                    {micStatus === "unsupported" && (
                      <span className="text-amber-600">
                        Voice input is not supported in this browser. Please use Chrome.
                      </span>
                    )}
                    {micStatus === "blocked" && (
                      <span className="text-rose-500">
                        Microphone permission blocked. Enable it in settings.
                      </span>
                    )}
                    {micStatus === "not-secure" && (
                      <span className="text-amber-500">
                        Voice input requires HTTPS. Fallback to text.
                      </span>
                    )}
                    {micStatus === "listening" && (
                      <span className="text-rose-500 animate-pulse">
                        🎤 Mic Listening... speak now.
                      </span>
                    )}
                    {micStatus === "processing" && (
                      <span className="text-indigo-500 animate-pulse">
                        ⚙️ Processing speech...
                      </span>
                    )}
                    {micStatus === "no-speech" && (
                      <span className="text-slate-500">
                        ⚠️ No speech detected. Speak clearly.
                      </span>
                    )}
                    {micStatus === "ready" && !isPaused && (
                      <span className="text-muted-foreground font-semibold">
                        ✅ Ready for input
                      </span>
                    )}
                    {isPaused && (
                      <span className="text-amber-600 font-bold">
                        ⏸️ Microphone Paused
                      </span>
                    )}
                  </div>
                  
                  {/* Turn count display */}
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Turns: {turnCount}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. FINAL FEEDBACK REPORT SCREEN */}
        {showReport && report && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Header Shield */}
            <div className="rounded-[2.5rem] border border-border bg-gradient-to-br from-indigo-500/[0.04] to-teal-500/[0.02] p-8 shadow-sm text-center relative overflow-hidden">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-sm">
                  <Award className="h-9 w-9" />
                </div>
              </div>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-black text-slate-900">
                Career Roleplay Evaluation
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5">
                Evaluation results generated based on your diagnostic, reasoning, and communication signals.
              </p>
              <div className="mt-1 flex justify-center">
                <span className="text-[9px] bg-emerald-500/10 text-emerald-700 border border-emerald-500/15 font-black uppercase px-3 py-1 rounded-full">
                  Synchronised to Career DNA (+150 XP)
                </span>
              </div>
            </div>

            {/* Performance Stats HUD Circle Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* Stat 1: Communication */}
              <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="32" cy="32" r="26" className="stroke-muted fill-none stroke-[4]" />
                    <circle cx="32" cy="32" r="26" className="stroke-indigo-500 fill-none stroke-[4]" strokeDasharray="163" strokeDashoffset={163 - (163 * report.communicationScore) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-800">{report.communicationScore}%</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3">Communication</span>
              </div>

              {/* Stat 2: Confidence */}
              <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="32" cy="32" r="26" className="stroke-muted fill-none stroke-[4]" />
                    <circle cx="32" cy="32" r="26" className="stroke-orange-500 fill-none stroke-[4]" strokeDasharray="163" strokeDashoffset={163 - (163 * report.confidenceScore) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-800">{report.confidenceScore}%</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3">Confidence</span>
              </div>

              {/* Stat 3: Reasoning */}
              <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="32" cy="32" r="26" className="stroke-muted fill-none stroke-[4]" />
                    <circle cx="32" cy="32" r="26" className="stroke-teal-500 fill-none stroke-[4]" strokeDasharray="163" strokeDashoffset={163 - (163 * (report.reasoningScore || 80)) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-800">{report.reasoningScore || 80}%</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3">Reasoning</span>
              </div>

              {/* Stat 4: Empathy/Persuasion */}
              <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="32" cy="32" r="26" className="stroke-muted fill-none stroke-[4]" />
                    <circle cx="32" cy="32" r="26" className="stroke-violet-500 fill-none stroke-[4]" strokeDasharray="163" 
                      strokeDashoffset={163 - (163 * (career === "lawyer" ? (report.persuasionScore || report.communicationScore) : (report.empathyScore || report.communicationScore))) / 100} 
                      strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-800">
                    {career === "lawyer" ? (report.persuasionScore || 80) : (report.empathyScore || 80)}%
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3">
                  {career === "lawyer" ? "Persuasion" : "Empathy"}
                </span>
              </div>

            </div>

            {/* Career Fit Score & Insight HUD */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-indigo-500/[0.02] to-transparent">
              <div className="flex flex-col items-center text-center shrink-0">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="40" cy="40" r="34" className="stroke-muted fill-none stroke-[5]" />
                    <circle cx="40" cy="40" r="34" className="stroke-emerald-500 fill-none stroke-[5]" strokeDasharray="213" strokeDashoffset={213 - (213 * report.careerFitScore) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-base font-black text-slate-800">{report.careerFitScore}%</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-2">Career Fit</span>
              </div>
              <div className="space-y-1.5 text-center md:text-left">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Career Fit Insight</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {report.careerFitInsight || "Your response style aligns well with the demands of this profession, highlighting strong situational judgement."}
                </p>
              </div>
            </div>

            {/* Strengths & Weaknesses Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Strength Card */}
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                  <span>Key Strengths</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {report.strengths}
                </p>
              </div>

              {/* Improvement Card */}
              <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                  <span>Areas to Improve</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {report.improvement}
                </p>
              </div>

            </div>

            {/* Next Action Recommendation */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-3 bg-gradient-to-r from-violet-500/[0.02] to-transparent">
              <div className="flex items-center gap-2 text-violet-600 font-bold text-xs uppercase tracking-wider">
                <Brain className="h-4.5 w-4.5 text-violet-500" />
                <span>Recommended Next Action</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-bold">
                {report.nextAction}
              </p>
            </div>

            {/* Finish actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={exitRoleplay}
                className="flex-1 rounded-2xl h-12 bg-primary hover:bg-primary/95 text-white font-bold"
              >
                Return to Hub
              </Button>
              <Button 
                variant="outline"
                onClick={() => startSession(career!)}
                className="flex-1 rounded-2xl h-12 border-border text-foreground hover:bg-muted font-bold"
              >
                Retry Roleplay <RefreshCw className="h-4 w-4 ml-1.5" />
              </Button>
            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}
