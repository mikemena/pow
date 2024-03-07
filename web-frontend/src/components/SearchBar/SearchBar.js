import { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../Inputs/TextInput';

const SearchBarContainer = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default function ExerciseSearch({ exercises = [], onChange }) {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = event => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue); // Call the provided onChange function with the new value
  };
  return (
    <SearchBarContainer>
      <TextInput
        list='exercises'
        id='exercise-search'
        onChange={handleInputChange}
        value={inputValue}
        type='search'
        placeholder='Search Exercise Names'
      />
      <datalist id='exercises'>
        {exercises.map((exercise, index) => (
          <option key={index} value={exercise.name} />
        ))}
      </datalist>
    </SearchBarContainer>
  );
}
