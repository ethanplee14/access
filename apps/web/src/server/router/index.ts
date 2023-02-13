// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { subjectRouter } from "./subject";
import { vaultRouter } from "./vault";
import { resourceViewerRouter } from "./vault/resource-viewer";
import { vaultSubjectRouter } from "./vault/subject";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("subject.", subjectRouter)
  .merge(
    "vault.",
    vaultRouter
      .merge("subject.", vaultSubjectRouter)
      .merge("resourceViewer.", resourceViewerRouter)
  );

// export type definition of API
export type AppRouter = typeof appRouter;
