import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  styled,
} from '@mui/material';
import {
  ArrowForward,
  ArrowBack,
  ArrowForwardIos,
  Star,
} from '@mui/icons-material';
import { fetchFeaturedProducts, fetchNewArrivals } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '70vh',
  minHeight: 400,
  maxHeight: 700,
  overflow: 'hidden',
  marginBottom: theme.spacing(6),
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  color: 'white',
  zIndex: 2,
  width: '100%',
  padding: theme.spacing(2),
}));

const HeroOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 1,
});

const CategoryCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: 200,
  cursor: 'pointer',
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.1)',
    },
  },
}));

const CategoryImage = styled(CardMedia)({
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
});

const CategoryContent = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  color: 'white',
  padding: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    backgroundColor: theme.palette.primary.main,
  },
}));

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentSlide, setCurrentSlide] = useState(0);

  const { featuredProducts, newArrivals } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const heroSlides = [
    {
      image: '/images/hero1.jpg',
      title: 'Exclusive Designer Collection',
      subtitle: 'Discover the latest trends in ethnic wear',
    },
    {
      image: '/images/hero2.jpg',
      title: 'Festival Season Sale',
      subtitle: 'Up to 40% off on selected items',
    },
    {
      image: '/images/hero3.jpg',
      title: 'Premium Member Benefits',
      subtitle: 'Exclusive access to special prices and early sales',
    },
  ];

  const categories = [
    { id: 1, name: 'Casual Wear', image: '/images/casual.jpg', count: 120 },
    { id: 2, name: 'Party Wear', image: '/images/party.jpg', count: 85 },
    { id: 3, name: 'Festival Collection', image: '/images/festival.jpg', count: 95 },
    { id: 4, name: 'Wedding Season', image: '/images/wedding.jpg', count: 75 },
  ];

  const handleSlideChange = (direction) => {
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    } else {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const renderHeroSection = () => (
    <HeroSection>
      <HeroOverlay />
      <Box
        component="img"
        src={heroSlides[currentSlide].image}
        alt={heroSlides[currentSlide].title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <HeroContent>
        <Typography variant="h2" gutterBottom>
          {heroSlides[currentSlide].title}
        </Typography>
        <Typography variant="h5" gutterBottom>
          {heroSlides[currentSlide].subtitle}
        </Typography>
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIos />}
          sx={{ mt: 4 }}
          onClick={() => navigate('/products')}
        >
          Shop Now
        </Button>
      </HeroContent>
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          gap: 1,
        }}
      >
        {heroSlides.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </Box>
      <IconButton
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
        }}
        onClick={() => handleSlideChange('prev')}
      >
        <ArrowBack />
      </IconButton>
      <IconButton
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.3)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.5)' },
        }}
        onClick={() => handleSlideChange('next')}
      >
        <ArrowForward />
      </IconButton>
    </HeroSection>
  );

  const renderCategories = () => (
    <Box sx={{ my: 8 }}>
      <Container maxWidth="xl">
        <SectionTitle variant="h4" gutterBottom>
          Shop by Category
        </SectionTitle>
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <CategoryCard onClick={() => navigate(`/products?category=${category.name}`)}>
                <CategoryImage image={category.image} />
                <CategoryContent>
                  <Typography variant="h6">{category.name}</Typography>
                  <Typography variant="body2">{category.count} Products</Typography>
                </CategoryContent>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );

  const renderNewArrivals = () => (
    <Box sx={{ my: 8, backgroundColor: 'grey.50', py: 6 }}>
      <Container maxWidth="xl">
        <SectionTitle variant="h4" gutterBottom>
          New Arrivals
        </SectionTitle>
        <Grid container spacing={3}>
          {newArrivals.slice(0, 4).map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIos />}
            onClick={() => navigate('/products?sort=newest')}
          >
            View All New Arrivals
          </Button>
        </Box>
      </Container>
    </Box>
  );

  const renderPremiumBenefits = () => (
    <Box sx={{ my: 8 }}>
      <Container maxWidth="xl">
        <SectionTitle variant="h4" gutterBottom>
          Premium Member Benefits
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Star sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Exclusive Prices
              </Typography>
              <Typography color="text.secondary">
                Get access to special member-only prices and early access to sales
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Star sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Special Discounts
              </Typography>
              <Typography color="text.secondary">
                Enjoy additional discounts on all products and free shipping
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Star sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Priority Support
              </Typography>
              <Typography color="text.secondary">
                Get priority customer support and exclusive styling advice
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        {!user?.type === 'PREMIUM' && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/upgrade')}
            >
              Upgrade to Premium
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );

  return (
    <Box>
      {renderHeroSection()}
      {renderCategories()}
      {renderNewArrivals()}
      {renderPremiumBenefits()}
    </Box>
  );
};

export default Home; 