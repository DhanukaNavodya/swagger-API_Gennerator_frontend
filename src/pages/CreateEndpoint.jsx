import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material'
import { endpointAPI, projectAPI } from '../services/api'
import { toast } from 'react-toastify'

function CreateEndpoint() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const [formData, setFormData] = useState({
    path: '',
    method: 'GET',
    summary: '',
    description: '',
    tags: [],
    parameters: [],
    requestBody: null,
    responses: new Map([['200', { description: 'Successful response' }]]),
    security: ['bearerAuth'],
    deprecated: false
  })

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await projectAPI.getById(projectId)
      setProject(response.data)
    } catch (error) {
      toast.error('Failed to fetch project')
    }
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleTagDelete = (tagToDelete) => () => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToDelete)
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await endpointAPI.create({
        projectId,
        ...formData
      })
      toast.success('Endpoint created successfully! 🎉')
      navigate(`/projects/${projectId}`)
    } catch (error) {
      toast.error('Failed to create endpoint')
      console.error('Create endpoint error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!project) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Typography sx={{ color: 'white' }}>Loading...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'rgba(255, 255, 255, 0.95)' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
          ➕ Add Endpoint to "{project.name}"
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
          Create a new API endpoint for your project
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>HTTP Method</InputLabel>
                <Select
                  name="method"
                  value={formData.method}
                  label="HTTP Method"
                  onChange={handleChange}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Path"
                name="path"
                value={formData.path}
                onChange={handleChange}
                required
                placeholder="/api/users/{id}"
                helperText="Must start with /"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                placeholder="Get user by ID"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of what this endpoint does..."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={handleTagDelete(tag)}
                    color="primary"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag (e.g., users, auth)"
                  onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                  sx={{ flex: 1 }}
                />
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleTagAdd}
                >
                  Add
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="deprecated"
                    checked={formData.deprecated}
                    onChange={handleChange}
                    color="warning"
                  />
                }
                label="Mark as Deprecated"
              />
            </Grid>

            <Grid item xs={12}>
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
                  {loading ? 'Creating...' : 'Create Endpoint'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/projects/${projectId}`)}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default CreateEndpoint