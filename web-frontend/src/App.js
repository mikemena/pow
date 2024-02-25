// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MusclesPage from './pages/muscles/main/muscles';
import ExercisesListPage from './pages/exercises/main/exercises';
import WorkoutPage from './pages/workoutTemplates/main/template';
import CreateWorkout from './pages/workoutTemplates/create/template';
import EditWorkout from './pages/workoutTemplates/edit/template';
import ProgressPage from './pages/progress/main/progress';
import ProfilePage from './pages/profile/main/profile';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MusclesPage />} />
        <Route path='/exercises' element={<ExercisesListPage />} />
        <Route path='/workouts' element={<WorkoutPage />} />
        <Route path='/create-workout' element={<CreateWorkout />} />
        <Route path='/edit-workout' element={<EditWorkout />} />
        <Route path='/progress' element={<ProgressPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
