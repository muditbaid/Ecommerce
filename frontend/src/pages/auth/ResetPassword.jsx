import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset } from '@mui/icons-material';
import { resetPassword, validateResetToken } from '../../store/slices/authSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({
    loading: true,
    error: '',
    success: false,
    tokenValid: false,
  });
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    try {
      await dispatch(validateResetToken({ token })).unwrap();
      setStatus((prev) => ({
        ...prev,
        loading: false,
        tokenValid: true,
      }));
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: 'Invalid or expired reset link. Please request a new one.',
        tokenValid: false,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setStatus((prev) => ({ ...prev, error: '' }));
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setStatus((prev) => ({
        ...prev,
        error: 'Password must be at least 8 characters long',
      }));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setStatus((prev) => ({
        ...prev,
        error: 'Passwords do not match',
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      await dispatch(
        resetPassword({
          token,
          password: formData.password,
        })
      ).unwrap();
      setStatus((prev) => ({
        ...prev,
        loading: false,
        success: true,
      }));
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to reset password. Please try again.',
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

  if (!status.tokenValid) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          variant="outlined"
          sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {status.error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/auth/forgot-password')}
            >
              Request New Reset Link
            </Button>
          </Box>
        </Paper>
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
          }}
        >
          <LockReset sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Reset Your Password
          </Typography>
          <Typography color="text.secondary" align="center" paragraph>
            Please enter your new password
          </Typography>

          {status.error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {status.error}
            </Alert>
          )}

          {status.success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password has been successfully reset!
              </Alert>
              <Typography paragraph>
                Redirecting you to the login page...
              </Typography>
              <CircularProgress size={24} />
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
                name="password"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={status.loading}
                sx={{ mt: 3 }}
              >
                {status.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Reset Password'
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword; 