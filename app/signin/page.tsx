"use client"

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { signOut } from "next-auth/react"
import { getTokenSubject } from '@/utils/utilsClient';

const SignInPage: React.FC = () => {

    const { data: session , status } = useSession();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    const resp = await signIn('credentials', {
        redirect: false,
        username: email,
        password: password,
      })

     router.push('/')
      
  };
  const router = useRouter()

  useEffect(
    ()=>{
      console.log(getTokenSubject(session?.accessToken as string));
      console.log(status);
      console.log(session);
    }
  , [session, status])
  
  return (
    <div >
          {/* <h1 className="text-2xl">subject if exist : {getTokenSubject(session?.accessToken as string)}</h1> */}
      <h2>Sign In</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div className='mt-2' >
        <label>Email:</label>
        <input
        className='text-black'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}

        />
        <span>ADIL.ABBADI</span>
      </div>
      <div className='mt-2' >
        <label>Password:</label>
        <input
        className='text-black'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span>Abbadi03/</span>
      </div>

      <button className='mt-2' onClick={handleSignIn}>Sign In</button>
  <br />
      <button className='mt-2'  onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default SignInPage;
