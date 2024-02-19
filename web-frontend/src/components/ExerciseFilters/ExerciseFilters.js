import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

function ExerciseFilters({ onMuscleChange, onEquipmentChange }) {
  const [equipments, setEquipments] = useState([]);
  const [muscles, setMuscles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch equipment catalog
        const equipmentResponse = await fetch(
          'http://localhost:9025/api/equipments'
        );
        const equipmentCatalog = await equipmentResponse.json();
        setEquipments(equipmentCatalog);

        // Fetch muscle catalog
        const musclesResponse = await fetch(
          'http://localhost:9025/api/muscles'
        );
        const musclesCatalog = await musclesResponse.json();
        setMuscles(musclesCatalog);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Stack direction='row' spacing={2}>
      <Autocomplete
        options={muscles.map(option => option.name)}
        renderInput={params => (
          <TextField
            {...params}
            label='Muscle'
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
        onChange={(event, newValue) => {
          onMuscleChange(newValue);
        }}
      />
      <Autocomplete
        options={equipments.map(option => option.name)}
        renderInput={params => (
          <TextField
            {...params}
            label='Equipment'
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
        onChange={(event, newValue) => {
          onEquipmentChange(newValue);
        }}
      />
    </Stack>
  );
}

export default ExerciseFilters;
