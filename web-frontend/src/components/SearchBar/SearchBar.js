import { useState } from 'react';
import TextInput from '../Inputs/TextInput';
import { useTheme } from '../../contexts/themeContext';
import './SearchBar.css';

export default function ExerciseSearch({
  exercises = [],
  onChange,
  searchStyle
}) {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = event => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const { theme } = useTheme();

  return (
    <div className='search-bar-container'>
      <TextInput
        list='exercises'
        className={`search-bar-container__input ${theme}`}
        id='exercise-search-bar'
        onChange={handleInputChange}
        value={inputValue}
        type='search'
        placeholder='Search Exercise Names'
        style={searchStyle}
      />
      <datalist id='exercises'>
        {exercises.map((exercise, index) => (
          <option key={index} value={exercise.name} />
        ))}
      </datalist>
    </div>
  );
}
