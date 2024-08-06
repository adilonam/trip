import {jwtDecode} from 'jwt-decode';


export function getTokenSubject(token : string) {
 if(token){

  try {
    const decodedToken = jwtDecode(token);
    if (!decodedToken.sub) {
      console.error('subject claim (sub) is missing');
      return null;
    }
    return decodedToken.sub ;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
 }
  
  
  }