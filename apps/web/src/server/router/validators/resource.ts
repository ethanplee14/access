import { z } from "zod";

export const createSubjectValidator = z.object({
  name: z.string(),
  about: z.string().optional(),
  parentIds: z.array(z.string()),
  childrenIds: z.array(z.string()),
});

export const createResourceValidator = z.object({
  url: z.string().trim().url(),
  name: z.string().trim(),
  subjectName: z.string().trim(),
  tags: z.array(z.string()),
  review: z
    .object({
      score: z.number().int(),
      comment: z.string().trim().optional(),
    })
    .optional(),
});
