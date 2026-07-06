import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        // Single-admin site: only ADMIN_EMAIL may create an account.
        // Set via: npx convex env set ADMIN_EMAIL "you@example.com"
        const adminEmail = process.env.ADMIN_EMAIL;
        if (
          params.flow === "signUp" &&
          (!adminEmail || params.email !== adminEmail)
        ) {
          throw new Error("Sign-up is disabled");
        }
        return { email: params.email as string };
      },
    }),
  ],
});
