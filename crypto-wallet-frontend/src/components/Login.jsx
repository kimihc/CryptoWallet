import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { Box, TextField, Button, Typography, Alert, Container, CssBaseline, Avatar, IconButton, Menu, MenuItem, InputAdornment, IconButton as MuiIconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TranslateIcon from '@mui/icons-material/Translate';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { deepPurple } from '@mui/material/colors';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);
  const { theme: themeMode, toggleTheme } = useContext(ThemeContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/signIn', {
        login,
        password,
      });
      const userData = {
        login,
        token: response.data.token,
        role: response.data.role || 'User',
      };
      authLogin(userData);
      navigate(userData.role === 'Employee' ? '/employee' : '/');
    } catch (err) {
      setError(language === 'ru' ? 'Неверные данные для входа' : 'Invalid login credentials');
    }
  };

  const handleLanguageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = (lang) => {
    if (lang) toggleLanguage(lang);
    setAnchorEl(null);
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const texts = {
    ru: {
      welcome: "С возвращением",
      description: "Введите данные аккаунта",
      loginLabel: "Логин",
      passwordLabel: "Пароль",
      forgotPassword: "Забыли пароль?",
      loginButton: "Войти",
      noAccount: "Нет аккаунта?",
      registerLink: "Зарегистрироваться",
      selectLanguage: "Выберите язык"
    },
    en: {
      welcome: "Welcome back!",
      description: "Enter your account details",
      loginLabel: "Login",
      passwordLabel: "Password",
      forgotPassword: "Forgot your password?",
      loginButton: "Log In",
      noAccount: "Don't have an account?",
      registerLink: "Register here",
      selectLanguage: "Select language"
    }
  };

  const theme = createTheme({
    palette: {
      mode: themeMode === 'dark' ? 'dark' : 'light',
      primary: {
        main: deepPurple[500],
      },
      secondary: {
        main: '#F7931A',
      },
      background: {
        default: themeMode === 'dark' ? '#121212' : '#fff',
        paper: themeMode === 'dark' ? '#1e1e1e' : '#f5f5f5',
      },
    },
    typography: {
      h5: {
        fontWeight: 600,
        letterSpacing: 0.5,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            padding: 4,
            borderRadius: 2,
            boxShadow: themeMode === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 3 }}>
            <IconButton onClick={toggleTheme} color="inherit">
              <Brightness4Icon />
            </IconButton>
            <IconButton onClick={handleLanguageClick} color="inherit">
              <TranslateIcon />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleLanguageClose(null)}
          >
            <MenuItem onClick={() => handleLanguageClose('ru')}>Русский</MenuItem>
            <MenuItem onClick={() => handleLanguageClose('en')}>English</MenuItem>
          </Menu>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} onClick={() => navigate('/')}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {texts[language].welcome}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {texts[language].description}
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label={texts[language].loginLabel}
              name="login"
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoFocus
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 },
              }}
              InputLabelProps={{
                required: false,
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={texts[language].passwordLabel}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 },
                endAdornment: (
                  <InputAdornment position="end">
                    <MuiIconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </MuiIconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                required: false,
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  {texts[language].forgotPassword}
                </Typography>
              </Link>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2, py: 1.5, borderRadius: 2 }}
            >
              {texts[language].loginButton}
            </Button>
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              {texts[language].noAccount}{' '}
              <Link to="/register" style={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                {texts[language].registerLink}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;