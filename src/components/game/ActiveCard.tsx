import React from "react";
import { Clock, Megaphone } from "lucide-react";
import { VoiceTranscriber } from "../VoiceTranscriber";

interface ActiveCardProps {
  status: "LOBBY" | "IN_PROGRESS" | "ROUND_END";
  isHost: boolean;
  isSpeaker: boolean;
  timeLeft: number;
  targetWord?: string;
  forbiddenWords?: string[];
  currentSpeakerName?: string;
  playerCount: number;
  onStartGame: () => void;
  onNextRound: () => void;
  onVoiceTranscript: (text: string) => void;
}

export const ActiveCard: React.FC<ActiveCardProps> = ({
  status,
  isHost,
  isSpeaker,
  timeLeft,
  targetWord,
  forbiddenWords,
  currentSpeakerName,
  playerCount,
  onStartGame,
  onNextRound,
  onVoiceTranscript,
}) => {
  return (
    <section
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1.2,
        padding: "24px",
        position: "relative",
        borderRadius: "16px",
      }}
    >
      {/* LOBBY STATE */}
      {status === "LOBBY" && (
        <div
          style={{
            textAlign: "center",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          className="fade-in"
        >
          <span style={{ fontSize: "3rem" }}>🎮</span>
          <h2>Aguardando o início do jogo</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            {isHost
              ? "Como criador da sala, você pode iniciar o jogo assim que houver pelo menos 2 jogadores conectados."
              : "Aguardando o host iniciar a partida..."}
          </p>
          {isHost && (
            <button
              onClick={onStartGame}
              className="btn btn-primary"
              style={{ marginTop: "10px" }}
              disabled={playerCount < 2}
            >
              Começar Partida
            </button>
          )}
          {playerCount < 2 && (
            <span style={{ fontSize: "0.8rem", color: "rgba(245, 158, 11, 1)" }}>
              ⚠️ Convide mais amigos para jogar! Mínimo de 2 jogadores.
            </span>
          )}
        </div>
      )}

      {/* IN_PROGRESS STATE */}
      {status === "IN_PROGRESS" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
          className="fade-in"
        >
          {/* Timer */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Clock size={20} color={timeLeft <= 10 ? "rgba(244, 63, 94, 1)" : "var(--text-secondary)"} />
            <span
              className="tabular-nums"
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                color: timeLeft <= 10 ? "rgba(244, 63, 94, 1)" : "var(--text-primary)",
              }}
            >
              0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
            {timeLeft <= 10 && (
              <span style={{ fontSize: "0.8rem", color: "rgba(244, 63, 94, 1)", fontWeight: 700 }}>
                QUICKLY!
              </span>
            )}
          </div>

          {/* Taboo card layout */}
          {isSpeaker ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                width: "100%",
                maxWidth: "380px",
              }}
            >
              <div
                className="liquid-glass"
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  textAlign: "center",
                  border: "2px solid rgba(139, 92, 246, 0.45)",
                  boxShadow: "0 0 25px rgba(139, 92, 246, 0.2)",
                }}
              >
                <span style={{ fontSize: "0.8rem", color: "rgba(6, 182, 212, 1)", fontWeight: 700, letterSpacing: "1px" }}>
                  SUA PALAVRA ALVO
                </span>
                <h2 style={{ fontSize: "2.4rem", fontWeight: 800, margin: "8px 0", color: "white" }}>
                  {targetWord}
                </h2>
                <div style={{ height: "1px", background: "rgba(139, 92, 246, 0.2)", margin: "16px 0" }}></div>
                <span style={{ fontSize: "0.8rem", color: "rgba(244, 63, 94, 1)", fontWeight: 700, letterSpacing: "1px" }}>
                  PALAVRAS PROIBIDAS (TABOO)
                </span>
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  {forbiddenWords?.map((fw) => (
                    <li
                      key={fw}
                      style={{
                        background: "rgba(244, 63, 94, 0.08)",
                        border: "1px solid rgba(244, 63, 94, 0.15)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "rgba(244, 63, 94, 1)",
                      }}
                    >
                      {fw}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <VoiceTranscriber onTranscript={onVoiceTranscript} />
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "8px" }}>
                  Fale no microfone ou use o chat abaixo para descrever em inglês.
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                margin: "auto 0",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(6, 182, 212, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(6, 182, 212, 1)",
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)",
                  animation: "pulse 2s infinite",
                }}
              >
                <Megaphone size={32} color="rgba(6, 182, 212, 1)" />
              </div>
              <h2>Descubra a Palavra!</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "340px" }}>
                <strong>{currentSpeakerName}</strong> está descrevendo a palavra. Digite seus palpites no chat de palpites abaixo!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ROUND_END STATE */}
      {status === "ROUND_END" && (
        <div
          style={{
            textAlign: "center",
            maxWidth: "420px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          className="fade-in"
        >
          <span style={{ fontSize: "3.5rem" }}>🏆</span>
          <h2>Fim da Rodada!</h2>
          <div
            style={{
              padding: "16px 24px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-l1)",
              borderRadius: "12px",
              margin: "8px 0",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>A palavra alvo era:</p>
            <h2 style={{ fontSize: "2rem", color: "white", margin: "4px 0" }}>{targetWord}</h2>
          </div>
          {isHost ? (
            <button onClick={onNextRound} className="btn btn-primary" style={{ marginTop: "10px" }}>
              Iniciar Próxima Rodada
            </button>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Aguardando o host iniciar a próxima rodada...
            </p>
          )}
        </div>
      )}
    </section>
  );
};
