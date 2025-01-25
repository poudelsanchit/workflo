import dbConnect from "@/lib/db";
import UserModel from "@/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;

        // If the user signs in via Google, create or update the user in the DB
        await dbConnect(); // Ensure the database is connected

        // Extract necessary fields from the profile
        const { name, email, picture } = profile as {
          name: string;
          email: string;
          picture: string;
        };

        // Find the user in the database
        let user = await UserModel.findOne({ email });

        if (user) {
          // If the user exists, update their info
          user.name = name;
          user.image = picture;
          user.googleId = account.providerAccountId;
          user.isActive = true;
        } else {
          // If the user doesn't exist, create a new one
          user = new UserModel({
            name,
            email,
            image: picture,
            googleId: account.providerAccountId,
            isActive: true,
            pages: {
              private: [], // Initialize empty private pages array
              teamspace: [], // Initialize empty teamspace pages array
            },
          });
        }

        // Save the user and ensure we retain their previous pages info
        await user.save();

        // Attach user info and pages to the token
        token.userId = user._id;
        token.privatePages = user.pages.private;
        token.teamspacePages = user.pages.teamspace;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the accessToken and userId to the session object
      session.accessToken = token.accessToken as string;
      session.userId = token.userId as string; // Add userId to session for client-side access
      return session;
    },
    async signIn() {
      // Return true to indicate the sign-in process should proceed
      return true;
    },
  },
});

export { handler as GET, handler as POST };
