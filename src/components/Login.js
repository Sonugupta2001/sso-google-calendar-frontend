import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import "@fontsource/roboto/400.css";

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
            navigate('/dashboard');
          } else {
            console.error(data.message);
          }
        });
    },
    onError: () => {
      console.error('Login Failed');
    },
    scope:
      'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        padding: '20px',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '40px',
          borderRadius: '12px',
          width: '400px',
          textAlign: 'center',
          backgroundColor: '#fff',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          marginTop: '12%',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: '#333' }}
          >
            Sign in to Google Calendar App
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: '#666' }}
          >
            Use your Google account to log in and manage your calendar.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
          sx={{
            backgroundColor: '#4285F4',
            color: '#fff',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            padding: '10px 20px',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#357ae8',
            },
          }}
        >
          Login with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
