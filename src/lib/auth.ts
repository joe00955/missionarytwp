import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
          username: user.username,
          points: user.points,
          rank: user.rank,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as unknown as Record<string, unknown>;
        token.id = user.id;
        token.role = u.role as string;
        token.username = u.username as string;
        token.points = u.points as number;
        token.rank = u.rank as string;
      }
      if (trigger === "update" && session) {
        token.points = session.points;
        token.rank = session.rank;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).username = token.username;
        (session.user as Record<string, unknown>).points = token.points;
        (session.user as Record<string, unknown>).rank = token.rank;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
