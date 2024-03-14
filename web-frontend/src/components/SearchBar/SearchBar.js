import { useState } from 'react';
import TextInput from '../Inputs/TextInput';
import styled from 'styled-components';

const SearchBarContainer = styled.div`
  display: flex;
  width: 600px;
  padding: 0 0 0 10px;
`;

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
  return (
    <SearchBarContainer>
      <TextInput
        list='exercises'
        className='search-bar-container__input'
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
    </SearchBarContainer>
  );
}
