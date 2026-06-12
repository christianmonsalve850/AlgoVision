'use client';

import { signInWithGoogle } from '../actions/sign-in-google';

export function GoogleSignInButton() {
  return (
    <button onClick={signInWithGoogle} className='bg-gray-700 p-4 rounded-2xl text-white hover:bg-gray-500'>
      Continue with Google
    </button>
  );
}