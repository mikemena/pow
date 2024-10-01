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
