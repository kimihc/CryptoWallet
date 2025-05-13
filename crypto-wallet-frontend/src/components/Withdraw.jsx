import React, { useContext, useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomAlert from './CustomAlert';

const Withdraw = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const wallet = location.state?.wallet;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const texts = {
    en: {
      withdraw: "Sell",
      selectAsset: "Select Asset",
      amount: "Amount",
      available: "Available",
      commission: "Commission (2.5%)",
      commissionCoins: "Commission in Coins",
      proceeds: "Proceeds",
      sell: "Sell",
      pleaseLogin: "Please log in to withdraw funds",
      noWallet: "No wallet selected",
      insufficientBalance: "Insufficient balance",
      invalidAmount: "Amount must be greater than 0",
      saleSuccessful: "Sale successful!",
      backToDashboard: "Back to Dashboard",
      paymentMethod: "Payment Method",
      card: "Card",
      bankAccount: "Bank Account",
      cardNumber: "Card Number",
      bankAccountNumber: "Bank Account Number",
      invalidPayment: "Please enter a valid card number (16 digits) or bank account number (8-12 digits)",
      confirm: "Confirm"
    },
    ru: {
      withdraw: "Продать",
      selectAsset: "Выберите Актив",
      amount: "Количество",
      available: "Доступно",
      commission: "Комиссия (2.5%)",
      commissionCoins: "Комиссия в монетах",
      proceeds: "Прибыль",
      sell: "Продать",
      pleaseLogin: "Пожалуйста, войдите, чтобы вывести средства",
      noWallet: "Кошелек не выбран",
      insufficientBalance: "Недостаточный баланс",
      invalidAmount: "Количество должно быть больше 0",
      saleSuccessful: "Продажа успешно выполнена!",
      backToDashboard: "Вернуться на главную",
      paymentMethod: "Способ оплаты",
      card: "Карта",
      bankAccount: "Банковский счет",
      cardNumber: "Номер карты",
      bankAccountNumber: "Номер банковского счета",
      invalidPayment: "Пожалуйста, введите корректный номер карты (16 цифр) или банковского счета (8-12 цифр)",
      confirm: "Подтвердить"
    }
  };
  const t = texts[language];

  useEffect(() => {
    if (!user) {
      setError(t.pleaseLogin);
      return;
    }
    if (!wallet) {
      setError(t.noWallet);
      return;
    }
    if (wallet.portfolio && wallet.portfolio.length > 0) {
      setSelectedAsset(wallet.portfolio[0].symbol);
    }
  }, [user, wallet]);

  const handleSell = () => {
    if (!selectedAsset) {
      setAlertOpen(true);
      setAlertMessage(t.selectAsset);
      setAlertSeverity('warning');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAlertOpen(true);
      setAlertMessage(t.invalidAmount);
      setAlertSeverity('warning');
      return;
    }

    const asset = wallet.portfolio.find(a => a.symbol === selectedAsset);
    if (!asset || asset.amount < parseFloat(amount)) {
      setAlertOpen(true);
      setAlertMessage(t.insufficientBalance);
      setAlertSeverity('warning');
      return;
    }

    setOpenDialog(true);
  };

  const confirmSell = () => {
    const isCardValid = selectedMethod === 'card' && cardNumber && cardNumber.length === 16 && /^\d+$/.test(cardNumber);
    const isBankValid = selectedMethod === 'bankAccount' && bankAccount && bankAccount.length >= 8 && bankAccount.length <= 12 && /^\d+$/.test(bankAccount);
    if (!isCardValid && !isBankValid) {
      setAlertOpen(true);
      setAlertMessage(t.invalidPayment);
      setAlertSeverity('warning');
      return;
    }

    setLoading(true);
    try {
      const transferAmount = parseFloat(amount);
      const asset = wallet.portfolio.find(a => a.symbol === selectedAsset);
      if (!asset) {
        throw new Error('Selected asset not found');
      }
      const assetPricePerUnit = asset.value / asset.amount;
      const transferValue = transferAmount * assetPricePerUnit;
      const commissionRate = 0.025;
      const commission = transferValue * commissionRate;
      const totalDeduction = transferValue;

      const savedWallets = JSON.parse(localStorage.getItem(`cryptoWallets_${user.login}`)) || [];
      const walletIndex = savedWallets.findIndex(w => w.address === wallet.address);
      const assetIndex = savedWallets[walletIndex].portfolio.findIndex(a => a.symbol === selectedAsset);

      savedWallets[walletIndex].portfolio[assetIndex].amount -= transferAmount;
      savedWallets[walletIndex].portfolio[assetIndex].value -= transferValue;

      if (savedWallets[walletIndex].portfolio[assetIndex].amount <= 0) {
        savedWallets[walletIndex].portfolio.splice(assetIndex, 1);
      }

      const transaction = {
        id: `tx${Date.now()}`,
        type: 'Sold',
        amount: transferAmount,
        symbol: selectedAsset,
        date: new Date().toLocaleString(),
        status: 'Completed',
        commission: commission.toFixed(2),
        proceeds: (transferValue - commission).toFixed(2),
        paymentMethod: selectedMethod,
        paymentDetails: selectedMethod === 'card' ? cardNumber : bankAccount
      };
      savedWallets[walletIndex].transactions.unshift(transaction);

      savedWallets[walletIndex].balance = savedWallets[walletIndex].portfolio.reduce(
        (sum, asset) => sum + (asset.value || 0), 0
      );

      localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(savedWallets));

      setLoading(false);
      setOpenDialog(false);
      setCardNumber('');
      setBankAccount('');
      setAlertOpen(true);
      setAlertMessage(t.saleSuccessful);
      setAlertSeverity('success');
      setTimeout(() => {
        navigate('/wallet');
      }, 10000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error processing sale:', err);
    }
  };

  const calculateProceeds = () => {
    if (!selectedAsset || !amount || parseFloat(amount) <= 0) return { commission: 0, commissionInCoins: 0, proceeds: 0 };
    const asset = wallet.portfolio.find(a => a.symbol === selectedAsset);
    const transferAmount = parseFloat(amount);
    const assetPricePerUnit = asset.value / asset.amount;
    const transferValue = transferAmount * assetPricePerUnit;
    const commission = transferValue * 0.025;
    const commissionInCoins = transferAmount * 0.025;
    return {
      commission: commission.toFixed(2),
      commissionInCoins: commissionInCoins.toFixed(8),
      proceeds: (transferValue - commission).toFixed(2)
    };
  };

  const { commission, commissionInCoins, proceeds } = calculateProceeds();

  if (loading) {
    return (
      <Box sx={ { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' 
      }}>
        <CircularProgress size={60} sx={{ color: theme === 'dark' ? '#ffffff' : '#1976d2' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        p: 3, 
        bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' 
      }}>
        <Typography 
          variant="h6" 
          sx={{ color: theme === 'dark' ? '#f44336' : '#d32f2f' }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        p: 3, 
        bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5', 
        minHeight: '100vh'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            {t.withdraw}
          </Typography>
          <Tooltip title={t.backToDashboard}>
            <IconButton color="primary" onClick={() => navigate('/wallet')}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
        </Box>

        <Paper sx={{ 
          p: 3, 
          bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff', 
          borderRadius: 2,
          color: theme === 'dark' ? '#ffffff' : '#000000'
        }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
              {t.selectAsset}
            </InputLabel>
            <Select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              label={t.selectAsset}
              sx={{
                color: theme === 'dark' ? '#ffffff' : '#000000',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#333' : '#e0e0e0'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#555' : '#bdbdbd'
                },
                '& .MuiSvgIcon-root': {
                  color: theme === 'dark' ? '#ffffff' : '#000000'
                }
              }}
            >
              {wallet?.portfolio?.map(asset => (
                <MenuItem key={asset.symbol} value={asset.symbol}>
                  {asset.name} ({asset.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedAsset && (
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2, 
                color: theme === 'dark' ? '#bbbbbb' : '#666666'
              }}
            >
              {t.available}: {wallet.portfolio.find(a => a.symbol === selectedAsset)?.amount} {selectedAsset}
            </Typography>
          )}

          <TextField
            fullWidth
            label={t.amount}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ mb: 3 }}
            InputLabelProps={{
              sx: { color: theme === 'dark' ? '#ffffff' : '#000000' }
            }}
            InputProps={{
              sx: { 
                color: theme === 'dark' ? '#ffffff' : '#000000',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#333' : '#e0e0e0'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme === 'dark' ? '#555' : '#bdbdbd'
                }
              }
            }}
          />

          {amount > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme === 'dark' ? '#bbbbbb' : '#666666'
                }}
              >
                {t.commission}: ${commission}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme === 'dark' ? '#bbbbbb' : '#666666'
                }}
              >
                {t.commissionCoins}: {commissionInCoins} {selectedAsset}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme === 'dark' ? '#4caf50' : '#2e7d32'
                }}
              >
                {t.proceeds}: ${proceeds}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSell}
              disabled={!selectedAsset}
            >
              {t.sell}
            </Button>
          </Box>
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{
          sx: { bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#000000' }
        }}>
          <DialogTitle>{t.withdraw}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                {t.paymentMethod}
              </InputLabel>
              <Select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                label={t.paymentMethod}
                sx={{
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme === 'dark' ? '#333' : '#e0e0e0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme === 'dark' ? '#555' : '#bdbdbd'
                  },
                  '& .MuiSvgIcon-root': {
                    color: theme === 'dark' ? '#ffffff' : '#000000'
                  }
                }}
              >
                <MenuItem value="card">{t.card}</MenuItem>
                <MenuItem value="bankAccount">{t.bankAccount}</MenuItem>
              </Select>
            </FormControl>
            {selectedMethod === 'card' ? (
              <TextField
                fullWidth
                label={t.cardNumber}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                InputProps={{
                  inputProps: { maxLength: 16 },
                  sx: { 
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' }
                  }
                }}
                sx={{ mb: 2 }}
                InputLabelProps={{ sx: { color: theme === 'dark' ? '#ffffff' : '#000000' } }}
              />
            ) : (
              <TextField
                fullWidth
                label={t.bankAccountNumber}
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, '').slice(0, 12))}
                InputProps={{
                  inputProps: { maxLength: 12 },
                  sx: { 
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' }
                  }
                }}
                sx={{ mb: 2 }}
                InputLabelProps={{ sx: { color: theme === 'dark' ? '#ffffff' : '#000000' } }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: theme === 'dark' ? '#f44336' : '#d32f2f' }}>
              {t.cancel}
            </Button>
            <Button variant="contained" color="primary" onClick={confirmSell}>
              {t.confirm}
            </Button>
          </DialogActions>
        </Dialog>

        <CustomAlert
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          message={alertMessage}
          severity={alertSeverity}
        />
      </Box>
    </Container>
  );
};

export default Withdraw;