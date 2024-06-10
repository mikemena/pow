import { v4 as uuidv4 } from 'uuid';

// Static IDs for initial state
const initialProgramId = uuidv4();
const initialWorkoutId = uuidv4();

export const initialState = {
  programs: {
    [initialProgramId]: {
      id: initialProgramId,
      name: 'Program 1',
      program_duration: 0,
      duration_unit: '',
      days_per_week: 0,
      main_goal: ''
    }
  },
  workouts: {
    [initialWorkoutId]: {
      id: initialWorkoutId,
      name: 'Workout 1',
      programId: initialProgramId,
      exercises: []
    }
  },
  exercises: {},
  sets: {},
  activeWorkout: initialWorkoutId
};
