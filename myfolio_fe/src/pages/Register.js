import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { auth } from '../services/api';

const Container = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  min-height: 100vh;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  background-color: #6366F1;
  background-image: radial-gradient(circle at bottom left, #6366F1 0%, #4F46E5 100%);
  padding: 3rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -30%;
    width: 140%;
    height: 140%;
    background-image: url("data:image/svg+xml,%3Csvg width='800' height='800' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='400' cy='400' r='300' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='2'/%3E%3Ccircle cx='400' cy='400' r='200' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='2'/%3E%3Ccircle cx='400' cy='400' r='100' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='2'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.15;
    z-index: 0;
    transform: scale(1.2);
  }

  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    position: relative;
    z-index: 1;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    opacity: 0.9;
    max-width: 400px;
    position: relative;
    z-index: 1;
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const RightPanel = styled.div`
  padding: 2rem 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #6366F1;
    border-radius: 50%;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
`;

const Subtitle = styled.p`
  color: #6B7280;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  color: #6B7280;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #E5E7EB;
  }
`;

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await auth.register(values.name, values.email, values.password);
        toast.success(response.data.message || 'Registration successful! Please check your email to verify your account.');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
      }
    },
  });

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
          <Title>Create an account</Title>
          <Subtitle>Start building your professional portfolio today</Subtitle>

          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && formik.errors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && formik.errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && formik.errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            {...formik.getFieldProps('confirmPassword')}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <Button type="submit" fullWidth>
            Create Account
          </Button>

          <div style={{ textAlign: 'center' }}>
            Already have an account? <StyledLink to="/login">Sign in</StyledLink>
          </div>
        </Form>
      </RightPanel>
    </Container>
  );
};

export default Register; 