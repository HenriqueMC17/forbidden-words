import React from "react";
import { Crown } from "lucide-react";

interface Player {
  _id: string;
  token: string;
  name: string;
  score: number;
  isOnline: boolean;
  avatar?: string;
  color?: string;
  isTyping?: boolean;
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
            const themeColor = p.color || "hsl(262, 83%, 68%)";
            const borderStyle = p.token === playerToken 
              ? `2px solid ${themeColor}` 
              : "1px solid transparent";
            
            return (
              <div
                key={p._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: p.token === playerToken ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.01)",
                  border: borderStyle,
                  boxShadow: p.token === playerToken ? `0 0 12px ${themeColor}1a` : undefined,
                  opacity: p.isOnline ? 1 : 0.4,
                  transition: "all 0.25s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div style={{ position: "relative" }}>
                    <div 
                      style={{ 
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(13, 13, 13, 0.5)",
                        border: `2px solid ${themeColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        boxShadow: `0 0 8px ${themeColor}40`
                      }}
                    >
                      {isPlayerSpeaker ? "🎙️" : (p.avatar || "🦊")}
                    </div>
                    {!p.isOnline && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: -2,
                          right: -2,
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "var(--text-muted)",
                          border: "1px solid var(--bg-l0)"
                        }}
                      ></span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
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
                    {p.isTyping && (
                      <span style={{ fontSize: "0.7rem", color: "hsl(190, 90%, 50%)", fontWeight: 600 }} className="fade-in">
                        Digitando...
                      </span>
                    )}
                  </div>
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
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      padding: "2px 6px",
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