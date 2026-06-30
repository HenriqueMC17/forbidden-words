import React from "react";
import { Clock, Megaphone } from "lucide-react";
import { VoiceTranscriber } from "../VoiceTranscriber";

interface Player {
  _id: string;
  token: string;
  name: string;
  score: number;
  isOnline: boolean;
  avatar?: string;
  color?: string;
}

interface ActiveCardProps {
  status: "LOBBY" | "IN_PROGRESS" | "ROUND_END" | "GAME_OVER";
  isHost: boolean;
  isSpeaker: boolean;
  timeLeft: number;
  targetWord?: string;
  targetTranslation?: string; // Dica em português
  forbiddenWords?: string[];
  forbiddenTranslations?: string[]; // Dicas das palavras proibidas
  currentSpeakerName?: string;
  playerCount: number;
  roundDuration?: number;
  targetScore?: number;
  players?: Player[];
  onStartGame: () => void;
  onNextRound: () => void;
  onVoiceTranscript: (text: string) => void;
  onUpdateSettings?: (roundDuration: number, targetScore: number) => void;
  onResetGame?: () => void;
}

export const ActiveCard: React.FC<ActiveCardProps> = ({
  status,
  isHost,
  isSpeaker,
  timeLeft,
  targetWord,
  targetTranslation,
  forbiddenWords,
  forbiddenTranslations,
  currentSpeakerName,
  playerCount,
  roundDuration,
  targetScore,
  players,
  onStartGame,
  onNextRound,
  onVoiceTranscript,
  onUpdateSettings,
  onResetGame,
}) => {
  // Ordena os jogadores para renderizar o pódio no GAME_OVER
  const sortedPlayers = [...(players || [])].sort((a, b) => b.score - a.score);
  const p1 = sortedPlayers[0];
  const p2 = sortedPlayers[1];
  const p3 = sortedPlayers[2];

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
            maxWidth: "440px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
          }}
          className="fade-in"
        >
          <span style={{ fontSize: "3rem" }}>🎮</span>
          <h2>Aguardando o início do jogo</h2>

          {/* Configurações da Sala */}
          <div
            className="liquid-glass"
            style={{
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              textAlign: "left",
              border: "1px solid var(--border-l2)",
            }}
          >
            <h4 style={{ fontSize: "0.8rem", color: "rgba(6, 182, 212, 1)", letterSpacing: "0.5px", fontWeight: 700 }}>
              CONFIGURAÇÕES DA SALA
            </h4>
            
            {isHost ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>Tempo do Round:</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[30, 60, 90].map((d) => (
                      <button
                        key={d}
                        onClick={() => onUpdateSettings?.(d, targetScore || 50)}
                        className="btn"
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                          background: roundDuration === d ? "linear-gradient(135deg, hsl(var(--color-primary)) 0%, rgba(139, 92, 246, 0.8) 100%)" : "var(--bg-l2)",
                          border: roundDuration === d ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid var(--border-l1)",
                        }}
                      >
                        {d}s
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>Meta de Pontos:</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[30, 50, 80].map((s) => (
                      <button
                        key={s}
                        onClick={() => onUpdateSettings?.(roundDuration || 60, s)}
                        className="btn"
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                          background: targetScore === s ? "linear-gradient(135deg, hsl(var(--color-primary)) 0%, rgba(139, 92, 246, 0.8) 100%)" : "var(--bg-l2)",
                          border: targetScore === s ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid var(--border-l1)",
                        }}
                      >
                        {s} pts
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Duração da rodada:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{roundDuration} segundos</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Pontuação para vencer:</span>
                  <strong style={{ color: "var(--text-primary)" }}>{targetScore} pontos</strong>
                </div>
              </div>
            )}
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            {isHost
              ? "Como criador da sala, você pode iniciar o jogo assim que houver pelo menos 2 jogadores conectados."
              : "Aguardando o host iniciar a partida..."}
          </p>
          {isHost && (
            <button
              onClick={onStartGame}
              className="btn btn-primary"
              style={{ marginTop: "6px" }}
              disabled={playerCount < 2}
            >
              Começar Partida
            </button>
          )}
          {playerCount < 2 && (
            <span style={{ fontSize: "0.8rem", color: "rgba(245, 158, 11, 1)", fontWeight: 500 }}>
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
                {targetTranslation && (
                  <span style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontStyle: "italic", display: "block", marginTop: "-6px", marginBottom: "12px" }}>
                    ({targetTranslation})
                  </span>
                )}
                
                <div style={{ height: "1px", background: "rgba(139, 92, 246, 0.2)", margin: "8px 0 16px 0" }}></div>
                
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
                  {forbiddenWords?.map((fw, idx) => {
                    const translation = forbiddenTranslations?.[idx];
                    return (
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
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <span>{fw}</span>
                        {translation && (
                          <span style={{ fontSize: "0.85rem", color: "rgba(244, 63, 94, 0.65)", fontStyle: "italic", fontWeight: 500 }}>
                            {translation}
                          </span>
                        )}
                      </li>
                    );
                  })}
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
          <span style={{ fontSize: "3.5rem" }}>🎉</span>
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
            {targetTranslation && (
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                ({targetTranslation})
              </p>
            )}
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

      {/* GAME_OVER STATE */}
      {status === "GAME_OVER" && (
        <div
          style={{
            textAlign: "center",
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
            alignItems: "center",
          }}
          className="fade-in"
        >
          <span style={{ fontSize: "3.5rem" }}>🏆</span>
          <h2 className="gradient-text" style={{ fontSize: "2rem", fontWeight: 800 }}>Fim de Jogo!</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "-10px" }}>
            A pontuação limite de <strong>{targetScore} pts</strong> foi atingida!
          </p>

          {/* Podium */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr 1fr",
              alignItems: "end",
              gap: "12px",
              width: "100%",
              margin: "12px 0",
              minHeight: "180px",
            }}
          >
            {/* 2nd Place */}
            {p2 ? (
              <div
                className="glass-panel"
                style={{
                  padding: "16px 12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.01)",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.03)",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🥈</span>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${p2.color || "hsl(262, 83%, 68%)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                  {p2.avatar || "🦊"}
                </div>
                <strong style={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>{p2.name}</strong>
                <span className="tabular-nums" style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 700 }}>{p2.score} pts</span>
              </div>
            ) : (
              <div style={{ minHeight: "10px" }} />
            )}

            {/* 1st Place */}
            {p1 ? (
              <div
                className="liquid-glass"
                style={{
                  padding: "24px 16px",
                  borderRadius: "16px",
                  border: "2px solid gold",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255, 215, 0, 0.06)",
                  boxShadow: "0 0 25px rgba(255, 215, 0, 0.15)",
                  transform: "scale(1.05)",
                }}
              >
                <span style={{ fontSize: "2rem" }}>👑</span>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: `3px solid ${p1.color || "gold"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 0 12px rgba(255, 215, 0, 0.25)" }}>
                  {p1.avatar || "🦊"}
                </div>
                <strong style={{ fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", color: "gold" }}>{p1.name}</strong>
                <span className="tabular-nums" style={{ fontSize: "0.95rem", color: "white", fontWeight: 800 }}>{p1.score} pts</span>
              </div>
            ) : (
              <div style={{ minHeight: "10px" }} />
            )}

            {/* 3rd Place */}
            {p3 ? (
              <div
                className="glass-panel"
                style={{
                  padding: "16px 12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.01)",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.03)",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>🥉</span>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${p3.color || "hsl(262, 83%, 68%)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
                  {p3.avatar || "🦊"}
                </div>
                <strong style={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>{p3.name}</strong>
                <span className="tabular-nums" style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 700 }}>{p3.score} pts</span>
              </div>
            ) : (
              <div style={{ minHeight: "10px" }} />
            )}
          </div>

          {isHost ? (
            <button onClick={onResetGame} className="btn btn-primary" style={{ marginTop: "10px", padding: "12px 24px" }}>
              Reiniciar Partida (Voltar ao Lobby)
            </button>
          ) : (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              Aguardando o host reiniciar a sala para uma nova partida...
            </p>
          )}
        </div>
      )}
    </section>
  );
};