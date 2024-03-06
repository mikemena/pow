import styled from 'styled-components';

const StyledButton = styled.button`
  margin: 20px;
  color: var(--dark-text-color);
  font-family: courier, monospace;
  background-color: ${props => props.bgColor || 'rgb(198, 255, 53)'};
  transform: skew(-20deg);
  width: 160px;
  font-size: 1em;
  font-weight: 500;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & > * {
    transform: skew(20deg);
  }

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: var(--dark-background);
    transition: width 0.4s ease;
    position: absolute;
    left: 0;
    bottom: -2px;
  }
`;

const Button = ({ id, onClick, children, bgColor }) => (
  <StyledButton id={id} onClick={onClick} bgColor={bgColor}>
    {children}
  </StyledButton>
);

export default Button;
