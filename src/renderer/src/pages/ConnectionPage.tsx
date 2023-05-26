import { Paper, Grid, Button } from '@mui/material'
import Neo4jConnectionForm from '@renderer/components/Neo4jConnectionForm'
import SqlConnectionForm from '@renderer/components/SqlConnectionForm'
import { useNavigate } from 'react-router-dom'

function ConnectionPage(): JSX.Element {
  const navigate = useNavigate()

  const handleStartTransformation = () => {
    navigate('/transformation')
  }

  return (
    <Grid container sx={{ height: '100vh' }} spacing={2}>
      <Grid item xs={6}>
        <Paper sx={{ p: 2, m: 2 }}>
          <h1>SQL Server Connection</h1>
          <SqlConnectionForm />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper sx={{ p: 2, m: 2, justifyContent: 'center', alignItems: 'center' }}>
          <h1>Neo4j Connection</h1>
          <Neo4jConnectionForm />
        </Paper>
      </Grid>
      <Grid item container xs={12}>
        <Paper
          sx={{
            p: 2,
            mx: 2,
            justifyContent: 'right',
            display: 'flex',
            height: 'fit-content',
            width: '100vw',
            alignSelf: 'flex-end'
          }}
        >
          <Button variant="contained" onClick={handleStartTransformation}>
            Start Transformation
          </Button>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default ConnectionPage
