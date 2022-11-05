import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    // async signIn({ user }: { user: User; account: Account; profile: Profile }) {
    //restricts registration
    // const userAcc = await prisma.user.findUnique({where: {email: user.email ?? ""}})
    // return userAcc != undefined
    //   return true;
    // },
  },
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    TwitterProvider({
      clientId: env.TWITTER_ID,
      clientSecret: env.TWITTER_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
