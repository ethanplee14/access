import { VaultResource, VaultTag } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import fetchMetadata, { Metadata } from "../../scripts/meta-fetcher";
import { createProtectedRouter } from "../context";

export const vaultSubjectRouter = createProtectedRouter()
  .query("read", {
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
  .query("fullView", {
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
  .query("record", {
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
  .mutation("create", {
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
  .mutation("edit", {
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
  .mutation("delete", {
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
  });
