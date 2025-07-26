import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { getUserPurchases } from '../../services/carservices';
import CarCard from '../carListingPage/CarCard/CarCard';
import { CardShimmer } from '../../components/Shimmer/CardShimmer';

interface Purchase {
  id: string;
  userId: string;
  carId: string;
  carDetails: any;
  purchasePrice: number;
  purchaseDate: string;
  status: string;
}

const PurchasesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (currentUser) {
        try {
          const userPurchases = await getUserPurchases(currentUser.uid);
          setPurchases(userPurchases);
        } catch (error) {
          console.error('Failed to fetch purchases:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPurchases();
  }, [currentUser]);

  if (loading) {
    return (
      <Box p={3}>
        <Typography variant="h4" mb={3}>My Purchases</Typography>
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CardShimmer />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        My Purchases ({purchases.length})
      </Typography>
      
      {purchases.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No purchases yet
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {purchases.map((purchase) => (
            <Grid item xs={12} sm={6} md={4} key={purchase.id}>
              <CarCard car={purchase.carDetails} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PurchasesPage;