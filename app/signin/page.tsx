"use client"

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    const resp = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      })

      console.log(resp);
      
  };

  return (
    <div >
      <h2>Sign In</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div>
        <label>Email:</label>
        <input
        className='text-black'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}

        />
      </div>
      <div>
        <label>Password:</label>
        <input
        className='text-black'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default SignInPage;
