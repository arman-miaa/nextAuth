import dbConnect, { collectionName } from "@/lib/dbConnect";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { signIn } from "next-auth/react";

export const authOptions = {
  secret:process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter Your UserName",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Your Password",
        },
        // Email: { label: "email", type: "email" },
      },
      async authorize(credentials, req) {
        // console.log('credentials from auth',credentials);
        // Add logic here to look up the user from the credentials supplied

        const { username, password } = credentials;
        const user = await dbConnect(collectionName.TEST_USER).findOne({
          username,
        });
        const isPasswordOK = password == user?.password;

        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };

        if (isPasswordOK) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account) {
        try {
            // console.log('From Signin calback', user,account,profile,email,credentials);
        const { providerAccountId, provider } = account;
        const { email: user_email, image, name } = user;
        const payload = { role: "user", providerAccountId, provider, user_email, image, name };
          // console.log("From Signin calback", payload);
          
          const userCollection = dbConnect(collectionName.TEST_USER);
          const isUserExit = await userCollection.findOne({ providerAccountId });

          if (!isUserExit) {
            await userCollection.insertOne(payload)
          }
          
        } catch (error) {
          console.log(error);
          return false;
          
        }
      
      }

      return true;
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
  },
};