// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MusclesPage from './pages/MusclesPage';
import ExercisesListPage from './pages/ExercisesListPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MusclesPage />} />
        <Route path='/exercises' element={<ExercisesListPage />} />
        <Route path='/exercises/:muscle?/:equipment? component={ExercisePage}' />
      </Routes>
    </Router>
  );
}

export default App;
