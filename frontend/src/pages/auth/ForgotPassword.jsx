import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { requestPasswordReset } from '../../store/slices/authSlice';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
      await dispatch(requestPasswordReset({ email })).unwrap();
      setStatus({
        loading: false,
        error: '',
        success: true,
      });
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message || 'Failed to send reset instructions. Please try again.',
        success: false,
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Email sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Reset Password
          </Typography>
          <Typography color="text.secondary" align="center" paragraph>
            Enter your email address and we'll send you instructions to reset your
            password.
          </Typography>

          {status.error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {status.error}
            </Alert>
          )}

          {status.success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset instructions have been sent to your email.
              </Alert>
              <Typography paragraph>
                Please check your email and follow the instructions to reset your
                password. The link will be valid for 1 hour.
              </Typography>
              <Button
                component={RouterLink}
                to="/auth/login"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Return to Login
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%', mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status.loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={status.loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {status.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{' '}
                  <Link component={RouterLink} to="/auth/login">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword; 