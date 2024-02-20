import React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function ExerciseSearch({ exercises = [], onChange }) {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id='exercise-search'
        disableClearable
        options={exercises.map(exercise => exercise.name)}
        onInputChange={(event, newValue) => onChange(newValue)}
        renderInput={params => (
          <TextField
            {...params}
            label='Search input'
            InputProps={{
              ...params.InputProps,
              type: 'search'
            }}
            sx={{ width: 850 }}
          />
        )}
      />
    </Stack>
  );
}
