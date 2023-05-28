import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

interface CustomSnackbarProps {
  open: boolean
  message: string
  alertType: 'success' | 'info' | 'warning' | 'error'
  handleClose: () => void
}

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const AlertSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  alertType,
  handleClose
}) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <div>
        <Alert onClose={handleClose} severity={alertType}>
          {message}
        </Alert>
      </div>
    </Snackbar>
  )
}

export default AlertSnackbar
