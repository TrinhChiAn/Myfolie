import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { CloudUpload, Delete, Person, Launch } from '@mui/icons-material';

import SettingsLayout from '../components/layout/SettingsLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { user } from '../services/api';
import { BASE_URL } from '../config/constants';
import DefaultAvatar from '../components/common/DefaultAvatar';

const Form = styled.form`
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.75rem;
`;

const Subtitle = styled.p`
  color: #6B7280;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const ImageUploadSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  padding: 2rem;
  background-color: #F8FAFC;
  border-radius: 0.75rem;
  border: 1px dashed #E2E8F0;
`;

const ImagePreviewContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageUploadInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.95rem;
    color: #6B7280;
    margin-bottom: 1.25rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const FormSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputWrapper = styled.div`
  label {
    display: block;
    font-size: 0.95rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 1rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease-in-out;
  min-height: 150px;
  resize: vertical;

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

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.375rem;
`;

const ActionButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ViewPortfolioButton = styled(Button)`
  margin-bottom: 1.5rem;
  background-color: #10B981;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  
  &:hover {
    background-color: #059669;
  }
`;

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required'),
  jobTitle: Yup.string()
    .nullable(),
  bio: Yup.string()
    .nullable(),
});

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    bio: '',
  });
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
        const [profileRes, userIdRes] = await Promise.all([
          user.getProfile('me'),
          user.getCurrentUserId()
        ]);
        
        console.log('Profile response:', profileRes.data);
        
        const profileData = {
          name: profileRes.data.name || '',
          email: profileRes.data.email || '',
          jobTitle: profileRes.data.jobTitle || '',
          bio: profileRes.data.bio || '',
        };
        
        setFormData(profileData);
        formik.setValues(profileData);
        
        setUserId(userIdRes.data.id);
        const imageUrl = profileRes.data.profileImage ? getImageUrl(profileRes.data.profileImage) : null;
        console.log('Setting profile image URL:', imageUrl);
        setProfileImage(imageUrl);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      jobTitle: '',
      bio: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await user.updateProfile(values);
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
      }

      setLoading(false);
    },
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    try {
      console.log('Uploading image:', file);
      const response = await user.updateProfileImage(file);
      console.log('Upload response:', response);
      setProfileImage(getImageUrl(response.data.profileImage));
      toast.success('Profile image updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleImageDelete = async () => {
    try {
      await user.updateProfileImage(null);
      setProfileImage(null);
      toast.success('Profile image removed successfully!');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleViewPortfolio = () => {
    if (userId) {
      navigate(`/portfolio/${userId}`);
    }
  };

  return (
    <SettingsLayout>
      <Header>
        <Title>Profile Settings</Title>
        <Subtitle>Customize your profile information and appearance</Subtitle>
      </Header>

      {userId && (
        <ViewPortfolioButton onClick={handleViewPortfolio}>
          <Launch /> View My Portfolio
        </ViewPortfolioButton>
      )}

      <Form onSubmit={formik.handleSubmit}>
        <ImageUploadSection>
          <ImagePreviewContainer>
            {profileImage && !imageError ? (
              <ProfileImage 
                src={profileImage} 
                alt="Profile" 
                onError={(e) => {
                  console.error('Error loading image:', e);
                  console.log('Image URL was:', profileImage);
                  setImageError(true);
                }}
              />
            ) : (
              <DefaultAvatar name={formData.name} />
            )}
          </ImagePreviewContainer>
          <ImageUploadInfo>
            <h3>Profile Photo</h3>
            <p>Upload a professional photo to make your profile stand out</p>
            <ButtonGroup>
              <ActionButton as="label" variant="outline">
                <CloudUpload /> Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </ActionButton>
              {profileImage && (
                <ActionButton variant="outline" onClick={handleImageDelete}>
                  <Delete /> Remove
                </ActionButton>
              )}
            </ButtonGroup>
          </ImageUploadInfo>
        </ImageUploadSection>

        <FormSection>
          <InputWrapper>
            <label htmlFor="name">Full Name <span style={{ color: '#EF4444' }}>*</span></label>
            <StyledInput
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />
            {formik.touched.name && formik.errors.name && (
              <ErrorMessage>{formik.errors.name}</ErrorMessage>
            )}
          </InputWrapper>

          <InputWrapper>
            <label htmlFor="jobTitle">Job Title <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>(Optional)</span></label>
            <StyledInput
              id="jobTitle"
              name="jobTitle"
              type="text"
              placeholder="e.g. Frontend Developer"
              value={formik.values.jobTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </InputWrapper>
        </FormSection>

        <InputWrapper>
          <label htmlFor="bio">Professional Bio <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>(Optional)</span></label>
          <TextArea
            id="bio"
            name="bio"
            value={formik.values.bio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Write a compelling introduction about yourself..."
          />
        </InputWrapper>

        <ActionButton type="submit" disabled={loading || !formik.dirty || !formik.isValid}>
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </ActionButton>
      </Form>
    </SettingsLayout>
  );
};

export default ProfileSettings; 