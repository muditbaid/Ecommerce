import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  Favorite,
  Search,
  Close,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const pages = [
  { title: 'New Arrivals', path: '/products?category=new' },
  { title: 'Categories', path: '/products' },
  { title: 'Sale', path: '/products?sale=true' },
];

const settings = [
  { title: 'Profile', path: '/profile' },
  { title: 'My Orders', path: '/orders' },
  { title: 'Wishlist', path: '/wishlist' },
  { title: 'Logout', path: '/logout' },
];

function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const cartItemsCount = useSelector((state) => state.cart.items.length);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const toggleMobileDrawer = () => setMobileDrawerOpen(!mobileDrawerOpen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: { xs: 1, md: 0 }, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              MISHRI BOUTIQUE
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                {pages.map((page) => (
                  <Button
                    key={page.title}
                    onClick={() => navigate(page.path)}
                    sx={{ color: 'white', display: 'block', mx: 1 }}
                  >
                    {page.title}
                  </Button>
                ))}
              </Box>
            )}

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit" onClick={() => navigate('/search')}>
                <Search />
              </IconButton>
              
              <IconButton color="inherit" onClick={() => navigate('/cart')}>
                <Badge badgeContent={cartItemsCount} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                    <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ ml: 1 }}
                >
                  Login
                </Button>
              )}
            </Box>

            {/* User Menu */}
            <Menu
              sx={{ mt: '45px' }}
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.title}
                  onClick={() => {
                    navigate(setting.path);
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={toggleMobileDrawer}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleMobileDrawer}
          onKeyDown={toggleMobileDrawer}
        >
          <List>
            {pages.map((page) => (
              <ListItem
                button
                key={page.title}
                onClick={() => navigate(page.path)}
              >
                <ListItemText primary={page.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Mishri Boutique. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default MainLayout; 