// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { CustomAdapter } from '@/lib/custom-adapter';
import { AuthOptions } from 'next-auth';
import { createMagicLinkEmail } from './email-template';


const authOptions: AuthOptions = {
  adapter: CustomAdapter,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT as string, 10),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        secure: true,
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
      
        const userRole = identifier.endsWith('@finaersa.com.ar') ? 'support' : 'user';
      
        const modifiedUrl = `${url}&role=${userRole}`;
      
        const emailTemplate = createMagicLinkEmail({ url: modifiedUrl, host });
      
        const nodemailer = require('nodemailer');
        const transport = nodemailer.createTransport(provider.server);
      
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Tu enlace de inicio de sesión para ${host}`,
          html: emailTemplate,
        });
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

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        const parsedUrl = new URL(url);
        const role = parsedUrl.searchParams.get('role');
  
        if (role === 'support') {
          return `${baseUrl}/support`; 
        }
        return `${baseUrl}/`; 
      }
  
      return baseUrl;
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
