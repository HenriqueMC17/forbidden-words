import { mutation } from "./_generated/server.js";
import { v } from "convex/values";

function isWordMatch(messageWord: string, targetWord: string): boolean {
  const m = messageWord.toUpperCase().trim();
  const t = targetWord.toUpperCase().trim();
  
  if (m === t) return true;
  
  // Se a palavra for muito curta, permite apenas correspondência exata ou plural simples em 'S'
  if (t.length <= 3) {
    return m === t || m === t + "S";
  }
  
  // Regras de sufixos em inglês para correspondência inteligente (fuzzy/stem match)
  const suffixes = ["S", "ES", "ED", "ING"];
  for (const suffix of suffixes) {
    if (t + suffix === m) return true;
  }
  
  // Se t termina com 'E' (ex: RIDE, PHONE) e m termina com 'ING' ou 'ED' (ex: RIDING, RIDED)
  if (t.endsWith("E")) {
    const tWithoutE = t.slice(0, -1);
    if (m === tWithoutE + "ING" || m === tWithoutE + "ED") return true;
  }
  
  // Se t termina com 'Y' (ex: LIBRARY) e m termina com 'IES' (ex: LIBRARIES)
  if (t.endsWith("Y")) {
    const tWithoutY = t.slice(0, -1);
    if (m === tWithoutY + "IES" || m === tWithoutY + "IED") return true;
  }

  // Se t é prefixo de m e m é apenas 1 ou 2 caracteres mais longo (ex: astronaut -> astronauts)
  if (m.startsWith(t) && m.length <= t.length + 2) {
    return true;
  }
  
  return false;
}

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
      const targetWord = room.targetWord || "";
      const forbidden = room.forbiddenWords || [];
      
      // Remove pontuações comuns para checar as palavras individualmente
      const wordsInMessage = textTrimmed
        .toUpperCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
        .split(/\s+/);

      let triggeredWord = "";
      let isForbidden = false;
      let isTarget = false;

      for (const w of wordsInMessage) {
        if (isWordMatch(w, targetWord)) {
          triggeredWord = w;
          isTarget = true;
          break;
        }
        const forbiddenMatch = forbidden.find(f => isWordMatch(w, f));
        if (forbiddenMatch) {
          triggeredWord = w;
          isForbidden = true;
          break;
        }
      }

      if (isForbidden || isTarget) {
        // Censura o texto na mensagem exibida
        const censoredText = textTrimmed.replace(new RegExp(triggeredWord, "gi"), "██████");
        
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
          text: `🚨 Buzz! ${player.name} used a ${isTarget ? "target" : "forbidden"} word ("${triggeredWord}")! -2 points!`,
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