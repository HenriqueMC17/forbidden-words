import React from "react";
import { Crown } from "lucide-react";

interface Player {
  _id: string;
  token: string;
  name: string;
  score: number;
  isOnline: boolean;
}

interface PlayerSidebarProps {
  players: Player[];
  playerToken: string;
  currentSpeakerId?: string;
  hostId: string;
}

export const PlayerSidebar: React.FC<PlayerSidebarProps> = ({
  players,
  playerToken,
  currentSpeakerId,
  hostId,
}) => {
  return (
    <aside
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        borderRadius: "16px",
      }}
    >
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          marginBottom: "16px",
          borderBottom: "1px solid var(--border-light)",
          paddingBottom: "8px",
        }}
      >
        Jogadores ({players.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, overflowY: "auto" }}>
        {players
          .slice()
          .sort((a, b) => b.score - a.score)
          .map((p) => {
            const isPlayerSpeaker = currentSpeakerId === p.token;
            const isPlayerHost = hostId === p.token;
            return (
              <div
                key={p._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: p.token === playerToken ? "rgba(139, 92, 246, 0.12)" : "rgba(255, 255, 255, 0.02)",
                  border: p.token === playerToken ? "1px solid rgba(139, 92, 246, 0.25)" : "1px solid transparent",
                  opacity: p.isOnline ? 1 : 0.4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                  <div style={{ position: "relative" }}>
                    <span style={{ fontSize: "1.1rem" }}>{isPlayerSpeaker ? "🎙️" : "👤"}</span>
                    {!p.isOnline && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "var(--text-muted)",
                        }}
                      ></span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: p.token === playerToken ? 700 : 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.name} {p.token === playerToken && " (Você)"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {isPlayerHost && (
                    <Crown
                      size={14}
                      color="gold"
                      style={{ filter: "drop-shadow(0 0 2px rgba(255,215,0,0.4))" }}
                    />
                  )}
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {p.score} pts
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </aside>
  );
};
