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

// Transliteration utility for Devanagari script to Roman script
function normalizeTranscript(text: string): string {
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (!hasDevanagari) return text;

  const vowels: { [key: string]: string } = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah'
  };

  const matras: { [key: string]: string } = {
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ः': 'h', 'ॅ': 'e'
  };

  const consonants: { [key: string]: string } = {
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
    'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
    'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
    'क्ष': 'ksha', 'त्र': 'tra', 'ज्ञ': 'gya', 'श्र': 'shra'
  };

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (vowels[char] !== undefined) {
      result += vowels[char];
    } else if (consonants[char] !== undefined) {
      const nextChar = text[i + 1];
      if (nextChar === '्') {
        result += consonants[char].slice(0, -1);
        i++; // skip halant
      } else if (nextChar && matras[nextChar] !== undefined) {
        result += consonants[char].slice(0, -1) + matras[nextChar];
        i++; // skip matra
      } else {
        result += consonants[char];
      }
    } else if (matras[char] !== undefined) {
      result += matras[char];
    } else if (char === '्') {
      // ignore standalone halant
    } else {
      result += char;
    }
  }

  return result
    .replace(/aa/g, "a")
    .replace(/hu/g, "hoon")
    .replace(/ha/g, "hai")
    .replace(/haii/g, "hai")
    .replace(/honn/g, "hoon")
    .replace(/kara/g, "kar")
    .replace(/raha/g, "rah")
    .replace(/hona/g, "hone")
    .replace(/da/g, "de")
    .replace(/na/g, "na")
    .toLowerCase()
    .trim();
}

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
  const [selectedLanguage, setSelectedLanguage] = useState<"english" | "hindi" | "hinglish">("english");
  const [history, setHistory] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  
  // Voice API state
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [micStatus, setMicStatus] = useState<"ready" | "listening" | "processing" | "no-speech" | "blocked" | "unsupported" | "not-secure">("ready");
  
  // Two-way voice loop states
  const [isTwoWayMode, setIsTwoWayMode] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Voice Performance Signals Tracking
  const [voiceUsed, setVoiceUsed] = useState(false);
  const [totalSpeakingTime, setTotalSpeakingTime] = useState(0);
  const [speakingTimeCount, setSpeakingTimeCount] = useState(0);
  const [interruptions, setInterruptions] = useState(0);
  const [hesitationCount, setHesitationCount] = useState(0);
  const [voiceTurnsCount, setVoiceTurnsCount] = useState(0);
  const [evaluationStats, setEvaluationStats] = useState<any>(null);

  const voiceUsedRef = useRef(voiceUsed);
  const totalSpeakingTimeRef = useRef(totalSpeakingTime);
  const speakingTimeCountRef = useRef(speakingTimeCount);
  const interruptionsRef = useRef(interruptions);
  const hesitationCountRef = useRef(hesitationCount);
  const voiceTurnsCountRef = useRef(voiceTurnsCount);
  const recognitionStartTimeRef = useRef<number | null>(null);

  // Constants
  const MAX_TURNS = 6;

  // Recognition Ref
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const autoListenTimeoutRef = useRef<any>(null);
  
  // Feedback evaluation report state
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<RoleplayReport | null>(null);
  const [animateScores, setAnimateScores] = useState(false);

  // Refs to prevent stale closures inside event listeners
  const isTwoWayModeRef = useRef(isTwoWayMode);
  const isPausedRef = useRef(isPaused);
  const isProcessingRef = useRef(isProcessing);
  const isListeningRef = useRef(isListening);
  const isSpeakingRef = useRef(isSpeaking);
  const isThinkingRef = useRef(isThinking);
  const careerRef = useRef(career);
  const historyRef = useRef(history);
  const turnCountRef = useRef(turnCount);
  const isPlayingRef = useRef(isPlaying);
  const isSessionEndedRef = useRef(isSessionEnded);

  // Sync refs with state updates
  useEffect(() => { isTwoWayModeRef.current = isTwoWayMode; }, [isTwoWayMode]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isThinkingRef.current = isThinking; }, [isThinking]);
  useEffect(() => { careerRef.current = career; }, [career]);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { turnCountRef.current = turnCount; }, [turnCount]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { isSessionEndedRef.current = isSessionEnded; }, [isSessionEnded]);
  useEffect(() => { isProcessingRef.current = isProcessing; }, [isProcessing]);
  useEffect(() => { voiceUsedRef.current = voiceUsed; }, [voiceUsed]);
  useEffect(() => { totalSpeakingTimeRef.current = totalSpeakingTime; }, [totalSpeakingTime]);
  useEffect(() => { speakingTimeCountRef.current = speakingTimeCount; }, [speakingTimeCount]);
  useEffect(() => { interruptionsRef.current = interruptions; }, [interruptions]);
  useEffect(() => { hesitationCountRef.current = hesitationCount; }, [hesitationCount]);
  useEffect(() => { voiceTurnsCountRef.current = voiceTurnsCount; }, [voiceTurnsCount]);

  // Sync speech recognition language with selectedLanguage
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage === "english" ? "en-US" : "hi-IN";
    }
  }, [selectedLanguage]);

  const stopAllVoiceActivity = () => {
    if (synthesisRef.current) {
      try {
        synthesisRef.current.cancel();
      } catch {}
    }
    setIsSpeaking(false);
    isSpeakingRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsListening(false);
    isListeningRef.current = false;
    setMicStatus("ready");

    if (activeAbortControllerRef.current) {
      try {
        activeAbortControllerRef.current.abort();
      } catch {}
      activeAbortControllerRef.current = null;
    }

    if (autoListenTimeoutRef.current) {
      clearTimeout(autoListenTimeoutRef.current);
      autoListenTimeoutRef.current = null;
    }
  };

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
      rec.lang = selectedLanguage === "english" ? "en-US" : "hi-IN";

      rec.onstart = () => {
        if (isSessionEndedRef.current || turnCountRef.current >= MAX_TURNS) {
          try {
            rec.abort();
          } catch {}
          setIsListening(false);
          isListeningRef.current = false;
          setMicStatus("ready");
          return;
        }
        if (isSpeakingRef.current) {
          const nextInterruptions = interruptionsRef.current + 1;
          setInterruptions(nextInterruptions);
          interruptionsRef.current = nextInterruptions;
        }
        recognitionStartTimeRef.current = Date.now();
        setIsListening(true);
        isListeningRef.current = true;
        setMicStatus("listening");
      };

      rec.onresult = (event: any) => {
        if (isSessionEndedRef.current || turnCountRef.current >= MAX_TURNS) {
          return;
        }

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
          const normalizedInterim = normalizeTranscript(interimTranscript);
          setCurrentInput(normalizedInterim);
          setMicStatus("processing");
        }
        
        if (finalTranscript) {
          const cleanFinal = finalTranscript.trim();
          if (cleanFinal) {
            const normalizedFinal = normalizeTranscript(cleanFinal);
            setCurrentInput(normalizedFinal);

            // Track hesitations
            const hesitations = normalizedFinal.match(/\b(um|uh|er|ah|like|hmmm|well)\b/gi) || [];
            if (hesitations.length > 0) {
              const nextHesitations = hesitationCountRef.current + hesitations.length;
              setHesitationCount(nextHesitations);
              hesitationCountRef.current = nextHesitations;
            }

            // Set voice used and increment turns
            setVoiceUsed(true);
            voiceUsedRef.current = true;

            const nextVoiceTurns = voiceTurnsCountRef.current + 1;
            setVoiceTurnsCount(nextVoiceTurns);
            voiceTurnsCountRef.current = nextVoiceTurns;
            
            // Auto-send in continuous voice loop mode
            if (isTwoWayModeRef.current && !isPausedRef.current && !isProcessingRef.current && !isSessionEndedRef.current && turnCountRef.current < MAX_TURNS) {
              setIsProcessing(true);
              isProcessingRef.current = true;
              
              // Stop recognition immediately to prevent duplicate sends
              try {
                rec.abort();
              } catch {}
              
              handleSendMessage(normalizedFinal);
            }
          }
        }
      };

      rec.onerror = (e: any) => {
        setIsListening(false);
        isListeningRef.current = false;
        const errType = e.error;
        console.error("Speech Recognition Error:", errType, e);

        if (isSessionEndedRef.current) {
          setMicStatus("ready");
          return;
        }

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
        isListeningRef.current = false;
        
        if (recognitionStartTimeRef.current) {
          const duration = (Date.now() - recognitionStartTimeRef.current) / 1000;
          if (duration > 0.5) {
            const nextTotal = totalSpeakingTimeRef.current + duration;
            setTotalSpeakingTime(nextTotal);
            totalSpeakingTimeRef.current = nextTotal;
            
            const nextCount = speakingTimeCountRef.current + 1;
            setSpeakingTimeCount(nextCount);
            speakingTimeCountRef.current = nextCount;
          }
          recognitionStartTimeRef.current = null;
        }

        if (!isProcessingRef.current || isSessionEndedRef.current) {
          setMicStatus("ready");
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      stopAllVoiceActivity();
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
    setIsSpeaking(false);
    isSpeakingRef.current = false;
    
    if (isListeningRef.current || isSessionEndedRef.current || turnCountRef.current >= MAX_TURNS) return;

    setMicStatus("processing");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Double check states before starting
      if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current && !isSessionEndedRef.current && turnCountRef.current < MAX_TURNS) {
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
      isListeningRef.current = false;
    }
  };

  // Voice Speech synthesis reader helper
  const speakText = (text: string) => {
    if (autoListenTimeoutRef.current) {
      clearTimeout(autoListenTimeoutRef.current);
      autoListenTimeoutRef.current = null;
    }

    if (isSessionEndedRef.current || turnCountRef.current >= MAX_TURNS) {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      return;
    }

    if (!synthesisRef.current || !voiceOutputEnabled) {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      // Muted fallback: wait 2 seconds for user to read then start listening
      if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current && !isSessionEndedRef.current && turnCountRef.current < MAX_TURNS) {
        autoListenTimeoutRef.current = setTimeout(() => {
          if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current && !isSessionEndedRef.current && turnCountRef.current < MAX_TURNS) {
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
    
    if (selectedLanguage === "english") {
      utterance.lang = "en-US";
    } else {
      utterance.lang = "hi-IN";
    }
    
    // Choose appropriate voice
    const voices = synthesisRef.current.getVoices();
    if (selectedLanguage !== "english") {
      const hindiVoice = voices.find(v => v.lang.toLowerCase().startsWith("hi"));
      if (hindiVoice) utterance.voice = hindiVoice;
    } else if (careerRef.current === "lawyer") {
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

    utterance.onstart = () => {
      if (isSessionEndedRef.current || turnCountRef.current >= MAX_TURNS) {
        synthesisRef.current?.cancel();
        setIsSpeaking(false);
        isSpeakingRef.current = false;
        return;
      }
      setIsSpeaking(true);
      isSpeakingRef.current = true;
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      // Auto-restart mic in Two-Way Mode only if session is active and under limit
      if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current && !isSessionEndedRef.current && turnCountRef.current < MAX_TURNS) {
        startListeningAutomatically();
      }
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      if (isTwoWayModeRef.current && isPlayingRef.current && !isPausedRef.current && !isProcessingRef.current && !isSessionEndedRef.current && turnCountRef.current < MAX_TURNS) {
        startListeningAutomatically();
      }
    };
    
    synthesisRef.current.speak(utterance);
  };

  // Start a roleplay session
  const startSession = async (selectedCareer: "lawyer" | "doctor") => {
    stopAllVoiceActivity();

    setCareer(selectedCareer);
    setIsPlaying(true);
    setTurnCount(0);
    turnCountRef.current = 0;
    setHistory([]);
    historyRef.current = [];
    setCurrentInput("");
    setShowReport(false);
    setReport(null);
    setAnimateScores(false);
    setIsThinking(true);
    setIsPaused(false);
    isPausedRef.current = false;
    setConfigError(null);
    setIsFallbackMode(false);
    setIsSessionEnded(false);
    isSessionEndedRef.current = false;
    setIsProcessing(false);
    isProcessingRef.current = false;

    // Reset voice performance tracking states
    setVoiceUsed(false);
    voiceUsedRef.current = false;
    setTotalSpeakingTime(0);
    totalSpeakingTimeRef.current = 0;
    setSpeakingTimeCount(0);
    speakingTimeCountRef.current = 0;
    setInterruptions(0);
    interruptionsRef.current = 0;
    setHesitationCount(0);
    hesitationCountRef.current = 0;
    setVoiceTurnsCount(0);
    voiceTurnsCountRef.current = 0;
    recognitionStartTimeRef.current = null;
    setEvaluationStats(null);

    careerRef.current = selectedCareer;
    isPlayingRef.current = true;

    if (selectedCareer === "lawyer") {
      const intro = "Welcome, counselor. The Court of CareerVerse is now in session. You represent the defendant. Please present your opening statement outlining why your client is not guilty of these charges.";
      setHistory([{ id: "init", sender: "character", text: intro }]);
      setIsThinking(false);
      setTimeout(() => {
        if (!isSessionEndedRef.current) speakText(intro);
      }, 300);
    } else {
      const intro = "Hello doctor... I'm really glad you could see me. For the last couple of days, I've had this persistent squeezing sensation right in the middle of my chest. It gets worse whenever I walk up a hill or carry anything heavy, and I feel really anxious and short of breath. Do you think I'm having a heart attack?";
      setHistory([{ id: "init", sender: "character", text: intro }]);
      setIsThinking(false);
      setTimeout(() => {
        if (!isSessionEndedRef.current) speakText(intro);
      }, 300);
    }
  };

  // Toggle Voice Capture manually
  const toggleListening = async () => {
    if (isSessionEndedRef.current || turnCountRef.current >= MAX_TURNS) return;

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
    setIsSpeaking(false);
    isSpeakingRef.current = false;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
      setIsListening(false);
      isListeningRef.current = false;
      setMicStatus("ready");
    } else {
      setMicStatus("processing");
      try {
        // Microphone permission check
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        if (isSessionEndedRef.current || turnCountRef.current >= MAX_TURNS) {
          setMicStatus("ready");
          return;
        }

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
        isListeningRef.current = false;
      }
    }
  };

  // Toggle continuous voice loop mode
  const toggleTwoWayMode = () => {
    if (isSessionEndedRef.current) return;
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
        isListeningRef.current = false;
        setMicStatus("ready");
      }
    } else {
      // Start listening if toggling continuous voice back on
      if (isPlaying && !isSpeaking && !isThinking && !isPaused && !isProcessingRef.current) {
        startListeningAutomatically();
      }
    }
  };

  // Toggle microphone pause state during session
  const togglePause = () => {
    if (isSessionEndedRef.current) return;
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
        isListeningRef.current = false;
        setMicStatus("ready");
      }
    } else {
      // Resume listening if appropriate
      if (isTwoWayMode && isPlaying && !isSpeaking && !isThinking && !isProcessingRef.current) {
        startListeningAutomatically();
      }
    }
  };

  // Get contextual fallback response if Gemini is unavailable
  const getContextualFallbackResponse = (userMsg: string, currentHistory: Message[], selectedCareer: "lawyer" | "doctor" | null) => {
    const cleanMsg = userMsg.toLowerCase();
    const isHindiOrHinglish = selectedLanguage === "hindi" || selectedLanguage === "hinglish";
    
    if (selectedCareer === "lawyer") {
      if (isHindiOrHinglish) {
        if (cleanMsg.includes("innocent") || cleanMsg.includes("bekasoor") || cleanMsg.includes("gunah")) {
          return "Vakil sahab, defence bekasoor hone ka claim kar raha hai. Lekin prosecution ke saboot mazboot hain. Aapke paas kya alibi ya record hai jo unhe scene par na hona prove kare?";
        }
        if (cleanMsg.includes("evidence") || cleanMsg.includes("proof") || cleanMsg.includes("saboot") || cleanMsg.includes("alibi")) {
          return "Court ne aapke saboot ko note kar liya hai. Par counselor, security camera footage bilkul saaf hai. Alarm bajne par aapka client wahan se kyu bhaaga?";
        }
        if (cleanMsg.includes("flight") || cleanMsg.includes("ran") || cleanMsg.includes("scared") || cleanMsg.includes("bhaag") || cleanMsg.includes("panic")) {
          return "Bekasoor aadmi ko bhaagne ki koi zaroorat nahi hoti. Court ko is baat par yakeen nahi hai. Aap apna aakhri defense argument pesh karein.";
        }
        if (cleanMsg.includes("trespass") || cleanMsg.includes("theft") || cleanMsg.includes("stole") || cleanMsg.includes("stolen") || cleanMsg.includes("chori")) {
          return "Silent alarm ke hisab se trespass aur theft ke charges lagaye gaye hain. Aapka argument in logs ko kaise galat prove karta hai, counselor?";
        }
        if (cleanMsg.includes("witness") || cleanMsg.includes("testimony") || cleanMsg.includes("statement") || cleanMsg.includes("gawah")) {
          return "Witness ka bayan record kiya ja chuka hai. Counselor, aap is timeline me kisi aisi gadbadi ko point karein jo aapke client ko support kare.";
        }
        return `Vakil sahab, aapne kaha: "${userMsg}". Court ko batayein ki ye point state ke main saboot ko kaise kamzor karta hai.`;
      } else {
        if (cleanMsg.includes("innocent") || cleanMsg.includes("not guilty")) {
          return "The defense claims innocence. However, counselor, the prosecution's evidence stands. What specific alibi or record can you show to disprove their presence at the scene?";
        }
        if (cleanMsg.includes("evidence") || cleanMsg.includes("proof") || cleanMsg.includes("alibi")) {
          return "The Court notes your reference to the evidence. But counselor, the security footage is clear. How do you explain your client's flight response when the alarm sounded?";
        }
        if (cleanMsg.includes("flight") || cleanMsg.includes("ran") || cleanMsg.includes("scared") || cleanMsg.includes("panic")) {
          return "An innocent person has no reason to run. The court remains skeptical of this explanation. Please summarize your final defense argument counselor.";
        }
        if (cleanMsg.includes("trespass") || cleanMsg.includes("theft") || cleanMsg.includes("stole") || cleanMsg.includes("stolen")) {
          return "The charges of trespass and felony theft are supported by the silent alarm log. How does your argument refute the timestamped entry logs, counselor?";
        }
        if (cleanMsg.includes("witness") || cleanMsg.includes("testimony") || cleanMsg.includes("statement")) {
          return "The witness testimony has been sworn and recorded. Counselor, point out any specific contradictions in their timeline that support your client.";
        }
        return `Counselor, you argued: "${userMsg}". Address the court directly on how this specific point refutes the state's prime evidence.`;
      }
    } else {
      if (isHindiOrHinglish) {
        if (cleanMsg.includes("pain") || cleanMsg.includes("constriction") || cleanMsg.includes("hurt") || cleanMsg.includes("sensation") || cleanMsg.includes("dard")) {
          return "Haan doctor, mere chest me bahut zyada pressure aur dard feel ho raha hai. Rest karne par bhi thik nahi ho raha, aur thoda sweat bhi aa raha hai. Kya ye koi serious issue hai?";
        }
        if (cleanMsg.includes("family") || cleanMsg.includes("father") || cleanMsg.includes("history") || cleanMsg.includes("parents") || cleanMsg.includes("parivar")) {
          return "Mere father ko bhi fifty ki age me heart surgery karwani padi thi. Isliye mujhe bahut darr lag raha hai, doctor. Mujhe kya hua hai?";
        }
        if (cleanMsg.includes("diagnose") || cleanMsg.includes("think") || cleanMsg.includes("angina") || cleanMsg.includes("heart") || cleanMsg.includes("dil")) {
          return "Angina... ye kya hota hai? Kya isko confirm karne ke liye koi test karna hoga? Agar mujhe raat ko phir se dard ho to kya emergency me jana chahiye?";
        }
        if (cleanMsg.includes("emergency") || cleanMsg.includes("ecg") || cleanMsg.includes("test") || cleanMsg.includes("hospital") || cleanMsg.includes("ilaj")) {
          return "Explain karne ke liye thank you, doctor. Mujhe ab thoda relief feel ho raha hai. Main kal subah hi ECG test schedule karunga. Thank you so much.";
        }
        if (cleanMsg.includes("exercise") || cleanMsg.includes("exertion") || cleanMsg.includes("walk") || cleanMsg.includes("stairs") || cleanMsg.includes("trigger") || cleanMsg.includes("chal")) {
          return "Jab main stairs chadta hoon ya koi physical kaam karta hoon, to dard bahut badh jata hai. Baithne par thoda kam hota hai par heavy lagta hai.";
        }
        if (cleanMsg.includes("duration") || cleanMsg.includes("long") || cleanMsg.includes("start") || cleanMsg.includes("hour") || cleanMsg.includes("kab")) {
          return "Ye lagbhag do ghante pehle shuru hua tha, doctor. Tab se lagatar dard ho raha hai, aur gehra saans lene me bhi dikkat ho rahi hai.";
        }
        return `Doctor, mujhe saans lene me thodi pareshani ho rahi hai aur halki nausea bhi feel ho rahi hai. Mujhe kya karna chahiye?`;
      } else {
        if (cleanMsg.includes("pain") || cleanMsg.includes("constriction") || cleanMsg.includes("hurt") || cleanMsg.includes("sensation")) {
          return "Yes, doctor. It is a squeezing, heavy weight right in my chest. It doesn't get better when I rest, and I feel quite sweaty. Do you think this is a heart issue?";
        }
        if (cleanMsg.includes("family") || cleanMsg.includes("father") || cleanMsg.includes("history") || cleanMsg.includes("parents")) {
          return "My father actually had heart surgery when he was fifty. That's why I'm so worried, doctor. What is your initial diagnosis?";
        }
        if (cleanMsg.includes("diagnose") || cleanMsg.includes("think") || cleanMsg.includes("angina") || cleanMsg.includes("heart")) {
          return "Angina... wow, that sounds scary. What tests do I need to confirm this, and should I go to the emergency room if the pain returns tonight?";
        }
        if (cleanMsg.includes("emergency") || cleanMsg.includes("ecg") || cleanMsg.includes("test") || cleanMsg.includes("hospital")) {
          return "Thank you for explaining that, doctor. I feel much more reassured. I will schedule the ECG test first thing tomorrow. Thank you for your care.";
        }
        if (cleanMsg.includes("exercise") || cleanMsg.includes("exertion") || cleanMsg.includes("walk") || cleanMsg.includes("stairs") || cleanMsg.includes("trigger")) {
          return "It definitely gets worse when I walk up stairs or exert myself. When I sit down for a few minutes, it eases slightly, but the heaviness remains. Is that typical?";
        }
        if (cleanMsg.includes("duration") || cleanMsg.includes("long") || cleanMsg.includes("start") || cleanMsg.includes("hour")) {
          return "It started about two hours ago, doctor. It's been constant since then, sometimes getting sharper when I try to take a deep breath.";
        }
        return `Doctor, I also feel a bit short of breath and some mild nausea along with this chest pressure. What other symptoms should I be concerned about?`;
      }
    }
  };

  // Submit User Message
  const handleSendMessage = async (textToSend?: string) => {
    const rawInput = textToSend !== undefined ? textToSend : currentInput.trim();
    const userText = normalizeTranscript(rawInput);
    if (!userText.trim()) {
      setIsProcessing(false);
      isProcessingRef.current = false;
      return;
    }

    if (isSessionEndedRef.current) {
      return;
    }

    if (turnCountRef.current >= MAX_TURNS) {
      await endRoleplaySession();
      return;
    }

    setIsProcessing(true);
    isProcessingRef.current = true;
    setCurrentInput("");

    const newUserMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText
    };

    setHistory((prev) => [...prev, newUserMsg]);
    setIsThinking(true);

    // Stop speaking if characters are talking
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    setIsSpeaking(false);
    isSpeakingRef.current = false;

    // Use current history plus the new message
    const activeHistory = [...historyRef.current, newUserMsg];

    let isTimeout = false;
    const controller = new AbortController();
    activeAbortControllerRef.current = controller;
    const timeoutId = setTimeout(() => {
      isTimeout = true;
      controller.abort();
    }, 20000); // 20s timeout limit

    setConfigError(null);

    try {
      const response = await fetch("/api/roleplay/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          career: careerRef.current,
          scenario: careerRef.current === "lawyer" ? "Courtroom Trial" : "Clinical intake",
          message: userText,
          history: activeHistory.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
          profile: { name: profile?.name, grade: profile?.grade },
          selectedLanguage
        })
      });

      clearTimeout(timeoutId);

      if (isSessionEndedRef.current) {
        return;
      }

      if (response.ok) {
        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let characterText = "";
          
          const placeholderId = `msg-stream-${Date.now()}`;
          setHistory((prev) => [...prev, { id: placeholderId, sender: "character", text: "" }]);
          setIsThinking(false);

          while (true) {
            if (isSessionEndedRef.current) {
              break;
            }
            const { done, value } = await reader.read();
            if (done) break;
            if (isSessionEndedRef.current) {
              break;
            }
            const chunk = decoder.decode(value, { stream: true });
            characterText += chunk;
            
            setHistory((prev) => 
              prev.map(m => m.id === placeholderId ? { ...m, text: characterText } : m)
            );
          }
          
          if (!isSessionEndedRef.current) {
            // AI Response speaks aloud
            speakText(characterText);
            
            const newTurnCount = turnCountRef.current + 1;
            setTurnCount(newTurnCount);
            turnCountRef.current = newTurnCount;
            
            if (newTurnCount >= MAX_TURNS) {
              await endRoleplaySession();
            }
          }
        } else {
          throw new Error("No reader available");
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || "Internal Server Error";
        throw new Error(errMsg);
      }
    } catch (e: any) {
      if (isSessionEndedRef.current || e.name === "AbortError") {
        return;
      }
      clearTimeout(timeoutId);
      setIsFallbackMode(true);
      
      let errorDisplay = `AI is temporarily unavailable (${e.message || "Unknown error"}). Continuing with fallback roleplay.`;
      if (isTimeout) {
        errorDisplay = "AI response timed out (20s limit reached). Continuing with fallback roleplay.";
      } else if (e.message?.includes("API key not found") || e.message?.includes("key not configured") || e.message?.includes("API key")) {
        errorDisplay = "Gemini API key not found. Please check your configuration.";
      } else if (e.message?.includes("model unavailable") || e.message?.includes("Model")) {
        errorDisplay = "Gemini model unavailable. Please try again later.";
      }
      setConfigError(errorDisplay);

      console.warn("Falling back to local character dialogue engine.", e);
      const fallbackText = getContextualFallbackResponse(userText, activeHistory, careerRef.current);
      
      setIsThinking(false);
      
      const fallbackTextWithNotice = `[Fallback]: ${fallbackText}`;
      
      let hasPlaceholder = false;
      let placeholderIdToUse = "";
      
      setHistory((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === "character") {
          hasPlaceholder = true;
          placeholderIdToUse = lastMsg.id;
        }
        return prev;
      });

      if (isSessionEndedRef.current) return;

      if (hasPlaceholder && placeholderIdToUse) {
        setHistory((prev) => 
          prev.map(m => m.id === placeholderIdToUse ? { 
            ...m, 
            text: m.text ? (m.text + " (Connection lost. " + fallbackTextWithNotice + ")") : fallbackText 
          } : m)
        );
      } else {
        const responseId = `msg-fallback-${Date.now()}`;
        setHistory((prev) => [...prev, { id: responseId, sender: "character", text: "" }]);
        
        const words = fallbackText.split(" ");
        let typedText = "";
        for (let i = 0; i < words.length; i++) {
          if (isSessionEndedRef.current) return;
          typedText += words[i] + (i === words.length - 1 ? "" : " ");
          setHistory((prev) => 
            prev.map(m => m.id === responseId ? { ...m, text: typedText } : m)
          );
          await new Promise(r => setTimeout(r, 20 + Math.random() * 20));
        }
      }
      
      if (isSessionEndedRef.current) return;

      speakText(fallbackText);

      const newTurnCount = turnCountRef.current + 1;
      setTurnCount(newTurnCount);
      turnCountRef.current = newTurnCount;
      
      if (newTurnCount >= MAX_TURNS) {
        await endRoleplaySession();
      }
    } finally {
      if (activeAbortControllerRef.current === controller) {
        activeAbortControllerRef.current = null;
      }
      // Clear input and unlock processing
      setCurrentInput("");
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  };

  // Compile final feedback report card
  const generateFeedbackReport = async () => {
    setIsThinking(true);
    const evaluationHistory = [...history];
    setConfigError(null);

    // Calculate user response metrics
    const userMessages = evaluationHistory.filter(m => m.sender === "user");
    const wordCounts = userMessages.map(m => m.text.split(/\s+/).filter(Boolean).length);
    const totalUserWords = wordCounts.reduce((a, b) => a + b, 0);
    const avgResponseLengthVal = userMessages.length > 0 ? Math.round(totalUserWords / userMessages.length) : 0;

    const questionCountVal = userMessages.filter(m => 
      m.text.includes("?") || 
      /\b(why|how|what|where|when|who|whose|which|did|do|does|is|are|was|were|can|could|should|would|has|have|had)\b/i.test(m.text)
    ).length;

    const followUpQuestionsVal = userMessages.slice(1).filter(m => 
      m.text.includes("?") || 
      /\b(why|how|what|where|when|who|whose|which|did|do|does|is|are|was|were|can|could|should|would|has|have|had)\b/i.test(m.text)
    ).length;

    const turnCompletionRate = Math.min(100, Math.round((turnCount / MAX_TURNS) * 100));
    
    // Voice metrics
    const voiceUsedVal = voiceUsedRef.current;
    const totalSpeakingTimeVal = Math.round(totalSpeakingTimeRef.current);
    const averageSpeakingTimeSecVal = speakingTimeCountRef.current > 0 ? Math.round(totalSpeakingTimeRef.current / speakingTimeCountRef.current) : 0;
    const interruptionsVal = interruptionsRef.current;
    const hesitationCountVal = hesitationCountRef.current;
    const microphoneParticipationVal = turnCount > 0 ? Math.round((voiceTurnsCountRef.current / turnCount) * 100) : 0;

    // Logic keywords matches
    const docKeywords = ["pain", "sensation", "chest", "happen", "worse", "better", "walk", "exertion", "breath", "anxious", "family", "history", "age", "work", "stress", "medical", "feel", "symptom"];
    const lawKeywords = ["evidence", "proof", "witness", "camera", "footage", "scene", "happen", "charges", "guilty", "innocent", "client", "video", "flight", "run", "alarm", "trespass", "theft"];
    const relevantKeywords = career === "doctor" ? docKeywords : lawKeywords;
    
    let keywordMatchesVal = 0;
    userMessages.forEach(m => {
      const text = m.text.toLowerCase();
      relevantKeywords.forEach(kw => {
        if (text.includes(kw)) keywordMatchesVal++;
      });
    });

    const statsSummary = {
      turnCount,
      avgResponseLength: avgResponseLengthVal,
      questionCount: questionCountVal,
      followUpQuestions: followUpQuestionsVal,
      turnCompletionRate,
      voiceUsed: voiceUsedVal,
      totalSpeakingTime: totalSpeakingTimeVal,
      averageSpeakingTimeSec: averageSpeakingTimeSecVal,
      interruptions: interruptionsVal,
      hesitationCount: hesitationCountVal,
      microphoneParticipation: microphoneParticipationVal,
      keywordMatches: keywordMatchesVal
    };
    setEvaluationStats(statsSummary);

    // Hybrid Scoring Subsystems
    const depthScore = Math.min(100, Math.round(avgResponseLengthVal * 4));
    const questionQuality = Math.min(100, Math.round((questionCountVal * 15) + (keywordMatchesVal * 8)));
    const questionQualityScore = userMessages.length > 0 ? Math.max(40, questionQuality) : 0;
    
    let voiceScore = 100;
    if (voiceUsedVal) {
      voiceScore -= (interruptionsVal * 15);
      voiceScore -= (hesitationCountVal * 4);
      if (averageSpeakingTimeSecVal > 0) {
        if (averageSpeakingTimeSecVal >= 5 && averageSpeakingTimeSecVal <= 15) voiceScore += 10;
        else if (averageSpeakingTimeSecVal < 5) voiceScore -= 10;
      }
    }
    const voiceScoreClamped = Math.max(40, Math.min(100, voiceScore));
    const participationScore = voiceUsedVal
      ? Math.round((turnCompletionRate * 0.6) + (voiceScoreClamped * 0.4))
      : Math.round(turnCompletionRate);

    const blendScore = (geminiScore: number, depth: number, quality: number, participation: number) => {
      return Math.round(
        (geminiScore * 0.4) +
        (depth * 0.2) +
        (quality * 0.2) +
        (participation * 0.2)
      );
    };

    try {
      const response = await fetch("/api/roleplay/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career,
          scenario: career === "lawyer" ? "Courtroom Trial" : "Clinical intake",
          history: evaluationHistory.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
          profile: { name: profile?.name },
          isFeedback: true,
          stats: statsSummary,
          selectedLanguage
        })
      });

      if (response.ok) {
        const feedback = await response.json();
        
        let geminiConfidence = feedback.confidence || 75;
        if (voiceUsedVal) {
          let confidenceAdjustment = 0;
          confidenceAdjustment -= (interruptionsVal * 5);
          confidenceAdjustment -= (hesitationCountVal * 3);
          if (averageSpeakingTimeSecVal > 0 && averageSpeakingTimeSecVal < 6) {
            confidenceAdjustment -= 10;
          } else if (averageSpeakingTimeSecVal >= 8) {
            confidenceAdjustment += 5;
          }
          geminiConfidence = Math.max(40, Math.min(100, geminiConfidence + confidenceAdjustment));
        }

        const blendedComm = blendScore(feedback.communication || 75, depthScore, questionQualityScore, participationScore);
        const blendedConf = blendScore(geminiConfidence, depthScore, questionQualityScore, participationScore);
        const blendedReasoning = blendScore(feedback.reasoning || 75, depthScore, questionQualityScore, participationScore);
        const blendedEmpathyOrPersuasion = blendScore(feedback.empathy || 75, depthScore, questionQualityScore, participationScore);
        const blendedCareerFit = blendScore(feedback.careerFit || 75, depthScore, questionQualityScore, participationScore);

        const scoreReport: RoleplayReport = {
          strengths: Array.isArray(feedback.strengths) ? feedback.strengths.join(". ") : (feedback.strengths || "Detailed diagnostic questioning and structured reasoning."),
          improvement: Array.isArray(feedback.improvements) ? feedback.improvements.join(". ") : (feedback.improvement || feedback.improvements || "Further evidence backup and alibi timelines verification."),
          communicationScore: blendedComm,
          confidenceScore: blendedConf,
          reasoningScore: blendedReasoning,
          empathyScore: career === "doctor" ? blendedEmpathyOrPersuasion : undefined,
          persuasionScore: career === "lawyer" ? blendedEmpathyOrPersuasion : undefined,
          careerFitScore: blendedCareerFit,
          careerFitInsight: feedback.summary || "Demonstrated a strong aptitude for quick situational diagnostics.",
          nextAction: feedback.recommendedNextAction || (career === "lawyer" ? "Study rules of evidence." : "Review intake lists.")
        };
        saveReportAndSync(scoreReport, feedback);
      } else {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error || "Internal Server Error";
        throw new Error(errMsg);
      }
    } catch (e: any) {
      setIsFallbackMode(true);
      let errorDisplay = `AI feedback generation is temporarily unavailable (${e.message || "Unknown error"}). Generating local fallback report.`;
      if (e.message?.includes("API key not found") || e.message?.includes("key not configured") || e.message?.includes("API key")) {
        errorDisplay = "Gemini API key not found. Generating local fallback report.";
      } else if (e.message?.includes("model unavailable") || e.message?.includes("Model")) {
        errorDisplay = "Gemini model unavailable. Generating local fallback report.";
      }
      setConfigError(errorDisplay);

      // Local fallback metrics based on session history
      const mockGeminiCommunication = Math.min(95, Math.max(45, 55 + avgResponseLengthVal * 1.2 - (hesitationCountVal * 1.5)));
      let mockGeminiConfidence = Math.min(95, Math.max(45, 50 + (voiceUsedVal ? 15 : 0) - (interruptionsVal * 6) + avgResponseLengthVal * 0.8));
      if (voiceUsedVal) {
        let confidenceAdjustment = 0;
        confidenceAdjustment -= (interruptionsVal * 5);
        confidenceAdjustment -= (hesitationCountVal * 3);
        if (averageSpeakingTimeSecVal > 0 && averageSpeakingTimeSecVal < 6) {
          confidenceAdjustment -= 10;
        } else if (averageSpeakingTimeSecVal >= 8) {
          confidenceAdjustment += 5;
        }
        mockGeminiConfidence = Math.max(40, Math.min(100, mockGeminiConfidence + confidenceAdjustment));
      }
      const mockGeminiReasoning = Math.min(95, Math.max(45, 45 + (keywordMatchesVal * 12) + (questionCountVal * 6)));
      const mockGeminiEmpathyOrPersuasion = Math.min(95, Math.max(45, 50 + (keywordMatchesVal * 10) + (avgResponseLengthVal * 0.5)));
      const mockGeminiCareerFit = Math.round((mockGeminiCommunication + mockGeminiConfidence + mockGeminiReasoning + mockGeminiEmpathyOrPersuasion) / 4);

      const blendedComm = blendScore(mockGeminiCommunication, depthScore, questionQualityScore, participationScore);
      const blendedConf = blendScore(mockGeminiConfidence, depthScore, questionQualityScore, participationScore);
      const blendedReasoning = blendScore(mockGeminiReasoning, depthScore, questionQualityScore, participationScore);
      const blendedEmpathyOrPersuasion = blendScore(mockGeminiEmpathyOrPersuasion, depthScore, questionQualityScore, participationScore);
      const blendedCareerFit = blendScore(mockGeminiCareerFit, depthScore, questionQualityScore, participationScore);

      const candidateStrengths: string[] = [];
      if (blendedComm >= 70) candidateStrengths.push(career === "lawyer" ? "Assertive and professional courtroom delivery" : "Good patient reassuring tone");
      if (blendedReasoning >= 70) candidateStrengths.push(career === "lawyer" ? "Strong evidence-based reasoning focus" : "Structured clinical symptom diagnostic tracking");
      if (candidateStrengths.length < 2) {
        candidateStrengths.push(career === "lawyer" ? "Consistent logical structure under pushback" : "Solid patient listening manner");
        candidateStrengths.push("Clear and precise vocabulary usage");
      }

      const candidateImprovements: string[] = [];
      if (blendedReasoning < 75) {
        candidateImprovements.push(career === "lawyer" ? "Support arguments with specific evidence citations" : "Avoid jumping to a medical diagnosis too quickly");
      }
      if (avgResponseLengthVal < 15) {
        candidateImprovements.push("Elaborate further on statements rather than providing short responses");
      }
      if (candidateImprovements.length < 2) {
        candidateImprovements.push(career === "lawyer" ? "Address judge/witness alibi timelines more directly" : "Elaborate more on symptom triggers and chest pressure duration");
        candidateImprovements.push("Incorporate more diagnostic questioning loops");
      }

      const offlineFeedback: RoleplayReport = {
        strengths: candidateStrengths.join(". "),
        improvement: candidateImprovements.join(". "),
        communicationScore: blendedComm,
        confidenceScore: blendedConf,
        reasoningScore: blendedReasoning,
        empathyScore: career === "doctor" ? blendedEmpathyOrPersuasion : undefined,
        persuasionScore: career === "lawyer" ? blendedEmpathyOrPersuasion : undefined,
        careerFitScore: blendedCareerFit,
        careerFitInsight: career === "lawyer"
          ? "Demonstrates a strong aptitude for quick structural reasoning and courtroom etiquette."
          : "Shows strong clinical compassion and structured diagnostics necessary for client consulting.",
        nextAction: career === "lawyer" 
          ? "Check the mock trial simulated cases in the library." 
          : "Review the cardio-pulmonary symptom trees in Growth Hub."
      };
      saveReportAndSync(offlineFeedback, {
        summary: offlineFeedback.careerFitInsight,
        strengths: candidateStrengths,
        improvements: candidateImprovements
      });
    }
  };

  const saveReportAndSync = (evalReport: RoleplayReport, rawFeedback?: any) => {
    setReport(evalReport);
    setIsThinking(false);
    setShowReport(true);
    setAnimateScores(false);
    setTimeout(() => {
      setAnimateScores(true);
    }, 150);

    // Save to local roleplay history
    if (typeof window !== "undefined") {
      try {
        const savedHistoryStr = localStorage.getItem("careerverse-roleplay-history") || "[]";
        const savedHistory = JSON.parse(savedHistoryStr);
        const newSessionRecord = {
          date: new Date().toLocaleDateString(),
          career,
          scores: {
            communication: evalReport.communicationScore,
            confidence: evalReport.confidenceScore,
            reasoning: evalReport.reasoningScore,
            empathyOrPersuasion: career === "lawyer" ? (evalReport.persuasionScore || 80) : (evalReport.empathyScore || 80),
            careerFit: evalReport.careerFitScore
          },
          strengths: Array.isArray(rawFeedback?.strengths) ? rawFeedback.strengths : [evalReport.strengths],
          weaknesses: Array.isArray(rawFeedback?.improvements) ? rawFeedback.improvements : [evalReport.improvement],
          summary: rawFeedback?.summary || evalReport.careerFitInsight
        };
        savedHistory.push(newSessionRecord);
        localStorage.setItem("careerverse-roleplay-history", JSON.stringify(savedHistory));
      } catch (err) {
        console.error("Error saving session history:", err);
      }
    }

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

      // Add journal reflection to the student timeline
      const rpJournalReflection = {
        id: `reflection-rp-${career}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        careerId: career === "lawyer" ? "lawyer" : "doctor",
        excited: `Completed flagship AI Voice Roleplay session as a ${career === "lawyer" ? "Defense Attorney" : "Medical Doctor"}. Scores: Fit ${evalReport.careerFitScore}%, Comm ${evalReport.communicationScore}%.`,
        difficult: evalReport.improvement,
        surprised: evalReport.strengths,
        feeling: Math.round(evalReport.careerFitScore / 20)
      };

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
        dna: updatedDna,
        journalReflections: [...(profile.journalReflections || []), rpJournalReflection]
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

  const endRoleplaySession = async () => {
    setIsSessionEnded(true);
    isSessionEndedRef.current = true;
    stopAllVoiceActivity();
    await generateFeedbackReport();
  };

  const endSession = async () => {
    await endRoleplaySession();
  };

  const exitRoleplay = () => {
    setIsPlaying(false);
    setCareer(null);
    setHistory([]);
    setShowReport(false);
    setReport(null);
    setAnimateScores(false);
    setConfigError(null);
    setIsFallbackMode(false);
    setIsSessionEnded(false);
    isSessionEndedRef.current = false;
    setTurnCount(0);
    turnCountRef.current = 0;
    
    stopAllVoiceActivity();
    
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

            {/* Language Selector */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-violet-500/[0.02] to-transparent">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-slate-700">Roleplay Language / भाषा चुनें</h4>
                <p className="text-xs text-muted-foreground">Choose the language you want to speak and write in during the simulation.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { id: "english", label: "English" },
                  { id: "hindi", label: "Hindi (Roman script)" },
                  { id: "hinglish", label: "Hinglish (Hindi + English)" }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id as any)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                      selectedLanguage === lang.id
                        ? "bg-primary text-white scale-[1.03]"
                        : "bg-muted border border-border text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
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
                    {isSpeaking && (
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
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base font-black text-slate-800 flex items-center justify-center gap-1.5">
                    {career === "lawyer" ? "Judge Sterling" : "Patient: Alex Mercer"}
                    {isFallbackMode && (
                      <span className="text-[8px] bg-amber-500/10 text-amber-700 border border-amber-500/25 px-1.5 py-0.5 rounded font-black uppercase animate-pulse select-none">
                        Fallback
                      </span>
                    )}
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
                  {isSessionEnded ? (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-wider block">Session complete</span>
                      <div className="flex items-center gap-1 h-5 justify-center">
                        {[...Array(8)].map((_, idx) => (
                          <div key={idx} className="w-1 h-1.5 bg-slate-200 rounded-full" />
                        ))}
                      </div>
                    </div>
                  ) : isSpeaking ? (
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
                {configError && (
                  <div className="bg-amber-50 border border-amber-500/20 text-amber-800 text-[11px] font-bold p-3 rounded-xl flex items-start gap-2 select-none animate-in fade-in duration-300">
                    <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="block uppercase tracking-wider text-[9px] text-amber-600 font-extrabold">Config Warning</span>
                      <p>{configError}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  
                  {/* Microphone active button */}
                  <motion.button
                    onClick={toggleListening}
                    whileTap={{ scale: 0.95 }}
                    disabled={micStatus === "unsupported" || micStatus === "not-secure" || isPaused || isSessionEnded || isProcessing}
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 relative shadow-sm",
                      isListening
                        ? "bg-rose-500 border-rose-600 text-white animate-pulse"
                        : "bg-muted text-muted-foreground border-border hover:bg-slate-200 hover:text-foreground",
                      (micStatus === "unsupported" || micStatus === "not-secure" || isPaused || isSessionEnded || isProcessing) && "opacity-50 cursor-not-allowed"
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
                        if (e.key === "Enter" && !isThinking && !isProcessingRef.current && !isSessionEnded) {
                          handleSendMessage();
                        }
                      }}
                      disabled={isThinking || isProcessingRef.current || isSessionEnded}
                      placeholder={
                        isSessionEnded
                          ? "Session complete"
                          : isListening 
                          ? "Speaking... (transcribing live)" 
                          : isPaused 
                          ? "Microphone is paused. Type your response..." 
                          : "Speak or type your response..."
                      }
                      className="w-full h-12 rounded-xl border border-border/80 px-4 pr-12 text-xs bg-muted/30 focus:bg-background outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={isThinking || isProcessingRef.current || isSessionEnded || !currentInput.trim()}
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
                      disabled={isSessionEnded}
                      className={cn(
                        "text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all duration-300",
                        isTwoWayMode
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                          : "bg-muted border-border text-muted-foreground hover:bg-slate-200",
                        isSessionEnded && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isTwoWayMode ? "🔁 Two-Way Voice Loop Active" : "💬 Manual Send Mode"}
                    </button>

                    {/* Pause/Resume Mic Button */}
                    {isTwoWayMode && (
                      <button
                        onClick={togglePause}
                        disabled={isSessionEnded}
                        className={cn(
                          "text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all duration-300",
                          isPaused
                            ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 animate-pulse"
                            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200",
                          isSessionEnded && "opacity-50 cursor-not-allowed"
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
                    disabled={isSessionEnded}
                    className="rounded-lg text-xs font-bold h-8 px-3 tracking-tight bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
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
                    <circle cx="32" cy="32" r="26" className="stroke-indigo-500 fill-none stroke-[4]" style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} strokeDasharray="163" strokeDashoffset={163 - (163 * (animateScores ? report.communicationScore : 0)) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-800">{report.communicationScore}%</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3">Communication</span>
                {evaluationStats && (
                  <span className="text-[9px] font-bold text-indigo-500/80 mt-1 select-none">
                    Avg words: {evaluationStats.avgResponseLength} | turns: {evaluationStats.turnCount}
                  </span>
                )}
              </div>

              {/* Stat 2: Confidence */}
              <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="32" cy="32" r="26" className="stroke-muted fill-none stroke-[4]" />
                    <circle cx="32" cy="32" r="26" className="stroke-orange-500 fill-none stroke-[4]" style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} strokeDasharray="163" strokeDashoffset={163 - (163 * (animateScores ? report.confidenceScore : 0)) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-800">{report.confidenceScore}%</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3">Confidence</span>
                {evaluationStats && (
                  <span className="text-[9px] font-bold text-orange-500/80 mt-1 select-none">
                    Hesitations: {evaluationStats.hesitationCount} | Interrupts: {evaluationStats.interruptions}
                  </span>
                )}
              </div>

              {/* Stat 3: Reasoning */}
              <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="32" cy="32" r="26" className="stroke-muted fill-none stroke-[4]" />
                    <circle cx="32" cy="32" r="26" className="stroke-teal-500 fill-none stroke-[4]" style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} strokeDasharray="163" strokeDashoffset={163 - (163 * (animateScores ? (report.reasoningScore || 80) : 0)) / 100} strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-800">{report.reasoningScore || 80}%</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3">Reasoning</span>
                {evaluationStats && (
                  <span className="text-[9px] font-bold text-teal-500/80 mt-1 select-none">
                    Logic keywords: {evaluationStats.keywordMatches}
                  </span>
                )}
              </div>

              {/* Stat 4: Empathy/Persuasion */}
              <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="32" cy="32" r="26" className="stroke-muted fill-none stroke-[4]" />
                    <circle cx="32" cy="32" r="26" className="stroke-violet-500 fill-none stroke-[4]" style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} strokeDasharray="163" 
                      strokeDashoffset={163 - (163 * (animateScores ? (career === "lawyer" ? (report.persuasionScore || report.communicationScore) : (report.empathyScore || report.communicationScore)) : 0)) / 100} 
                      strokeLinecap="round" />
                  </svg>
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-black text-slate-800">
                    {career === "lawyer" ? (report.persuasionScore || 80) : (report.empathyScore || 80)}%
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-3">
                  {career === "lawyer" ? "Persuasion" : "Empathy"}
                </span>
                {evaluationStats && (
                  <span className="text-[9px] font-bold text-violet-500/80 mt-1 select-none">
                    Questions: {evaluationStats.questionCount} | Voice turns: {evaluationStats.microphoneParticipation}%
                  </span>
                )}
              </div>
            </div>

            {/* Career Fit Score & Insight HUD */}
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-indigo-500/[0.02] to-transparent">
              <div className="flex flex-col items-center text-center shrink-0">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <svg className="absolute transform -rotate-90 w-full h-full">
                    <circle cx="40" cy="40" r="34" className="stroke-muted fill-none stroke-[5]" />
                    <circle cx="40" cy="40" r="34" className="stroke-emerald-500 fill-none stroke-[5]" style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} strokeDasharray="213" strokeDashoffset={213 - (213 * (animateScores ? report.careerFitScore : 0)) / 100} strokeLinecap="round" />
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
                Start New Roleplay <RefreshCw className="h-4 w-4 ml-1.5" />
              </Button>
            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}
