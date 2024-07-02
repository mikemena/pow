import { useTheme } from '../../contexts/themeContext';
import './TextInput.css';
const TextInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
  ...props
}) => {
  const theme = useTheme();
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`text-input ${className} ${theme}`}
      {...props}
    />
  );
};

export default TextInput;
