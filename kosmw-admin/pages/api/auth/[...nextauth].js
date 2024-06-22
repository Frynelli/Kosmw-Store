//Next Auth
//Google Provider
//oAuth
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/db';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return profile.email_verified && profile.email.endsWith("@gmail.com");
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page after sign in
      return baseUrl;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: '/sign-in',
  // },
};

export default NextAuth(authOptions);
