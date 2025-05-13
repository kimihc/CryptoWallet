import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Container,
  IconButton,
  Tooltip,
  Pagination
} from '@mui/material';
import {
  Send as SendIcon,
  ShowChart as ChartIcon,
  SwapHoriz as SwapIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';

const History = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const wallet = location.state?.wallet;
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const texts = {
    en: {
      transactions: "Transaction History",
      noTransactions: "No transactions available",
      back: "Back to Dashboard",
      page: "Page",
      of: "of",
      pleaseLogin: "Please log in to view your history",
      selectWallet: "Please select a wallet first"
    },
    ru: {
      transactions: "История транзакций",
      noTransactions: "Нет доступных транзакций",
      back: "Вернуться к панели",
      page: "Страница",
      of: "из",
      pleaseLogin: "Пожалуйста, войдите, чтобы просмотреть историю",
      selectWallet: "Пожалуйста, сначала выберите кошелек"
    }
  };
  const t = texts[language];

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' }}>
        <Typography variant="h6" sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t.pleaseLogin}</Typography>
      </Box>
    );
  }

  if (!wallet) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' }}>
        <Typography variant="h6" sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t.selectWallet}</Typography>
      </Box>
    );
  }

  const transactions = wallet.transactions || [];
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5', minHeight: '100vh', color: theme === 'dark' ? '#ffffff' : '#000000' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {t.transactions}
          </Typography>
          <Tooltip title={t.back}>
            <IconButton color="primary" onClick={() => navigate('/wallet')}>
              <BackIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Paper sx={{ 
          p: 3,
          bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
          borderRadius: 2
        }}>
          {currentTransactions.length > 0 ? (
            currentTransactions.map((tx, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 2,
                borderBottom: index !== currentTransactions.length - 1 ? `1px solid ${theme === 'dark' ? '#333' : '#eee'}` : 'none'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ 
                    bgcolor: theme === 'dark' ? '#333' : '#eee',
                    mr: 2,
                    width: 40, 
                    height: 40
                  }}>
                    {tx.type === 'Received' ? <SendIcon sx={{ transform: 'rotate(180deg)' }} /> : 
                      tx.type === 'Sent' ? <SendIcon /> : 
                      tx.type === 'Bought' ? <ChartIcon /> : <SwapIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{tx.type}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
                      {new Date(tx.date).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle1">
                    {tx.type === 'Swap' ? 
                      `${tx.amount} ${tx.from} → ${tx.to}` : 
                      `${tx.amount} ${tx.currency}`}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: tx.status === 'Completed' ? 
                        (theme === 'dark' ? '#4caf50' : '#2e7d32') : 
                        (theme === 'dark' ? '#f44336' : '#d32f2f') 
                    }}
                  >
                    {tx.status}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>{t.noTransactions}</Typography>
          )}

          {transactions.length > transactionsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default History;