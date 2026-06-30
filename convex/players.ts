import { mutation } from "./_generated/server.js";
import { v } from "convex/values";

export const leaveRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_room_token", (q) => q.eq("roomId", args.roomId).eq("token", args.token))
      .unique();

    if (player) {
      // Marca o jogador como offline
      await ctx.db.patch(player._id, { isOnline: false, isTyping: false });
      
      await ctx.db.insert("messages", {
        roomId: args.roomId,
        playerName: "System",
        text: `${player.name} left the room.`,
        type: "system",
        createdAt: Date.now(),
      });
    }
  },
});

export const updateTypingStatus = mutation({
  args: {
    roomId: v.id("rooms"),
    token: v.string(),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query("players")
      .withIndex("by_room_token", (q) => q.eq("roomId", args.roomId).eq("token", args.token))
      .unique();

    if (player) {
      await ctx.db.patch(player._id, { isTyping: args.isTyping });
    }
  },
});