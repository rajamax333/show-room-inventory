import React from 'react';
import styles from './Shimmer.module.scss';

interface ShimmerProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({ 
  width = '100%', 
  height = '200px', 
  borderRadius = '4px' 
}) => {
  return (
    <div 
      className={styles.shimmer}
      style={{ width, height, borderRadius }}
    />
  );
};