import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
const mongodbUrl = process.env.MONGODB_URL;
if (!mongodbUrl) {
  throw new Error("MONGODB_URL environment variable is required");
}

const client = new MongoClient(mongodbUrl);
const db = client.db("studio-space");
export const auth = betterAuth({
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 3 * 24 * 60 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});
