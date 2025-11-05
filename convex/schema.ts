import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Extend the default auth tables with custom user fields
const schema = defineSchema({
  ...authTables,

  // Custom user profile fields (extends the auth users table)
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    // Custom fields
    dateOfBirth: v.optional(v.string()),
    gender: v.optional(v.string()),
  })
    .index("email", ["email"]),

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

export default schema;
