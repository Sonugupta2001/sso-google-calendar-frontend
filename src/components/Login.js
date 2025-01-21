import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      const authorizationCode = response.code;

      fetch('http://localhost:5001/api/auth/getTokens', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authorizationCode}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem('access_token', data.tokens.access_token);
            localStorage.setItem('refresh_token', data.tokens.refresh_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');
          } else {
            console.error('Authentication failed:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error during authentication:', error);
        });
    },
    onError: () => {
      console.error('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
  });

  return (
    <div className="login-container">
      <button onClick={handleLogin} disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in with Google'}
      </button>
    </div>
  );
};

export default Login;