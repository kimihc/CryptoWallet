import React, { useContext, useState, useEffect, useMemo } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Chip,
  Container,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  CircularProgress,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Paid as TokenIcon,
  ShowChart as ChartIcon,
  SwapHoriz as SwapIcon,
  Send as SendIcon,
  History as HistoryIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  MoneyOff as SellIcon
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert';

const CryptoDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { user, updateUserByLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wallets, setWallets] = useState(() => {
    if (user && user.login) {
      const savedWallets = localStorage.getItem(`cryptoWallets_${user.login}`);
      return savedWallets ? JSON.parse(savedWallets) : [];
    }
    return [];
  });
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [openCreateWallet, setOpenCreateWallet] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [sendAsset, setSendAsset] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [walletType, setWalletType] = useState('other');
  const [searchTerm, setSearchTerm] = useState('');
  const [openAssetDialog, setOpenAssetDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const texts = {
    en: {
      createWallet: "Create Wallet",
      walletName: "Wallet Name",
      create: "Create",
      cancel: "Cancel",
      assets: "Your Assets",
      quickActions: "Quick Actions",
      send: "Send",
      swap: "Swap",
      buy: "Buy",
      sell: "Sell",
      history: "History",
      recentTransactions: "Recent Transactions",
      portfolioChart: "Portfolio Chart",
      chartPlaceholder: "Loading chart...",
      retry: "Retry",
      error: "Failed to load data",
      noWallets: "No wallets created yet. Create your first wallet!",
      selectWallet: "Select a wallet to view details",
      pleaseLogin: "Please log in to manage your wallets",
      copied: "Copied to clipboard!",
      sendAsset: "Send Asset",
      selectAsset: "Select Asset",
      amount: "Amount",
      recipientAddress: "Recipient Wallet Address",
      sendConfirm: "Send",
      noAssets: "No assets available",
      insufficientBalance: "Insufficient balance",
      invalidAmount: "Amount must be greater than 0",
      invalidAddress: "Invalid or non-existent wallet address",
      transferSuccessful: "Transfer successful!",
      myWallet: "My Wallet",
      otherWallet: "Other Wallet",
      selectRecipientWallet: "Select Recipient Wallet",
      commission: "Commission (2.5%)",
      commissionCoins: "Commission in Coins",
      search: "Search...",
      totalValue: "Total Value",
      change24h: "24h Change",
      assetsCount: "Assets",
      failedToCopy: "Failed to copy address",
      walletNotFound: "Wallet not found",
      portfolioStats: "Portfolio Stats",
      noTransactions: "No transactions available",
      totalTransactions: "Total Transactions",
      totalProfitLoss: "Total Profit/Loss",
      highestPerformer: "Highest Performer",
      lowestPerformer: "Lowest Performer",
      none: "None",
      apiError: "Failed to fetch asset prices from API",
      profit: "Profit",
      currentPrice: "Current Price",
      quantity: "Quantity",
      totalValueAsset: "Total Value",
      assetDetails: "Asset Details",
      initialPrice: "Purchase price",
      changePercentage: "Change %",
      verificationRequired: "Verification required to access the wallet dashboard. Please complete the verification process."
    },
    ru: {
      createWallet: "Создать Кошелек",
      walletName: "Название Кошелька",
      create: "Создать",
      cancel: "Отмена",
      assets: "Ваши активы",
      quickActions: "Быстрые действия",
      send: "Отправить",
      swap: "Обменять",
      buy: "Купить",
      sell: "Продать",
      history: "История",
      recentTransactions: "Последние транзакции",
      portfolioChart: "График портфолио",
      chartPlaceholder: "Загрузка графика...",
      retry: "Повторить",
      error: "Ошибка загрузки данных",
      noWallets: "Кошельки еще не созданы. Создайте первый кошелек!",
      selectWallet: "Выберите кошелек для просмотра деталей",
      pleaseLogin: "Пожалуйста, войдите, чтобы управлять своими кошельками",
      copied: "Скопировано в буфер обмена!",
      sendAsset: "Отправить Актив",
      selectAsset: "Выберите Актив",
      amount: "Количество",
      recipientAddress: "Адрес Кошелька Получателя",
      sendConfirm: "Отправить",
      noAssets: "Нет доступных активов",
      insufficientBalance: "Недостаточный баланс",
      invalidAmount: "Количество должно быть больше 0",
      invalidAddress: "Недействительный или несуществующий адрес кошелька",
      transferSuccessful: "Перевод успешно выполнен!",
      myWallet: "Мой Кошелек",
      otherWallet: "Другой Кошелек",
      selectRecipientWallet: "Выберите Кошелек Получателя",
      commission: "Комиссия (2.5%)",
      commissionCoins: "Комиссия в монетах",
      search: "Поиск...",
      totalValue: "Общая стоимость",
      change24h: "Изменение за 24ч",
      assetsCount: "Активы",
      failedToCopy: "Не удалось скопировать адрес",
      walletNotFound: "Кошелек не найден",
      portfolioStats: "Статистика портфеля",
      noTransactions: "Нет доступных транзакций",
      totalTransactions: "Всего транзакций",
      totalProfitLoss: "Общая прибыль/убыток",
      highestPerformer: "Лучший актив",
      lowestPerformer: "Худший актив",
      none: "Нет",
      apiError: "Не удалось получить цены активов с API",
      profit: "Прибыль",
      currentPrice: "Текущая цена",
      quantity: "Количество",
      totalValueAsset: "Общая стоимость",
      assetDetails: "Детали актива",
      initialPrice: "Цена покупки",
      changePercentage: "Изменение %",
      verificationRequired: "Необходимо пройти верификацию для доступа к дашборду кошелька. Пожалуйста, завершите процесс верификации."
    }
  };
  const t = texts[language];

  const generateWalletAddress = () => {
    let hex = Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return `0x${hex}`;
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return address.replace(/(.{4})/g, '$1-').slice(0, -1);
  };

  const normalizeAddress = (address) => {
    if (!address) return '';
    const normalized = address.replace(/[^0-9a-fA-Fx]/g, '').toLowerCase();
    console.log('Normalized address:', normalized);
    return normalized;
  };

  const isValidAddress = (address) => {
    const regex = /^0x[0-9a-fA-F]{32,40}$/;
    const isValid = regex.test(address);
    if (!isValid) {
      console.log('Address validation failed:', address, 'Length:', address.length - 2);
    }
    return isValid;
  };

  const generateChartData = (portfolio) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    return months.map((month, index) => ({
      name: month,
      value: portfolio.reduce((sum, asset) => sum + (asset.value || 0), 0) * (1 + (Math.random() - 0.5) * 0.2)
    }));
  };

  const fetchAssetPrices = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch asset prices');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching asset prices:', err);
      throw new Error(t.apiError);
    }
  };

  const fetchData = async (walletAddress) => {
    try {
      setLoading(true);
      setError(null);

      if (!user || !user.login) {
        setAlertOpen(true);
        setAlertMessage(t.pleaseLogin);
        setAlertSeverity('warning');
        throw new Error(t.pleaseLogin);
      }

      const savedWallets = JSON.parse(localStorage.getItem(`cryptoWallets_${user.login}`)) || [];
      const wallet = savedWallets.find(w => w.address === walletAddress);

      if (!wallet) {
        setAlertOpen(true);
        setAlertMessage(t.walletNotFound);
        setAlertSeverity('error');
        throw new Error(t.walletNotFound);
      }

      let portfolio = wallet.portfolio || [];
      const transactions = wallet.transactions || [];

      if (portfolio.length > 0) {
        const marketData = await fetchAssetPrices();
        portfolio = portfolio.map(asset => {
          const marketAsset = marketData.find(
            ma => ma.symbol.toLowerCase() === asset.symbol.toLowerCase() ||
                  ma.name.toLowerCase() === asset.name.toLowerCase()
          );
          if (marketAsset) {
            const newPrice = marketAsset.current_price;
            const newValue = asset.amount * newPrice;
            const change24h = marketAsset.price_change_percentage_24h || 0;
            const buyPrice = asset.buyPrice || (asset.initialValue / asset.amount);
            return {
              ...asset,
              value: newValue,
              change: parseFloat(change24h.toFixed(2)),
              image: marketAsset.image || asset.image,
              buyPrice: buyPrice,
              currentPrice: newPrice
            };
          }
          return asset;
        });
      }

      const balance = portfolio.reduce((sum, asset) => sum + (asset.value || 0), 0);

      const updatedWallets = savedWallets.map(w => 
        w.address === walletAddress ? { ...w, portfolio, balance, transactions } : w
      );
      localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(updatedWallets));
      setWallets(updatedWallets);

      setSelectedWallet({
        ...wallet,
        balance,
        portfolio,
        transactions
      });
      setChartData(generateChartData(portfolio));
    } catch (err) {
      setError(err.message);
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.login) {
      const savedWallets = localStorage.getItem(`cryptoWallets_${user.login}`);
      setWallets(savedWallets ? JSON.parse(savedWallets) : []);
    } else {
      setWallets([]);
      setSelectedWallet(null);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.login) {
      localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(wallets));
      if (wallets.length > 0 && !selectedWallet) {
        setSelectedWallet(wallets[0]);
        fetchData(wallets[0].address);
      }
    }
  }, [wallets, user]);

  useEffect(() => {
    if (selectedWallet && user && user.login) {
      const interval = setInterval(() => {
        fetchData(selectedWallet.address);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedWallet, user]);

  const handleCreateWallet = () => {
    if (!user) {
      setAlertOpen(true);
      setAlertMessage(t.pleaseLogin);
      setAlertSeverity('warning');
      return;
    }
    if (!newWalletName.trim()) {
      setAlertOpen(true);
      setAlertMessage(t.walletName + ' is required');
      setAlertSeverity('warning');
      return;
    }
    const newWallet = {
      name: newWalletName,
      address: generateWalletAddress(),
      createdAt: new Date().toISOString(),
      portfolio: [],
      transactions: [],
      balance: 0
    };
    setWallets(prev => [...prev, newWallet]);
    setNewWalletName('');
    setOpenCreateWallet(false);
    setSelectedWallet(newWallet);
    localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify([...wallets, newWallet]));
    window.location.reload();
  };

  const handleSelectWallet = (wallet) => {
    setSelectedWallet(wallet);
    fetchData(wallet.address);
  };

  const handleBuyCoin = () => {
    if (!selectedWallet) {
      setAlertOpen(true);
      setAlertMessage(t.selectWallet);
      setAlertSeverity('warning');
      return;
    }
    navigate('/pay', { state: { wallet: selectedWallet } });
  };

  const handleSellCoin = () => {
    if (!selectedWallet) {
      setAlertOpen(true);
      setAlertMessage(t.selectWallet);
      setAlertSeverity('warning');
      return;
    }
    navigate('/sell', { state: { wallet: selectedWallet } });
  };

  const handleSwap = () => {
    if (!selectedWallet) {
      setAlertOpen(true);
      setAlertMessage(t.selectWallet);
      setAlertSeverity('warning');
      return;
    }
    navigate('/swap', { state: { wallet: selectedWallet } });
  };

  const handleSend = () => {
    if (!selectedWallet) {
      setAlertOpen(true);
      setAlertMessage(t.selectWallet);
      setAlertSeverity('warning');
      return;
    }
    if (!selectedWallet.portfolio || selectedWallet.portfolio.length === 0) {
      setAlertOpen(true);
      setAlertMessage(t.noAssets);
      setAlertSeverity('warning');
      return;
    }
    setSendAsset(selectedWallet.portfolio[0].symbol);
    setSendAmount('');
    setRecipientAddress('');
    setWalletType('other');
    setOpenSendDialog(true);
  };

  const handleHistory = () => {
    if (!selectedWallet) {
      setAlertOpen(true);
      setAlertMessage(t.selectWallet);
      setAlertSeverity('warning');
      return;
    }
    navigate('/history', { state: { wallet: selectedWallet } });
  };

  const confirmSend = () => {
    if (!sendAsset) {
      setAlertOpen(true);
      setAlertMessage(t.selectAsset);
      setAlertSeverity('warning');
      return;
    }
    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      setAlertOpen(true);
      setAlertMessage(t.invalidAmount);
      setAlertSeverity('warning');
      return;
    }
    if (!recipientAddress) {
      setAlertOpen(true);
      setAlertMessage(t.invalidAddress);
      setAlertSeverity('warning');
      return;
    }

    const normalizedRecipientAddress = normalizeAddress(recipientAddress);
    if (walletType === 'other' && !isValidAddress(normalizedRecipientAddress)) {
      setAlertOpen(true);
      setAlertMessage(t.invalidAddress);
      setAlertSeverity('warning');
      return;
    }

    const asset = selectedWallet.portfolio.find(a => a.symbol === sendAsset);
    if (!asset || asset.amount < parseFloat(sendAmount)) {
      setAlertOpen(true);
      setAlertMessage(t.insufficientBalance);
      setAlertSeverity('warning');
      return;
    }

    const transferAmount = parseFloat(sendAmount);
    const assetPricePerUnit = asset.value / asset.amount;
    const transferValue = transferAmount * assetPricePerUnit;
    const commissionRate = 0.025;
    const commission = transferValue * commissionRate;
    const totalDeduction = transferValue + commission;

    if (asset.value < totalDeduction) {
      setAlertOpen(true);
      setAlertMessage(t.insufficientBalance);
      setAlertSeverity('warning');
      return;
    }

    let recipientWallet = null;
    let recipientUserLogin = user.login;
    let finalRecipientAddress = normalizedRecipientAddress;

    const senderWallets = [...wallets];
    const senderWalletIndex = senderWallets.findIndex(w => w.address === selectedWallet.address);
    const senderAssetIndex = senderWallets[senderWalletIndex].portfolio.findIndex(a => a.symbol === sendAsset);

    if (walletType === 'my') {
      recipientWallet = senderWallets.find(w => w.address === recipientAddress);
      if (!recipientWallet || recipientAddress === selectedWallet.address) {
        setAlertOpen(true);
        setAlertMessage(t.invalidAddress);
        setAlertSeverity('warning');
        return;
      }
      finalRecipientAddress = recipientAddress;
    } else {
      const allUsersKeys = Object.keys(localStorage).filter(key => key.startsWith('cryptoWallets_'));
      console.log('Searching for address:', normalizedRecipientAddress);
      for (const userKey of allUsersKeys) {
        console.log('Checking wallets in:', userKey);
        try {
          const userWallets = JSON.parse(localStorage.getItem(userKey)) || [];
          const foundWallet = userWallets.find(w => normalizeAddress(w.address) === normalizedRecipientAddress);
          if (foundWallet) {
            recipientWallet = foundWallet;
            recipientUserLogin = userKey.replace('cryptoWallets_', '');
            console.log('Found recipient wallet:', foundWallet.address, 'for user:', recipientUserLogin);
            break;
          }
        } catch (err) {
          console.error(`Error parsing wallets for ${userKey}:`, err);
        }
      }
      if (!recipientWallet) {
        console.log('No wallet found for address:', normalizedRecipientAddress);
        setAlertOpen(true);
        setAlertMessage(t.invalidAddress);
        setAlertSeverity('warning');
        return;
      }
    }

    const isSuspicious = transferValue >= 5000;
    const transactionStatus = isSuspicious ? 'Suspicious' : 'Completed';

    senderWallets[senderWalletIndex].portfolio[senderAssetIndex].amount -= transferAmount;
    senderWallets[senderWalletIndex].portfolio[senderAssetIndex].value -= transferValue;

    if (senderWallets[senderWalletIndex].portfolio[senderAssetIndex].amount <= 0) {
      senderWallets[senderWalletIndex].portfolio.splice(senderAssetIndex, 1);
    }

    const senderTransaction = {
      id: `tx${Date.now()}`,
      type: 'Sent',
      amount: transferAmount,
      currency: sendAsset,
      date: new Date().toLocaleString(),
      status: transactionStatus,
      address: finalRecipientAddress,
      commission: commission.toFixed(2),
      total: totalDeduction.toFixed(2)
    };
    senderWallets[senderWalletIndex].transactions.unshift(senderTransaction);

    senderWallets[senderWalletIndex].balance = senderWallets[senderWalletIndex].portfolio.reduce(
      (sum, asset) => sum + (asset.value || 0), 0
    );

    const updatedSenderTransactions = senderWallets[senderWalletIndex].transactions;
    updateUserByLogin(user.login, { transactions: updatedSenderTransactions });

    if (walletType === 'my') {
      const recipientWalletIndex = senderWallets.findIndex(w => w.address === recipientAddress);
      if (!senderWallets[recipientWalletIndex].portfolio) {
        senderWallets[recipientWalletIndex].portfolio = [];
      }
      const recipientAssetIndex = senderWallets[recipientWalletIndex].portfolio.findIndex(a => a.symbol === sendAsset);

      if (recipientAssetIndex !== -1) {
        senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].amount += transferAmount;
        senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].value += transferValue;
        senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].initialValue =
          (senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].initialValue || 0) +
          (transferValue * (1 - commissionRate));
        senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].buyPrice =
          senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].initialValue /
          senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].amount;
      } else {
        senderWallets[recipientWalletIndex].portfolio.push({
          symbol: sendAsset,
          name: asset.name,
          amount: transferAmount,
          value: transferValue,
          initialValue: transferValue * (1 - commissionRate),
          buyPrice: (transferValue * (1 - commissionRate)) / transferAmount,
          change: asset.change,
          image: asset.image
        });
      }

      const recipientTransaction = {
        id: `tx${Date.now()}`,
        type: 'Received',
        amount: transferAmount,
        currency: sendAsset,
        date: new Date().toLocaleString(),
        status: transactionStatus,
        address: selectedWallet.address,
        commission: '0.00',
        total: transferValue.toFixed(2)
      };
      if (!senderWallets[recipientWalletIndex].transactions) {
        senderWallets[recipientWalletIndex].transactions = [];
      }
      senderWallets[recipientWalletIndex].transactions.unshift(recipientTransaction);

      senderWallets[recipientWalletIndex].balance = senderWallets[recipientWalletIndex].portfolio.reduce(
        (sum, asset) => sum + (asset.value || 0), 0
      );

      console.log('Saving senderWallets for my wallet transfer:', senderWallets);
      localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(senderWallets));

      setWallets(senderWallets);
      setSelectedWallet({
        ...senderWallets[senderWalletIndex],
        balance: senderWallets[senderWalletIndex].balance,
        portfolio: senderWallets[senderWalletIndex].portfolio,
        transactions: senderWallets[senderWalletIndex].transactions
      });
      setChartData(generateChartData(senderWallets[senderWalletIndex].portfolio));

      updateUserByLogin(user.login, { transactions: senderWallets[recipientWalletIndex].transactions });
    } else {
      let recipientWallets = [];
      try {
        recipientWallets = JSON.parse(localStorage.getItem(`cryptoWallets_${recipientUserLogin}`)) || [];
      } catch (err) {
        console.error(`Error parsing recipient wallets for ${recipientUserLogin}:`, err);
        setAlertOpen(true);
        setAlertMessage(t.invalidAddress);
        setAlertSeverity('warning');
        return;
      }
      const recipientWalletIndex = recipientWallets.findIndex(w => normalizeAddress(w.address) === finalRecipientAddress);

      if (recipientWalletIndex === -1) {
        console.log('Recipient wallet not found in recipientWallets:', finalRecipientAddress);
        setAlertOpen(true);
        setAlertMessage(t.invalidAddress);
        setAlertSeverity('warning');
        return;
      }

      if (!recipientWallets[recipientWalletIndex].portfolio) {
        recipientWallets[recipientWalletIndex].portfolio = [];
      }
      const recipientAssetIndex = recipientWallets[recipientWalletIndex].portfolio.findIndex(a => a.symbol === sendAsset);

      if (recipientAssetIndex !== -1) {
        recipientWallets[recipientWalletIndex].portfolio[recipientAssetIndex].amount += transferAmount;
        recipientWallets[recipientWalletIndex].portfolio[recipientAssetIndex].value += transferValue;
        recipientWallets[recipientWalletIndex].portfolio[recipientAssetIndex].initialValue =
          (recipientWallets[recipientWalletIndex].portfolio[recipientAssetIndex].initialValue || 0) +
          (transferValue * (1 - commissionRate));
        recipientWallets[recipientWalletIndex].portfolio[recipientAssetIndex].buyPrice =
          recipientWallets[recipientWalletIndex].portfolio[recipientAssetIndex].initialValue /
          recipientWallets[recipientWalletIndex].portfolio[recipientAssetIndex].amount;
      } else {
        recipientWallets[recipientWalletIndex].portfolio.push({
          symbol: sendAsset,
          name: asset.name,
          amount: transferAmount,
          value: transferValue,
          initialValue: transferValue * (1 - commissionRate),
          buyPrice: (transferValue * (1 - commissionRate)) / transferAmount,
          change: asset.change,
          image: asset.image
        });
      }

      const recipientTransaction = {
        id: `tx${Date.now()}`,
        type: 'Received',
        amount: transferAmount,
        currency: sendAsset,
        date: new Date().toLocaleString(),
        status: transactionStatus,
        address: selectedWallet.address,
        commission: '0.00',
        total: transferValue.toFixed(2)
      };
      if (!recipientWallets[recipientWalletIndex].transactions) {
        recipientWallets[recipientWalletIndex].transactions = [];
      }
      recipientWallets[recipientWalletIndex].transactions.unshift(recipientTransaction);

      recipientWallets[recipientWalletIndex].balance = recipientWallets[recipientWalletIndex].portfolio.reduce(
        (sum, asset) => sum + (asset.value || 0), 0
      );

      console.log('Saving senderWallets:', senderWallets);
      console.log('Saving recipientWallets:', recipientWallets);
      localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(senderWallets));
      localStorage.setItem(`cryptoWallets_${recipientUserLogin}`, JSON.stringify(recipientWallets));

      setWallets(senderWallets);
      setSelectedWallet({
        ...senderWallets[senderWalletIndex],
        balance: senderWallets[senderWalletIndex].balance,
        portfolio: senderWallets[senderWalletIndex].portfolio,
        transactions: senderWallets[senderWalletIndex].transactions
      });
      setChartData(generateChartData(senderWallets[senderWalletIndex].portfolio));

      updateUserByLogin(recipientUserLogin, { transactions: recipientWallets[recipientWalletIndex].transactions });
    }

    setOpenSendDialog(false);
    setSendAsset('');
    setSendAmount('');
    setRecipientAddress('');
    setWalletType('other');
    setAlertOpen(true);
    setAlertMessage(t.transferSuccessful);
    setAlertSeverity('success');
  };

  const handleCopyAddress = () => {
    if (selectedWallet && selectedWallet.address) {
      navigator.clipboard.writeText(selectedWallet.address).then(() => {
        setAlertOpen(true);
        setAlertMessage(t.copied);
        setAlertSeverity('success');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        setAlertOpen(true);
        setAlertMessage(t.failedToCopy);
        setAlertSeverity('error');
      });
    }
  };

  const handleOpenAssetDialog = (asset) => {
    setSelectedAsset(asset);
    setOpenAssetDialog(true);
  };

  const handleCloseAssetDialog = () => {
    setOpenAssetDialog(false);
    setSelectedAsset(null);
  };

  const filteredPortfolio = useMemo(() => {
    if (!selectedWallet || !selectedWallet.portfolio) return [];
    return selectedWallet.portfolio.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedWallet, searchTerm]);

  useEffect(() => {
    console.log('Current user object:', user);
    console.log('KYC status:', user?.kycStatus);
  }, [user]);

  if (!user) {
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
          variant="h4" 
          sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
        >
          {t.pleaseLogin}
        </Typography>
      </Box>
    );
  }

  const isKycConfirmed = user.kycStatus === 'Подтвержден' || user.kycStatus === 'confirmed';
  if (!isKycConfirmed) {
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
          variant="h4" 
          sx={{ color: theme === 'dark' ? '#ffffff' : '#000000', textAlign: 'center' }}
        >
          {t.verificationRequired}
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ 
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
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        p: 3, 
        bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5' 
      }}>
        <Typography color="error" sx={{ mb: 2, color: theme === 'dark' ? '#f44336' : '#d32f2f' }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<HistoryIcon />} 
          onClick={() => fetchData(selectedWallet?.address)}
          sx={{
            bgcolor: theme === 'dark' ? '#4caf50' : '#2e7d32',
            color: '#ffffff',
            '&:hover': {
              bgcolor: theme === 'dark' ? '#66bb6a' : '#388e3c'
            }
          }}
        >
          {t.retry}
        </Button>
      </Box>
    );
  }

  const totalTransactions = selectedWallet?.transactions?.length || 0;
  const totalProfitLoss = selectedWallet?.portfolio?.reduce((sum, asset) => {
    if (asset.currentPrice && asset.buyPrice) {
      return sum + ((asset.currentPrice - asset.buyPrice) * asset.amount);
    }
    return sum;
  }, 0).toFixed(2) || 0;
  const highestPerformer = selectedWallet?.portfolio?.length > 0
    ? selectedWallet.portfolio.reduce((max, asset) => (asset.change > max.change ? asset : max), selectedWallet.portfolio[0])
    : null;
  const lowestPerformer = selectedWallet?.portfolio?.length > 0
    ? selectedWallet.portfolio.reduce((min, asset) => (asset.change < min.change ? asset : min), selectedWallet.portfolio[0])
    : null;

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5', minHeight: '100vh' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          ...(language === 'ru' && { pr: 1.25 })
        }}>
          {selectedWallet && selectedWallet.address ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              ...(language === 'ru' && { mr: 0.25 })
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mr: 2, 
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  ...(language === 'ru' && { mr: 0.25 })
                }}
              >
                {formatAddress(selectedWallet.address)}
              </Typography>
              <Tooltip title={t.copied}>
                <IconButton 
                  color="primary"
                  onClick={handleCopyAddress} 
                  size="small"
                >
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: theme === 'dark' ? '#ffffff' : '#000000',
                ...(language === 'ru' && { mr: 1.25 })
              }}
            >
              {t.noWallets}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={t.createWallet}>
              <IconButton 
                color="primary"
                onClick={() => setOpenCreateWallet(true)}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            {wallets.map((wallet, index) => (
              <Chip
                key={index}
                icon={<WalletIcon />}
                label={wallet.name}
                onClick={() => handleSelectWallet(wallet)}
                sx={{ 
                  ml: 1,
                  p: 1,
                  bgcolor: selectedWallet?.address === wallet.address ? 
                    (theme === 'dark' ? '#4caf50' : '#2e7d32') : 
                    (theme === 'dark' ? '#1e1e1e' : '#ffffff'),
                  color: selectedWallet?.address === wallet.address ? 
                    '#ffffff' : 
                    (theme === 'dark' ? '#ffffff' : '#000000'),
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: theme === 'dark' ? '#555' : '#e0e0e0'
                  },
                  ...(language === 'ru' && { mr: 0.25 })
                }}
              />
            ))}
          </Box>
        </Box>

        <Dialog 
          open={openCreateWallet} 
          onClose={() => setOpenCreateWallet(false)}
          PaperProps={{
            sx: {
              bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }
          }}
        >
          <DialogTitle>{t.createWallet}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t.walletName}
              fullWidth
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
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
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenCreateWallet(false)}
              sx={{ color: theme === 'dark' ? '#f44336' : '#d32f2f' }}
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={handleCreateWallet}
              sx={{ color: theme === 'dark' ? '#4caf50' : '#2e7d32' }}
            >
              {t.create}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openSendDialog} 
          onClose={() => setOpenSendDialog(false)}
          PaperProps={{
            sx: {
              bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }
          }}
        >
          <DialogTitle>{t.sendAsset}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                {t.selectAsset}
              </InputLabel>
              <Select
                value={sendAsset}
                onChange={(e) => setSendAsset(e.target.value)}
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
                {selectedWallet?.portfolio?.map(asset => (
                  <MenuItem key={asset.symbol} value={asset.symbol}>
                    {asset.name} ({asset.symbol})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={t.amount}
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              sx={{ mb: 2 }}
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
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup
                row
                value={walletType}
                onChange={(e) => setWalletType(e.target.value)}
              >
                <FormControlLabel 
                  value="my" 
                  control={<Radio sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />} 
                  label={t.myWallet} 
                  sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
                />
                <FormControlLabel 
                  value="other" 
                  control={<Radio sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />} 
                  label={t.otherWallet} 
                  sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
                />
              </RadioGroup>
            </FormControl>
            {walletType === 'my' ? (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                  {t.selectRecipientWallet}
                </InputLabel>
                <Select
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  label={t.selectRecipientWallet}
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
                  {wallets
                    .filter(wallet => wallet.address !== selectedWallet?.address)
                    .map(wallet => (
                      <MenuItem key={wallet.address} value={wallet.address}>
                        {wallet.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label={t.recipientAddress}
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
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
            )}
            {sendAsset && sendAmount > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                >
                  {t.commission}: ${(parseFloat(sendAmount) * (selectedWallet.portfolio.find(a => a.symbol === sendAsset)?.value / selectedWallet.portfolio.find(a => a.symbol === sendAsset)?.amount) * 0.025).toFixed(2)}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                >
                  {t.commissionCoins}: {(parseFloat(sendAmount) * 0.025).toFixed(8)} {sendAsset}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenSendDialog(false)}
              sx={{ color: theme === 'dark' ? '#f44336' : '#d32f2f' }}
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={confirmSend}
              sx={{ color: theme === 'dark' ? '#4caf50' : '#2e7d32' }}
            >
              {t.sendConfirm}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openAssetDialog} 
          onClose={handleCloseAssetDialog}
          PaperProps={{
            sx: {
              bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }
          }}
        >
          <DialogTitle>{t.assetDetails}</DialogTitle>
          <DialogContent>
            {selectedAsset && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={selectedAsset.image} 
                    sx={{ mr: 2, width: 40, height: 40, bgcolor: theme === 'dark' ? '#333' : '#eee' }}
                  >
                    <TokenIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedAsset.name} ({selectedAsset.symbol})</Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                    >
                      {t.quantity}: {selectedAsset.amount.toLocaleString()} {selectedAsset.symbol}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1">
                  {t.currentPrice}: ${selectedAsset.currentPrice.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  {t.initialPrice}: ${selectedAsset.buyPrice.toLocaleString()}
                </Typography>
                <Typography variant="body1">
                  {t.totalValueAsset}: ${selectedAsset.value.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: selectedAsset.change >= 0 ? (theme === 'dark' ? '#4caf50' : '#2e7d32') : (theme === 'dark' ? '#f44336' : '#d32f2f') 
                  }}
                >
                  {t.changePercentage}: {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)}%
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: (selectedAsset.currentPrice - selectedAsset.buyPrice) * selectedAsset.amount >= 0 ? 
                      (theme === 'dark' ? '#4caf50' : '#2e7d32') : 
                      (theme === 'dark' ? '#f44336' : '#d32f2f') 
                  }}
                >
                  {t.profit}: {((selectedAsset.currentPrice - selectedAsset.buyPrice) * selectedAsset.amount).toFixed(2) >= 0 ? '+' : ''}$
                  {Math.abs((selectedAsset.currentPrice - selectedAsset.buyPrice) * selectedAsset.amount).toLocaleString()}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAssetDialog} sx={{ color: theme === 'dark' ? '#f44336' : '#d32f2f' }}>
              {t.cancel}
            </Button>
          </DialogActions>
        </Dialog>

        {selectedWallet && (
          <>
            <Box sx={{ overflow: 'hidden' }}>
              <Box sx={{ 
                overflowX: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                '-ms-overflow-style': 'none'
              }}>
                <Grid container spacing={3} wrap="nowrap">
                  <Grid item xs={7} sx={{ flexShrink: 0 }}>
                    <Paper sx={{ 
                      p: 3,
                      bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                      borderRadius: 2,
                      color: theme === 'dark' ? '#ffffff' : '#000000'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t.assets}
                      </Typography>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder={t.search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />
                            </InputAdornment>
                          ),
                          sx: {
                            mb: 2,
                            bgcolor: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
                            borderRadius: 1,
                            '& .MuiInputBase-input': {
                              color: theme === 'dark' ? '#ffffff' : '#000000'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme === 'dark' ? '#333' : '#e0e0e0'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme === 'dark' ? '#555' : '#bdbdbd'
                            }
                          }
                        }}
                      />
                      {filteredPortfolio.length > 0 ? (
                        filteredPortfolio.map((asset, index) => (
                          <Box 
                            key={index} 
                            onClick={() => handleOpenAssetDialog(asset)} 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              py: 2,
                              cursor: 'pointer',
                              borderBottom: index !== filteredPortfolio.length - 1 ? `1px solid ${theme === 'dark' ? '#333' : '#eee'}` : 'none',
                              '&:hover': {
                                bgcolor: theme === 'dark' ? '#2e2e2e' : '#f5f5f5'
                              },
                              ...(language === 'ru' && { pr: 1.25 })
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={asset.image} 
                                sx={{ 
                                  mr: 2,
                                  width: 40, 
                                  height: 40,
                                  bgcolor: theme === 'dark' ? '#333' : '#eee'
                                }}
                              >
                                <TokenIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }} />
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1">{asset.name}</Typography>
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                                >
                                  ${asset.currentPrice.toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="subtitle1">
                                {asset.amount.toLocaleString()} {asset.symbol}
                              </Typography>
                              <Typography variant="body2">
                                ${asset.value.toLocaleString()}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography 
                          color="text.secondary"
                          sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                        >
                          {t.noAssets}
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={5} sx={{ flexShrink: 0 }}>
                    <Paper sx={{ 
                      p: 3,
                      mb: 3,
                      bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                      borderRadius: 2,
                      color: theme === 'dark' ? '#ffffff' : '#000000'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t.quickActions}
                      </Typography>
                      <Grid container spacing={language === 'ru' ? 0 : 2}>
                        {[
                          { icon: <SendIcon />, label: t.send, onClick: handleSend },
                          { icon: <SwapIcon />, label: t.swap, onClick: handleSwap },
                          { icon: <ChartIcon />, label: t.buy, onClick: handleBuyCoin },
                          { icon: <SellIcon />, label: t.sell, onClick: handleSellCoin },
                          { icon: <HistoryIcon />, label: t.history, onClick: handleHistory }
                        ].map((action, index) => (
                          <Grid item xs={language === 'ru' ? 12 : 6} key={index}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={action.icon}
                              onClick={action.onClick}
                              sx={{
                                p: 2,
                                borderColor: theme === 'dark' ? '#333' : '#e0e0e0',
                                color: theme === 'dark' ? '#ffffff' : '#000000',
                                ...(language === 'ru' && {
                                  whiteSpace: 'normal',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden'
                                }),
                                '&:hover': {
                                  borderColor: theme === 'dark' ? '#555' : '#bdbdbd',
                                  bgcolor: theme === 'dark' ? '#2e2e2e' : '#f5f5f5'
                                },
                                ...(language === 'ru' && { pr: 2 })
                              }}
                            >
                              {action.label}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>

                    <Paper sx={{ 
                      p: 3,
                      bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                      borderRadius: 2,
                      color: theme === 'dark' ? '#ffffff' : '#000000'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t.portfolioStats}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ mb: 2, ...(language === 'ru' && { pr: 2 }) }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                            >
                              {t.totalValue}
                            </Typography>
                            <Typography variant="h6">
                              ${selectedWallet.balance.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2, ...(language === 'ru' && { pr: 2 }) }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                            >
                              {t.totalTransactions}
                            </Typography>
                            <Typography variant="h6">
                              {totalTransactions}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2, ...(language === 'ru' && { pr: 2 }) }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                            >
                              {t.highestPerformer}
                            </Typography>
                            <Typography variant="h6">
                              {highestPerformer ? `${highestPerformer.name} (${highestPerformer.change.toFixed(2)}%)` : t.none}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ mb: 2, ...(language === 'ru' && { pr: 2 }) }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                            >
                              {t.change24h}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: selectedWallet.portfolio.reduce((sum, coin) => sum + (coin.change || 0), 0) >= 0 ? 
                                  (theme === 'dark' ? '#4caf50' : '#2e7d32') : 
                                  (theme === 'dark' ? '#f44336' : '#d32f2f') 
                              }}
                            >
                              {selectedWallet.portfolio.reduce((sum, coin) => sum + (coin.change || 0), 0).toFixed(2)}%
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2, ...(language === 'ru' && { pr: 2 }) }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                            >
                              {t.totalProfitLoss}
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: parseFloat(totalProfitLoss) >= 0 ? 
                                  (theme === 'dark' ? '#4caf50' : '#2e7d32') : 
                                  (theme === 'dark' ? '#f44336' : '#d32f2f') 
                              }}
                            >
                              {parseFloat(totalProfitLoss) >= 0 ? '+' : ''}${Math.abs(parseFloat(totalProfitLoss)).toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ ...(language === 'ru' && { pr: 2 }) }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                            >
                              {t.lowestPerformer}
                            </Typography>
                            <Typography variant="h6">
                              {lowestPerformer ? `${lowestPerformer.name} (${lowestPerformer.change.toFixed(2)}%)` : t.none}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Box sx={{ mb: 2, ...(language === 'ru' && { pr: 2 }) }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}
                        >
                          {t.assetsCount}
                        </Typography>
                        <Typography variant="h6">
                          {selectedWallet.portfolio.length}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </>
        )}
      </Box>
      <CustomAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
        severity={alertSeverity}
        sx={{
          ...(alertSeverity === 'error' && {
            backgroundColor: '#ff0000',
            color: '#ffffff'
          })
        }}
      />
    </Container>
  );
};

export default CryptoDashboard;