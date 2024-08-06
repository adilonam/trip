import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    access: String | null
    refresh: String | null
  }
  interface Session  extends DefaultSession{
    user?: User & DefaultSession['user']
    accessToken: String | null
  }
}