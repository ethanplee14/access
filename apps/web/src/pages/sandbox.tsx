import { trpc } from "../utils/trpc";

export default function Sandbox() {
  const { data } = trpc.useQuery(["vault.search", "writ"]);
  console.log(data);

  return <div>{JSON.stringify(data)}</div>;
}
