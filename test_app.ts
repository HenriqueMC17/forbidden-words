import React from "react";
import ReactDOMServer from "react-dom/server";
import * as convexReact from "convex/react";

const mockPlayers = [
  { _id: "1", token: "alice-token", name: "Alice", score: 0, isOnline: true, avatar: "fox", color: "hsl(262, 83%, 68%)" },
  { _id: "2", token: "bob-token", name: "Bob", score: 0, isOnline: true, avatar: "rocket", color: "hsl(190, 90%, 50%)" }
];

const mockRoom = {
  _id: "jd7...",
  code: "ABCD",
  status: "LOBBY" as const,
  hostId: "alice-token",
  currentSpeakerId: "alice-token",
  roundCount: 0,
  roundDuration: 60,
  targetScore: 50,
  players: mockPlayers,
  messages: []
};

// Override useQuery and useMutation
(convexReact as any).useQuery = (apiRef: any, args: any) => {
  console.log("Mock useQuery called for:", apiRef);
  return mockRoom;
};

(convexReact as any).useMutation = (apiRef: any) => {
  console.log("Mock useMutation called for:", apiRef);
  return () => Promise.resolve();
};

import { GameRoom } from "./src/components/GameRoom";

try {
  console.log("Testing GameRoom render...");
  const html = ReactDOMServer.renderToString(
    React.createElement(GameRoom, {
      roomId: "jd7...",
      playerToken: "alice-token",
      onLeave: () => {}
    })
  );
  console.log("GameRoom rendered successfully! Length: " + html.length);
} catch (err) {
  console.error("GameRoom render failed:", err);
}
