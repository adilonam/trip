import NextAuth, { AuthOptions, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios';

import {jwtDecode} from 'jwt-decode';
import { JWT } from 'next-auth/jwt';


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
          // Initial sign in
      if (account && user) {
        
        return {
          accessToken: user.access_token,
          refreshToken: user.refresh_token,
          accessTokenExpires: getTokenExpiration(user.access_token as string), 
          user
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        
        return token;
      }

      // Access token has expired, try to update it using refresh token
      return refreshAccessToken(token);
        },
    
    session :    async ({session, token , user}) =>{
            // forward the accessToken to the session
            session.accessToken = token.accessToken as string;
//  buiiiiiiild own user
session.user = {} as User
      return session;
        }
      },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            authorize: async (credentials : any) => {
                try {
                  const { data } = await axios.post( `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/authenticate`, {
                    email: credentials.email,
                    password: credentials.password
                  });
                  if (data) {                    
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



async function refreshAccessToken(token : JWT) {
   
    
    try {
      const url =  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh-token`; // The endpoint for refreshing the token
      const response = await axios.post(url,{refresh_token : token.refreshToken},);
  
      const refreshedTokens = response.data;

      // Handle response and errors as appropriate.
      // Make sure to verify the shape of the response and extract the data correctly.
      if (!refreshedTokens.access_token) {
        throw new Error("No access_token returned from refresh token endpoint");
      }
     

      return {
        ...token,
        accessToken: refreshedTokens.access_token,
       accessTokenExpires: getTokenExpiration(refreshedTokens.access_token),
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      };
  
    } catch (error) {
      console.error('Error refreshing access token:', error);
  
      // If we get here, it means refresh token has failed.
      // Handle token refresh failure as appropriate. Common pattern is to sign the user out.
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }
  }



  function getTokenExpiration(token : string) {
    try {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.exp) {
        console.error('Expiration claim (exp) is missing');
        return null;
      }
      return decodedToken.exp * 1000 ;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

export default handler