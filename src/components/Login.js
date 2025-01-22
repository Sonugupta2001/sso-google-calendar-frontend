import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      const authorizationCode = response.code;
      localStorage.setItem('authorization_code', authorizationCode);

      await fetch('https://sso-google-calendar-backend.onrender.com/api/login', {
        method: 'POST',
        credentials: "include",
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authorizationCode,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('session id: ', document.cookie);
          navigate('/dashboard');
        }
        else {
          console.error( data.message );
        }
      })
    },
    onError: () => {
      console.error('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
  });

  return (
    <div className="login-container">
      <button onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
};

export default Login;