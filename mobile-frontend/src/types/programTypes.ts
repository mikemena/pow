import { Dispatch } from 'react';

export interface ProgramContextType {
  state: {
    program: Program;
    workout: {
      workouts: Workout[];
      activeWorkout: string | null;
    };
    mode: 'view' | 'edit' | 'create';
  };
  dispatch: Dispatch<any>;
  setMode: (mode: 'view' | 'edit' | 'create') => void;
  updateProgramField: (field: keyof Program, value: any) => void;
  initializeNewProgramState: () => void;
  initializeEditProgramState: (program: Program, workouts: Workout[]) => void;
  addProgram: (details: Partial<Program>) => void;
  updateProgram: (updatedProgram: Program) => Promise<void>;
  deleteProgram: (programId: number | string) => Promise<void>;
  addWorkout: () => void;
  updateWorkoutField: (field: keyof Workout, value: any) => void;
  updateWorkout: (updatedWorkout: Workout) => void;
  deleteWorkout: (workoutId: number | string) => void;
  setActiveWorkout: (workoutId: number | string) => void;
  addExercise: (workoutId: number | string, exercises: Exercise[]) => void;
  updateExercise: (
    workoutId: number | string,
    updatedExercises: Exercise[]
  ) => void;
  toggleExerciseSelection: (
    exerciseId: number | string,
    exerciseData: Exercise
  ) => void;
  removeExercise: (
    workoutId: number | string,
    exerciseId: number | string
  ) => void;
  addSet: (workoutId: number | string, exerciseId: number | string) => void;
  updateSet: (
    workoutId: number | string,
    exerciseId: number | string,
    updatedSet: Set
  ) => void;
  removeSet: (
    workoutId: number | string,
    exerciseId: number | string,
    setId: number | string
  ) => void;
  saveProgram: () => Promise<void>;
  clearProgram: () => void;
}

export interface Set {
  id: number;
  exercise_id: number;
  reps: number;
  weight: number;
  order: number;
}

export interface Exercise {
  id: number;
  workout_id: number;
  catalog_exercise_id: number;
  order: number;
  name: string;
  muscle: string;
  muscle_group: string;
  subcategory: string;
  equipment: string;
  sets: Set[];
}

export interface Workout {
  id: number | string;
  name: string;
  exercises: Array<any>;
}

export interface WorkoutProps {
  workout: Workout;
  isExpanded: boolean;
  onToggleExpand: (workoutId: number | string) => void;
}

export interface Program {
  id: string | null;
  name: string;
  main_goal: string;
  program_duration: number;
  duration_unit: string;
  days_per_week: number;
  workouts: Workout[];
}

export interface ProgramList {
  programs: Program[];
  workouts: any[];
}

export interface Filters {
  programName: string;
  selectedGoal: string;
  durationType: string;
  daysPerWeek: string;
}
