import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyles from './styles/GlobalStyles';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSettings from './pages/ProfileSettings';
import ProjectSettings from './pages/ProjectSettings';
import AccountSettings from './pages/AccountSettings';
import Portfolio from './pages/Portfolio';

// Theme
const theme = {
  colors: {
    primary: '#6366F1',
    text: '#1F2937',
    background: '#F9FAFB',
    error: '#EF4444',
    success: '#10B981',
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/settings/profile" element={<ProfileSettings />} />
          <Route path="/settings/projects" element={<ProjectSettings />} />
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/portfolio/:userId" element={<Portfolio />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
