import { v4 as uuidv4 } from 'uuid';

// Exporting initialState separately
export const initialState = {
  activeWorkout: null,
  program: {
    user_id: 2,
    name: 'Program 1',
    program_duration: 0,
    duration_unit: '',
    days_per_week: 0,
    main_goal: '',
    workouts: [
      { id: uuidv4(), name: 'Workout 1', exercises: [], active: false }
    ]
  }
};
