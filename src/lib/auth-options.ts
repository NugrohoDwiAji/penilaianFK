import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import  {prisma}  from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" }
      },

   

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password diperlukan");
        }

        

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            dosen: true,
          }
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah");
        }

        const isPasswordValid = user.password === credentials.password;

        if (!isPasswordValid) {
          throw new Error("Email atau password salah");
        }

        return {
          id: user.id,
          name: user.dosen?.nama_dosen,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 , // 30 hari
  },

  pages: {
    signIn: "/admin/dashboard",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Update session
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect ke URL yang diminta atau default ke dashboard
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  events: {
    async signIn({ user, account }) {
      // Log atau track sign in
      console.log(`User ${user.email} signed in with ${account?.provider}`);
    },
    async signOut({ token }) {
      console.log(`User ${token.email} signed out`);
    }
  },

  debug: process.env.NODE_ENV === "development",
  
  secret: process.env.NEXTAUTH_SECRET,
};