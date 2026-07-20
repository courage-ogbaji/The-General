import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import { rateLimit } from "@/lib/rate-limit";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials, request) => {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;
      const { email, password } = parsed.data;

      const ip = request.headers.get("x-forwarded-for") ?? "unknown";
      const { success } = rateLimit(`login:${ip}:${email}`, {
        limit: 5,
        windowMs: 60_000,
      });
      if (!success) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.hashedPassword) return null;

      const valid = await bcrypt.compare(password, user.hashedPassword);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.displayName,
        image: user.profilePhotoUrl,
        role: user.role,
      };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              displayName: user.name ?? user.email,
              profilePhotoUrl: user.image,
              role: "WISHER",
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "WISHER";
      }
      return session;
    },
  },
});
