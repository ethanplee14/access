import { getServerAuthSession } from "./get-server-auth-session";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";

export type VerifiedSession = Session & { user: NonNullable<Session["user"]> };

export default function getAuthServerSideProps(
  cbk?: (
    ctx: GetServerSidePropsContext,
    session: VerifiedSession
  ) => Promise<any> | any
) {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(ctx);
    if (!session || !session.user) {
      return {
        redirect: { destination: "/login" },
      };
    }
    const verifiedSession = { ...session, user: session.user };
    return (await cbk?.(ctx, verifiedSession)) ?? { props: {} };
  };
}
