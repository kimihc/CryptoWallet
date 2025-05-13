import logo from './logo.svg';
import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeContext } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import insurance1 from './assets/insurance1.svg';
import wallet1 from './assets/wallet1.svg';
import profit1 from './assets/profit1.svg';
import { CssBaseline, Box, Typography } from '@mui/material';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CryptoDashboard from './components/Dashboard';
import Profile from './components/Profile';
import Tokens from './pages/Tokens';
import CryptoAssetsPage from './components/CryptoAssetsPage';
import SupportChat from './components/SupportChat';
import TokenDetailPage from './components/TokenDetailPage';
import HomePage from './components/HomePage';
import BuyCoinPage from './components/BuyCoinPage';
import History from './components/History';
import SwapCoinPage from './components/SwapCoinPage';
import Withdraw from './components/Withdraw';
import BlogPage from './components/BlogPage';
import BlogDetailPage from './components/BlogDetailPage';
import AboutPage from './components/AboutPage';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard'; 
import { LanguageContext } from './context/LanguageContext';
import Earn from './components/Earn';

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const hideHeader = ['/login', '/register'].includes(location.pathname) || (user && (user.role === 'Employee' || user.role === 'Admin'));
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  const features = [
    {
      src: wallet1,
      title: "Value",
      description: "Обменивайте активы из своего кошелька. Будьте своим банком. Без централизованных мостов или обёртывания активов",
    },
    {
      src: profit1,
      title: "Yield",
      description: "Предоставляйте ликвидность и зарабатывайте доход на своих нативных активах с защитой от непостоянных потерь",
    },
    {
      src: insurance1,
      title: "Insurance",
      description: "Получите защиту от непостоянных потерь в ваших пулах ликвидности",
    },
    {
      src: wallet1,
      title: "Staking",
      description: "Зарабатывайте доход на своих нативных активах с защитой от непостоянных потерь",
    },
  ];

  return (
    <ThemeProvider>
      <LanguageProvider>
        <MuiThemeProvider theme={createTheme({
          palette: {
            mode: theme === 'dark' ? 'dark' : 'light',
            primary: { main: '#7c3aed' },
            secondary: { main: '#F7931A' },
          },
        })}>
          <CssBaseline />
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: '1 0 auto' }}>
              {!hideHeader && <Header />}
              <Routes>
                <Route
                  path="/"
                  element={
                    user && user.role === 'Admin' ? (
                      <AdminDashboard />
                    ) : user && user.role === 'Employee' ? (
                      <EmployeeDashboard />
                    ) : (
                      <Box sx={{ flex: '1 0 auto' }}>
                        <HomePage />
                        <Footer />
                      </Box>
                    )
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/wallet" element={<CryptoDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/nft" element={<Tokens />} />
                <Route path="/tokens" element={<CryptoAssetsPage />} />
                <Route path="/tokens/:id" element={<TokenDetailPage />} />
                <Route path="/explorer" element={<SupportChat />} />
                <Route path="/pay" element={<BuyCoinPage />} />
                <Route path="/history" element={<History />} />
                <Route path="/swap" element={<SwapCoinPage />} />
                <Route path="/sell" element={<Withdraw />} />
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/blogs/:id" element={<BlogDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/earn" element={<Earn />} />
                <Route
                  path="/employee"
                  element={
                    user && user.role === 'Employee' ? <EmployeeDashboard /> : <Box sx={{ p: 4 }}>
                      <Typography variant="h6" color="error">
                        {language === 'ru' ? 'Доступ запрещен. Только для сотрудников.' : 'Access denied. Employees only.'}
                      </Typography>
                    </Box>
                  }
                />
              </Routes>
            </Box>
          </Box>
        </MuiThemeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;