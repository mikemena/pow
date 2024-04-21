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
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`text-input ${className}`}
      {...props}
    />
  );
};

export default TextInput;
