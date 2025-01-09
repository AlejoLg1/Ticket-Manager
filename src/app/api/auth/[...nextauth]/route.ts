// route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = NextAuth({
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
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      console.log("TOKEN DESDE ROUTE: ", token)
      return token;
    },
    // async session({ session, token }) {
    //   if (session && token) {
    //     session.id = typeof token.id === 'string' ? token.id : '';
    //     session.email = typeof token.email === 'string' ? token.email : '';
    //     session.role = typeof token.role === 'string' ? token.role : 'user';
    //   }
    //   console.log("SESSION DESDE ROUTE: ", token)
    //   return session;
    // },
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
      console.log("SESSION DESDE ROUTE: ", session);
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  debug: true,
});


export const GET = authOptions;
export const POST = authOptions;

