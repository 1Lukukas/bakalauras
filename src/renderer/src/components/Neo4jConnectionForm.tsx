import { useState } from 'react'
import { TextField, Button, Grid, Snackbar, Alert } from '@mui/material'

const Neo4jConnectionForm = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [formValues, setFormValues] = useState({
    databaseName: 'neo4j',
    uri: 'neo4j://localhost:7687',
    username: 'neo4j',
    password: 'password1!'
  })

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const a = await handleConnectToNeo4j(formValues)
    console.log(a)
  }

  const handleConnectToNeo4j = async (dbConfig: {
    uri: string
    username: string
    password: string
  }) => {
    await window.api.connectToNeo4j(dbConfig)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container sx={{ py: 2 }} spacing={2}>
        <Grid item sm={12}>
          <TextField
            fullWidth
            label="URI"
            name="uri"
            value={formValues.uri}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item sm={12}>
          <TextField
            fullWidth
            label="Database Name"
            name="databaseName"
            value={formValues.databaseName}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item sm={12}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formValues.username}
            onChange={handleFormChange}
          />
        </Grid>
        <Grid item sm={12}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleFormChange}
          />
        </Grid>
      </Grid>
      <Button color="primary" type="submit" variant="contained">
        Connect
      </Button>
      <Snackbar
        open={isConnected}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setIsConnected(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Connected to SQL Server!
        </Alert>
      </Snackbar>
    </form>
  )
}

export default Neo4jConnectionForm
