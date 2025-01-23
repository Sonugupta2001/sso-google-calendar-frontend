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
      
      // production url for fetch request - https://sso-google-calendar-backend.onrender.com
      // development url for fetch request - http://localhost:5001

      const SCOPES = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ];
      

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
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
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