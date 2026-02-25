import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';

const authUrl =
  process.env.AUTH_URL ||
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
const baseUrl = authUrl || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined);

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  basePath: '/api/auth',
  ...(baseUrl ? { url: baseUrl } : {}),
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? process.env.CLIENT_SECRET ?? '',
      authorization: {
        params: { scope: 'identify email guilds' },
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/login-error',
  },
});
