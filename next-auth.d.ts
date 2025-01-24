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