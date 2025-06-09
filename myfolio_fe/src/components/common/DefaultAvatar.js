import React from 'react';
import styled from 'styled-components';

const AvatarContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #6366F1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.size === 'large' ? '3rem' : '2rem'};
  font-weight: 600;
`;

const DefaultAvatar = ({ name = '', size = 'medium' }) => {
  // Get initials from name (up to 2 characters)
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <AvatarContainer size={size}>
      {initials || '?'}
    </AvatarContainer>
  );
};

export default DefaultAvatar; 