import { useContext, useState } from 'react'
import { TextField, Button, Grid, Snackbar, Alert } from '@mui/material'
import { MigrationContext } from '@renderer/contexts/MigrationContext'

const SqlConnectionForm = () => {
  const { setEdgeData, setNodeData } = useContext(MigrationContext)
  const [isConnected, setIsConnected] = useState(false)
  const [formValues, setFormValues] = useState({
    host: 'localhost',
    databaseName: 'AdventureWorks',
    username: 'sa',
    password: 'password1!'
  })

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    handleConnectToSql(formValues)
  }

  const handleConnectToSql = async (dbConfig: {
    host: string
    databaseName: string
    username: string
    password: string
  }) => {
    try {
      setIsConnected(true)
      const { nodes, edges } = await window.api.connectToSql(dbConfig)
      setNodeData(nodes)
      setEdgeData(edges)
    } catch (error) {
      console.error('Error connecting to SQL server:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container sx={{ py: 2 }} spacing={2}>
        <Grid item sm={12}>
          <TextField
            fullWidth
            label="Host"
            name="host"
            value={formValues.host}
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

export default SqlConnectionForm
