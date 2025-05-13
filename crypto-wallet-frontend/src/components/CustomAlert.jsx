import React from 'react';
import { Box, Typography, Button, Alert as MuiAlert, Slide, Snackbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CustomAlert = ({ open, onClose, message, severity, action }) => {
  const theme = useTheme();

  const alertStyles = {
    borderRadius: 8,
    boxShadow: theme.shadows[4],
    backgroundColor: severity === 'success' ? theme.palette.success.light :
                    severity === 'error' ? theme.palette.warning.light :
                    severity === 'warning' ? theme.palette.error.light :
                    theme.palette.info.light,
    color: theme.palette.getContrastText(
      severity === 'success' ? theme.palette.success.light :
      severity === 'error' ? theme.palette.warning.light :
      severity === 'warning' ? theme.palette.error.light :
      theme.palette.info.light
    ),
    padding: theme.spacing(2),
    minWidth: 300,
    '& .MuiAlert-icon': {
      color: severity === 'success' ? theme.palette.success.main :
             severity === 'error' ? theme.palette.warning.main :
             severity === 'warning' ? theme.palette.error.main :
             theme.palette.info.main,
    },
  };

  const buttonStyles = {
    color: theme.palette.getContrastText(
      severity === 'success' ? theme.palette.success.light :
      severity === 'error' ? theme.palette.warning.light :
      severity === 'warning' ? theme.palette.error.light :
      theme.palette.info.light
    ),
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={Slide}
    >
      <MuiAlert
        severity={severity}
        sx={alertStyles}
        action={
          action ? (
            <Button color="inherit" size="small" onClick={action.onClick} sx={buttonStyles}>
              {action.label}
            </Button>
          ) : null
        }
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      </MuiAlert>
    </Snackbar>
  );
};

export default CustomAlert;