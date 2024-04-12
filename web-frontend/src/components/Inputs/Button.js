import './Button.css';
import { useTheme } from '../../contexts/themeContext';

const Button = ({ id, type = 'button', onClick, children, fontSize }) => {
  const { theme } = useTheme();
  return (
    <div id={id} type={type} onClick={onClick} fontSize={fontSize}>
      <div className={`btn ${theme}`}>
        <span>{children}</span>
      </div>
    </div>
  );
};

export default Button;
