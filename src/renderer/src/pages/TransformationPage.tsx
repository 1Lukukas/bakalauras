import { Button, Grid, Paper } from '@mui/material'
import Graph from '@renderer/components/Graph'
import Menu from '@renderer/components/Menu'
import { MigrationContext } from '@renderer/contexts/MigrationContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TransformationPage = () => {
  const { setEdgeData, setNodeData } = useContext(MigrationContext)
  const navigate = useNavigate()
  const { nodeData } = useContext(MigrationContext)

  const handleStartMigration = () => {
    navigate('/migration')
  }

  const getSchema = async () => {
    const { nodes, edges } = await window.api.getSchema()
    setNodeData(nodes)
    setEdgeData(edges)
  }

  useEffect(() => {
    getSchema()
  }, [])
  
  return (
    <>
      {nodeData.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <Menu />
          </Grid>
          <Grid item xs={7}>
            <Graph />
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
              <Button variant="contained" onClick={handleStartMigration}>
                Start Migration
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default TransformationPage
