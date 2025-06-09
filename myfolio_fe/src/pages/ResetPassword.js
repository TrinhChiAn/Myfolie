import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { auth } from '../services/api';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  background-color: ${props => props.theme.colors.primary};
  padding: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const RightPanel = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  color: #6B7280;
  margin-bottom: 2rem;
`;

const PasswordRequirements = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #6B7280;
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.met ? props.theme.colors.success : '#E5E7EB'};
  }
`;

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase character')
    .matches(/[A-Z]/, 'Must contain at least one uppercase character')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[^a-zA-Z0-9]/, 'Must contain at least one special character')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await auth.resetPassword(token, values.password);
        toast.success('Password reset successful!');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      }
    },
  });

  const password = formik.values.password;
  const requirements = [
    { label: 'one lowercase character', met: /[a-z]/.test(password) },
    { label: 'one special character', met: /[^a-zA-Z0-9]/.test(password) },
    { label: 'one uppercase character', met: /[A-Z]/.test(password) },
    { label: '8 character minimum', met: password.length >= 8 },
    { label: 'one number', met: /[0-9]/.test(password) },
  ];

  if (!token) {
    return (
      <Container>
        <RightPanel>
          <Title>Invalid Reset Link</Title>
          <Subtitle>The password reset link is invalid or has expired.</Subtitle>
          <Button onClick={() => navigate('/forgot-password')} fullWidth>
            Request New Reset Link
          </Button>
        </RightPanel>
      </Container>
    );
  }

  return (
    <Container>
      <LeftPanel>
        <h2>Easy Portfolio for Developer</h2>
        <p>
          As a web developer, having a portfolio is essential for showcasing your technical skills and attracting potential clients. A portfolio is a museum of your work, with past tech stacks, case studies, and your work history.
        </p>
      </LeftPanel>
      <RightPanel>
        <Form onSubmit={formik.handleSubmit}>
          <Logo>
            BlueCyber
          </Logo>
          <Title>Choose new password</Title>
          <Subtitle>Enter your new password and you're all set.</Subtitle>

          <Input
            label="Password"
            type="password"
            placeholder="Enter a password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && formik.errors.password}
          />

          <PasswordRequirements>
            {requirements.map((req, index) => (
              <Requirement key={index} met={req.met}>
                {req.label}
              </Requirement>
            ))}
          </PasswordRequirements>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            {...formik.getFieldProps('confirmPassword')}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <Button type="submit" fullWidth>
            Reset Password
          </Button>
        </Form>
      </RightPanel>
    </Container>
  );
};

export default ResetPassword; 