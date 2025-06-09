import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Email, GitHub, Launch } from '@mui/icons-material';
import { toast } from 'react-toastify';

import Button from '../components/common/Button';
import DefaultAvatar from '../components/common/DefaultAvatar';
import defaultProjectImage from '../assets/images/default-project.png';
import { user, projects } from '../services/api';
import { BASE_URL } from '../config/constants';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
`;

const ProfileImageContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 2rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Name = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const JobTitle = styled.h2`
  font-size: 1.5rem;
  color: #6B7280;
  margin-bottom: 1.5rem;
`;

const Bio = styled.p`
  max-width: 600px;
  margin: 0 auto 2rem;
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled.div`
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #F3F4F6;
  background-image: ${props => props.image ? `url(${props.image})` : `url(${defaultProjectImage})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding: 20px;
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #6B7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ContactButton = styled(Button)`
  margin: 0 auto 4rem;
  display: flex;
`;

const Portfolio = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (filename) => {
    if (!filename) return null;
    const url = `${BASE_URL}/uploads/profile-images/${filename}`;
    console.log('Image URL:', url);
    return url;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse, projectsResponse] = await Promise.all([
          user.getProfile(userId),
          projects.getUserProjects(userId),
        ]);
        setProfile(profileResponse.data);
        setUserProjects(projectsResponse.data);
      } catch (error) {
        toast.error('Failed to load portfolio');
      }
    };

    fetchData();
  }, [userId]);

  const handleContact = () => {
    if (profile?.email) {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <ProfileImageContainer>
          {profile.profileImage && !imageError ? (
            <ProfileImage 
              src={getImageUrl(profile.profileImage)} 
              alt={profile.name}
              onError={(e) => {
                console.error('Error loading image:', e);
                console.log('Image URL was:', getImageUrl(profile.profileImage));
                setImageError(true);
              }}
            />
          ) : (
            <DefaultAvatar name={profile.name} size="large" />
          )}
        </ProfileImageContainer>
        <Name>{profile.name}</Name>
        <JobTitle>{profile.jobTitle}</JobTitle>
        <Bio>{profile.bio}</Bio>
        <ContactButton onClick={handleContact}>
          <Email /> Contact
        </ContactButton>
      </Header>

      <ProjectsGrid>
        {userProjects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectImage image={project.image} />
            <ProjectContent>
              <ProjectTitle>{project.name}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              <ProjectLinks>
                {project.demoUrl && (
                  <ProjectLink href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Launch /> Demo
                  </ProjectLink>
                )}
                {project.repositoryUrl && (
                  <ProjectLink href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    <GitHub /> Code
                  </ProjectLink>
                )}
              </ProjectLinks>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>

      <div style={{ textAlign: 'center', marginTop: '4rem', color: '#6B7280' }}>
        Powered by BlueCyber
      </div>
    </Container>
  );
};

export default Portfolio; 