import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { LogOut } from "lucide-react";
import { PlayerSidebar } from "./game/PlayerSidebar";
import { ActiveCard } from "./game/ActiveCard";
import { ChatPanel } from "./game/ChatPanel";

interface GameRoomProps {
  roomId: string;
  playerToken: string;
  onLeave: () => void;
}

interface WindowWithAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const playSuccessSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as WindowWithAudioContext).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    // Tocando um sinal sonoro duplo harmônico e ascendente (Dó5 -> Mi5)
    playTone(523.25, ctx.currentTime, 0.15);
    playTone(659.25, ctx.currentTime + 0.1, 0.30);
  } catch (e) {
    console.warn("Failed to play success sound via Web Audio API", e);
  }
};

const playBuzzSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as WindowWithAudioContext).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth"; // Som dente-de-serra clássico de campainha/buzz
    osc.frequency.setValueAtTime(100, ctx.currentTime); // Frequência grave de 100Hz
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn("Failed to play buzz sound via Web Audio API", e);
  }
};

const playTickSound = (isTock: boolean, timeLeft: number) => {
  try {
    const AudioContextClass = window.AudioContext || (window as WindowWithAudioContext).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // O tom aumenta conforme o tempo fica menor (de 10s a 1s)
    const baseFreq = isTock ? 380 : 560;
    const pitchMultiplier = 1 + (10 - timeLeft) * 0.05; // Vai de 1.0x a 1.45x
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq * pitchMultiplier, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Silencia erros de áudio
  }
};

export const GameRoom: React.FC<GameRoomProps> = ({ roomId, playerToken, onLeave }) => {
  const room = useQuery(api.rooms.getRoomDetails, {
    roomId: roomId as Id<"rooms">,
    token: playerToken,
  });

  const sendMessage = useMutation(api.messages.sendMessage);
  const startGame = useMutation(api.rooms.startGame);
  const nextRound = useMutation(api.rooms.nextRound);
  const forceEndRound = useMutation(api.rooms.forceEndRound);
  const leaveRoom = useMutation(api.players.leaveRoom);
  const updateTypingStatus = useMutation(api.players.updateTypingStatus);
  const updateRoomSettings = useMutation(api.rooms.updateRoomSettings);
  const resetRoomToLobby = useMutation(api.rooms.resetRoomToLobby);

  const [inputText, setInputText] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [shouldShake, setShouldShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const lastMessageIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<any | null>(null);

  // Efeitos visuais e sonoros reativos (Confete no acerto, Shake e Buzz no erro)
  useEffect(() => {
    if (room && room.messages && room.messages.length > 0) {
      const lastMsg = room.messages[room.messages.length - 1];
      if (lastMsg._id !== lastMessageIdRef.current) {
        lastMessageIdRef.current = lastMsg._id;
        
        if (lastMsg.type === "correct" || room.status === "GAME_OVER") {
          playSuccessSound();
          import("canvas-confetti").then((module) => {
            const confetti = module.default;
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
            });
          }).catch((err) => {
            console.error("Failed to load canvas-confetti", err);
          });
        } else if (lastMsg.type === "buzz") {
          playBuzzSound();
          setShouldShake(true);
          setTimeout(() => setShouldShake(false), 400);
        }
      }
    }
  }, [room?.messages, room?.status]);

  // Temporizador local reativo sincronizado com o Convex com feedback sonoro (tique-taque)
  useEffect(() => {
    if (room && room.status === "IN_PROGRESS" && room.roundEndTime) {
      let lastTickSecond = -1;
      const updateTimer = () => {
        const remaining = Math.max(0, Math.ceil((room.roundEndTime! - Date.now()) / 1000));
        setTimeLeft(remaining);

        // Tique-taque sonoro de urgência nos últimos 10 segundos
        if (remaining > 0 && remaining <= 10 && remaining !== lastTickSecond) {
          lastTickSecond = remaining;
          playTickSound(remaining % 2 === 0, remaining);
        }

        if (remaining === 0) {
          clearInterval(interval);
          // O Host encerra a rodada no backend quando o tempo esgota
          if (room.hostId === playerToken) {
            forceEndRound({ roomId: room._id }).catch((err) => {
              console.error("Failed to force end round", err);
            });
          }
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 250);
      return () => clearInterval(interval);
    }
  }, [room?.status, room?.roundEndTime, room?.hostId, playerToken, roomId, forceEndRound]);

  // Event listener para tratar desconexão automática ao fechar a aba ou recarregar (Presence)
  useEffect(() => {
    const handleUnload = () => {
      leaveRoom({ roomId: roomId as Id<"rooms">, token: playerToken }).catch((err) => {
        console.error("Failed to leave room on unload", err);
      });
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [roomId, playerToken, leaveRoom]);

  const handleVoiceTranscript = useCallback(async (text: string) => {
    if (!room) return;
    try {
      await sendMessage({
        roomId: room._id,
        token: playerToken,
        text,
      });
    } catch (err) {
      console.error("Erro ao enviar transcrição de voz", err);
    }
  }, [room?._id, playerToken, sendMessage]);

  if (!room) {
    return (
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyItems: "center", color: "var(--text-secondary)" }}>
        Carregando sala de jogo...
      </div>
    );
  }

  const isHost = room.hostId === playerToken;
  const isSpeaker = room.currentSpeakerId === playerToken;
  const currentSpeaker = room.players.find((p) => p.token === room.currentSpeakerId);

  const handleInputChange = (text: string) => {
    setInputText(text);

    // Dispara typing status true no Convex
    updateTypingStatus({
      roomId: room._id,
      token: playerToken,
      isTyping: text.trim().length > 0,
    }).catch(() => {});

    // Debounce para limpar status digitando após 1.5s
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus({
        roomId: room._id,
        token: playerToken,
        isTyping: false,
      }).catch(() => {});
    }, 1500);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    // Limpa status digitando imediatamente
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    updateTypingStatus({
      roomId: room._id,
      token: playerToken,
      isTyping: false,
    }).catch(() => {});

    try {
      setErrorMsg("");
      await sendMessage({
        roomId: room._id,
        token: playerToken,
        text: inputText.trim(),
      });
      setInputText("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao enviar mensagem");
    }
  };



  const handleStart = async () => {
    try {
      setErrorMsg("");
      await startGame({ roomId: room._id, token: playerToken });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao iniciar jogo");
    }
  };

  const handleNext = async () => {
    try {
      await nextRound({ roomId: room._id });
    } catch (err) {
      console.error("Erro ao avançar rodada", err);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveRoom({ roomId: room._id, token: playerToken });
    } catch (err) {
      console.error("Erro ao sair da sala", err);
    }
    onLeave();
  };

  const handleUpdateSettings = async (duration: number, score: number) => {
    try {
      await updateRoomSettings({
        roomId: room._id,
        token: playerToken,
        roundDuration: duration,
        targetScore: score,
      });
    } catch (err) {
      console.error("Erro ao atualizar configurações", err);
    }
  };

  const handleResetGame = async () => {
    try {
      await resetRoomToLobby({
        roomId: room._id,
        token: playerToken,
      });
    } catch (err) {
      console.error("Erro ao reiniciar jogo", err);
    }
  };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", flex: 1, height: "100vh", padding: "16px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <header className="glass-panel" style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", padding: "16px 24px", marginBottom: "16px", borderRadius: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }} className="gradient-text">Forbidden Words</h2>
          <span style={{ fontSize: "0.85rem", padding: "4px 10px", borderRadius: "99px", background: "rgba(6, 182, 212, 0.15)", color: "rgba(6, 182, 212, 1)", fontWeight: 700 }}>
            CODE: {room.code}
          </span>
          {room.status !== "LOBBY" && (
            <span style={{ fontSize: "0.85rem", padding: "4px 10px", borderRadius: "99px", background: "rgba(255, 255, 255, 0.05)", color: "var(--text-secondary)", fontWeight: 600 }}>
              Round {room.roundCount}
            </span>
          )}
        </div>
        <button onClick={handleLeave} className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
          <LogOut size={16} /> Sair da Sala
        </button>
      </header>

      {/* Main Content Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px", flex: 1, minHeight: 0 }}>
        
        {/* Left Side: Leaderboard & Players */}
        <PlayerSidebar
          players={room.players}
          playerToken={playerToken}
          currentSpeakerId={room.currentSpeakerId}
          hostId={room.hostId}
        />

        {/* Right Side: Primary Game Dashboard */}
        <main style={{ display: "flex", flexDirection: "column", gap: "16px", minWidth: 0 }}>
          
          {/* Main Gameplay Screen */}
          <div className={shouldShake ? "shake" : ""} style={{ display: "flex", flex: 1.2, minHeight: 0 }}>
            <ActiveCard
              status={room.status}
              isHost={isHost}
              isSpeaker={isSpeaker}
              timeLeft={timeLeft}
              targetWord={room.targetWord}
              targetTranslation={room.targetTranslation}
              forbiddenWords={room.forbiddenWords}
              forbiddenTranslations={room.forbiddenTranslations}
              currentSpeakerName={currentSpeaker?.name}
              playerCount={room.players.length}
              roundDuration={room.roundDuration}
              targetScore={room.targetScore}
              players={room.players}
              onStartGame={handleStart}
              onNextRound={handleNext}
              onVoiceTranscript={handleVoiceTranscript}
              onUpdateSettings={handleUpdateSettings}
              onResetGame={handleResetGame}
            />
          </div>

          {/* Chat & Messages Log Panel */}
          <ChatPanel
            messages={room.messages}
            status={room.status === "GAME_OVER" ? "ROUND_END" : room.status}
            isSpeaker={isSpeaker}
            inputText={inputText}
            onChangeInput={handleInputChange}
            onSendMessage={handleSend}
            errorMsg={errorMsg}
          />
        </main>
      </div>
    </div>
  );
};