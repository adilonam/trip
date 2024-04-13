import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    access_token: String | null
    refresh_token: String | null
  }
  interface Session  extends DefaultSession{
    user?: User & DefaultSession['user']
    accessToken: String | null
    refreshToken: String | null
  }
}