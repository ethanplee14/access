// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { subjectRouter } from "./subject";
import { vaultRouter } from "./vault";
import { vaultResourceRoutr } from "./vault/resource";
import { vaultSubjectRouter } from "./vault/subject";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("subject.", subjectRouter)
  .merge(
    "vault.",
    vaultRouter
      .merge("subject.", vaultSubjectRouter)
      .merge("resource.", vaultResourceRoutr)
  );

// export type definition of API
export type AppRouter = typeof appRouter;
