// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials', 
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/services/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (res.ok) {
            const user = await res.json();
            return { id: user.id, email: user.email, role: user.role };
          }

          return null;
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
        };
        session.sub = token.sub as string;
        session.iat = token.iat as number;
        session.exp = token.exp as number;
        session.jti = token.jti as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
