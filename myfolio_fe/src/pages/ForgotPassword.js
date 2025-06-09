import React from 'react';
import { Link } from 'react-router-dom';
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

const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
});

const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await auth.forgotPassword(values.email);
        toast.success('Password reset instructions sent to your email!');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to send reset instructions');
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
          <Title>Forgot password</Title>
          <Subtitle>We'll email you instructions to reset your password</Subtitle>

          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && formik.errors.email}
          />

          <Button type="submit" fullWidth>
            Reset Password
          </Button>

          <div style={{ textAlign: 'center' }}>
            <StyledLink to="/login">Back to login</StyledLink>
          </div>
        </Form>
      </RightPanel>
    </Container>
  );
};

export default ForgotPassword; 