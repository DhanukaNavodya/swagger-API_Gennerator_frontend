import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { projectAPI } from '../services/api'
import { toast } from 'react-toastify'

function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectAPI.getAll()
      setProjects(response.data)
    } catch (error) {
      toast.error('Failed to fetch projects')
      console.error('Fetch projects error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(projectId)
        toast.success('Project deleted successfully')
        fetchProjects()
      } catch (error) {
        toast.error('Failed to delete project')
      }
    }
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
          📚 My Projects
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/projects/create')}
          sx={{ 
            background: 'white', 
            color: '#667eea',
            '&:hover': { background: '#f0f4ff' },
            fontWeight: 'bold'
          }}
        >
          ➕ Create New Project
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 2,
          textAlign: 'center',
          py: 6
        }}>
          <Typography variant="h5" sx={{ mb: 2, color: '#667eea' }}>
            No Projects Yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            Create your first project to start managing API endpoints
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/projects/create')}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            Create Your First Project
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {project.name}
                    </Typography>
                    <Box>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/swagger/${project._id}`)}
                        sx={{ color: '#667eea', mr: 1 }}
                      >
                        📖 View Docs
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => handleDelete(project._id)}
                        sx={{ color: '#d32f2f' }}
                      >
                        🗑️ Delete
                      </Button>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {project.description || 'No description'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => navigate(`/projects/${project._id}`)}
                      sx={{ 
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': { 
                          background: '#f0f4ff',
                          borderColor: '#667eea'
                        }
                      }}
                    >
                      View Details →
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default Dashboard