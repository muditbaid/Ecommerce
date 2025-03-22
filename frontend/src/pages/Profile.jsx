import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Stack,
  Divider,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Person,
  ShoppingBag,
  Settings,
  Edit,
  Visibility,
  Star,
} from '@mui/icons-material';
import { fetchUserOrders } from '../store/slices/orderSlice';
import { updateProfile } from '../store/slices/authSlice';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const { user, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.orders);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
      }));
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await dispatch(updateProfile({
        username: formData.username,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })).unwrap();
      setSuccess('Profile updated successfully');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderPersonalInfo = () => (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}
          src={user?.avatar}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h5">{user?.name}</Typography>
          <Chip
            icon={<Star />}
            label={`${user?.type} Member`}
            color={user?.type === 'PREMIUM' ? 'primary' : 'default'}
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={authLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={authLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={authLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={authLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={authLoading}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          type="submit"
          disabled={authLoading}
        >
          Update Profile
        </Button>
      </Box>
    </Box>
  );

  const renderOrderHistory = () => (
    <Box>
      {ordersError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {ordersError}
        </Alert>
      )}
      {ordersLoading ? (
        <Typography>Loading orders...</Typography>
      ) : orders?.length > 0 ? (
        <List>
          {orders.map((order) => (
            <ListItem
              key={order.id}
              divider
              secondaryAction={
                <Chip
                  label={order.status}
                  color={getOrderStatusColor(order.status)}
                  size="small"
                />
              }
            >
              <ListItemText
                primary={`Order #${order.id}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Total: ₹{order.total}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No orders found</Typography>
      )}
    </Box>
  );

  const renderAccountSettings = () => (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Membership Status
        </Typography>
        <Typography color="text.secondary" paragraph>
          You are currently on the {user?.type} plan.
        </Typography>
        {user?.type !== 'PREMIUM' && (
          <Button variant="contained" color="primary">
            Upgrade to Premium
          </Button>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Email Preferences
        </Typography>
        <Stack spacing={2}>
          <Typography color="text.secondary">
            Manage your email notification preferences
          </Typography>
          {/* Add email preference toggles here */}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Password & Security
        </Typography>
        <Button variant="outlined" color="primary">
          Change Password
        </Button>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Button variant="outlined" color="error">
          Delete Account
        </Button>
      </Paper>
    </Stack>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            icon={<Person />}
            label="Personal Info"
            iconPosition="start"
          />
          <Tab
            icon={<ShoppingBag />}
            label="Order History"
            iconPosition="start"
          />
          <Tab
            icon={<Settings />}
            label="Account Settings"
            iconPosition="start"
          />
        </Tabs>
        <Divider />
        <Box sx={{ p: 3 }}>
          <TabPanel value={activeTab} index={0}>
            {renderPersonalInfo()}
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            {renderOrderHistory()}
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            {renderAccountSettings()}
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 