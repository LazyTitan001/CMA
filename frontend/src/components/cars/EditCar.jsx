import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { getCar, updateCar } from '../../services/api'

const EditCar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: {
      car_type: '',
      company: '',
      dealer: '',
    },
  })
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await getCar(id)
        const car = response.data
        setFormData({
          title: car.title,
          description: car.description,
          tags: car.tags,
        })
        setExistingImages(car.images)
      } catch (error) {
        toast.error('Failed to fetch car details')
        navigate('/')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchCar()
  }, [id, navigate])

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
    const totalImages = files.length + existingImages.length + newImages.length
    
    if (totalImages > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      if (!isValidType) toast.error(`${file.name} is not an image`)
      if (!isValidSize) toast.error(`${file.name} exceeds 5MB limit`)
      return isValidType && isValidSize
    })

    setNewImages((prev) => [...prev, ...validFiles])
    
    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setNewImagePreviews((prev) => [...prev, ...newPreviews])
  }

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (existingImages.length + newImages.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('tags', JSON.stringify(formData.tags))
      formDataToSend.append('existingImages', JSON.stringify(existingImages))
      newImages.forEach((image) => {
        formDataToSend.append('images', image)
      })

      await updateCar(id, formDataToSend)
      toast.success('Car updated successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update car')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Car
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
        />
        
        {/* Tags Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tags
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Car Type"
                name="tags.car_type"
                value={formData.tags.car_type}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Company"
                name="tags.company"
                value={formData.tags.company}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Dealer"
                name="tags.dealer"
                value={formData.tags.dealer}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Existing Images Section */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Existing Images
          </Typography>
          <Grid container spacing={2}>
            {existingImages.map((image, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={`http://localhost:5000/uploads/${image}`}
                    alt={`Car ${index}`}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                    onClick={() => removeExistingImage(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* New Images Upload Section */}
        <Box sx={{ mt: 3 }}>
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
              disabled={existingImages.length + newImages.length >= 10}
            >
              Add More Images
            </Button>
          </label>
          <Typography variant="caption" sx={{ ml: 2 }}>
            {10 - (existingImages.length + newImages.length)} slots remaining
          </Typography>
        </Box>

        {/* New Images Preview Section */}
        {newImagePreviews.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              New Images
            </Typography>
            <Grid container spacing={2}>
              {newImagePreviews.map((url, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt={`New ${index}`}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                      onClick={() => removeNewImage(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? 'Updating...' : 'Update Car'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ flex: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default EditCar