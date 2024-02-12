// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MusclesPage from './pages/Muscles/MusclesPage';
import ExercisesListPage from './pages/ExercisesList/ExercisesListPage';
import WorkoutPage from './pages/Workouts/Workout';
import CreateWorkout from './components/CreateWorkout/CreateWorkout';
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
