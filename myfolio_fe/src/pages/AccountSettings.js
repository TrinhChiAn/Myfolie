import React, { useState } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import SettingsLayout from '../components/layout/SettingsLayout';
import Button from '../components/common/Button';
import { user } from '../services/api';

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

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.375rem;
`;

const ActionButton = styled(Button)`
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const AccountSettings = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await user.changePassword(values);
        toast.success('Password updated successfully');
        formik.resetForm();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update password');
      }
      setLoading(false);
    },
  });

  return (
    <SettingsLayout>
      <Header>
        <Title>Account Settings</Title>
        <Subtitle>Manage your account security settings</Subtitle>
      </Header>

      <Form onSubmit={formik.handleSubmit}>
        <InputWrapper>
          <label htmlFor="currentPassword">Current Password <span style={{ color: '#EF4444' }}>*</span></label>
          <StyledInput
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Enter your current password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.currentPassword && formik.errors.currentPassword}
          />
          {formik.touched.currentPassword && formik.errors.currentPassword && (
            <ErrorMessage>{formik.errors.currentPassword}</ErrorMessage>
          )}
        </InputWrapper>

        <InputWrapper>
          <label htmlFor="newPassword">New Password <span style={{ color: '#EF4444' }}>*</span></label>
          <StyledInput
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter your new password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && formik.errors.newPassword}
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <ErrorMessage>{formik.errors.newPassword}</ErrorMessage>
          )}
        </InputWrapper>

        <InputWrapper>
          <label htmlFor="confirmPassword">Confirm New Password <span style={{ color: '#EF4444' }}>*</span></label>
          <StyledInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your new password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <ErrorMessage>{formik.errors.confirmPassword}</ErrorMessage>
          )}
        </InputWrapper>

        <ActionButton type="submit" disabled={loading || !formik.dirty || !formik.isValid}>
          {loading ? 'Updating Password...' : 'Update Password'}
        </ActionButton>
      </Form>
    </SettingsLayout>
  );
};

export default AccountSettings; 