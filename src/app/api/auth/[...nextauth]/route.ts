import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://maestro-api-dev.secil.biz/Auth/Login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const result = await res.json();
      
        if (res.ok && result.data?.accessToken) {
          return {
            id: "randomid",
            username: credentials?.username ?? "",
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          };
        }
        return null; 
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.accessToken = (user as unknown as { accessToken: string }).accessToken;
      token.refreshToken = (user as unknown as { refreshToken: string }).refreshToken;
    }
    return token;
  },
  async session({ session, token }) {
    (session as unknown as { accessToken: string }).accessToken = (token as unknown as { accessToken: string }).accessToken;
    (session as unknown as { refreshToken: string }).refreshToken = (token as unknown as { refreshToken: string }).refreshToken;
    return session;
  },
},

  secret:  "super-secret-default-key-23924",//test edebilmeniz için default değer atadım.
});

export { handler as GET, handler as POST };
