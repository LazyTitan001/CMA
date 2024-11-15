import { useState } from 'react'
import '@fontsource/poppins';
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Container,
  Fade,
  useTheme,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  AddAPhoto as AddPhotoIcon,
  DirectionsCar as DirectionsCarIcon,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { createCar } from '../../services/api'

const AddCar = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: {
      car_type: '',
      company: '',
      dealer: '',
    },
  })
  const [images, setImages] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('tags.')) {
      const tagName = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        tags: {
          ...prev.tags,
          [tagName]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setImages((prev) => [...prev, ...files])
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (images.length === 0) {
      toast.error('Please select at least one image')
      return
    }
  
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('tags', JSON.stringify(formData.tags))
      images.forEach((image) => {
        formDataToSend.append('images', image)
      })
  
      await createCar(formDataToSend)
      toast.success('Car added successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add car')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md">
      <Fade in timeout={1000}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4, 
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.98)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <DirectionsCarIcon 
              sx={{ 
                fontSize: 40, 
                color: theme.palette.primary.main,
                mb: 1
              }} 
            />
            <Typography 
        variant="h4" 
        sx={{
          fontWeight: 700,
          color: theme.palette.primary.main,
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        ADD NEW CAR
      </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Car Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Car Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
              sx={{ mb: 3 }}
            />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Car Type"
                  name="tags.car_type"
                  value={formData.tags.car_type}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Company"
                  name="tags.company"
                  value={formData.tags.company}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Dealer"
                  name="tags.dealer"
                  value={formData.tags.dealer}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload">
                <Button 
                  variant="outlined" 
                  component="span"
                  startIcon={<AddPhotoIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Upload Images (Max 10)
                </Button>
              </label>
            </Box>

            <Grid container spacing={2} sx={{ mt: 3 }}>
              {previewUrls.map((url, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      '&:hover': {
                        '& .deleteButton': {
                          opacity: 1,
                        }
                      }
                    }}
                  >
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    />
                    <IconButton
                      className="deleteButton"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        }
                      }}
                      onClick={() => removeImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {loading ? 'Adding Car...' : 'Add Car'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Container>
  )
}

export default AddCar