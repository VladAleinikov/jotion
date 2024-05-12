import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Не авторизован");
    }

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
      orgId: args.orgId,
    });

    return document;
  },
});

export const getSidebar = query({
  args: {
    orgId: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Не авторизован");
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_org_parent", (q) =>
        q.eq("orgId", args.orgId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Не авторизован");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Не найдено");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Нет разрешения");
    }
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Не авторизован");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Не авторизован");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Не найдено");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Нет разрешения");
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);

      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    await ctx.db.patch(args.id, options);

    recursiveRestore(args.id);

    return existingDocument;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Не авторизован");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Не найдено");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Нет разрешения");
    }

    const document = await ctx.db.delete(args.id);

    return document;
  }
})

export const getSearch = query({
  args: {orgId: v.string()},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Не авторизован");
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) =>
        q.eq(q.field("isArchived"), false)
      )
      .order("desc")
      .collect();
    
    return documents;

  }
})

export const copy = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Не авторизован");
    }

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Не найдено");
    }

    const document = await ctx.db.insert("documents", {
      ...existingDocument,
      title: existingDocument.title + " - copy",
    });

    return document;
  },
});
