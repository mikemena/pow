import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function FreeSolo({ exercises, onChange }) {
  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Autocomplete
        freeSolo
        id='free-solo-2-demo'
        disableClearable
        options={exercises.map(exercise => exercise.name)}
        renderInput={params => (
          <TextField
            {...params}
            label='Search input',
            onChange={e => onChange(e.target.value)}
            InputProps={{
              ...params.InputProps,
              type: 'search'
            }}
          />
        )}
      />
    </Stack>
  );
}
