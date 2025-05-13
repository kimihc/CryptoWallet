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

const SwapCoinPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const wallet = location.state?.wallet;
  const [availableCoins, setAvailableCoins] = useState([]);
  const [fromCoin, setFromCoin] = useState('');
  const [toCoin, setToCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [swapRate, setSwapRate] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const texts = {
    en: {
      title: "Swap Cryptocurrency",
      fromCoin: "From Coin",
      toCoin: "To Coin",
      amount: "Amount",
      swap: "Swap",
      cancel: "Cancel",
      totalCost: "Total Cost",
      commission: "Commission (2.5%)",
      totalWithCommission: "Total with Commission",
      pleaseSelectWallet: "Please select a wallet first",
      pleaseLogin: "Please log in to swap coins",
      swapSuccessful: "Swap successful!",
      swapUnderReview: "Swap of $5000 or more is under review.",
      confirmSwap: "Confirm Swap",
      insufficientBalance: "Insufficient balance",
      noCoinsAvailable: "No coins available at the moment",
      priceUnavailable: "Price unavailable",
      invalidAmount: "Amount must be greater than 0",
      invalidCoins: "Please select valid coins",
      noAssets: "No assets available in wallet",
      youWillReceive: "You will receive"
    },
    ru: {
      title: "Обмен Криптовалюты",
      fromCoin: "Из Монеты",
      toCoin: "В Монету",
      amount: "Количество",
      swap: "Обменять",
      cancel: "Отмена",
      totalCost: "Общая Стоимость",
      commission: "Комиссия (2.5%)",
      totalWithCommission: "Итог с комиссией",
      pleaseSelectWallet: "Пожалуйста, сначала выберите кошелек",
      pleaseLogin: "Пожалуйста, войдите, чтобы обменять монеты",
      swapSuccessful: "Обмен успешно завершен!",
      swapUnderReview: "Обмен на $5000 или более отправлен на доработку.",
      confirmSwap: "Подтвердить Обмен",
      insufficientBalance: "Недостаточный баланс",
      noCoinsAvailable: "На данный момент монеты недоступны",
      priceUnavailable: "Цена недоступна",
      invalidAmount: "Количество должно быть больше 0",
      invalidCoins: "Пожалуйста, выберите действительные монеты",
      noAssets: "В кошельке нет доступных активов",
      youWillReceive: "Вы получите"
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
        setToCoin(filteredData[0].id);
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

  useEffect(() => {
    if (wallet?.portfolio?.length > 0 && !fromCoin) {
      setFromCoin(wallet.portfolio[0].symbol);
    }
  }, [wallet]);

  const calculateSwapRate = () => {
    const fromCoinData = wallet?.portfolio?.find(c => c.symbol === fromCoin);
    const toCoinData = availableCoins.find(c => c.id === toCoin);
    if (fromCoinData && toCoinData && fromCoinData.value && toCoinData.current_price) {
      const fromPricePerUnit = fromCoinData.value / fromCoinData.amount;
      setSwapRate(fromPricePerUnit / toCoinData.current_price);
    } else {
      setSwapRate(0);
    }
  };

  useEffect(() => {
    calculateSwapRate();
  }, [fromCoin, toCoin, availableCoins, wallet]);

  const handleSwap = () => {
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
    if (!fromCoin || !toCoin || fromCoin === toCoin) {
      setAlertOpen(true);
      setAlertMessage(t.invalidCoins);
      setAlertSeverity('warning');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setAlertOpen(true);
      setAlertMessage(t.invalidAmount);
      setAlertSeverity('warning');
      return;
    }
    const fromCoinData = wallet.portfolio.find(c => c.symbol === fromCoin);
    if (!fromCoinData || fromCoinData.amount < parseFloat(amount)) {
      setAlertOpen(true);
      setAlertMessage(t.insufficientBalance);
      setAlertSeverity('warning');
      return;
    }
    setOpenConfirmDialog(true);
  };

  const confirmSwap = () => {
    const fromCoinData = wallet.portfolio.find(c => c.symbol === fromCoin);
    const toCoinData = availableCoins.find(c => c.id === toCoin);
    if (!fromCoinData || !toCoinData) {
      setAlertOpen(true);
      setAlertMessage(t.invalidCoins);
      setAlertSeverity('warning');
      setOpenConfirmDialog(false);
      return;
    }

    const swapAmount = parseFloat(amount);
    const fromPricePerUnit = fromCoinData.value / fromCoinData.amount;
    const baseCost = fromPricePerUnit * swapAmount;
    const receivedAmount = swapAmount * swapRate;
    const commissionRate = 0.025;
    const commission = baseCost * commissionRate;
    const totalWithCommission = baseCost + commission;
    const toCoinPricePerUnit = toCoinData.current_price;
    const receivedValue = receivedAmount * toCoinPricePerUnit;

    const updatedWallets = JSON.parse(localStorage.getItem(`cryptoWallets_${user.login}`)) || [];
    const walletIndex = updatedWallets.findIndex(w => w.address === wallet.address);

    if (walletIndex === -1) {
      setOpenConfirmDialog(false);
      return;
    }

    if (!updatedWallets[walletIndex].transactions) {
      updatedWallets[walletIndex].transactions = [];
    }

    const newTransaction = {
      id: `tx${Date.now()}`,
      type: 'Swap',
      amount: swapAmount,
      from: fromCoinData.symbol,
      to: toCoinData.symbol.toUpperCase(),
      date: new Date().toISOString(),
      status: baseCost >= 5000 ? 'Pending' : 'Completed',
      commission: commission.toFixed(2),
      total: totalWithCommission.toFixed(2),
      pendingDetails: baseCost >= 5000 ? {
        from: {
          symbol: fromCoinData.symbol,
          amount: swapAmount,
          value: baseCost
        },
        to: {
          symbol: toCoinData.symbol.toUpperCase(),
          name: toCoinData.name,
          amount: receivedAmount,
          value: receivedValue,
          buyPrice: toCoinPricePerUnit,
          currentPrice: toCoinPricePerUnit,
          change: toCoinData.price_change_percentage_24h,
          image: toCoinData.image
        }
      } : null
    };
    updatedWallets[walletIndex].transactions.unshift(newTransaction);

    if (baseCost < 5000) {
      if (!updatedWallets[walletIndex].portfolio) {
        updatedWallets[walletIndex].portfolio = [];
      }

      const fromAssetIndex = updatedWallets[walletIndex].portfolio.findIndex(a => a.symbol === fromCoin);
      if (fromAssetIndex !== -1) {
        updatedWallets[walletIndex].portfolio[fromAssetIndex].amount -= swapAmount;
        updatedWallets[walletIndex].portfolio[fromAssetIndex].value = updatedWallets[walletIndex].portfolio[fromAssetIndex].amount * fromPricePerUnit;
        if (updatedWallets[walletIndex].portfolio[fromAssetIndex].amount <= 0) {
          updatedWallets[walletIndex].portfolio.splice(fromAssetIndex, 1);
        }
      }

      const toAssetIndex = updatedWallets[walletIndex].portfolio.findIndex(a => a.symbol.toLowerCase() === toCoinData.symbol.toLowerCase());
      if (toAssetIndex !== -1) {
        const currentAmount = updatedWallets[walletIndex].portfolio[toAssetIndex].amount;
        const currentInitialValue = updatedWallets[walletIndex].portfolio[toAssetIndex].initialValue || 0;
        const newAmount = currentAmount + receivedAmount;
        const newInitialValue = currentInitialValue + receivedValue;
        updatedWallets[walletIndex].portfolio[toAssetIndex].amount = newAmount;
        updatedWallets[walletIndex].portfolio[toAssetIndex].value = newAmount * toCoinPricePerUnit;
        updatedWallets[walletIndex].portfolio[toAssetIndex].initialValue = newInitialValue;
        updatedWallets[walletIndex].portfolio[toAssetIndex].buyPrice = newInitialValue / newAmount;
        updatedWallets[walletIndex].portfolio[toAssetIndex].currentPrice = toCoinPricePerUnit;
      } else {
        updatedWallets[walletIndex].portfolio.push({
          symbol: toCoinData.symbol.toUpperCase(),
          name: toCoinData.name,
          amount: receivedAmount,
          value: receivedValue,
          initialValue: receivedValue,
          buyPrice: toCoinPricePerUnit,
          currentPrice: toCoinPricePerUnit,
          change: toCoinData.price_change_percentage_24h,
          image: toCoinData.image
        });
      }

      updatedWallets[walletIndex].balance = updatedWallets[walletIndex].portfolio.reduce((sum, asset) => sum + (asset.value || 0), 0);
    }

    localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(updatedWallets));

    if (baseCost >= 5000) {
      const employeeHistoryKey = `pendingEmployeeTransactions`;
      let pendingEmployeeTransactions = JSON.parse(localStorage.getItem(employeeHistoryKey)) || [];
      pendingEmployeeTransactions.push({
        transactionId: newTransaction.id,
        userLogin: user.login,
        type: 'Swap',
        amount: swapAmount,
        from: fromCoinData.symbol,
        to: toCoinData.symbol.toUpperCase(),
        date: newTransaction.date,
        status: 'Pending',
        commission: commission.toFixed(2),
        total: totalWithCommission.toFixed(2),
        pendingDetails: newTransaction.pendingDetails
      });
      localStorage.setItem(employeeHistoryKey, JSON.stringify(pendingEmployeeTransactions));
    }

    setOpenConfirmDialog(false);
    setAmount('');
    setAlertOpen(true);
    setAlertMessage(baseCost >= 5000 ? t.swapUnderReview : t.swapSuccessful);
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
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  if (!wallet.portfolio || wallet.portfolio.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' }}>
        <Typography variant="h6" sx={{ mb: 2, color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t.noAssets}</Typography>
        <Button variant="contained" onClick={() => navigate('/wallet')} sx={{
          bgcolor: theme === 'dark' ? '#4caf50' : '#2e7d32',
          color: '#ffffff',
          '&:hover': { bgcolor: theme === 'dark' ? '#66bb6a' : '#388e3c' }
        }}>
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  const fromCoinData = wallet.portfolio.find(c => c.symbol === fromCoin) || { value: 0, amount: 0, symbol: '' };
  const toCoinData = availableCoins.find(c => c.id === toCoin) || { current_price: 0, symbol: '' };
  const swapAmount = parseFloat(amount) || 0;
  const fromPricePerUnit = fromCoinData.value / (fromCoinData.amount || 1);
  const baseCost = fromPricePerUnit * swapAmount;
  const receivedAmount = swapAmount * swapRate;
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
            <InputLabel sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t.fromCoin}</InputLabel>
            <Select
              value={fromCoin}
              onChange={(e) => setFromCoin(e.target.value)}
              label={t.fromCoin}
              fullWidth
              displayEmpty
              renderValue={(value) => {
                const coin = wallet.portfolio.find(c => c.symbol === value);
                return coin ? `${coin.name} (${coin.symbol})` : t.fromCoin;
              }}
              sx={{
                color: theme === 'dark' ? '#ffffff' : '#000000',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' },
                '& .MuiSvgIcon-root': { color: theme === 'dark' ? '#ffffff' : '#000000' }
              }}
            >
              {wallet.portfolio.map(coin => (
                <MenuItem key={coin.symbol} value={coin.symbol}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <img src={coin.image} alt={coin.name} style={{ width: 24, height: 24, marginRight: 8 }} />
                    <Box>
                      <Typography>{coin.name} ({coin.symbol})</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
                        {coin.amount} available
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>{t.toCoin}</InputLabel>
            <Select
              value={toCoin}
              onChange={(e) => setToCoin(e.target.value)}
              label={t.toCoin}
              fullWidth
              displayEmpty
              renderValue={(value) => {
                const coin = availableCoins.find(c => c.id === value);
                return coin ? `${coin.name} (${coin.symbol.toUpperCase()})` : t.toCoin;
              }}
              sx={{
                color: theme === 'dark' ? '#ffffff' : '#000000',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' },
                '& .MuiSvgIcon-root': { color: theme === 'dark' ? '#ffffff' : '#000000' }
              }}
            >
              {availableCoins.map(coin => (
                <MenuItem key={coin.id} value={coin.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <img src={coin.image} alt={coin.name} style={{ width: 24, height: 24, marginRight: 8 }} />
                    <Box>
                      <Typography>{coin.name} ({coin.symbol.toUpperCase()})</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
                        ${coin.current_price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={t.amount}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">{fromCoinData.symbol}</InputAdornment>,
              sx: { 
                color: theme === 'dark' ? '#ffffff' : '#000000',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#333' : '#e0e0e0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme === 'dark' ? '#555' : '#bdbdbd' }
              }
            }}
            sx={{ mb: 3 }}
            InputLabelProps={{ sx: { color: theme === 'dark' ? '#ffffff' : '#000000' } }}
          />
          <Typography variant="body1" sx={{ mb: 2, color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
            {t.youWillReceive}: {receivedAmount.toFixed(6)} {toCoinData.symbol.toUpperCase()}
          </Typography>
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
            <Button variant="contained" color="primary" onClick={handleSwap} disabled={!fromCoin || !toCoin || !amount}>
              {t.swap}
            </Button>
          </Box>
        </Paper>

        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} PaperProps={{
          sx: { bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#000000' }
        }}>
          <DialogTitle>{t.confirmSwap}</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Swap {amount} {fromCoinData.symbol} for {receivedAmount.toFixed(6)} {toCoinData.symbol.toUpperCase()}?
            </Typography>
            <Typography sx={{ mb: 2, color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
              {t.commission}: ${commission.toFixed(2)}
            </Typography>
            <Typography sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
              {t.totalWithCommission}: ${totalWithCommission.toFixed(2)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)} sx={{ color: theme === 'dark' ? '#f44336' : '#d32f2f' }}>
              {t.cancel}
            </Button>
            <Button variant="contained" color="primary" onClick={confirmSwap}>
              {t.swap}
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

export default SwapCoinPage;