// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/home';
import ExercisesListPage from './pages/exercises/main/exercises';
import WorkoutPage from './pages/workoutTemplates/main/template';
import ProgramPage from './pages/programs/main/programs';
import CreateWorkout from './pages/workoutTemplates/create/template';
import CreateWorkoutDetails from './pages/workoutTemplates/create/templateDetails';
import EditWorkout from './pages/workoutTemplates/edit/template';
import ProgressPage from './pages/progress/main/progress';
import ProfilePage from './pages/profile/main/profile';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/exercises' element={<ExercisesListPage />} />
        <Route path='/workouts' element={<WorkoutPage />} />
        <Route path='/create-workout' element={<CreateWorkout />} />
        <Route path='/programs' element={<ProgramPage />} />
        <Route
          path='/create-workout-details'
          element={<CreateWorkoutDetails />}
        />
        <Route path='/edit-workout' element={<EditWorkout />} />
        <Route path='/progress' element={<ProgressPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
