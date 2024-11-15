import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Dialog,
} from '@mui/material'
import { Edit, Delete, ArrowBack } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { getCar, deleteCar } from '../../services/api'

const CarDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchCar()
  }, [id])

  const fetchCar = async () => {
    try {
      const response = await getCar(id)
      setCar(response.data)
    } catch (error) {
      toast.error('Failed to fetch car details')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(id)
        toast.success('Car deleted successfully')
        navigate('/')
      } catch (error) {
        toast.error('Failed to delete car')
      }
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to List
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">{car.title}</Typography>
          <Box>
            <Button
              startIcon={<Edit />}
              onClick={() => navigate(`/cars/edit/${id}`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              startIcon={<Delete />}
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <img
              src={`http://localhost:5000/uploads/${car.images[0]}`}
              alt={car.title}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedImage(car.images[0])}
            />
            <Grid container spacing={1} sx={{ mt: 2 }}>
              {car.images.slice(1).map((image, index) => (
                <Grid item xs={3} key={index}>
                  <img
                    src={`http://localhost:5000/uploads/${image}`}
                    alt={`${car.title} ${index + 2}`}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedImage(image)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Tags:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`Type: ${car.tags.car_type}`} />
                <Chip label={`Company: ${car.tags.company}`} />
                <Chip label={`Dealer: ${car.tags.dealer}`} />
              </Box>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Description:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {car.description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
      >
        <img
          src={`http://localhost:5000/uploads/${selectedImage}`}
          alt="Large view"
          style={{
            maxWidth: '100vw',
            maxHeight: '90vh',
            objectFit: 'contain',
          }}
        />
      </Dialog>
    </Box>
  )
}

export default CarDetail