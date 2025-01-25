// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    userId?: string;
    
  }

  interface JWT {
    accessToken?: string;
    userId?: string;
  }
}


// types/next-auth.d.ts
import { Session } from "next-auth";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image?: string | null;
    };
  }
}