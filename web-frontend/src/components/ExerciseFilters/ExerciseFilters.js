import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import useFetchData from '../../hooks/useFetchData';
import CircularProgress from '@mui/material/CircularProgress';

function ExerciseFilters({ onMuscleChange, onEquipmentChange }) {
  const {
    data: muscles,
    isLoading: isLoadingMuscles,
    error: errorMuscles
  } = useFetchData('http://localhost:9025/api/muscles');

  const {
    data: equipments,
    isLoading: isLoadingEquipments,
    error: errorEquipments
  } = useFetchData('http://localhost:9025/api/equipments');

  // Loading indicator or error message for equipments
  if (isLoadingEquipments) return <CircularProgress />;
  if (errorEquipments)
    return <div>Error loading equipments: {errorEquipments}</div>;

  // Loading indicator or error message for muscles
  if (isLoadingMuscles) return <CircularProgress />;
  if (errorMuscles) return <div>Error loading equipments: {errorMuscles}</div>;

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
        sx={{ width: 250 }}
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
        sx={{ width: 250 }}
        onChange={(event, newValue) => {
          onEquipmentChange(newValue);
        }}
      />
    </Stack>
  );
}

export default ExerciseFilters;
