import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const BASE_URL = 'http://localhost:9025/api';

// Cache helper functions
const getCachedData = async key => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);

    if (Date.now() - timestamp > CACHE_DURATION) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

const setCachedData = async (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Cache storage error:', error);
  }
};

// Main fetch function
async function fetchExerciseData(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  // Check cache first
  const cachedData = await getCachedData(url);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache the successful response
    await setCachedData(url, data);

    return data;
  } catch (error) {
    console.error('Error fetching exercise data:', error);
    throw error;
  }
}

// Custom hooks
export function useExerciseCatalog(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchExerciseData('/exercise-catalog', params);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useExercisesByMuscle(muscleId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!muscleId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchExerciseData(
          `/exercise-catalog/muscles/${muscleId}`
        );
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [muscleId]);

  return { data, loading, error };
}

// Cache control function
export const clearExerciseCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const exerciseKeys = keys.filter(key => key.includes(BASE_URL));
    await AsyncStorage.multiRemove(exerciseKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
