// Only include Monday in the initial days array
export const INITIAL_DAYS = [{ id: 1, name: 'Monday' }];

// Include all possible days for user to add
export const ALL_DAYS = [
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
  { id: 7, name: 'Sunday' }
];

export const DAY_TYPES = [
  { id: 1, value: 'day of week', label: 'Day of Week' },
  { id: 2, value: 'numerical', label: 'Numerical' }
];

export const DURATION_TYPES = [
  { id: 1, value: 'days', label: 'Days' },
  { id: 2, value: 'weeks', label: 'Weeks' },
  { id: 3, value: 'months', label: 'Months' }
];

export const GOAL_TYPES = [
  { id: 1, value: 'strenght', label: 'Strength' },
  { id: 2, value: 'endurance', label: 'Endurance' },
  { id: 3, value: 'hypertrophy', label: 'Hypertrophy' },
  { id: 4, value: 'weight loss', label: 'Weight Loss' }
];
