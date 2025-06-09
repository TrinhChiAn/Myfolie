import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: ${props => props.variant === 'outlined' ? 'transparent' : props.theme.colors.primary};
  color: ${props => props.variant === 'outlined' ? props.theme.colors.primary : 'white'};
  border: 2px solid ${props => props.theme.colors.primary};
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.variant === 'outlined' ? props.theme.colors.primary + '10' : props.theme.colors.primary + 'dd'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Button = ({ fullWidth, ...props }) => {
  return <StyledButton $fullWidth={fullWidth} {...props} />;
};

export default Button; 