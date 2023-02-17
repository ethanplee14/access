import { VaultSubject } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/rpc";
import { z } from "zod";
import { createProtectedRouter } from "../context";

export const vaultRouter = createProtectedRouter()
  .query("subjectGraph", {
    async resolve({ ctx }) {
      const subjects = await ctx.prisma.vaultSubject.findMany({
        where: { userId: ctx.session.user.id },
        include: {
          parents: { select: { id: true } },
          children: { select: { id: true } },
        },
      });

      type GraphVaultSubject = VaultSubject & {
        parents: string[];
        children: string[];
      };
      const subjectGraph: Record<string, GraphVaultSubject> = {};
      subjects.forEach((s) => {
        subjectGraph[s.id] = {
          ...s,
          parents: s.parents.map((p) => p.id),
          children: s.children.map((c) => c.id),
        };
      });
      return subjectGraph;
    },
  })
  .query("search", {
    input: z.string().trim().min(1),
    async resolve({ ctx, input }) {
      const subjectSearch = ctx.prisma.vaultSubject.findMany({
        where: { name: { search: input + "*" }, userId: ctx.session.user.id },
        take: 5,
      });
      const resourceSearch = ctx.prisma.vaultResource.findMany({
        where: {
          OR: [
            { name: { search: input + "*" } },
            { review: { search: input + "*" } },
          ],
          userId: ctx.session.user.id,
        },
        take: 5,
      });
      const searchResults = await Promise.all([subjectSearch, resourceSearch]);
      return {
        subjects: searchResults[0].map((s) => s.name),
        resources: searchResults[1].map((s) => s.name),
      };
    },
  })
  .mutation("addRelationship", {
    input: z.object({
      parent: z.string(),
      child: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.vaultSubject.update({
        where: {
          userId_id: {
            userId: ctx.session.user.id,
            id: input.parent,
          },
        },
        data: {
          children: {
            connect: { id: input.child },
          },
        },
      });
    },
  })
  .mutation("removeRelationship", {
    input: z.object({
      parent: z.string(),
      child: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.vaultSubject.update({
        where: {
          userId_id: {
            userId: ctx.session.user.id,
            id: input.parent,
          },
        },
        data: {
          children: {
            disconnect: { id: input.child },
          },
        },
      });
    },
  });
