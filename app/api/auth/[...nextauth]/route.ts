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
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
        if (account) {
            token.accessToken = account.access_token;

            // If the user signs in via Google, create or update the user in the DB
            await dbConnect();  // Ensure the database is connected

            // Extract necessary fields from the profile
            const { name, email, picture } = profile as { name: string, email: string, picture: string };

            // Create or update the user in the database
            const user = await UserModel.findOneAndUpdate(
                { email },  // Find by email
                {
                    name,
                    email,
                    image: picture,
                    googleId: account.providerAccountId,
                    isActive: true,  // You can manage the isActive flag based on logic
                },
                { new: true, upsert: true }  // Create the user if not found (upsert)
            );

            // Optionally attach user info to the token
            token.userId = user._id;  // Add user ID to the token
        }
        return token;
    },
    async session({ session, token }) {
        // Attach the accessToken and userId to the session object
        session.accessToken = token.accessToken as string;
        session.userId = token.userId as string;  // Add userId to session for client-side access
        return session;
    },
    async signIn() {
        // Return true to indicate the sign-in process should proceed
        return true;
    },
},
});

export { handler as GET, handler as POST };
