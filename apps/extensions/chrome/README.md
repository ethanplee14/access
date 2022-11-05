## A few notes

- TRPC AppRouter uses any type. Importing from @access/web trpc sever router creates type definition errors because next-auth user id type is declared in next-auth.d.ts. Declaration files are not ported over in monorepos.
- host_permissions is set for cors access. Without it, can't make fetch requests to the appropriate server.

Consider Plasmo for extension framework[https://docs.plasmo.com/]
