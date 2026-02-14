import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/dashboard"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            📚 Swagger Manager
          </Typography>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography sx={{ color: 'white' }}>
                👋 {user?.username || 'User'}
              </Typography>
              <Button 
                color="inherit" 
                onClick={() => navigate('/projects/create')}
              >
                ➕ New Project
              </Button>
              <Button 
                color="inherit" 
                onClick={handleLogout}
              >
                🔐 Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/register"
                sx={{ 
                  background: 'white', 
                  color: '#667eea',
                  '&:hover': { background: '#f0f4ff' }
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar