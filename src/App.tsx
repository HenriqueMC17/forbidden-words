import { useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Lobby } from "./components/Lobby";
import { GameRoom } from "./components/GameRoom";

// Inicializa o Cliente Convex. VITE_CONVEX_URL é configurada no arquivo .env.local pelo comando 'npx convex dev'
const convexUrl = import.meta.env.VITE_CONVEX_URL;
if (!convexUrl) {
  console.warn("VITE_CONVEX_URL is not set. Make sure to run `npx convex dev` to initialize your Convex project.");
}
const convex = new ConvexReactClient(convexUrl || "https://dummy-url.convex.cloud");

export default function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerToken, setPlayerToken] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("playerToken");
    if (!token) {
      token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("playerToken", token);
    }
    setPlayerToken(token);
  }, []);

  if (!playerToken) return null;

  return (
    <ConvexProvider client={convex}>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {roomId ? (
          <GameRoom
            roomId={roomId}
            playerToken={playerToken}
            onLeave={() => setRoomId(null)}
          />
        ) : (
          <Lobby
            playerToken={playerToken}
            onRoomJoined={(id) => setRoomId(id)}
          />
        )}
      </div>
    </ConvexProvider>
  );
}
