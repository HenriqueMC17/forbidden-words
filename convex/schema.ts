import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    code: v.string(), // Código de 4 letras da sala
    status: v.union(v.literal("LOBBY"), v.literal("IN_PROGRESS"), v.literal("ROUND_END")),
    hostId: v.string(), // Token do jogador host
    currentSpeakerId: v.optional(v.string()), // Token do jogador que é o Speaker
    roundCount: v.number(),
    roundEndTime: v.optional(v.number()), // Timestamp epoch de quando a rodada termina
    targetWord: v.optional(v.string()),
    targetTranslation: v.optional(v.string()), // Tradução em português da palavra-alvo
    forbiddenWords: v.optional(v.array(v.string())),
    forbiddenTranslations: v.optional(v.array(v.string())), // Traduções em português das palavras proibidas
    usedWords: v.array(v.string()), // Palavras já usadas neste jogo para não repetir
  }).index("by_code", ["code"]),

  players: defineTable({
    roomId: v.id("rooms"),
    token: v.string(), // Token de sessão persistido no localStorage do cliente
    name: v.string(),
    score: v.number(),
    isOnline: v.boolean(),
  }).index("by_room", ["roomId"])
    .index("by_room_token", ["roomId", "token"]),

  messages: defineTable({
    roomId: v.id("rooms"),
    playerId: v.optional(v.string()), // Token do jogador, ou nulo para mensagens do sistema
    playerName: v.string(),
    text: v.string(),
    type: v.union(v.literal("chat"), v.literal("guess"), v.literal("system"), v.literal("buzz"), v.literal("correct")),
    createdAt: v.number(), // Timestamp de criação
  }).index("by_room", ["roomId"]),
});