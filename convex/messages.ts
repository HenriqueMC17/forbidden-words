import { mutation } from "./_generated/server.js";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    roomId: v.id("rooms"),
    token: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Sala não encontrada");

    const player = await ctx.db
      .query("players")
      .withIndex("by_room_token", (q) => q.eq("roomId", args.roomId).eq("token", args.token))
      .unique();

    if (!player) throw new Error("Jogador não encontrado nesta sala");

    const textTrimmed = args.text.trim();
    if (!textTrimmed) return;

    // Chat normal em LOBBY ou ROUND_END
    if (room.status !== "IN_PROGRESS") {
      await ctx.db.insert("messages", {
        roomId: args.roomId,
        playerId: args.token,
        playerName: player.name,
        text: textTrimmed,
        type: "chat",
        createdAt: Date.now(),
      });
      return;
    }

    // Lógica durante a rodada ativa (gameplay)
    const isSpeaker = room.currentSpeakerId === args.token;

    if (isSpeaker) {
      // Validação do Speaker: não pode usar a palavra-alvo nem as proibidas
      const targetWord = room.targetWord?.toUpperCase() || "";
      const forbidden = room.forbiddenWords?.map(w => w.toUpperCase()) || [];
      
      // Remove pontuações comuns para checar as palavras individualmente
      const wordsInMessage = textTrimmed
        .toUpperCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
        .split(/\s+/);

      let triggeredWord = "";
      let isForbidden = false;
      let isTarget = false;

      for (const w of wordsInMessage) {
        if (w === targetWord) {
          triggeredWord = targetWord;
          isTarget = true;
          break;
        }
        if (forbidden.includes(w)) {
          triggeredWord = w;
          isForbidden = true;
          break;
        }
      }

      if (isForbidden || isTarget) {
        // Censura o texto na mensagem exibida
        const censoredText = textTrimmed.replace(new RegExp(triggeredWord, "gi"), "🤫🤫🤫");
        
        // Penalidade ao Speaker: perde 2 pontos (mínimo de 0)
        const newScore = Math.max(0, player.score - 2);
        await ctx.db.patch(player._id, { score: newScore });

        await ctx.db.insert("messages", {
          roomId: args.roomId,
          playerId: args.token,
          playerName: player.name,
          text: censoredText,
          type: "buzz",
          createdAt: Date.now(),
        });

        await ctx.db.insert("messages", {
          roomId: args.roomId,
          playerName: "System",
          text: `⚠️ Buzz! ${player.name} used a ${isTarget ? "target" : "forbidden"} word ("${triggeredWord}")! -2 points!`,
          type: "system",
          createdAt: Date.now(),
        });
      } else {
        // Envio de descrição válido
        await ctx.db.insert("messages", {
          roomId: args.roomId,
          playerId: args.token,
          playerName: player.name,
          text: textTrimmed,
          type: "chat",
          createdAt: Date.now(),
        });
      }
    } else {
      // Lógica do Guesser (Adivinhador)
      const targetWord = room.targetWord?.toUpperCase() || "";
      const guess = textTrimmed.toUpperCase().trim();

      if (guess === targetWord) {
        // Guesser acertou! +10 pontos
        await ctx.db.patch(player._id, { score: player.score + 10 });
        
        // Speaker ganha +5 pontos pela boa descrição
        if (room.currentSpeakerId) {
          const speaker = await ctx.db
            .query("players")
            .withIndex("by_room_token", (q) => q.eq("roomId", args.roomId).eq("token", room.currentSpeakerId!))
            .unique();
          if (speaker) {
            await ctx.db.patch(speaker._id, { score: speaker.score + 5 });
          }
        }

        // Finaliza a rodada atual
        await ctx.db.patch(args.roomId, {
          status: "ROUND_END",
        });

        await ctx.db.insert("messages", {
          roomId: args.roomId,
          playerId: args.token,
          playerName: player.name,
          text: textTrimmed,
          type: "correct",
          createdAt: Date.now(),
        });

        await ctx.db.insert("messages", {
          roomId: args.roomId,
          playerName: "System",
          text: `🎉 Correct! ${player.name} guessed the word "${targetWord}"!`,
          type: "system",
          createdAt: Date.now(),
        });
      } else {
        // Palpite incorreto
        await ctx.db.insert("messages", {
          roomId: args.roomId,
          playerId: args.token,
          playerName: player.name,
          text: textTrimmed,
          type: "guess",
          createdAt: Date.now(),
        });
      }
    }
  },
});
