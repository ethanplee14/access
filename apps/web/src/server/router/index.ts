// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "./context";
import { subjectRouter } from "./subject";
import { vaultRouter } from "./vault";
import { vaultResourceRouter } from "./vault/resource";
import { vaultSubjectRouter } from "./vault/subject";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("subject.", subjectRouter)
  .merge(
    "vault.",
    vaultRouter
      .merge("subject.", vaultSubjectRouter)
      .merge("resource.", vaultResourceRouter)
  );

// export type definition of API
export type AppRouter = typeof appRouter;
