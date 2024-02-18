// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MusclesPage from './pages/Muscles/MusclesPage';
import ExercisesListPage from './pages/ExercisesList/ExercisesListPage';
import WorkoutPage from './pages/WorkoutTemplates/TemplatePage';
import CreateWorkout from './pages/CreateTemplate/CreateTemplate';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MusclesPage />} />
        <Route path='/exercises' element={<ExercisesListPage />} />
        <Route path='/workouts' element={<WorkoutPage />} />
        <Route path='/create-workout' element={<CreateWorkout />} />
      </Routes>
    </Router>
  );
}

export default App;
