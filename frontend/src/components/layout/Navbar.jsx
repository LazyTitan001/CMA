import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '@fontsource/poppins';  // Importing Poppins font

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: 'rgb(55 65 81 / var(--tw-bg-opacity, 1))', 
      boxShadow: 'none',
      py: 1.5,
      borderBottom: '1px solid #eaeaea'
    }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ 
          padding: 0,
          justifyContent: 'space-between',
          minHeight: '64px'
        }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ 
              textDecoration: 'none', 
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.8rem',
              letterSpacing: '0.5px',
              fontWeight: 600,
              '&:hover': {
                color: '#1565c0'
              }
            }}
          >
            VehicleVault
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 4,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {token ? (
              <>
                <Button 
                  component={Link} 
                  to="/"
                  sx={{ 
                    color: '#ffffff',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#1565c0'
                    }
                  }}
                >
                  My Cars
                </Button>
                <Button 
                  component={Link} 
                  to="/cars/add"
                  sx={{ 
                    color: '#ffffff',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#1565c0'
                    }
                  }}
                >
                  Add Car
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgb(17 24 39 / var(--tw-bg-opacity, 1))',
                    color: 'white',
                    textTransform: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    borderRadius: '4px',
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                  onClick={handleMenuOpen}
                >
                  Profile
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                      color: '#1e88e5',
                      fontSize: '0.9rem',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    color: '#1e88e5',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#1565c0'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    backgroundColor: '#1e88e5',
                    color: 'white',
                    textTransform: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    borderRadius: '4px',
                    px: 3,
                    '&:hover': {
                      backgroundColor: '#1565c0'
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
