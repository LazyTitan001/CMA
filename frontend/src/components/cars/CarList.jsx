import { useState, useEffect } from 'react';
import { Grid, TextField, Typography, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { getCars, deleteCar } from '../../services/api';
import CarCard from './CarCard';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const response = await getCars(search);
      setCars(response.data);
    } catch (error) {
      toast.error('Failed to fetch cars');
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
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(id);
        toast.success('Car deleted successfully');
        fetchCars();
      } catch (error) {
        toast.error('Failed to delete car');
      }
    }
  };

  return (
    <Box sx={{ mt: 4, mx: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "'Bona Nova SC', serif",
            color: '#3f51b5', // Optional: You can change the color to match your theme
          }}
        >
          MY GARAGE
        </Typography>
        <TextField
          fullWidth
          label="Search cars"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : cars.length === 0 ? (
        <Typography variant="h6" align="center">
          No cars found
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {cars.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car._id}>
              <CarCard car={car} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CarList;
