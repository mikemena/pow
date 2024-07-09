import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Inputs/Button';
import NavBar from '../../../components/Nav/Nav';
import { useTheme } from '../../../contexts/themeContext';
import './program.css';

const ProgramDetailsPage = () => {
  const { theme } = useTheme();

  return (
    <div>
      <NavBar />
      <div className='view-prog-page'>
        <div className='view-prog-page__page-title-container'>
          <h1 className='view-prog-page__page-title'>Program Details</h1>
          <Link
            className={`view-prog-page__title-link ${theme}`}
            to='/programs'
          >
            Back to Programs
          </Link>
        </div>
      </div>
      <div className='view-prog-page__program-list'></div>
      <div className='create-prog-page__button-container'>
        <Button type='button' onClick={console.log('edit program')}>
          Edit
        </Button>
        <Button type='submit' onClick={console.log('delete program')}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProgramDetailsPage;
