import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

export default function Sandbox() {
  const { data, status } = useSession();

  return <div>{data?.user?.id}</div>;
}
