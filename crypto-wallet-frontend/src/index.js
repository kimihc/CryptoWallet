import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <CssBaseline />
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);