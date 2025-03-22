import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  ArrowForward,
} from '@mui/icons-material';
import {
  removeItem,
  updateQuantity,
  clearCart,
} from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleQuantityChange = (productId, size, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      dispatch(updateQuantity({ productId, size, quantity: newQty }));
    }
  };

  const handleRemoveItem = (productId, size) => {
    dispatch(removeItem({ productId, size }));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = item.sale_price || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return user?.type === 'PREMIUM' ? 0 : subtotal >= 2000 ? 0 : 99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  if (!items.length) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <ShoppingCart
            sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={`${item.id}-${item.size.id}`}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component="img"
                          src={item.images[0]}
                          alt={item.name}
                          sx={{
                            width: 80,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.fabric} • {item.style}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{item.size.name}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.size,
                              item.quantity,
                              -1
                            )
                          }
                        >
                          <Remove />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.size,
                              item.quantity,
                              1
                            )
                          }
                        >
                          <Add />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        ₹{item.sale_price || item.price}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>
                        ₹{(item.sale_price || item.price) * item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(item.id, item.size)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>₹{calculateSubtotal()}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography color="text.secondary">Shipping</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography>₹{calculateShipping()}</Typography>
                    {user?.type === 'PREMIUM' && (
                      <Typography
                        variant="caption"
                        color="success.main"
                        display="block"
                      >
                        Free shipping for Premium members
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">₹{calculateTotal()}</Typography>
                </Box>
                {!user && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Please{' '}
                    <Button
                      color="info"
                      size="small"
                      onClick={() => navigate('/login')}
                    >
                      login
                    </Button>{' '}
                    to continue with checkout
                  </Alert>
                )}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!user}
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 