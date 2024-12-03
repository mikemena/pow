import { useState, useEffect, useCallback } from 'react';

export function useExerciseData(baseUrl = 'http://localhost:9025/api') {
  const [exercises, setExercises] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetadata = useCallback(async () => {
    console.log('Fetching metadata...');
    try {
      const musclesUrl = `${baseUrl}/muscles`;
      const equipmentUrl = `${baseUrl}/equipments`;

      console.log('Fetching from URLs:', { musclesUrl, equipmentUrl });
      const [musclesRes, equipmentRes] = await Promise.all([
        fetch(`${baseUrl}/muscles`),
        fetch(`${baseUrl}/equipments`)
      ]);

      console.log('Response status:', {
        muscles: musclesRes.status,
        equipment: equipmentRes.status
      });

      if (!musclesRes.ok || !equipmentRes.ok) {
        throw new Error('Failed to fetch metadata');
      }

      const [musclesData, equipmentData] = await Promise.all([
        musclesRes.json(),
        equipmentRes.json()
      ]);

      console.log('Fetched data:', {
        muscles: musclesData?.length || 0,
        equipment: equipmentData?.length || 0
      });

      setMuscles(musclesData);
      setEquipment(equipmentData);
    } catch (err) {
      setError(err.message);
    }
  }, [baseUrl]);

  const fetchExercises = useCallback(
    async (params = {}) => {
      try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(
          `${baseUrl}/exercise-catalog${queryString ? `?${queryString}` : ''}`
        );

        if (!response.ok) throw new Error('Failed to fetch exercises');

        const data = await response.json();
        setExercises(data.exercises);
        return data;
      } catch (err) {
        setError(err.message);
        return null;
      }
    },
    [baseUrl]
  );

  useEffect(() => {
    console.log('Initial hook mount, starting data fetch');
    setLoading(true);
    Promise.all([fetchMetadata(), fetchExercises()]).finally(() => {
      console.log('All data fetched, setting loading to false');
      setLoading(false);
    });
  }, [fetchMetadata, fetchExercises]);

  return {
    exercises,
    muscles,
    equipment,
    loading,
    error,
    fetchExercises,
    fetchMetadata
  };
}
