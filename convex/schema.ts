import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables, // users, sessions, etc.

  entries: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    dateISO: v.string(),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_user_date", ["userId", "dateISO"]),
});
