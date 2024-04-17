import React, { createContext, useState } from 'react';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  // This state now tracks the expanded state of multiple workouts
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  const toggleExpand = workoutId => {
    setExpandedWorkouts(prevExpandedWorkouts => ({
      ...prevExpandedWorkouts,
      [workoutId]: !prevExpandedWorkouts[workoutId]
    }));
  };

  return (
    <WorkoutContext.Provider value={{ expandedWorkouts, toggleExpand }}>
      {children}
    </WorkoutContext.Provider>
  );
};
