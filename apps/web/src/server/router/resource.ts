import { z } from "zod";
import { createProtectedRouter } from "./context";
import {
  createResourceValidator,
  createSubjectValidator,
} from "./validators/resource";

/**
 * TODO:
 *  Consider refactoring and potentially removing all of this. Resource creation flow will probably start
 *  at the vault and users can decide whether they want to merge it globally or not.
 *  This logic should be handled in a single router so double network requests don't need to be called.
 */

export const newResourceRouter = createProtectedRouter()
  .query("resourceById", {
    input: z.string(),
    async resolve({ ctx, input }) {
      return ctx.prisma.resource.findUnique({
        where: { id: input },
        include: { tags: { select: { name: true } } },
      });
    },
  })
  .query("subjectRecord", {
    async resolve({ ctx }) {
      const subjects = await ctx.prisma.subject.findMany({
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
  .mutation("createResource", {
    input: createResourceValidator,
    async resolve({ ctx, input }) {
      const { tags: existingTags } = await ctx.prisma.subject.findUniqueOrThrow(
        {
          where: { name: input.subjectName },
          select: { tags: { select: { name: true } } },
        }
      );
      const missingTags = input.tags.filter(
        (t) => !existingTags.map((et) => et.name).includes(t)
      );
      const { tags: tagIds } = await ctx.prisma.subject.update({
        where: { name: input.subjectName },
        data: {
          tags: { create: missingTags.map((t) => ({ name: t })) },
        },
        select: {
          tags: { select: { id: true } },
        },
      });
      return ctx.prisma.subject.update({
        where: { name: input.subjectName },
        data: {
          resources: {
            create: {
              name: input.name,
              url: input.url,
              userId: ctx.session.user.id,
              tags: {
                connect: tagIds,
              },
              //review needs to be optional
              // reviews: {
              //   create: [{
              //     score: input.review?.score, //review create is optional
              //     comment: input.review?.comment,
              //     userId: ctx.session.user.id,
              //   }]
              // }
            },
          },
        },
      });
    },
  });
// .mutation("createSubject", {
//   input: createSubjectValidator,
//   async resolve({ ctx, input }) {
//     return ctx.prisma.subject.create({
//       data: {
//         name: input.name,
//         about: input.about,
//         parents: { connect: input.parentIds.map(id => ({id})) },
//         children: { connect: input.childrenIds.map(id => ({id})) },
//         tags: {
//           createMany: { data: input.tags.map(t => ({name: t}))}
//         }
//       }
//     })
//   }
// })
