import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id: string;
    email: string;
    role: string;
  }

  interface User {
    id: string;
    email: string;
    role: string;
  }

  interface JWT {
    id: string;
    email: string;
    role: string;
  }
}
