import { createProtectedRouter } from "../context";
import { z } from "zod";
import fetchMetadata from "../../scripts/meta-fetcher";
import { createResourceValidator } from "../validators/resource";

/**
 * TODO:
 *  this entire router needs to check if it's allowed to make changes to the resource.
 *  Doesn't do any kind of user ownership verification. Consider using middleware for verifying access
 *  to resource
 */
export const vaultResourceRouter = createProtectedRouter()
  .middleware(async ({ ctx, rawInput, next }) => {
    //Do subject and resId validation here.
    return next({ ctx });
  })
  .query("view", {
    input: z.object({
      resId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const resource = await ctx.prisma.vaultResource.findUnique({
        where: { id: input.resId },
        include: { tags: true },
      });
      if (!resource) return null;

      let meta = { title: "", description: "", image: "" };
      try {
        meta = await fetchMetadata(resource.url);
      } catch (e) {
        console.log("Failed to lookup meta data for: " + resource.url);
        console.log(e);
      }
      return { ...resource, meta };
    },
  })
  .mutation("create", {
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
              userId: ctx.session.user.id,
            },
          },
        },
      });
    },
  })
  .mutation("edit", {
    input: z.object({
      resId: z.string(),
      subjectId: z.string(),
      url: z.string().url().trim().optional(),
      name: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
    async resolve({ ctx, input }) {
      const { tags: existingTags } =
        await ctx.prisma.vaultSubject.findUniqueOrThrow({
          where: { id: input.subjectId },
          select: { tags: { select: { id: true, name: true } } },
        });
      const missingTags = (input.tags ?? []).filter(
        (t) => !existingTags.map((et) => et.name).includes(t)
      );
      const { tags: subjectTagIds } = await ctx.prisma.vaultSubject.update({
        where: { id: input.subjectId },
        data: {
          tags: { create: missingTags.map((t) => ({ name: t })) },
        },
        select: {
          tags: { select: { id: true, name: true } },
        },
      });
      const subjectTagIdsDict: Record<string, string> = {};
      subjectTagIds.forEach((tag) => (subjectTagIdsDict[tag.name] = tag.id));
      const tagIds = input.tags?.map((t) => ({ id: subjectTagIdsDict[t] }));
      return await ctx.prisma.vaultResource.update({
        where: { id: input.resId },
        data: {
          url: input.url,
          name: input.name,
          tags: { set: tagIds },
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      resId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.$transaction([
        ctx.prisma.vaultResource.update({
          where: { id: input.resId },
          data: {
            tags: { set: [] },
          },
        }),
        ctx.prisma.vaultResource.delete({
          where: { id: input.resId },
        }),
      ]);
    },
  })
  .mutation("updateScore", {
    input: z.object({
      resId: z.string(),
      score: z.number(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.vaultResource.update({
        where: { id: input.resId },
        data: { score: input.score },
      });
    },
  })
  .mutation("updateReview", {
    input: z.object({
      resId: z.string(),
      review: z.string(),
    }),
    async resolve({ ctx, input }) {
      /*
        The commented lines below is the logic for fetching resource based on subject and updating it directly.
        Not sure if a nested updated is better performance than 2 query calls but that's a micro optimization.
        That I'm just not gonna worry about. Commented out temporarily while considering front-end forwarding
        of the subject name.
       */
      return await ctx.prisma.vaultResource.update({
        where: { id: input.resId },
        data: { review: input.review },
      });
      // return await ctx.prisma.vaultSubject.update({
      //   where: {
      //     userId_name: {
      //       userId: ctx.session.user.id,
      //       name: input.subjectName
      //     }
      //   },
      //   data: {
      //     resources: {
      //       update: {
      //         where: {id: input.resId},
      //         data: {review: input.review}
      //       }
      //     }
      //   }
      // })
    },
  });
