import { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Container,
  InputAdornment,
  Fade,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { toast } from 'react-toastify';
import { getCars, deleteCar } from '../../services/api';
import CarCard from './CarCard';
import '@fontsource/poppins';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchCars = async () => {
    try {
      const response = await getCars(search);
      setCars(response.data);
    } catch (error) {
      toast.error('Unable to fetch your garage. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCars();
    }, 500);
    return () => clearTimeout(debounce);
  }, [search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this car from your garage?')) {
      try {
        await deleteCar(id);
        toast.success('Car removed from garage');
        fetchCars();
      } catch (error) {
        toast.error('Unable to remove car. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 6,
          mb: 8,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Fade in timeout={1000}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}
            >
              <DirectionsCarIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  mr: 2
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  letterSpacing: 1,
                }}
              >
                MY GARAGE
              </Typography>
            </Box>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search your cars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                maxWidth: 700,
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    '& > fieldset': {
                      borderColor: theme.palette.primary.main,
                    }
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Fade>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : cars.length === 0 ? (
          <Fade in timeout={1000}>
            <Box sx={{ mt: 8 }}>
              <DirectionsCarIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  color: '#fff',
                  fontWeight: 500
                }}
              >
                No cars found in your garage
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Fade in timeout={1000}>
            <Grid container spacing={3}>
              {cars.map((car) => (
                <Grid item xs={12} sm={6} lg={4} key={car._id}>
                  <CarCard car={car} onDelete={handleDelete} />
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </Box>
    </Container>
  );
};

export default CarList;