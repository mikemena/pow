// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/home';
import ExercisesListPage from './pages/exercises/exercises';
import SelectExercisesPage from './pages/exercises/select-exercises';
import ProgramPage from './pages/programs/main/programs';
import ProgramDetailsPage from './pages/programs/detail/program';
import CreateProgramPage from './pages/programs/create/program';
import EditProgramPage from './pages/programs/edit/program';
import ProgressPage from './pages/progress/main/progress';
import ProfilePage from './pages/profile/main/profile';
import { ProgramProvider } from './contexts/programContext';
import { useTheme } from './contexts/themeContext';

import './App.css';

const App = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // When the theme changes, update the class on the <html> element
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ProgramProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/exercises' element={<ExercisesListPage />} />
          <Route path='/select-exercises' element={<SelectExercisesPage />} />
          <Route path='/programs' element={<ProgramPage />} />
          <Route
            path='/programs/:program_id'
            element={<ProgramDetailsPage />}
          />
          <Route path='/create-program' element={<CreateProgramPage />} />
          <Route
            path='/programs/:program_id/edit'
            element={<EditProgramPage />}
          />
          <Route path='/progress' element={<ProgressPage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>
      </Router>
    </ProgramProvider>
  );
};

export default App;
