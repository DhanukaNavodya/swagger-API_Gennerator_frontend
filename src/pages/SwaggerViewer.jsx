import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Button,
  CircularProgress,
  Alert
} from '@mui/material'
import { projectAPI } from '../services/api'
import { toast } from 'react-toastify'

function SwaggerViewer() {
  const { projectId } = useParams()
  const [swaggerSpec, setSwaggerSpec] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    loadSwaggerSpec()
  }, [projectId])

  const loadSwaggerSpec = async () => {
    try {
      setLoading(true)
      const response = await projectAPI.generateSwagger(projectId)
      setSwaggerSpec(response.data)
      setProjectName(response.data.info.title)
    } catch (error) {
      toast.error('Failed to load Swagger specification')
      console.error('Load swagger error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography sx={{ color: 'white' }}>Loading Swagger Documentation...</Typography>
        </Box>
      </Container>
    )
  }

  if (!swaggerSpec) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', background: 'rgba(255, 255, 255, 0.95)' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load Swagger specification
          </Alert>
          <Button onClick={loadSwaggerSpec} variant="contained">
            Retry
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="false" sx={{ mt: 2, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2, background: 'rgba(255, 255, 255, 0.95)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {projectName}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Interactive API Documentation
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => window.open(`${window.location.origin}/api-docs/${projectId}`, '_blank')}
          >
            🌐 Open in New Tab
          </Button>
        </Box>
      </Paper>
      
      <div style={{ background: 'white', borderRadius: '8px', padding: '20px' }}>
        <SwaggerUI spec={swaggerSpec} />
      </div>
    </Container>
  )
}

export default SwaggerViewer