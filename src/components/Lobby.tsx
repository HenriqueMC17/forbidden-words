import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Flame, Play, Plus } from "lucide-react";

interface LobbyProps {
  playerToken: string;
  onRoomJoined: (roomId: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({ playerToken, onRoomJoined }) => {
  const [name, setName] = useState(() => localStorage.getItem("playerName") || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = useMutation(api.rooms.createRoom);
  const joinRoom = useMutation(api.rooms.joinRoom);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      localStorage.setItem("playerName", name.trim());
      const result = await createRoom({
        playerName: name.trim(),
        token: playerToken,
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
      localStorage.setItem("playerName", name.trim());
      const result = await joinRoom({
        code: code.trim().toUpperCase(),
        playerName: name.trim(),
        token: playerToken,
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
          maxWidth: "480px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          border: "1px solid var(--border-l1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, hsl(var(--color-primary)) 0%, hsl(var(--color-secondary)) 100%)",
              marginBottom: "16px",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
            }}
          >
            <Flame size={32} color="white" />
          </div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "8px" }} className="gradient-text">
            Forbidden Words
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            The ultimate Taboo game to practice English. Describe terms without saying forbidden words!
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "hsl(var(--color-danger))",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>YOUR NAME</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Alex Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            disabled={isLoading}
          />
        </div>

        <div style={{ height: "1px", background: "var(--border-light)", margin: "8px 0" }}></div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Nova Sala */}
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>New Game</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", flex: 1, lineBreak: "anywhere" }}>
              Start a new game room and invite your friends/students.
            </p>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isLoading}>
              <Plus size={18} /> Create Room
            </button>
          </form>

          {/* Entrar em Sala */}
          <form onSubmit={handleJoin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>Join Game</h3>
            <input
              type="text"
              className="input-field"
              placeholder="CODE"
              style={{
                textAlign: "center",
                letterSpacing: "4px",
                fontSize: "1.1rem",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "10px 8px",
              }}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
              disabled={isLoading}
            />
            <button type="submit" className="btn btn-secondary" style={{ width: "100%" }} disabled={isLoading}>
              <Play size={18} /> Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};