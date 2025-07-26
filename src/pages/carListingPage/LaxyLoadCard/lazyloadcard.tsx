import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import CarCard from "../CarCard/carCard";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { CardShimmer } from "../../../components/Shimmer/CardShimmer";
import type { Car } from "../../../store/carSlice";

interface LazyLoadCardProps {
  car: Car;
  onEdit?: (car: Car) => void;
}

export const LazyLoadCard = ({ car, onEdit }: LazyLoadCardProps) => {
  const { userRole } = useAuth();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [ref, isVisible] = useIntersectionObserver();

  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (isVisible && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isVisible, hasLoaded]);

  return (
    <div ref={ref}>
      {hasLoaded ? <CarCard car={car} onEdit={isAdmin ? onEdit : undefined} /> : <CardShimmer />}
    </div>
  );
};
