import { useState, useCallback } from 'react';
import { Workout } from '../types/programTypes';

// Define the type for expandedWorkouts
type ExpandedWorkouts = {
  [key: string]: boolean;
};

// Define the return type of the hook
interface UseExpandedWorkoutsReturn {
  expandedWorkouts: ExpandedWorkouts;
  toggleWorkout: (workoutId: string | number) => void;
  initializeExpanded: (workouts: Workout[]) => void;
  collapseAllWorkouts: () => void;
}

const useExpandedWorkouts = (
  initialWorkouts: Workout[] = []
): UseExpandedWorkoutsReturn => {
  const [expandedWorkouts, setExpandedWorkouts] = useState<ExpandedWorkouts>(
    {}
  );

  const toggleWorkout = useCallback((workoutId: string | number) => {
    setExpandedWorkouts(prevState => {
      // Collapse all workouts
      const newState: ExpandedWorkouts = Object.keys(prevState).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {} as ExpandedWorkouts
      );

      // Expand the clicked workout if it wasn't already expanded
      newState[workoutId] = !prevState[workoutId];

      return newState;
    });
  }, []);

  const collapseAllWorkouts = useCallback(() => {
    setExpandedWorkouts({});
  }, []);

  const initializeExpanded = useCallback((workouts: Workout[]) => {
    const initialState = workouts.reduce((acc, workout) => {
      acc[workout.id] = false;
      return acc;
    }, {} as ExpandedWorkouts);
    setExpandedWorkouts(initialState);
  }, []);

  return {
    expandedWorkouts,
    toggleWorkout,
    initializeExpanded,
    collapseAllWorkouts
  };
};

export default useExpandedWorkouts;
