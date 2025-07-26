import React from 'react';
import { Card, CardContent, Box } from '@mui/material';
import { Shimmer } from './Shimmer';

export const CardShimmer: React.FC = () => {
  return (
    <Card sx={{ maxWidth: 345, margin: 'auto' }}>
      <Shimmer height="200px" />
      <CardContent>
        <Box mb={1}>
          <Shimmer height="24px" width="70%" />
        </Box>
        <Box mb={1}>
          <Shimmer height="32px" width="50%" />
        </Box>
        <Box mb={1}>
          <Shimmer height="20px" width="40%" />
        </Box>
        <Box mb={2}>
          <Shimmer height="40px" width="100%" />
        </Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Shimmer height="16px" width="25%" />
          <Shimmer height="16px" width="25%" />
          <Shimmer height="16px" width="25%" />
        </Box>
        <Shimmer height="16px" width="60%" />
      </CardContent>
      <Box p={2}>
        <Shimmer height="36px" width="100%" borderRadius="8px" />
      </Box>
    </Card>
  );
};