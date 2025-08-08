declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    username: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
  }
}
