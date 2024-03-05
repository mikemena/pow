const SelectDropdown = ({ id, options, value, onChange, placeholder }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className='select-dropdown'
    >
      {placeholder && <option value=''>{placeholder}</option>}
      {options.map(option => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectDropdown;
