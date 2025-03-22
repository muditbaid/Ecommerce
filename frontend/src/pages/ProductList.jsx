import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Container,
  Button,
} from '@mui/material';
import { FilterList as FilterIcon, NavigateNext } from '@mui/icons-material';
import { fetchFilteredProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';

const ProductList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { products, loading, error, filters } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    // Parse URL search params
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};
    
    // Map URL params to filters
    if (searchParams.has('category')) urlFilters.category = searchParams.get('category');
    if (searchParams.has('fabric')) urlFilters.fabric = searchParams.get('fabric');
    if (searchParams.has('style')) urlFilters.style = searchParams.get('style');
    if (searchParams.has('occasion')) urlFilters.occasion = searchParams.get('occasion');
    if (searchParams.has('minPrice')) urlFilters.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.has('maxPrice')) urlFilters.maxPrice = Number(searchParams.get('maxPrice'));
    
    // Fetch products with combined filters
    dispatch(fetchFilteredProducts({ ...filters, ...urlFilters }));
  }, [dispatch, location.search, filters]);

  const toggleMobileFilter = () => {
    setMobileFilterOpen(!mobileFilterOpen);
  };

  const renderBreadcrumbs = () => (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
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
      <Typography color="text.primary">Kurtis</Typography>
    </Breadcrumbs>
  );

  const renderHeader = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1">
        Kurtis Collection
      </Typography>
      {isMobile && (
        <Button
          startIcon={<FilterIcon />}
          onClick={toggleMobileFilter}
          variant="outlined"
        >
          Filters
        </Button>
      )}
    </Box>
  );

  const renderFilters = () => (
    <>
      {/* Desktop Filters */}
      {!isMobile && (
        <Grid item xs={12} md={3} lg={2.5}>
          <FilterPanel />
        </Grid>
      )}

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={toggleMobileFilter}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 360,
            p: 2,
          },
        }}
      >
        <FilterPanel />
      </Drawer>
    </>
  );

  const renderProducts = () => {
    if (loading) {
      return <Typography>Loading products...</Typography>;
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    // Add this check to ensure products is an array
    if (!Array.isArray(products)) {
      return <Typography>No products available</Typography>;
    }

    if (products.length === 0) {
      return <Typography>No products found</Typography>;
    }

    return (
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="xl">
      {renderBreadcrumbs()}
      {renderHeader()}
      <Grid container spacing={4}>
        {renderFilters()}
        {renderProducts()}
      </Grid>
    </Container>
  );
};

export default ProductList; 