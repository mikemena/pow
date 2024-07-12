import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { IoChevronBackOutline } from 'react-icons/io5';

import Button from '../../../components/Inputs/Button';
import NavBar from '../../../components/Nav/Nav';
import { useTheme } from '../../../contexts/themeContext';

import './program.css';

const ProgramDetailsPage = () => {
  const { program_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        console.log(`Fetching program details for ID: ${program_id}`);
        const response = await fetch(
          `http://localhost:9025/api/programs/${program_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Program details fetched:', data);
      } catch (err) {
        console.error('Error fetching program details:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [program_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <NavBar />
      <div className='prog-details-page'>
        <div className='prog-details-page__header'>
          <Link
            className={`prog-details-page__title-link ${theme}`}
            to='/programs'
          >
            <IoChevronBackOutline className='prog-details-page__back-icon' />
            <span className='prog-details-page__back-text'>Back</span>
          </Link>
          <div className={`prog-details-page__program ${theme}`}>
            <h2 className='prog-details-page__program-title'>Edit Program</h2>
          </div>
        </div>
        <div className='prog-details-page__button-container'>
          <Button type='button' onClick={console.log('add workout')}>
            Add Workout
          </Button>
          <Button type='submit' onClick={console.log('save')}>
            Save
          </Button>
          <Button type='submit' onClick={console.log('cancel')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailsPage;
