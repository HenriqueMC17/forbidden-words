import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Flame, Play, Plus } from "lucide-react";

interface LobbyProps {
  playerToken: string;
  onRoomJoined: (roomId: string) => void;
}

const AVATARS = ["🦊", "🚀", "🧙‍♂️", "🍕", "💎", "🎨", "🦁", "👾", "🌈", "🔥", "🌟", "🦄"];
const COLORS = [
  { name: "Violet", value: "hsl(262, 83%, 68%)" },
  { name: "Cyan", value: "hsl(190, 90%, 50%)" },
  { name: "Emerald", value: "hsl(142, 70%, 45%)" },
  { name: "Gold", value: "hsl(38, 92%, 50%)" },
  { name: "Crimson", value: "hsl(350, 80%, 55%)" },
];

export const Lobby: React.FC<LobbyProps> = ({ playerToken, onRoomJoined }) => {
  const [name, setName] = useState(() => localStorage.getItem("playerName") || "");
  const [avatar, setAvatar] = useState(() => localStorage.getItem("playerAvatar") || "🦊");
  const [color, setColor] = useState(() => localStorage.getItem("playerColor") || "hsl(262, 83%, 68%)");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = useMutation(api.rooms.createRoom);
  const joinRoom = useMutation(api.rooms.joinRoom);

  const saveProfile = () => {
    localStorage.setItem("playerName", name.trim());
    localStorage.setItem("playerAvatar", avatar);
    localStorage.setItem("playerColor", color);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      saveProfile();
      const result = await createRoom({
        playerName: name.trim(),
        token: playerToken,
        avatar,
        color,
      });
      onRoomJoined(result.roomId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (code.trim().length !== 4) {
      setError("Room code must be exactly 4 letters");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      saveProfile();
      const result = await joinRoom({
        code: code.trim().toUpperCase(),
        playerName: name.trim(),
        token: playerToken,
        avatar,
        color,
      });
      onRoomJoined(result.roomId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        padding: "24px",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          border: "1px solid var(--border-l1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, hsl(var(--color-primary)) 0%, hsl(var(--color-secondary)) 100%)",
              marginBottom: "12px",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
            }}
          >
            <Flame size={32} color="white" />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "4px" }} className="gradient-text">
            Forbidden Words
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            The ultimate Taboo game. Describe terms in English without saying forbidden words!
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "hsl(var(--color-danger))",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>YOUR NAME</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Alex Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={16}
            disabled={isLoading}
            style={{ padding: "12px 16px" }}
          />
        </div>

        {/* Customization (Avatar & Color) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>CHOOSE AVATAR</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            {AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => setAvatar(av)}
                style={{
                  width: "36px",
                  height: "36px",
                  fontSize: "1.3rem",
                  borderRadius: "8px",
                  border: avatar === av ? `2px solid ${color}` : "1px solid var(--border-l1)",
                  background: avatar === av ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s ease",
                  transform: avatar === av ? "scale(1.1)" : "scale(1)",
                }}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>THEME COLOR</label>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            {COLORS.map((col) => (
              <button
                key={col.name}
                type="button"
                onClick={() => setColor(col.value)}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: col.value,
                  border: color === col.value ? "3px solid white" : "none",
                  cursor: "pointer",
                  boxShadow: color === col.value ? `0 0 10px ${col.value}` : "none",
                  transition: "all 0.15s ease",
                  transform: color === col.value ? "scale(1.15)" : "scale(1)",
                }}
                title={col.name}
              />
            ))}
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border-light)", margin: "4px 0" }}></div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Nova Sala */}
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>New Game</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", flex: 1 }}>
              Start a new game room and configure duration/score settings.
            </p>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "10px 16px" }} disabled={isLoading}>
              <Plus size={16} /> Create Room
            </button>
          </form>

          {/* Entrar em Sala */}
          <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Join Game</h3>
            <input
              type="text"
              className="input-field"
              placeholder="CODE"
              style={{
                textAlign: "center",
                letterSpacing: "4px",
                fontSize: "1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "8px 6px",
              }}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
              disabled={isLoading}
            />
            <button type="submit" className="btn btn-secondary" style={{ width: "100%", padding: "10px 16px" }} disabled={isLoading}>
              <Play size={16} /> Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};