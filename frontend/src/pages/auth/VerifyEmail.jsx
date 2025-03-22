import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { MarkEmailRead, ErrorOutline } from '@mui/icons-material';
import { verifyEmail, resendVerification } from '../../store/slices/authSlice';

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = useState({
    loading: true,
    error: '',
    success: false,
    resending: false,
  });

  useEffect(() => {
    verifyEmailToken();
  }, []);

  const verifyEmailToken = async () => {
    try {
      await dispatch(verifyEmail({ token })).unwrap();
      setStatus({
        loading: false,
        error: '',
        success: true,
      });
      // Redirect to login after successful verification
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message || 'Email verification failed. Please try again.',
        success: false,
      });
    }
  };

  const handleResendVerification = async () => {
    setStatus((prev) => ({ ...prev, resending: true }));
    try {
      await dispatch(resendVerification()).unwrap();
      setStatus((prev) => ({
        ...prev,
        resending: false,
        error: '',
      }));
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        resending: false,
        error: 'Failed to resend verification email. Please try again.',
      }));
    }
  };

  if (status.loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
            textAlign: 'center',
          }}
        >
          {status.success ? (
            <>
              <MarkEmailRead
                sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
              />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
                Email Verified!
              </Typography>
              <Typography color="text.secondary" paragraph>
                Your email has been successfully verified. You can now log in to
                your account.
              </Typography>
              <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
                Redirecting you to the login page...
              </Alert>
              <CircularProgress size={24} />
            </>
          ) : (
            <>
              <ErrorOutline
                sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
              />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
                Verification Failed
              </Typography>
              <Typography color="text.secondary" paragraph>
                The verification link appears to be invalid or has expired.
              </Typography>
              {status.error && (
                <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                  {status.error}
                </Alert>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleResendVerification}
                  disabled={status.resending}
                  sx={{ mb: 2 }}
                >
                  {status.resending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  or{' '}
                  <Button
                    component={RouterLink}
                    to="/auth/login"
                    color="primary"
                  >
                    Return to Login
                  </Button>
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyEmail; 