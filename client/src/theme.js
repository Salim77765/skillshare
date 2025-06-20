import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // Modern blue
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6', // Purple
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Green
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444', // Red
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b', // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#0ea5e9', // Sky blue
      light: '#38bdf8',
      dark: '#0284c7',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // Slate 800
      secondary: '#64748b', // Slate 500
      disabled: '#94a3b8', // Slate 400
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 2px 2px -2px rgba(0, 0, 0, 0.25), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 3px 4px -2px rgba(0, 0, 0, 0.25), 0 1px 8px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 3px 4px -2px rgba(0, 0, 0, 0.25), 0 3px 8px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 4px 6px -2px rgba(0, 0, 0, 0.25), 0 2px 12px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 4px 6px -2px rgba(0, 0, 0, 0.25), 0 6px 16px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 4px 8px -2px rgba(0, 0, 0, 0.25), 0 6px 20px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 5px 8px -2px rgba(0, 0, 0, 0.25), 0 8px 24px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 6px 12px -4px rgba(0, 0, 0, 0.25), 0 12px 28px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 7px 12px -4px rgba(0, 0, 0, 0.25), 0 12px 32px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 8px 14px -4px rgba(0, 0, 0, 0.25), 0 14px 44px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 8px 16px -4px rgba(0, 0, 0, 0.25), 0 16px 48px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 9px 18px -4px rgba(0, 0, 0, 0.25), 0 18px 52px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 10px 20px -4px rgba(0, 0, 0, 0.25), 0 20px 56px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 10px 20px -4px rgba(0, 0, 0, 0.25), 0 20px 60px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 12px 22px -4px rgba(0, 0, 0, 0.25), 0 22px 64px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 12px 24px -4px rgba(0, 0, 0, 0.25), 0 24px 70px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 14px 26px -6px rgba(0, 0, 0, 0.25), 0 26px 80px 0 rgba(0, 0, 0, 0.2)',
    '0 0 1px 0 rgba(0, 0, 0, 0.31), 0 14px 28px -6px rgba(0, 0, 0, 0.25), 0 32px 90px 0 rgba(0, 0, 0, 0.2)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

export default theme;
