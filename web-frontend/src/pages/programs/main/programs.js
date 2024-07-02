import React, { useState, useMemo } from 'react';
import useFetchData from '../../../hooks/useFetchData';
import TextInput from '../../../components/Inputs/TextInput';
import { BsChevronCompactUp, BsChevronCompactDown } from 'react-icons/bs';
import NavBar from '../../../components/Nav/Nav';
import { useTheme } from '../../../contexts/themeContext';
import { DURATION_TYPES, GOAL_TYPES } from '../../../utils/constants';

import './programs.css';

const ProgramPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedMainGoal, setSelectedMainGoal] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedDurationUnit, setSelectedDurationUnit] = useState('');
  const [selectedDaysPerWeek, setSelectedDaysPerWeek] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const { theme } = useTheme();

  const handleInputChange = event => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const {
    data: programs,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/programs/2');

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesMainGoal =
        !selectedMainGoal ||
        selectedMainGoal === 'All' ||
        program.main_goal === selectedMainGoal;
      const matchesDuration =
        !selectedDuration ||
        selectedDuration === 'All' ||
        (program.program_duration === parseInt(selectedDuration) &&
          (!selectedDurationUnit ||
            program.duration_unit === selectedDurationUnit));
      const matchesDaysPerWeek =
        !selectedDaysPerWeek ||
        selectedDaysPerWeek === 'All' ||
        program.days_per_week === parseInt(selectedDaysPerWeek);
      const matchesSearchTerm =
        !searchTerm ||
        program.name.toLowerCase().includes(searchTerm.toLowerCase());
      return (
        matchesMainGoal &&
        matchesDuration &&
        matchesDaysPerWeek &&
        matchesSearchTerm
      );
    });
  }, [
    searchTerm,
    selectedMainGoal,
    selectedDuration,
    selectedDurationUnit,
    selectedDaysPerWeek,
    programs
  ]);

  const onGoalChange = event => {
    setSelectedMainGoal(event.target.value);
  };

  const onDurationChange = event => {
    setSelectedDuration(event.target.value);
  };

  const onDurationUnitChange = event => {
    setSelectedDurationUnit(event.target.value);
  };

  const onDaysPerWeekChange = event => {
    setSelectedDaysPerWeek(event.target.value);
  };

  console.log('programs from programs page:', programs);
  if (isLoading) return <div>loading...</div>;
  if (error) return <div>Error loading programs: {error}</div>;

  return (
    <div>
      <NavBar />
      <div className='view-prog-page'>
        <h1 className='view-prog-page__page-title'>My Programs</h1>

        <div className={`view-prog-page__search-container ${theme}`}>
          <div className='view-prog-page__search-expand-container'>
            <button
              className='view-prog-page__search-expand-btn'
              onClick={handleExpand}
            >
              {isExpanded ? (
                <BsChevronCompactUp
                  className={`workout__icon ${theme}`}
                  size={30}
                />
              ) : (
                <BsChevronCompactDown
                  className={`workout__icon ${theme}`}
                  size={30}
                />
              )}
            </button>
            {!isExpanded && (
              <p className={`view-prog-page__search-filer-text ${theme}`}>
                Filter
              </p>
            )}
          </div>

          {isExpanded && (
            <div className='view-prog-page__search-inputs'>
              <div className={`view-prog-page__search-input-top-row ${theme}`}>
                <TextInput
                  list='programs'
                  className={`program-search__search-text-input ${theme}`}
                  id='program-search-bar'
                  onChange={handleInputChange}
                  value={inputValue}
                  type='search'
                  placeholder='Program Names'
                />
                <datalist id='programs'>
                  {programs.map((program, index) => (
                    <option key={index} value={program.name} />
                  ))}
                </datalist>
                <select
                  onChange={onGoalChange}
                  className={`program-search__goals ${theme}`}
                >
                  <option value=''>Goal</option>
                  {GOAL_TYPES.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`view-prog-page__search-input-bottom-row ${theme}`}
              >
                <TextInput
                  className={`program-search__duration ${theme}`}
                  type='search'
                  onChange={onDurationChange}
                  onBlur={onDurationChange}
                  placeholder='Duration'
                />
                <select
                  onChange={onDurationUnitChange}
                  className={`program-search__duration-unit ${theme}`}
                >
                  <option value=''>Duration Type</option>
                  {DURATION_TYPES.map((option, index) => (
                    <option key={index} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <TextInput
                  className={`program-search__days-per-week ${theme}`}
                  type='search'
                  onChange={onDaysPerWeekChange}
                  onBlur={onDaysPerWeekChange}
                  placeholder='Days Per Week'
                />
              </div>

              <div
                className={`view-prog-page__search-input-container ${theme}`}
              ></div>
            </div>
          )}
        </div>
      </div>
      <div className='view-prog-page__program-list'>
        {filteredPrograms.map(program => (
          <div key={program.id} className={`view-prog-page__program ${theme}`}>
            <h2 className='view-prog-page__program-title'>{program.name}</h2>
            <div className='view-prog-page__program-details'>
              <div className='view-prog-page__program-details-section'>
                <p className='view-prog-page__program-details-label'>
                  Main Goal
                </p>
                <p className='view-prog-page__program-details-value'>
                  {program.main_goal}
                </p>
              </div>
              <div className='view-prog-page__program-details-section'>
                <p className='view-prog-page__program-details-label'>
                  Duration
                </p>
                <p className='view-prog-page__program-details-value'>
                  {program.program_duration} {program.duration_unit}
                </p>
              </div>
              <div className='view-prog-page__program-details-section'>
                <p className='view-prog-page__program-details-label'>
                  Days Per Week
                </p>
                <p className='view-prog-page__program-details-value'>
                  {program.days_per_week}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramPage;
