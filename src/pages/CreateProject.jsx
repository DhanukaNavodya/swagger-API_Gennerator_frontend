import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box 
} from '@mui/material'
import { projectAPI } from '../services/api'
import { toast } from 'react-toastify'

function CreateProject() {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await projectAPI.create(formData)
      toast.success('Project created successfully! 🎉')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to create project')
      console.error('Create project error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'rgba(255, 255, 255, 0.95)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          ➕ Create New Project
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            margin="normal"
            placeholder="e.g., User Management API"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            margin="normal"
            placeholder="Describe your project..."
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f94 100%)',
                }
              }}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default CreateProject