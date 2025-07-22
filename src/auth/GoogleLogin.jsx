import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLogin = () => {
  const responseGoogle = async (authResult) => {
    try {
      console.log("Google auth response:", authResult);
      // Send authResult.code to your backend to get access token
    } catch (error) {
      console.error("ERROR while requesting Google login:", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code', // Use this only if backend handles token exchange
  });

  return (
    <div className='App'>
      <button
        onClick={googleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
