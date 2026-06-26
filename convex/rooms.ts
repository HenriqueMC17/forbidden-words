import { mutation, query } from "./_generated/server.js";
import { v } from "convex/values";
import { WORDS } from "./words.js";

// Função auxiliar para gerar código de sala de 4 letras
function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const createRoom = mutation({
  args: {
    playerName: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    let code = generateCode();
    // Garante que o código seja único
    let existing = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    while (existing !== null) {
      code = generateCode();
      existing = await ctx.db
        .query("rooms")
        .withIndex("by_code", (q) => q.eq("code", code))
        .unique();
    }

    const roomId = await ctx.db.insert("rooms", {
      code,
      status: "LOBBY",
      hostId: args.token,
      roundCount: 0,
      usedWords: [],
    });

    await ctx.db.insert("players", {
      roomId,
      token: args.token,
      name: args.playerName,
      score: 0,
      isOnline: true,
    });

    await ctx.db.insert("messages", {
      roomId,
      playerName: "System",
      text: `${args.playerName} created the room ${code}.`,
      type: "system",
      createdAt: Date.now(),
    });

    return { roomId, code };
  },
});

export const joinRoom = mutation({
  args: {
    code: v.string(),
    playerName: v.string(),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const formattedCode = args.code.toUpperCase().trim();
    const room = await ctx.db
      .query("rooms")
      .withIndex("by_code", (q) => q.eq("code", formattedCode))
      .unique();

    if (!room) {
      throw new Error("Sala não encontrada");
    }

    // Verifica se o jogador já existe na sala
    const existingPlayer = await ctx.db
      .query("players")
      .withIndex("by_room_token", (q) => q.eq("roomId", room._id).eq("token", args.token))
      .unique();

    if (!existingPlayer) {
      await ctx.db.insert("players", {
        roomId: room._id,
        token: args.token,
        name: args.playerName,
        score: 0,
        isOnline: true,
      });

      await ctx.db.insert("messages", {
        roomId: room._id,
        playerName: "System",
        text: `${args.playerName} joined the room.`,
        type: "system",
        createdAt: Date.now(),
      });
    } else {
      // Jogador reconectando
      await ctx.db.patch(existingPlayer._id, { isOnline: true });
    }

    return { roomId: room._id };
  },
});

export const getRoomDetails = query({
  args: {
    roomId: v.id("rooms"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return null;

    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("asc")
      .collect();

    const isSpeaker = room.currentSpeakerId === args.token;

    // Proteção de dados: O Guesser não pode ver a palavra-alvo nem as proibidas
    const targetWord = isSpeaker ? room.targetWord : undefined;
    const forbiddenWords = isSpeaker ? room.forbiddenWords : undefined;

    return {
      _id: room._id,
      code: room.code,
      status: room.status,
      hostId: room.hostId,
      currentSpeakerId: room.currentSpeakerId,
      roundCount: room.roundCount,
      roundEndTime: room.roundEndTime,
      usedWords: room.usedWords,
      targetWord,
      forbiddenWords,
      players,
      messages: messages.slice(-50), // Envia apenas as últimas 50 mensagens
    };
  },
});

export const startGame = mutation({
  args: {
    roomId: v.id("rooms"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Sala não encontrada");
    if (room.hostId !== args.token) throw new Error("Apenas o Host pode iniciar o jogo");

    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    if (players.length < 2) {
      throw new Error("Mínimo de 2 jogadores para iniciar o jogo");
    }

    // Seleciona o primeiro Speaker (host)
    const speaker = players.find(p => p.token === room.hostId) || players[0];
    // Seleciona uma palavra aleatória
    const randomCard = WORDS[Math.floor(Math.random() * WORDS.length)];

    await ctx.db.patch(args.roomId, {
      status: "IN_PROGRESS",
      currentSpeakerId: speaker.token,
      targetWord: randomCard.word,
      forbiddenWords: randomCard.forbidden,
      roundCount: 1,
      roundEndTime: Date.now() + 60000, // 60 segundos
      usedWords: [randomCard.word],
    });

    await ctx.db.insert("messages", {
      roomId: args.roomId,
      playerName: "System",
      text: `Game started! ${speaker.name} is the Speaker!`,
      type: "system",
      createdAt: Date.now(),
    });
  },
});

export const nextRound = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Sala não encontrada");

    const players = await ctx.db
      .query("players")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .collect();

    // Encontra o próximo Speaker
    let nextSpeakerIndex = 0;
    if (room.currentSpeakerId) {
      const currentIndex = players.findIndex((p) => p.token === room.currentSpeakerId);
      if (currentIndex !== -1) {
        nextSpeakerIndex = (currentIndex + 1) % players.length;
      }
    }
    const nextSpeaker = players[nextSpeakerIndex];

    // Encontra uma palavra que ainda não foi usada
    let availableWords = WORDS.filter((w) => !room.usedWords.includes(w.word));
    let usedWords = [...room.usedWords];
    if (availableWords.length === 0) {
      availableWords = WORDS;
      usedWords = [];
    }

    const randomCard = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWords.push(randomCard.word);

    await ctx.db.patch(args.roomId, {
      status: "IN_PROGRESS",
      currentSpeakerId: nextSpeaker.token,
      targetWord: randomCard.word,
      forbiddenWords: randomCard.forbidden,
      roundCount: room.roundCount + 1,
      roundEndTime: Date.now() + 60000,
      usedWords,
    });

    await ctx.db.insert("messages", {
      roomId: args.roomId,
      playerName: "System",
      text: `Round ${room.roundCount + 1} started! ${nextSpeaker.name} is the Speaker!`,
      type: "system",
      createdAt: Date.now(),
    });
  },
});

export const forceEndRound = mutation({
  args: {
    roomId: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Sala não encontrada");
    if (room.status !== "IN_PROGRESS") return;

    await ctx.db.patch(args.roomId, {
      status: "ROUND_END",
    });

    await ctx.db.insert("messages", {
      roomId: args.roomId,
      playerName: "System",
      text: `Time's up! The target word was: "${room.targetWord}".`,
      type: "system",
      createdAt: Date.now(),
    });
  },
});
