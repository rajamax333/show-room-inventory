import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardMedia, 
  CardContent,
  Rating,
  Chip,
} from '@mui/material';
import { ArrowBack, LocalGasStation, Speed, People } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cars } = useAppSelector(state => state.cars);
  
  const car = cars.find(c => c.id === id);

  if (!car) {
    return (
      <Box p={3}>
        <Typography variant="h6">Car not found</Typography>
        <Button onClick={() => navigate('/home')} startIcon={<ArrowBack />}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      p={3} 
      maxWidth="800px" 
      mx="auto"
      sx={{
        minHeight: '100vh',
        background: '#ffffff'
      }}
    >
      <Button 
        onClick={() => navigate('/home')} 
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
      >
        Back to Home
      </Button>
      
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
        />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">
              {car.brand} {car.model}
            </Typography>
            <Chip label={car.vehicleType} color="primary" />
          </Box>
          
          <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
            ₹{car.price?.toLocaleString()}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={car.rating} precision={0.1} readOnly />
            <Typography variant="body1" ml={1}>
              ({car.rating})
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            {car.description}
          </Typography>
          
          <Box display="flex" gap={3} mb={2}>
            <Box display="flex" alignItems="center">
              <LocalGasStation color="action" />
              <Typography variant="body1" ml={1}>
                {car.mileage}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Speed color="action" />
              <Typography variant="body1" ml={1}>
                {car.transmission}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <People color="action" />
              <Typography variant="body1" ml={1}>
                {car.seatingCapacity} seats
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" color={car.stock > 0 ? "success.main" : "error.main"}>
            {car.stock > 0 ? `${car.stock} in stock` : 'Out of stock'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CarDetailPage;
