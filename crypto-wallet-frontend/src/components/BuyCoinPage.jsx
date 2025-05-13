import React, { useContext, useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import CustomAlert from './CustomAlert';

const BuyCoinPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const wallet = location.state?.wallet;
  const [availableCoins, setAvailableCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const texts = {
    en: {
      title: "Buy Cryptocurrency",
      selectCoin: "Select Coin",
      amount: "Amount",
      buy: "Buy",
      cancel: "Cancel",
      totalCost: "Total Cost",
      commission: "Commission (2.5%)",
      totalWithCommission: "Total with Commission",
      pleaseSelectWallet: "Please select a wallet first",
      pleaseLogin: "Please log in to buy coins",
      purchaseSuccessful: "Purchase successful!",
      purchaseUnderReview: "Purchase of $5000 or more is under review.",
      cardDetails: "Enter Card Details",
      cardNumber: "Card Number",
      expiryDate: "Expiry Date (MM/YY)",
      cvv: "CVV",
      invalidCard: "Please enter valid card details",
      noCoinsAvailable: "No coins available at the moment",
      priceUnavailable: "Price unavailable",
      invalidCoin: "Please select a valid coin"
    },
    ru: {
      title: "Купить Криптовалюту",
      selectCoin: "Выберите Монету",
      amount: "Количество",
      buy: "Купить",
      cancel: "Отмена",
      totalCost: "Общая Стоимость",
      commission: "Комиссия (2.5%)",
      totalWithCommission: "Итог с комиссией",
      pleaseSelectWallet: "Пожалуйста, сначала выберите кошелек",
      pleaseLogin: "Пожалуйста, войдите, чтобы купить монеты",
      purchaseSuccessful: "Покупка успешно завершена!",
      purchaseUnderReview: "Покупка на $5000 или более отправлена на доработку.",
      cardDetails: "Введите данные карты",
      cardNumber: "Номер карты",
      expiryDate: "Срок действия (ММ/ГГ)",
      cvv: "CVV",
      invalidCard: "Пожалуйста, введите корректные данные карты",
      noCoinsAvailable: "На данный момент монеты недоступны",
      priceUnavailable: "Цена недоступна",
      invalidCoin: "Пожалуйста, выберите действительную монету"
    }
  };
  const t = texts[language];

  const fetchAvailableCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
      if (!response.ok) throw new Error('Failed to fetch coins');
      const data = await response.json();
      const filteredData = data.filter(coin => 
        typeof coin.current_price === 'number' && 
        typeof coin.price_change_percentage_24h === 'number' &&
        coin.symbol
      );
      setAvailableCoins(filteredData);
      if (filteredData.length > 0) {
        setSelectedCoin(filteredData[0].id);
      } else {
        setError(t.noCoinsAvailable);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableCoins();
  }, []);

  const handleBuyCoin = () => {
    if (!user || !user.login) {
      setAlertOpen(true);
      setAlertMessage(t.pleaseLogin);
      setAlertSeverity('warning');
      return;
    }
    if (!wallet || !wallet.address) {
      setAlertOpen(true);
      setAlertMessage(t.pleaseSelectWallet);
      setAlertSeverity('warning');
      return;
    }
    if (!selectedCoin) {
      setAlertOpen(true);
      setAlertMessage(t.invalidCoin);
      setAlertSeverity('warning');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAlertOpen(true);
      setAlertMessage(t.amount + 'должен быть 0');
      setAlertSeverity('warning');
      return;
    }
    setOpenCardDialog(true);
  };

  const confirmPayment = () => {
    if (!cardNumber || !expiryDate || !cvv || cardNumber.length !== 16 || !/^\d{2}\/\d{2}$/.test(expiryDate) || cvv.length !== 3) {
      setAlertOpen(true);
      setAlertMessage(t.invalidCard);
      setAlertSeverity('warning');
      return;
    }

    const coin = availableCoins.find(c => c.id === selectedCoin);
    if (!coin || !coin.symbol) {
      setAlertOpen(true);
      setAlertMessage(t.invalidCoin);
      setAlertSeverity('warning');
      setOpenCardDialog(false);
      return;
    }

    if (!wallet || !wallet.address) {
      setAlertOpen(true);
      setAlertMessage(t.pleaseSelectWallet);
      setAlertSeverity('warning');
      setOpenCardDialog(false);
      return;
    }

    if (!user || !user.login) {
      setAlertOpen(true);
      setAlertMessage(t.pleaseLogin);
      setAlertSeverity('warning');
      setOpenCardDialog(false);
      return;
    }

    const baseCost = coin.current_price * parseFloat(amount);
    const commissionRate = 0.025;
    const commission = baseCost * commissionRate;
    const totalWithCommission = baseCost + commission;

    const updatedWallets = JSON.parse(localStorage.getItem(`cryptoWallets_${user.login}`)) || [];
    let walletIndex = updatedWallets.findIndex(w => w.address === wallet.address);
    
    if (walletIndex === -1) {
      const newWallet = {
        ...wallet,
        portfolio: [],
        transactions: [],
        balance: 0
      };
      updatedWallets.push(newWallet);
      walletIndex = updatedWallets.length - 1;
    }

    if (!updatedWallets[walletIndex].transactions) {
      updatedWallets[walletIndex].transactions = [];
    }

    const newTransaction = {
      id: `tx${Date.now()}`,
      type: 'Bought',
      amount: parseFloat(amount),
      currency: coin.symbol.toUpperCase(),
      date: new Date().toISOString(),
      status: baseCost >= 5000 ? 'Pending' : 'Completed',
      commission: commission.toFixed(2),
      total: totalWithCommission.toFixed(2),
      pendingDetails: baseCost >= 5000 ? {
        coinSymbol: coin.symbol.toUpperCase(),
        coinName: coin.name,
        amount: parseFloat(amount),
        buyPrice: coin.current_price,
        assetValue: coin.current_price * parseFloat(amount),
        change: coin.price_change_percentage_24h,
        image: coin.image
      } : null
    };
    updatedWallets[walletIndex].transactions.unshift(newTransaction);

    if (baseCost < 5000) {
      if (!updatedWallets[walletIndex].portfolio) {
        updatedWallets[walletIndex].portfolio = [];
      }

      const existingAssetIndex = updatedWallets[walletIndex].portfolio.findIndex(a => a.symbol === coin.symbol.toUpperCase());
      const buyPrice = coin.current_price;
      const assetValue = buyPrice * parseFloat(amount);

      if (existingAssetIndex !== -1) {
        const currentAmount = updatedWallets[walletIndex].portfolio[existingAssetIndex].amount;
        const currentInitialValue = updatedWallets[walletIndex].portfolio[existingAssetIndex].initialValue || 0;
        const newAmount = currentAmount + parseFloat(amount);
        const newInitialValue = currentInitialValue + assetValue;
        updatedWallets[walletIndex].portfolio[existingAssetIndex].amount = newAmount;
        updatedWallets[walletIndex].portfolio[existingAssetIndex].value = buyPrice * newAmount;
        updatedWallets[walletIndex].portfolio[existingAssetIndex].initialValue = newInitialValue;
        updatedWallets[walletIndex].portfolio[existingAssetIndex].buyPrice = newInitialValue / newAmount;
        updatedWallets[walletIndex].portfolio[existingAssetIndex].currentPrice = buyPrice;
      } else {
        const newAsset = {
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          amount: parseFloat(amount),
          value: assetValue,
          initialValue: assetValue,
          buyPrice: buyPrice,
          currentPrice: buyPrice,
          change: coin.price_change_percentage_24h,
          image: coin.image
        };
        updatedWallets[walletIndex].portfolio.push(newAsset);
      }

      updatedWallets[walletIndex].balance = updatedWallets[walletIndex].portfolio.reduce((sum, asset) => sum + asset.value, 0);
    }

    localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(updatedWallets));

    if (baseCost >= 5000) {
      const employeeHistoryKey = `pendingEmployeeTransactions`;
      let pendingEmployeeTransactions = JSON.parse(localStorage.getItem(employeeHistoryKey)) || [];
      pendingEmployeeTransactions.push({
        transactionId: newTransaction.id,
        userLogin: user.login,
        type: 'Bought',
        amount: parseFloat(amount),
        currency: coin.symbol.toUpperCase(),
        date: newTransaction.date,
        status: 'Pending',
        commission: commission.toFixed(2),
        total: totalWithCommission.toFixed(2),
        pendingDetails: newTransaction.pendingDetails
      });
      localStorage.setItem(employeeHistoryKey, JSON.stringify(pendingEmployeeTransactions));
    }

    setOpenCardDialog(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setAlertOpen(true);
    setAlertMessage(baseCost >= 5000 ? t.purchaseUnderReview : t.purchaseSuccessful);
    setAlertSeverity(baseCost >= 5000 ? 'warning' : 'success');
    setTimeout(() => {
      navigate('/wallet');
    }, 10000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' }}>
        <CircularProgress size={60} sx={{ color: theme === 'dark' ? '#ffffff' : '#1976d2' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' }}>
        <Typography color="error" sx={{ mb: 2, color: theme === 'dark' ? '#f44336' : '#d32f2f' }}>{error}</Typography>
        <Button variant="contained" onClick={fetchAvailableCoins} sx={{
          bgcolor: theme === 'dark' ? '#4caf50' : '#2e7d32',
          color: '#ffffff',
          '&:hover': { bgcolor: theme === 'dark' ? '#66bb6a' : '#388e3c' }
        }}>Retry</Button>
      </Box>
    );
  }

  if (!user || !user.login) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' }}>
        <Typography variant="h6" sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t.pleaseLogin}</Typography>
      </Box>
    );
  }

  if (!wallet || !wallet.address) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' }}>
        <Typography variant="h6" sx={{ mb: 2, color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t.pleaseSelectWallet}</Typography>
        <Button variant="contained" onClick={() => navigate('/wallet')} sx={{
          bgcolor: theme === 'dark' ? '#4caf50' : '#2e7d32',
          color: '#ffffff',
          '&:hover': { bgcolor: theme === 'dark' ? '#66bb6a' : '#388e3c' }
        }}>
          Go to Wallet
        </Button>
      </Box>
    );
  }

  const selectedCoinData = availableCoins.find(c => c.id === selectedCoin) || { current_price: 0, price_change_percentage_24h: 0, symbol: '' };
  const baseCost = selectedCoinData.current_price * (parseFloat(amount) || 0);
  const commissionRate = 0.025;
  const commission = baseCost * commissionRate;
  const totalWithCommission = baseCost + commission;
  const totalCost = baseCost.toFixed(2);

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            {t.title}
          </Typography>
          <Tooltip title="Back to Dashboard">
            <IconButton color="primary" onClick={() => navigate('/wallet')}>
              <BackIcon />
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
            <InputLabel sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t.selectCoin}</InputLabel>
            <Select
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              label={t.selectCoin}
              fullWidth
              displayEmpty
              renderValue={(value) => {
                const coin = availableCoins.find(c => c.id === value);
                return coin ? `${coin.name} (${coin.symbol.toUpperCase()})` : t.selectCoin;
              }}
              sx={{
                color: theme === 'dark' ? '#ffffff' : '#000000',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' },
                '& .MuiSvgIcon-root': { color: theme === 'dark' ? '#ffffff' : '#000000' }
              }}
            >
              {availableCoins.length > 0 ? (
                availableCoins.map(coin => {
                  const price = typeof coin.current_price === 'number' ? coin.current_price.toFixed(2) : t.priceUnavailable;
                  const change = typeof coin.price_change_percentage_24h === 'number' ? coin.price_change_percentage_24h.toFixed(2) : '0.00';
                  return (
                    <MenuItem key={coin.id} value={coin.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <img src={coin.image} alt={coin.name} style={{ width: 24, height: 24, marginRight: 8 }} />
                        <Box>
                          <Typography>{coin.name} ({coin.symbol.toUpperCase()})</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
                            ${price} ({change}%)
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled value="">
                  <Typography sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>{t.noCoinsAvailable}</Typography>
                </MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label={t.amount}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">{selectedCoinData.symbol.toUpperCase()}</InputAdornment>,
              sx: { 
                color: theme === 'dark' ? '#ffffff' : '#000000',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' }
              }
            }}
            sx={{ mb: 3 }}
            InputLabelProps={{ sx: { color: theme === 'dark' ? '#ffffff' : '#000000' } }}
          />
          <Typography variant="h6" sx={{ mb: 2, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            {t.totalCost}: ${totalCost}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
            {t.commission}: ${commission.toFixed(2)}
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            {t.totalWithCommission}: ${totalWithCommission.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleBuyCoin} disabled={!selectedCoin}>
              {t.buy}
            </Button>
          </Box>
        </Paper>

        <Dialog open={openCardDialog} onClose={() => setOpenCardDialog(false)} PaperProps={{
          sx: { bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#000000' }
        }}>
          <DialogTitle>{t.cardDetails}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label={t.cardNumber}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              InputProps={{
                inputProps: { maxLength: 16 },
                endAdornment: cardNumber ? (
                  <InputAdornment position="end">
                    {cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                  </InputAdornment>
                ) : null,
                sx: { 
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' }
                }
              }}
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: theme === 'dark' ? '#ffffff' : '#000000' } }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={t.expiryDate}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value.replace(/[^0-9/]/g, '').slice(0, 5))}
                placeholder="MM/YY"
                InputProps={{
                  inputProps: { maxLength: 5 },
                  sx: { 
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' }
                  }
                }}
                InputLabelProps={{ sx: { color: theme === 'dark' ? '#ffffff' : '#000000' } }}
              />
              <TextField
                fullWidth
                label={t.cvv}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                InputProps={{
                  inputProps: { maxLength: 3 },
                  sx: { 
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' }
                  }
                }}
                InputLabelProps={{ sx: { color: theme === 'dark' ? '#ffffff' : '#000000' } }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCardDialog(false)} sx={{ color: theme === 'dark' ? '#f44336' : '#d32f2f' }}>
              {t.cancel}
            </Button>
            <Button variant="contained" color="primary" onClick={confirmPayment}>
              {t.buy}
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

export default BuyCoinPage;