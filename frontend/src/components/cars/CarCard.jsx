import { Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material'
import { Edit, Delete, Visibility } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const CarCard = ({ car, onDelete }) => {
  const navigate = useNavigate()

  return (
    <Card elevation={3}>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:5000/uploads/${car.images[0]}`}
        alt={car.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {car.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {car.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip size="small" label={car.tags.car_type} />
          <Chip size="small" label={car.tags.company} />
          <Chip size="small" label={car.tags.dealer} />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={() => navigate(`/cars/${car._id}`)}
        >
          View
        </Button>
        <Button
          size="small"
          startIcon={<Edit />}
          onClick={() => navigate(`/cars/edit/${car._id}`)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<Delete />}
          onClick={() => onDelete(car._id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}

export default CarCard