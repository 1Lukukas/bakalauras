import { useEffect, useRef, useState } from 'react'
import { Box, Grid, Paper } from '@mui/material'
import Log from '@renderer/components/Log'
import { useNavigate } from 'react-router-dom'

function MigrationPage(): JSX.Element {
  const [migrationLog, setMigrationLog] = useState<string[]>([])
  const [migrationCompleted, setMigrationCompleted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleMigration = async () => {
    await window.api.createNodes()
    await window.api.createRelationships()
    setMigrationCompleted(true)
  }

  useEffect(() => {
    handleMigration()
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [migrationLog])

  window.api.onLogReceived((log: string) => {
    setMigrationLog([...migrationLog, log])
  })

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, m: 2 }}>
            <h1>{migrationCompleted ? 'Migration complete' : 'Migration in progress...'}</h1>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, m: 2 }}>
            <Box sx={{ backgroundColor: '#ECECEC', height: '70vh' }}>
              <div style={{ height: '100%', overflow: 'auto' }}>
                <Log items={migrationLog} />
                <div ref={messagesEndRef} />
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default MigrationPage
