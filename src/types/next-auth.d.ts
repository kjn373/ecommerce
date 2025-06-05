// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      accountType: string;
    };
  }

  interface User {
    id: string;
    email: string;
    username: string;
    accountType: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accountType: string;
  }
} 