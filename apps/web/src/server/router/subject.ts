import { createRouter } from "./context";
import { z } from "zod";

export const subjectRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return ctx.prisma.subject.findMany({
        include: { children: { select: { id: true } } },
      });
    },
  })
  .query("getAllNames", {
    async resolve({ ctx }) {
      const names = await ctx.prisma.subject.findMany({
        select: { name: true },
      });
      return names.map((n) => n.name);
    },
  })
  .query("getSubject", {
    input: z.string(),
    async resolve({ ctx, input }) {
      return ctx.prisma.subject.findUniqueOrThrow({
        where: { id: input },
        include: { tags: { include: { resources: true } } },
      });
    },
  });
