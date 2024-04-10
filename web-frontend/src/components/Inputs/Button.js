import styled from 'styled-components';

const StyledButton = styled.button`
  margin: 20px;
  color: var(--white);
  font-family: courier, monospace;
  background-color: ${props => props.bgColor || 'rgb(249, 156, 87)'};
  width: 160px;
  font-size: ${props => props.fontSize || '1em'};
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Button = ({
  id,
  type = 'button',
  onClick,
  children,
  bgColor,
  fontSize
}) => (
  <StyledButton
    id={id}
    type={type}
    onClick={onClick}
    bgColor={bgColor}
    fontSize={fontSize}
  >
    {children}
  </StyledButton>
);

export default Button;
