import { useState } from 'react'
import { TextField, Button, Grid } from '@mui/material'
import AlertSnackbar from './AlertSnackbar'

const SqlConnectionForm = () => {
  const [snackbarData, setSnackbarData] = useState<{
    message: string
    alertType: 'success' | 'info' | 'warning' | 'error'
  } | null>(null)
  const [open, setOpen] = useState(false)
  const [formValues, setFormValues] = useState({
    host: 'localhost',
    databaseName: 'AdventureWorks',
    username: 'sa',
    password: 'password1!'
  })

  const handleOpenSnackbar = () => {
    setOpen(true)
  }

  const handleCloseSnackbar = () => {
    setOpen(false)
  }

  const showSnackbar = (message: string, alertType: 'success' | 'info' | 'warning' | 'error') => {
    setSnackbarData({ message, alertType })
    handleOpenSnackbar()
  }

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
      await window.api.connectToSql(dbConfig)
      showSnackbar(`Successfully connected SQL Server database!`, 'success')
    } catch (error) {
      if (error instanceof Error) showSnackbar(error.message, 'error')
      else showSnackbar('Error connecting to SQL Server database', 'error')
    }
  }

  return (
    <>
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
      </form>
      {snackbarData && (
        <AlertSnackbar
          open={open}
          message={snackbarData.message}
          alertType={snackbarData.alertType}
          handleClose={handleCloseSnackbar}
        />
      )}
    </>
  )
}

export default SqlConnectionForm
