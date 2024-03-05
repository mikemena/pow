import { useState, useEffect } from 'react';
import useFetchData from '../hooks/useFetchData';

const useExercises = () => {
  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');
};
