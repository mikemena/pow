// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MusclesPage from './pages/Muscles/MusclesPage';
import ExercisesListPage from './pages/ExercisesList/ExercisesListPage';
import WorkoutPage from './pages/Workouts/Workout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MusclesPage />} />
        <Route path='/exercises' element={<ExercisesListPage />} />
        <Route path='/exercises/:muscle?/:equipment? component={ExercisePage}' />
        <Route path='/workouts' element={<WorkoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
