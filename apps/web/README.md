# Access

Re-write of the initial prototype using the [t3 stack](https://github.com/t3-oss/create-t3-app/).

.env file missing for security. To start the project, create a new .env with the google oauth, twitter oauth,
mysql db url and nextauth configurations.

### TODO

- Consider [react-form](https://react-hook-form.com/)
- [auto-animate](https://auto-animate.formkit.com/)
- [Vector.js](https://vectorjs.org/examples/exponential-tree/) seems like a suitable auto-orientate replacement
  for a 2d plain system.
- [Git conventions](https://www.conventionalcommits.org/en/v1.0.0/) for consistent and understandable commits.
- https://www.growthbook.io/
- https://github.com/vasturiano/react-force-graph
- [Rich textareas comparison](https://www.sanity.io/guides/top-5-rich-text-react-components)
  - Update: Went with slate.js. Offers typescript supports and a lot of easy customization. In beta, but mature enough to adopt
- [React digraph editor by uber](https://github.com/uber/react-digraph)
- [iframe usage specifications](https://blog.bitsrc.io/best-practices-in-using-iframes-with-react-6193feaa1e08)
- Raindrop uses iframes a bit differently from a preview.system source. They can load web pages even if it's blocked by iframe policy.... sus. investigate further. Will put iframe system on hold for now.
- [Keysely - If ever need to phase out prisma](https://github.com/depot/kysely-planetscale)
