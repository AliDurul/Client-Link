import NextAuth, { Account, CredentialsSignin, Profile, Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { TCredentials, userInfo } from "./types/next-auth";
import { fetchWithErrorHandling, refreshAccessToken, registerOrFetchUser } from "./lib/features/auth/authActions";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.API_BASE_URL;

class SignInError extends Error {
  constructor(message: string, public code: string = "signin_error") {
    super(message);
    this.name = "SignInError";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth-error',
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      authorize: async (credentials) => {
        if (!credentials) return null;
        const { email, password } = credentials as TCredentials;
        return fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, { email, password });
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user) return false;

      try {
        if (account?.provider !== 'credentials') {
          const userTokens = await registerOrFetchUser(account as Account, profile as Profile);
          user.access = userTokens.access;
          user.refresh = userTokens.refresh;
        }
      } catch (error) {
        if (error instanceof SignInError) return `/auth-error?error=${encodeURIComponent(error.message)}&code=${error.code}`;

        return `/auth-error?error=An unexpected error occurred`;
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {

      if (trigger === 'update' && session?.user) Object.assign(token.userInfo, session.user);

      if (user) return { ...token, access: user.access, refresh: user.refresh, userInfo: jwtDecode<userInfo>(user.access) };

      if (Date.now() < token.userInfo.exp * 1000) return token;

      if (!token.refresh) throw new TypeError("Missing refresh_token");

      const res = await refreshAccessToken(token);

      if (res.error === "RefreshTokenError") {
        return null;
      }

      return res;
    },

    async session({ session, token }) {


      if (token.access) {
        const { access, refresh, userInfo, error } = token as JWT;
        session.user = userInfo as any;
        session.access = access;
        session.refresh = refresh;
        session.error = error;
      }
      return session as Session;
    },
  }
})