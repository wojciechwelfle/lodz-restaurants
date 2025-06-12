import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../data/api';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';

interface RegisterProps {
  title: string;
}

const Register: React.FC<RegisterProps> = ({ title }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      // Registration successful, redirect to login page
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              autoFocus
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              id="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/login">
              <Typography variant="body2" color="primary">
                Masz już konto? Zaloguj się
              </Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
