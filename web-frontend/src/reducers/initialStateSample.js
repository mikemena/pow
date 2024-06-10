import { v4 as uuidv4 } from 'uuid';

// Static IDs for initial state
const initialProgramId = uuidv4();
const initialWorkoutId = uuidv4();
const initialExerciseId = uuidv4(); // Added for initial exercise
const initialSetId = uuidv4();

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
      exercises: [initialExerciseId], // Now contains IDs referencing exercises
      programId: initialProgramId
    }
  },
  exercises: {
    [initialWorkoutId]: {
      // Use dynamic workout ID
      [initialExerciseId]: {
        // Dynamically add exercises
        id: initialExerciseId,
        name: 'Exercise 1',
        sets: [initialSetId] // Now referencing sets by ID
      }
    }
  },
  sets: {
    [initialSetId]: {
      id: initialSetId,
      count: 10,
      weight: 50,
      exerciseId: initialExerciseId
    }
  },
  activeWorkout: initialWorkoutId // Points to the currently active workout
};
