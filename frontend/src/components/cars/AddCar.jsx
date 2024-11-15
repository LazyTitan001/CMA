import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { createCar } from '../../services/api'

const AddCar = () => {
  const navigate = useNavigate()
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
    
    // Create preview URLs
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
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Add New Car
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
          required
        />
        <Grid container spacing={2} sx={{ mt: 1 }}>
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
            <Button variant="outlined" component="span">
              Upload Images (Max 10)
            </Button>
          </label>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {previewUrls.map((url, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={url}
                  alt={`Preview ${index}`}
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
                  }}
                  onClick={() => removeImage(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ flex: 1 }}
          >
            {loading ? 'Adding Car...' : 'Add Car'}
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

export default AddCar