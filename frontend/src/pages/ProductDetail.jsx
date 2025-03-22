import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Snackbar,
  Tabs,
  Tab,
  styled,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  Share,
  NavigateNext,
  Add,
  Remove,
} from '@mui/icons-material';
import { fetchProductById } from '../store/slices/productSlice';
import { addItem } from '../store/slices/cartSlice';

// Styled Components
const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  cursor: 'pointer',
});

const SizeButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '60px',
  margin: theme.spacing(0.5),
  ...(selected && {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`product-tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const { selectedProduct: product, loading, error } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  // Check user permissions
  const canViewPrices = user?.type === 'PLUS' || user?.type === 'PREMIUM';
  const canSeePromotions = user?.type === 'PREMIUM';

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSnackbar({ open: true, message: 'Please select a size' });
      return;
    }
    dispatch(
      addItem({
        ...product,
        size: selectedSize,
        quantity,
      })
    );
    setSnackbar({ open: true, message: 'Added to cart successfully!' });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const renderBreadcrumbs = () => (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      sx={{ mb: 3 }}
    >
      <Link
        color="inherit"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        Home
      </Link>
      <Link
        color="inherit"
        href="/products"
        onClick={(e) => {
          e.preventDefault();
          navigate('/products');
        }}
      >
        Kurtis
      </Link>
      <Typography color="text.primary">{product?.name}</Typography>
    </Breadcrumbs>
  );

  const renderImageGallery = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <Grid container spacing={1}>
          {product?.images.map((image, index) => (
            <Grid item xs={3} md={12} key={index}>
              <Paper
                elevation={selectedImage === index ? 4 : 1}
                sx={{
                  p: 0.5,
                  cursor: 'pointer',
                  border: (theme) =>
                    selectedImage === index
                      ? `2px solid ${theme.palette.primary.main}`
                      : 'none',
                }}
                onClick={() => setSelectedImage(index)}
              >
                <ProductImage
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  style={{ height: '80px' }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} md={10}>
        <Paper elevation={1}>
          <ProductImage
            src={product?.images[selectedImage]}
            alt={product?.name}
            style={{ height: '600px' }}
          />
        </Paper>
      </Grid>
    </Grid>
  );

  const renderPriceSection = () => {
    if (!canViewPrices) {
      return (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/upgrade')}
          >
            Upgrade to View Price
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Plus and Premium members can view prices
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 3 }}>
        {canSeePromotions && product?.sale_price ? (
          <>
            <Typography variant="h4" color="error" component="span">
              ₹{product.sale_price}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              component="span"
              sx={{ ml: 2, textDecoration: 'line-through' }}
            >
              ₹{product.price}
            </Typography>
            <Chip
              label={`${Math.round(
                ((product.price - product.sale_price) / product.price) * 100
              )}% OFF`}
              color="error"
              size="small"
              sx={{ ml: 2 }}
            />
          </>
        ) : (
          <Typography variant="h4">₹{product.price}</Typography>
        )}
      </Box>
    );
  };

  const renderProductInfo = () => (
    <>
      <Typography variant="h4" gutterBottom>
        {product?.name}
      </Typography>

      {renderPriceSection()}

      {/* Product Details Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" sx={{ width: '30%' }}>
                Fabric
              </TableCell>
              <TableCell>{product?.fabric}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Style</TableCell>
              <TableCell>{product?.style}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Occasion</TableCell>
              <TableCell>{product?.occasion}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Sleeve Type</TableCell>
              <TableCell>{product?.sleeve_type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Neck Type</TableCell>
              <TableCell>{product?.neck_type}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Size Selection */}
      <Typography variant="subtitle1" gutterBottom>
        Select Size
      </Typography>
      <Box sx={{ mb: 3 }}>
        {product?.sizes.map((size) => (
          <SizeButton
            key={size.id}
            variant="outlined"
            selected={selectedSize?.id === size.id}
            onClick={() => handleSizeSelect(size)}
            disabled={size.stock === 0}
          >
            {size.name}
          </SizeButton>
        ))}
      </Box>

      {/* Quantity Selection */}
      {canViewPrices && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1">Quantity:</Typography>
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Remove />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 2 }}>
            {quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product?.stock}
          >
            <Add />
          </IconButton>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {canViewPrices && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleAddToCart}
            disabled={!selectedSize || product?.stock === 0}
          >
            Add to Cart
          </Button>
        )}
        <IconButton onClick={() => setIsWishlisted(!isWishlisted)}>
          {isWishlisted ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
        <IconButton onClick={handleShare}>
          <Share />
        </IconButton>
      </Box>
    </>
  );

  const renderTabs = () => (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="Description" />
          <Tab label="Size Guide" />
          <Tab label="Care Instructions" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Typography>{product?.description}</Typography>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableBody>
              {product?.sizes.map((size) => (
                <TableRow key={size.id}>
                  <TableCell component="th" sx={{ width: '30%' }}>
                    {size.name}
                  </TableCell>
                  <TableCell>{size.measurements}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Typography component="div">
          <ul>
            <li>Machine wash cold</li>
            <li>Gentle cycle with similar colors</li>
            <li>Do not bleach</li>
            <li>Tumble dry low</li>
            <li>Iron on medium heat if needed</li>
          </ul>
        </Typography>
      </TabPanel>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="xl">
        <Alert severity="info" sx={{ mt: 3 }}>
          Product not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {renderBreadcrumbs()}
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {renderImageGallery()}
        </Grid>
        <Grid item xs={12} md={5}>
          {renderProductInfo()}
        </Grid>
        <Grid item xs={12}>
          {renderTabs()}
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default ProductDetail;