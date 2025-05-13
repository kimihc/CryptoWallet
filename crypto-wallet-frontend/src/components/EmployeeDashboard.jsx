import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  CssBaseline,
  Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const EmployeeDashboard = () => {
  const { user, allUsers, updateUserByLogin, logout } = useContext(AuthContext);
  const { theme: themeMode } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [employeeHistory, setEmployeeHistory] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);

  const loadData = () => {
    if (!user || !user.login) return;

    const historyKey = `employeeHistory_${user.login}`;
    const savedHistory = localStorage.getItem(historyKey);
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory)
        .map(entry => ({
          ...entry,
          details: typeof entry.details === 'object' ? entry.details.kycStatus || JSON.stringify(entry.details) : entry.details
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); 
      setEmployeeHistory(parsedHistory);
    } else {
      setEmployeeHistory([]);
    }

    const pendingEmployeeTransactions = JSON.parse(localStorage.getItem('pendingEmployeeTransactions')) || [];
    setPendingTransactions(pendingEmployeeTransactions);
  };

  useEffect(() => {
    if (!user || user.role !== 'Employee') {
      navigate('/');
      return;
    }

    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const updateHistory = (action, target, details) => {
    const historyEntry = {
      id: Date.now(),
      action,
      target,
      details: typeof details === 'object' ? JSON.stringify(details) : details,
      timestamp: new Date().toISOString(),
      employeeLogin: user.login,
    };
    const historyKey = `employeeHistory_${user.login}`;
    const updatedHistory = [historyEntry, ...employeeHistory]; 
    setEmployeeHistory(updatedHistory);
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
  };

  const handleTransactionAction = (userLogin, transactionId, action) => {
    const updatedPendingTransactions = pendingTransactions.filter(txn => !(txn.transactionId === transactionId && txn.userLogin === userLogin));
    setPendingTransactions(updatedPendingTransactions);
    localStorage.setItem('pendingEmployeeTransactions', JSON.stringify(updatedPendingTransactions));

    const userWalletsKey = `cryptoWallets_${userLogin}`;
    const userWallets = JSON.parse(localStorage.getItem(userWalletsKey)) || [];
    const wallet = userWallets[0];
    if (!wallet) return;

    const transaction = wallet.transactions.find(txn => txn.id === transactionId);
    if (!transaction) return;

    if (action === 'approve') {
      if (transaction.type === 'Bought') {
        const { coinSymbol, coinName, amount, buyPrice, assetValue, change, image } = transaction.pendingDetails;
        if (!wallet.portfolio) wallet.portfolio = [];

        const existingAssetIndex = wallet.portfolio.findIndex(a => a.symbol === coinSymbol);
        if (existingAssetIndex !== -1) {
          const currentAmount = wallet.portfolio[existingAssetIndex].amount;
          const currentInitialValue = wallet.portfolio[existingAssetIndex].initialValue || 0;
          const newAmount = currentAmount + amount;
          const newInitialValue = currentInitialValue + assetValue;
          wallet.portfolio[existingAssetIndex].amount = newAmount;
          wallet.portfolio[existingAssetIndex].value = buyPrice * newAmount;
          wallet.portfolio[existingAssetIndex].initialValue = newInitialValue;
          wallet.portfolio[existingAssetIndex].buyPrice = newInitialValue / newAmount;
          wallet.portfolio[existingAssetIndex].currentPrice = buyPrice;
        } else {
          const newAsset = {
            symbol: coinSymbol,
            name: coinName,
            amount,
            value: assetValue,
            initialValue: assetValue,
            buyPrice,
            currentPrice: buyPrice,
            change,
            image
          };
          wallet.portfolio.push(newAsset);
        }

        wallet.balance = wallet.portfolio.reduce((sum, asset) => sum + asset.value, 0);
      } else if (transaction.type === 'Swap') {
        const { from, to } = transaction.pendingDetails;
        if (!wallet.portfolio) wallet.portfolio = [];

        const fromAssetIndex = wallet.portfolio.findIndex(a => a.symbol === from.symbol);
        if (fromAssetIndex !== -1) {
          wallet.portfolio[fromAssetIndex].amount -= from.amount;
          wallet.portfolio[fromAssetIndex].value -= from.value;
          if (wallet.portfolio[fromAssetIndex].amount <= 0) {
            wallet.portfolio.splice(fromAssetIndex, 1);
          }
        }

        const toAssetIndex = wallet.portfolio.findIndex(a => a.symbol.toLowerCase() === to.symbol.toLowerCase());
        if (toAssetIndex !== -1) {
          const currentAmount = wallet.portfolio[toAssetIndex].amount;
          const currentInitialValue = wallet.portfolio[toAssetIndex].initialValue || 0;
          const newAmount = currentAmount + to.amount;
          const newInitialValue = currentInitialValue + to.value;
          wallet.portfolio[toAssetIndex].amount = newAmount;
          wallet.portfolio[toAssetIndex].value = newAmount * to.currentPrice;
          wallet.portfolio[toAssetIndex].initialValue = newInitialValue;
          wallet.portfolio[toAssetIndex].buyPrice = newInitialValue / newAmount;
          wallet.portfolio[toAssetIndex].currentPrice = to.currentPrice;
        } else {
          wallet.portfolio.push({
            symbol: to.symbol,
            name: to.name,
            amount: to.amount,
            value: to.value,
            initialValue: to.value,
            buyPrice: to.buyPrice,
            currentPrice: to.currentPrice,
            change: to.change,
            image: to.image
          });
        }

        wallet.balance = wallet.portfolio.reduce((sum, asset) => sum + (asset.value || 0), 0);
      }

      transaction.status = 'Completed';
      delete transaction.pendingDetails;
    } else {
      transaction.status = 'Rejected';
      delete transaction.pendingDetails;
    }

    localStorage.setItem(userWalletsKey, JSON.stringify(userWallets));

    updateHistory(
      action === 'approve' ? 'Transaction Approved' : 'Transaction Rejected',
      transactionId,
      action === 'approve' ? (language === 'ru' ? 'Подтвержден' : 'Approved') : (language === 'ru' ? 'Отклонен' : 'Rejected')
    );
  };

  const handleKycAction = (userLogin, action) => {
    const newStatus = action === 'approve' 
      ? (language === 'ru' ? 'Подтвержден' : 'Verified') 
      : (language === 'ru' ? 'Отклонен' : 'Rejected');
    const userDataKey = `userData_${userLogin}`;
    const userData = JSON.parse(localStorage.getItem(userDataKey)) || {};
    updateUserByLogin(userLogin, { kycStatus: newStatus, passportData: userData.passportData || null });

    updateHistory(
      action === 'approve' ? 'KYC Approved' : 'KYC Rejected',
      userLogin,
      newStatus
    );
  };

  const handleCreateReport = () => {
    const reportKey = `employeeReport_${user.login}_${Date.now()}`;
    localStorage.setItem(reportKey, JSON.stringify(employeeHistory));
    alert(language === 'ru' ? 'Отчет создан и сохранен' : 'Report created and saved');
  };

  const pendingTransactionsForReview = pendingTransactions.map(txn => ({
    ...txn,
    id: txn.transactionId,
    userLogin: txn.userLogin
  }));

  const pendingKycUsers = allUsers.filter(u => 
    u.kycStatus === (language === 'ru' ? 'В обработке' : 'In Progress')
  );

  const texts = {
    ru: {
      dashboard: "Панель сотрудника",
      transactionsTab: "Транзакции на проверку",
      verificationsTab: "Верификации пользователей",
      historyTab: "История операций",
      transactionId: "ID транзакции",
      user: "Пользователь",
      amount: "Сумма",
      date: "Дата",
      status: "Статус",
      actions: "Действия",
      approve: "Подтвердить",
      reject: "Отклонить",
      login: "Логин",
      kycStatus: "Статус KYC",
      firstName: "Имя",
      lastName: "Фамилия",
      dob: "Дата рождения",
      country: "Страна",
      address: "Адрес",
      passportNumber: "Номер паспорта",
      logout: "Выйти",
      action: "Действие",
      target: "Цель",
      details: "Детали",
      timestamp: "Время",
      createReport: "Создать отчет"
    },
    en: {
      dashboard: "Employee Dashboard",
      transactionsTab: "Transactions for Review",
      verificationsTab: "User Verifications",
      historyTab: "Operation History",
      transactionId: "Transaction ID",
      user: "User",
      amount: "Amount",
      date: "Date",
      status: "Status",
      actions: "Actions",
      approve: "Approve",
      reject: "Reject",
      login: "Login",
      kycStatus: "KYC Status",
      firstName: "First Name",
      lastName: "Last Name",
      dob: "Date of Birth",
      country: "Country",
      address: "Address",
      passportNumber: "Passport Number",
      logout: "Logout",
      action: "Action",
      target: "Target",
      details: "Details",
      timestamp: "Timestamp",
      createReport: "Create Report"
    }
  };

  const theme = createTheme({
    palette: {
      mode: themeMode === 'dark' ? 'dark' : 'light',
      primary: {
        main: '#7c3aed',
      },
      secondary: {
        main: '#F7931A',
      },
      background: {
        default: themeMode === 'dark' ? '#1A1E34' : '#f5f5f5',
        paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 3, md: 5 }, background: themeMode === 'dark' ? 'linear-gradient(135deg, #1e1e1e, #2a2a2a)' : 'linear-gradient(135deg, #ffffff, #f0f4f8)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h3" color="text.primary" fontWeight="bold">
                {texts[language].dashboard}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ borderRadius: 2 }}
              >
                {texts[language].logout}
              </Button>
            </Box>

            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 4 }}>
              <Tab label={texts[language].transactionsTab} />
              <Tab label={texts[language].verificationsTab} />
              <Tab label={texts[language].historyTab} />
            </Tabs>

            {tabValue === 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{texts[language].transactionId}</TableCell>
                      <TableCell>{texts[language].user}</TableCell>
                      <TableCell>{texts[language].amount}</TableCell>
                      <TableCell>{texts[language].date}</TableCell>
                      <TableCell>{texts[language].status}</TableCell>
                      <TableCell>{texts[language].actions}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingTransactionsForReview.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell>{txn.id}</TableCell>
                        <TableCell>{txn.userLogin}</TableCell>
                        <TableCell>
                          {txn.type === 'Swap' 
                            ? `${txn.amount} ${txn.from} to ${txn.to}`
                            : `${txn.amount} ${txn.currency}`}
                        </TableCell>
                        <TableCell>{new Date(txn.date).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}</TableCell>
                        <TableCell>{txn.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleTransactionAction(txn.userLogin, txn.id, 'approve')}
                            sx={{ mr: 1 }}
                          >
                            {texts[language].approve}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleTransactionAction(txn.userLogin, txn.id, 'reject')}
                          >
                            {texts[language].reject}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingTransactionsForReview.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          {language === 'ru' ? 'Нет транзакций для проверки' : 'No transactions to review'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tabValue === 1 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{texts[language].login}</TableCell>
                      <TableCell>{texts[language].kycStatus}</TableCell>
                      <TableCell>{texts[language].firstName}</TableCell>
                      <TableCell>{texts[language].lastName}</TableCell>
                      <TableCell>{texts[language].dob}</TableCell>
                      <TableCell>{texts[language].country}</TableCell>
                      <TableCell>{texts[language].address}</TableCell>
                      <TableCell>{texts[language].passportNumber}</TableCell>
                      <TableCell>{texts[language].actions}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingKycUsers.map((u) => (
                      <TableRow key={u.login}>
                        <TableCell>{u.login}</TableCell>
                        <TableCell>{u.kycStatus}</TableCell>
                        <TableCell>{u.passportData?.FirstName || 'N/A'}</TableCell>
                        <TableCell>{u.passportData?.LastName || 'N/A'}</TableCell>
                        <TableCell>{u.passportData?.['Date of Birth'] || 'N/A'}</TableCell>
                        <TableCell>{u.passportData?.Страна || u.passportData?.Country || 'N/A'}</TableCell>
                        <TableCell>{u.passportData?.Адрес || u.passportData?.Address || 'N/A'}</TableCell>
                        <TableCell>{u.passportData?.['Passport Number'] || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleKycAction(u.login, 'approve')}
                            sx={{ mr: 1 }}
                          >
                            {texts[language].approve}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleKycAction(u.login, 'reject')}
                          >
                            {texts[language].reject}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendingKycUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          {language === 'ru' ? 'Нет пользователей для верификации' : 'No users to verify'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {tabValue === 2 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{texts[language].action}</TableCell>
                      <TableCell>{texts[language].target}</TableCell>
                      <TableCell>{texts[language].details}</TableCell>
                      <TableCell>{texts[language].timestamp}</TableCell>
                      <TableCell align="right">{texts[language].createReport}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employeeHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell>{entry.target}</TableCell>
                        <TableCell>{entry.details}</TableCell>
                        <TableCell>{new Date(entry.timestamp).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={handleCreateReport}
                            sx={{ borderRadius: 2 }}
                          >
                            {texts[language].createReport}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {employeeHistory.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          {language === 'ru' ? 'История пуста' : 'History is empty'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeDashboard;