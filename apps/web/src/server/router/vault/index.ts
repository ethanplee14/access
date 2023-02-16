import { VaultSubject } from "@prisma/client";
import { z } from "zod";
import { createProtectedRouter } from "../context";
import { createResourceValidator } from "../validators/resource";

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
    input: z.string(),
    async resolve({ ctx, input }) {
      const subjects = await ctx.prisma.vaultSubject.findMany({
        where: {
          name: {
            search: input + "*",
          },
        },
      });
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
  })
  .mutation("createResource", {
    input: createResourceValidator,
    async resolve({ ctx, input }) {
      const subjectCompositeId = {
        userId_name: {
          userId: ctx.session.user.id,
          name: input.subjectName,
        },
      };
      const { tags: existingTags } =
        await ctx.prisma.vaultSubject.findUniqueOrThrow({
          where: subjectCompositeId,
          select: { tags: { select: { name: true } } },
        });
      const missingTags = input.tags.filter(
        (t) => !existingTags.map((et) => et.name).includes(t)
      );
      const { tags } = await ctx.prisma.vaultSubject.update({
        where: subjectCompositeId,
        data: {
          tags: { create: missingTags.map((t) => ({ name: t })) },
        },
        select: {
          tags: { select: { id: true, name: true } },
        },
      });
      const tagDict: Record<string, string> = {};
      tags.forEach((tag) => (tagDict[tag.name] = tag.id));
      const tagIds = input.tags.map((t) => ({ id: tagDict[t] }));

      return ctx.prisma.vaultSubject.update({
        where: subjectCompositeId,
        data: {
          resources: {
            create: {
              name: input.name,
              url: input.url,
              score: input.review?.score,
              review: input.review?.comment,
              tags: { connect: tagIds },
            },
          },
        },
      });
    },
  });
