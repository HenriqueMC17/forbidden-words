import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

interface VoiceTranscriberProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceTranscriber: React.FC<VoiceTranscriberProps> = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    // Suporte para navegadores web (Chrome, Edge, Safari utilizam webkitSpeechRecognition)
    const SpeechRecognitionClass = 
      (window as WindowWithSpeech).SpeechRecognition || 
      (window as WindowWithSpeech).webkitSpeechRecognition;
      
    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognitionClass();
    rec.continuous = true; // Reconhecimento de voz contínuo ativado!
    rec.interimResults = true;
    rec.lang = "en-US"; // Obriga o reconhecimento de fala em Inglês

    rec.onstart = () => {
      setIsListening(true);
      setInterimText("");
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimText(interim);
      if (final.trim()) {
        onTranscript(final.trim());
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = rec;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition", err);
      }
    }
  };

  if (!isSupported) {
    return (
      <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "8px" }}>
        Microphone speech-to-text not supported in this browser. Use Chrome/Edge/Safari.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%", marginTop: "12px" }}>
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`btn ${isListening ? "mic-active" : "btn-primary"}`}
        style={{
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          padding: 0,
          boxShadow: isListening ? "0 0 25px rgba(244, 63, 94, 0.5)" : undefined,
        }}
        title={isListening ? "Stop Speaking" : "Start Speaking (English)"}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      {isListening && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }} className="fade-in">
          <span style={{ fontSize: "0.85rem", color: "rgba(244, 63, 94, 1)", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="voice-waves" style={{ marginTop: 0 }}>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
            Listening (Speak in English)...
          </span>
          {interimText && (
            <p 
              className="liquid-glass"
              style={{ 
                fontStyle: "italic", 
                color: "var(--text-primary)", 
                fontSize: "0.95rem", 
                textAlign: "center", 
                maxWidth: "300px", 
                padding: "8px 16px", 
                borderRadius: "12px",
                border: "1px solid var(--border-l2)"
              }}
            >
              "{interimText}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};