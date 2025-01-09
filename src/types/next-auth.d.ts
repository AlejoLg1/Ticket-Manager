declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      name?: string | null;
      image?: string | null;
    };
    id: string;
    email: string;
    role: string;
    sub: string;
    iat: number;
    exp: number;
    jti: string;
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
