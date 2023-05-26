import { Box } from '@mui/material'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      aria-labelledby={`simple-tab-${index}`}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      role="tabpanel"
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <>{children}</>
        </Box>
      )}
    </div>
  )
}

export default TabPanel
