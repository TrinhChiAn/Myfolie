import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: #9CA3AF;
  }

  ${props => props.error && `
    border-color: ${props.theme.colors.error};
    &:focus {
      border-color: ${props.theme.colors.error};
      box-shadow: 0 0 0 2px ${props.theme.colors.error}20;
    }
  `}
`;

const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 14px;
`;

const Input = ({ label, error, ...props }) => {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <StyledInput error={error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
};

export default Input; 