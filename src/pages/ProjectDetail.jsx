import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import { projectAPI, endpointAPI } from '../services/api'
import { toast } from 'react-toastify'

function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [endpoints, setEndpoints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjectData()
  }, [id])

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      const [projectRes, endpointsRes] = await Promise.all([
        projectAPI.getById(id),
        endpointAPI.getAllByProject(id)
      ])
      setProject(projectRes.data)
      setEndpoints(endpointsRes.data)
    } catch (error) {
      toast.error('Failed to fetch project data')
      console.error('Fetch project error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEndpoint = async (endpointId) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      try {
        await endpointAPI.delete(endpointId)
        toast.success('Endpoint deleted successfully')
        fetchProjectData()
      } catch (error) {
        toast.error('Failed to delete endpoint')
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

  if (!project) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Project not found</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 2, background: 'rgba(255, 255, 255, 0.95)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {project.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              {project.description || 'No description provided'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/swagger/${id}`)}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f94 100%)',
                }
              }}
            >
              📖 View Swagger Documentation
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/projects/${id}/endpoints/create`)}
            >
              ➕ Add Endpoint
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            📊 Project Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                  {endpoints.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Endpoints
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Created
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                  {project.teamMembers?.length || 1}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Team Members
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2, color: 'white', fontWeight: 'bold' }}>
        🔌 Endpoints ({endpoints.length})
      </Typography>

      {endpoints.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', background: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#667eea' }}>
            No Endpoints Yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            Create your first endpoint to start documenting your API
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(`/projects/${id}/endpoints/create`)}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f94 100%)',
              }
            }}
          >
            ➕ Add Your First Endpoint
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {endpoints.map((endpoint) => (
            <Grid item xs={12} key={endpoint._id}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 2,
                  borderLeft: `4px solid ${
                    endpoint.method === 'GET' ? '#4caf50' :
                    endpoint.method === 'POST' ? '#2196f3' :
                    endpoint.method === 'PUT' ? '#ff9800' : '#f44336'
                  }`
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip 
                        label={endpoint.method} 
                        size="small" 
                        sx={{ 
                          background: endpoint.method === 'GET' ? '#e8f5e9' :
                                     endpoint.method === 'POST' ? '#e3f2fd' :
                                     endpoint.method === 'PUT' ? '#fff3e0' : '#ffebee',
                          color: endpoint.method === 'GET' ? '#2e7d32' :
                                  endpoint.method === 'POST' ? '#1565c0' :
                                  endpoint.method === 'PUT' ? '#e65100' : '#c62828',
                          fontWeight: 'bold',
                          minWidth: 70
                        }} 
                      />
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {endpoint.path}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
                      {endpoint.summary}
                    </Typography>
                    
                    {endpoint.description && (
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        {endpoint.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {endpoint.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          sx={{ background: '#f0f4ff', color: '#667eea' }} 
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate(`/swagger/${id}`)}
                    >
                      View in Docs
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteEndpoint(endpoint._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default ProjectDetail