import { createReactQueryHooks } from "@trpc/react";

type AppRouter = any;

export const trpc = createReactQueryHooks<AppRouter>();
