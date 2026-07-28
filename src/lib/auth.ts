import { memoryAdapter } from "@better-auth/memory-adapter";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth/minimal";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-me",
  database: memoryAdapter({}),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  plugins: [nextCookies()],
});
