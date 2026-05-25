/**
 * NextAuth configuration for SephyrOath platform
 */

import type { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import { getServerSession as nextAuthGetServerSession } from 'next-auth/next';

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set');
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password_hash) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password_hash);
        if (!isPasswordValid) {
          return null;
        }

        if ((user.role === 'ADMIN' || user.role === 'OWNER') && user.accountStatus !== 'ACTIVE') {
          throw new Error('Account pending owner approval');
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
        } as any;
      },
    }),
  ],

  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.accountStatus = (user as any).accountStatus;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).accountStatus = token.accountStatus;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },

  events: {
    async signIn({ user }) {
      console.log('User signed in:', user.email);
    },
    async signOut({ token }) {
      console.log('User signed out:', token?.email);
    },
  },
};

export async function getServerAuthSession() {
  return await nextAuthGetServerSession(authOptions);
}

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role?: 'MEMBER' | 'ADMIN' | 'OWNER';
      accountStatus?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
    };
  }

  interface User {
    id: string;
    role?: 'MEMBER' | 'ADMIN' | 'OWNER';
    accountStatus?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'MEMBER' | 'ADMIN' | 'OWNER';
    accountStatus?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  }
}
