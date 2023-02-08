import { createProtectedRouter } from "../context";
import { createResourceValidator } from "../validators/resource";
import { VaultResource, VaultSubject, VaultTag } from "@prisma/client";
import { z } from "zod";
import fetchMetadata, { Metadata } from "../../scripts/meta-fetcher";
import { TRPCError } from "@trpc/server";

export const vaultRouter = createProtectedRouter()
  .query("subject", {
    input: z.string(),
    async resolve({ ctx, input }) {
      return ctx.prisma.vaultSubject.findUnique({
        where: {
          userId_id: {
            userId: ctx.session.user.id,
            id: input,
          },
        },
        include: { tags: { select: { name: true } } },
      });
    },
  })
  .query("subjectView", {
    input: z.string(),
    async resolve({ ctx, input }) {
      const subjectWithResources = await ctx.prisma.vaultSubject.findUnique({
        where: {
          userId_name: {
            userId: ctx.session.user.id,
            name: input,
          },
        },
        include: { resources: { include: { tags: true } } },
      });
      if (!subjectWithResources)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Can't find subject for ${{
            userId: ctx.session.user.id,
            name: input,
          }}`,
        });

      const resourcesWithMeta: Record<
        string,
        VaultResource & { tags: VaultTag[] } & { meta: Metadata }
      > = {};
      await Promise.all(
        subjectWithResources.resources.map(async (r) => {
          try {
            const meta = await fetchMetadata(r.url, 1000);
            resourcesWithMeta[r.id] = { ...r, meta };
          } catch (e) {
            resourcesWithMeta[r.id] = {
              ...r,
              meta: { title: "", description: "", image: "" },
            };
          }
        })
      );
      return { subject: subjectWithResources, resources: resourcesWithMeta };
    },
  })
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
  .query("subjectRecord", {
    async resolve({ ctx }) {
      const subjects = await ctx.prisma.vaultSubject.findMany({
        where: { userId: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          tags: {
            select: { id: true, name: true },
          },
        },
      });

      type SelectedSubjectFields = {
        tags: { id: string; name: string }[];
        id: string;
        name: string;
      };
      const subjectRecord: Record<string, SelectedSubjectFields> = {};
      subjects.forEach((s) => (subjectRecord[s.name] = s));
      return subjectRecord;
    },
  })
  .mutation("createSubject", {
    input: z.object({
      name: z.string(),
      about: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.vaultSubject.create({
        data: {
          name: input.name,
          about: input.about,
          userId: ctx.session.user.id,
        },
      });
    },
  })
  .mutation("editSubject", {
    input: z.object({
      subjectName: z.string().trim(),
      newName: z.string().trim(),
      newAbout: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.vaultSubject.update({
        where: {
          userId_name: {
            name: input.subjectName,
            userId: ctx.session.user.id,
          },
        },
        data: {
          name: input.newName,
          about: input.newAbout,
        },
      });
    },
  })
  .mutation("addRelationship", {
    input: z.object({
      source: z.string(),
      target: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.vaultSubject.update({
        where: {
          userId_id: {
            userId: ctx.session.user.id,
            id: input.source,
          },
        },
        data: {
          children: {
            connect: { id: input.target },
          },
        },
      });
    },
  })
  // .mutation("removeRelationship", {})
  .mutation("deleteSubject", {
    input: z.string(),
    async resolve({ ctx, input }) {
      const subjectCompositeId = {
        userId_name: {
          userId: ctx.session.user.id,
          name: input,
        },
      };

      // can't unset on updateMany [https://github.com/prisma/prisma/issues/3143]
      const { tags: tagIds } = await ctx.prisma.vaultSubject.findUniqueOrThrow({
        where: subjectCompositeId,
        select: {
          tags: { select: { id: true } },
        },
      });
      /*
      transaction [
        unset all tag-resource relationships,
        unset subject parents/children and delete tags/resources,
        delete subject
      ]
     */
      return ctx.prisma.$transaction([
        ...tagIds.map((tagId) =>
          ctx.prisma.vaultTag.update({
            where: tagId,
            data: { resources: { set: [] } },
          })
        ),
        ctx.prisma.vaultSubject.update({
          where: subjectCompositeId,
          data: {
            parents: { set: [] },
            children: { set: [] },
            tags: { deleteMany: {} },
            resources: { deleteMany: {} },
          },
        }),
        ctx.prisma.vaultSubject.delete({ where: subjectCompositeId }),
      ]);
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
