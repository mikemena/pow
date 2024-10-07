import { useState, useCallback } from 'react';

const useExpandedWorkouts = (initialWorkouts = []) => {
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  const toggleWorkout = useCallback(workoutId => {
    setExpandedWorkouts(prevState => {
      // Collapse all workouts
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      // Expand the clicked workout if it wasn't already expanded
      newState[workoutId] = !prevState[workoutId];

      return newState;
    });
  }, []);

  const collapseAllWorkouts = useCallback(() => {
    setExpandedWorkouts({});
  }, []);

  const initializeExpanded = useCallback(workouts => {
    const initialState = workouts.reduce((acc, workout) => {
      acc[workout.id] = false;
      return acc;
    }, {});
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
