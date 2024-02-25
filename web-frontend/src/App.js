// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MusclesPage from './pages/Muscles/MusclesPage';
import ExercisesListPage from './pages/ExercisesList/ExercisesListPage';
import WorkoutPage from './pages/WorkoutTemplates/TemplatePage';
import CreateWorkout from './pages/CreateTemplate/CreateTemplate';
import EditWorkout from './pages/EditTemplate/EditTemplate';
import ProgressPage from './pages/Progress/Progress';
import ProfilePage from './pages//Profile/Profile';

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
