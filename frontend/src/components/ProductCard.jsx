import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  Chip,
  Tooltip,
  styled,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  RemoveRedEye,
  ShoppingCart,
} from '@mui/icons-material';
import { addItem } from '../store/slices/cartSlice';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    '& .MuiCardMedia-root': {
      filter: 'brightness(0.9)',
    },
    '& .hover-actions': {
      opacity: 1,
    },
  },
}));

const HoverActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  gap: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  zIndex: 2,
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const {
    id,
    name,
    price,
    sale_price,
    images,
    fabric,
    is_featured,
    stock,
  } = product;

  // Check user permissions
  const canViewPrices = user?.type === 'PLUS' || user?.type === 'PREMIUM';
  const canSeePromotions = user?.type === 'PREMIUM';

  const handleQuickView = (e) => {
    e.stopPropagation();
    // Implement quick view modal logic
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addItem({ ...product, quantity: 1 }));
  };

  const renderPrice = () => {
    if (!canViewPrices) {
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/upgrade');
          }}
        >
          Upgrade to View Price
        </Button>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {sale_price && canSeePromotions ? (
          <>
            <Typography variant="h6" color="error" sx={{ fontWeight: 600 }}>
              ₹{sale_price}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              ₹{price}
            </Typography>
          </>
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ₹{price}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <StyledCard onClick={() => navigate(`/products/${id}`)}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="300"
          image={images[0]}
          alt={name}
          sx={{ objectFit: 'cover' }}
        />
        
        {/* Badges */}
        <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 1 }}>
          {is_featured && (
            <Chip
              label="Featured"
              size="small"
              color="primary"
              sx={{ backgroundColor: 'white', fontWeight: 500 }}
            />
          )}
          {sale_price && canSeePromotions && (
            <Chip
              label={`${Math.round(((price - sale_price) / price) * 100)}% OFF`}
              size="small"
              color="error"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>

        {/* Hover Actions */}
        <HoverActions className="hover-actions">
          <Tooltip title="Quick View">
            <ActionButton onClick={handleQuickView}>
              <RemoveRedEye />
            </ActionButton>
          </Tooltip>
          <Tooltip title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}>
            <ActionButton onClick={handleWishlist}>
              {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
            </ActionButton>
          </Tooltip>
          {stock > 0 && canViewPrices && (
            <Tooltip title="Add to Cart">
              <ActionButton onClick={handleAddToCart}>
                <ShoppingCart />
              </ActionButton>
            </Tooltip>
          )}
        </HoverActions>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 500,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {fabric}
        </Typography>

        {renderPrice()}

        {stock === 0 && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            sx={{ mt: 2 }}
            disabled
          >
            Out of Stock
          </Button>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard; 