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

  if (!car) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Car not found</Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Back to List
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            {car.title}
          </Typography>
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
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  '& .zoom-indicator': {
                    opacity: 1,
                  }
                }
              }}
              onClick={() => setSelectedImage(car.images[0])}
            >
              <img
                src={car.images[0]?.url}
                alt={car.title}
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
              />
              <Box
                className="zoom-indicator"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 1,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
              >
                <Typography variant="body2">
                  Click to zoom
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={1} sx={{ mt: 2 }}>
              {car.images.slice(1).map((image, index) => (
                <Grid item xs={3} key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 1,
                      overflow: 'hidden',
                      '&:hover': {
                        '& .image-overlay': {
                          opacity: 1,
                        }
                      },
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.url}
                      alt={`${car.title} ${index + 2}`}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      className="image-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: 'white', fontWeight: 500 }}
                      >
                        View
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Type: ${car.tags.car_type}`}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                  <Chip
                    label={`Company: ${car.tags.company}`}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                  <Chip
                    label={`Dealer: ${car.tags.dealer}`}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Description
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {car.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            margin: 1,
          }
        }}
      >
        <Box
          sx={{
            position: 'relative',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: 2,
            cursor: 'pointer',
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage?.url}
            alt="Large view"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Box>
      </Dialog>
    </Box>
  )
}

export default CarDetail