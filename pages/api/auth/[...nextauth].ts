import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios';




export const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    pages: {
        signIn: '/signin',
    },
    callbacks: {
       jwt : async ({token, user, account, profile, isNewUser}) =>{
          // This callback is called whenever a user is logged in
          if (user) {
            // forwarding accessToken and refreshToken to the token that will be saved in the JWT
            token.accessToken = user.access_token;
            token.refreshToken = user.refresh_token;
          }
          return token;
        },
    
    session :    async ({session, token , user}) =>{
          // This callback is called whenever a session check is made.
          // Attach the accessToken and refreshToken to the session to be forwarded to the client.
          session.accessToken = token.accessToken as string;
          session.refreshToken = token.refreshToken as string;
          return session;
        }
      },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            authorize: async (credentials : any) => {
                try {
                  const { data } = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {
                    email: credentials.email,
                    password: credentials.password
                  });
          
                  if (data) {
                    console.log(data);
                    
                    return data; // This will be the user object that the JWT callback and session callback work with
                  } else {
                    return null; // User will not be authenticated if no data is returned
                  }
          
                } catch (e : any) {
                  // Handle errors, for example, if the server returns a non-2xx status code.
                  console.error('Authorization error', e.response);
                  return null;
                }
              }
            })
    ],
}

const handler = NextAuth(authOptions)

export default handler