import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { Modal, Box, Typography, TextField, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Paper, useMediaQuery, useTheme } from '@mui/material';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'buyer'
  });
  const [loading, setLoading] = useState(false);

  const { signin, signup } = useAuth();

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    maxWidth: isMobile ? '60%' : 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: { xs: 2, sm: 4 },
    maxHeight: '90vh',
    overflow: 'auto',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      email: '',
      password: '',
      displayName: '',
      role: 'buyer'
    });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.displayName, formData.role);
      toast.success('Account created successfully!');
      navigate('/home');
      handleCloseModal();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signin(formData.email, formData.password);
      sessionStorage.setItem('loginUser', formData.email);
      toast.success('Login successful!');
      navigate('/home');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Drive Your Dreams</h1>
          <p className="hero-subtitle">Premium Car Inventory Management System</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="login-section">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 400, width: '100%' }}>
          <div className="login-logo">
            <div className="logo-icon">🚗</div>
            <div className="logo-text">CIS</div>
            <div className="logo-tagline">Car Inventory System</div>
          </div>

          <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              variant="outlined"
              autoComplete='off'
            />

            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5,
                background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0, #0d47a1)',
                }
              }}
            >
              {loading ? 'Please Wait...' : 'Login to CIS'}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Button variant="text" onClick={handleSignupClick} sx={{ textTransform: 'none' }}>
              Sign Up
            </Button>
          </Typography>
        </Paper>
      </div>

      {/* Signup Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="signup-modal-title"
        aria-describedby="signup-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="signup-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Create Account
          </Typography>
          <form onSubmit={handleSignupSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="displayName"
              label="Full Name"
              autoComplete='off'
              value={formData.displayName}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email Address"
              type="email"
              value={formData?.email}
              onChange={handleInputChange}
               autoComplete='off'
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Role</FormLabel>
              <RadioGroup
                row
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <FormControlLabel 
                  value="buyer" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">👤</Typography>
                      <Typography style={{color:'black'}} variant="body2" fontWeight={500}>Buyer</Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="admin" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">👨‍💼</Typography>
                      <Typography  style={{color:'black'}} variant="body2" fontWeight={500}>Admin</Typography>
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Login;
