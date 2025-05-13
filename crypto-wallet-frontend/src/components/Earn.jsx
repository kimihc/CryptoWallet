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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Paid as TokenIcon,
  Send as SendIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert';

const Earn = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
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
  const [openCreateWallet, setOpenCreateWallet] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openStakeDialog, setOpenStakeDialog] = useState(false);
  const [sendAsset, setSendAsset] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [walletType, setWalletType] = useState('other');
  const [stakeAsset, setStakeAsset] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const texts = {
    en: {
      earn: "Earn",
      createWallet: "Create Wallet",
      walletName: "Wallet Name",
      create: "Create",
      cancel: "Cancel",
      assets: "Your Assets",
      send: "Send",
      stake: "Stake",
      stakedAssets: "Staked Assets",
      pleaseLogin: "Please log in to manage your wallets",
      noWallets: "No wallets created yet. Create your first wallet!",
      selectWallet: "Select a wallet to view details",
      copied: "Copied to clipboard!",
      sendAsset: "Send Asset",
      selectAsset: "Select Asset",
      amount: "Amount",
      recipientAddress: "Recipient Wallet Address",
      sendConfirm: "Send",
      stakeAsset: "Stake Asset",
      stakeConfirm: "Stake",
      noAssets: "No assets available",
      insufficientBalance: "Insufficient balance",
      invalidAmount: "Amount must be greater than 0",
      invalidAddress: "Invalid or non-existent wallet address",
      transferSuccessful: "Transfer successful!",
      stakeSuccessful: "Staking successful!",
      myWallet: "My Wallet",
      otherWallet: "Other Wallet",
      selectRecipientWallet: "Select Recipient Wallet",
      commission: "Commission (2.5%)",
      commissionCoins: "Commission in Coins",
      walletNotFound: "Wallet not found",
      failedToCopy: "Failed to copy address",
      staked: "Staked",
      available: "Available",
      cannotTransferStaked: "Cannot transfer staked assets",
      annualYield: "Annual Yield",
      stakingDuration: "Staking Duration (Days)",
      unstake: "Unstake"
    },
    ru: {
      earn: "Заработок",
      createWallet: "Создать Кошелек",
      walletName: "Название Кошелька",
      create: "Создать",
      cancel: "Отмена",
      assets: "Ваши активы",
      send: "Отправить",
      stake: "Застейкать",
      stakedAssets: "Застейканные активы",
      pleaseLogin: "Пожалуйста, войдите, чтобы управлять своими кошельками",
      noWallets: "Кошельки еще не созданы. Создайте первый кошелек!",
      selectWallet: "Выберите кошелек для просмотра деталей",
      copied: "Скопировано в буфер обмена!",
      sendAsset: "Отправить Актив",
      selectAsset: "Выберите Актив",
      amount: "Количество",
      recipientAddress: "Адрес Кошелька Получателя",
      sendConfirm: "Отправить",
      stakeAsset: "Застейкать Актив",
      stakeConfirm: "Застейкать",
      noAssets: "Нет доступных активов",
      insufficientBalance: "Недостаточный баланс",
      invalidAmount: "Количество должно быть больше 0",
      invalidAddress: "Недействительный или несуществующий адрес кошелька",
      transferSuccessful: "Перевод успешно выполнен!",
      stakeSuccessful: "Стейкинг успешно выполнен!",
      myWallet: "Мой Кошелек",
      otherWallet: "Другой Кошелек",
      selectRecipientWallet: "Выберите Кошелек Получателя",
      commission: "Комиссия (2.5%)",
      commissionCoins: "Комиссия в монетах",
      walletNotFound: "Кошелек не найден",
      failedToCopy: "Не удалось скопировать адрес",
      staked: "Застейкано",
      available: "Доступно",
      cannotTransferStaked: "Нельзя переводить застейканные активы",
      annualYield: "Годовая доходность",
      stakingDuration: "Длительность стейкинга (дней)",
      unstake: "Вывести из стейкинга"
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
    return address.replace(/[^0-9a-fA-Fx]/g, '').toLowerCase();
  };

  const isValidAddress = (address) => {
    const regex = /^0x[0-9a-fA-F]{32,40}$/;
    return regex.test(address);
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

      const updatedWallets = savedWallets.map(w => 
        w.address === walletAddress ? { ...w } : w
      );
      localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(updatedWallets));
      setWallets(updatedWallets);

      setSelectedWallet({
        ...wallet
      });
    } catch (err) {
      setError(err.message);
      setAlertOpen(true);
      setAlertMessage(err.message);
      setAlertSeverity('error');
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
      stakedAssets: [],
      transactions: [],
      balance: 0
    };
    setWallets(prev => [...prev, newWallet]);
    setNewWalletName('');
    setOpenCreateWallet(false);
    setSelectedWallet(newWallet);
    localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify([...wallets, newWallet]));
  };

  const handleSelectWallet = (wallet) => {
    setSelectedWallet(wallet);
    fetchData(wallet.address);
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

  const handleStake = () => {
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
    setStakeAsset(selectedWallet.portfolio[0].symbol);
    setStakeAmount('');
    setOpenStakeDialog(true);
  };

  const handleUnstake = (assetSymbol) => {
    const senderWallets = [...wallets];
    const senderWalletIndex = senderWallets.findIndex(w => w.address === selectedWallet.address);
    const stakedAssetIndex = senderWallets[senderWalletIndex].stakedAssets.findIndex(a => a.symbol === assetSymbol);

    if (stakedAssetIndex === -1) return;

    const stakedAsset = senderWallets[senderWalletIndex].stakedAssets[stakedAssetIndex];
    const assetIndex = senderWallets[senderWalletIndex].portfolio.findIndex(a => a.symbol === assetSymbol);

    if (assetIndex !== -1) {
      senderWallets[senderWalletIndex].portfolio[assetIndex].amount += stakedAsset.amount;
      senderWallets[senderWalletIndex].portfolio[assetIndex].value += stakedAsset.value;
    } else {
      senderWallets[senderWalletIndex].portfolio.push({
        ...stakedAsset,
        amount: stakedAsset.amount,
        value: stakedAsset.value
      });
    }

    senderWallets[senderWalletIndex].stakedAssets.splice(stakedAssetIndex, 1);
    senderWallets[senderWalletIndex].balance = senderWallets[senderWalletIndex].portfolio.reduce(
      (sum, asset) => sum + (asset.value || 0), 0
    );

    localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(senderWallets));
    setWallets(senderWallets);
    setSelectedWallet({
      ...senderWallets[senderWalletIndex],
      balance: senderWallets[senderWalletIndex].balance,
      portfolio: senderWallets[senderWalletIndex].portfolio,
      stakedAssets: senderWallets[senderWalletIndex].stakedAssets
    });
    setAlertOpen(true);
    setAlertMessage(t.stakeSuccessful);
    setAlertSeverity('success');
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
    const stakedAsset = selectedWallet.stakedAssets?.find(a => a.symbol === sendAsset);

    if (!asset) {
      setAlertOpen(true);
      setAlertMessage(t.noAssets);
      setAlertSeverity('warning');
      return;
    }

    const transferAmount = parseFloat(sendAmount);
    if (asset.amount < transferAmount) {
      setAlertOpen(true);
      setAlertMessage(t.insufficientBalance);
      setAlertSeverity('warning');
      return;
    }

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
      const allUsers = Object.keys(localStorage).filter(key => key.startsWith('cryptoWallets_'));
      for (const userKey of allUsers) {
        const userWallets = JSON.parse(localStorage.getItem(userKey)) || [];
        const foundWallet = userWallets.find(w => normalizeAddress(w.address) === normalizedRecipientAddress);
        if (foundWallet) {
          recipientWallet = foundWallet;
          recipientUserLogin = userKey.replace('cryptoWallets_', '');
          break;
        }
      }
      if (!recipientWallet) {
        setAlertOpen(true);
        setAlertMessage(t.invalidAddress);
        setAlertSeverity('warning');
        return;
      }
    }

    senderWallets[senderWalletIndex].portfolio[senderAssetIndex].amount -= transferAmount;
    senderWallets[senderWalletIndex].portfolio[senderAssetIndex].value -= transferValue;

    if (senderWallets[senderWalletIndex].portfolio[senderAssetIndex].amount <= 0) {
      senderWallets[senderWalletIndex].portfolio.splice(senderAssetIndex, 1);
    }

    const senderTransaction = {
      id: `tx${Date.now()}`,
      type: 'Sent',
      amount: transferAmount,
      symbol: sendAsset,
      date: new Date().toLocaleString(),
      status: 'Completed',
      address: finalRecipientAddress,
      commission: commission.toFixed(2),
      total: totalDeduction.toFixed(2)
    };
    senderWallets[senderWalletIndex].transactions.unshift(senderTransaction);

    senderWallets[senderWalletIndex].balance = senderWallets[senderWalletIndex].portfolio.reduce(
      (sum, asset) => sum + (asset.value || 0), 0
    );

    if (walletType === 'my') {
      const recipientWalletIndex = senderWallets.findIndex(w => w.address === recipientAddress);
      if (!senderWallets[recipientWalletIndex].portfolio) {
        senderWallets[recipientWalletIndex].portfolio = [];
      }
      const recipientAssetIndex = senderWallets[recipientWalletIndex].portfolio.findIndex(a => a.symbol === sendAsset);

      if (recipientAssetIndex !== -1) {
        senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].amount += transferAmount;
        senderWallets[recipientWalletIndex].portfolio[recipientAssetIndex].value += transferValue;
      } else {
        senderWallets[recipientWalletIndex].portfolio.push({
          symbol: sendAsset,
          name: asset.name,
          amount: transferAmount,
          value: transferValue,
          change: asset.change,
          image: asset.image
        });
      }

      const recipientTransaction = {
        id: `tx${Date.now()}`,
        type: 'Received',
        amount: transferAmount,
        symbol: sendAsset,
        date: new Date().toLocaleString(),
        status: 'Completed',
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

      localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(senderWallets));
      setWallets(senderWallets);
      setSelectedWallet({
        ...senderWallets[senderWalletIndex],
        balance: senderWallets[senderWalletIndex].balance,
        portfolio: senderWallets[senderWalletIndex].portfolio,
        transactions: senderWallets[senderWalletIndex].transactions
      });
    } else {
      let recipientWallets = JSON.parse(localStorage.getItem(`cryptoWallets_${recipientUserLogin}`)) || [];
      const recipientWalletIndex = recipientWallets.findIndex(w => normalizeAddress(w.address) === finalRecipientAddress);

      if (recipientWalletIndex === -1) {
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
      } else {
        recipientWallets[recipientWalletIndex].portfolio.push({
          symbol: sendAsset,
          name: asset.name,
          amount: transferAmount,
          value: transferValue,
          change: asset.change,
          image: asset.image
        });
      }

      const recipientTransaction = {
        id: `tx${Date.now()}`,
        type: 'Received',
        amount: transferAmount,
        symbol: sendAsset,
        date: new Date().toLocaleString(),
        status: 'Completed',
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

      localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(senderWallets));
      localStorage.setItem(`cryptoWallets_${recipientUserLogin}`, JSON.stringify(recipientWallets));
      setWallets(senderWallets);
      setSelectedWallet({
        ...senderWallets[senderWalletIndex],
        balance: senderWallets[senderWalletIndex].balance,
        portfolio: senderWallets[senderWalletIndex].portfolio,
        transactions: senderWallets[senderWalletIndex].transactions
      });
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

  const confirmStake = () => {
    if (!stakeAsset) {
      setAlertOpen(true);
      setAlertMessage(t.selectAsset);
      setAlertSeverity('warning');
      return;
    }
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setAlertOpen(true);
      setAlertMessage(t.invalidAmount);
      setAlertSeverity('warning');
      return;
    }

    const asset = selectedWallet.portfolio.find(a => a.symbol === stakeAsset);
    if (!asset || asset.amount < parseFloat(stakeAmount)) {
      setAlertOpen(true);
      setAlertMessage(t.insufficientBalance);
      setAlertSeverity('warning');
      return;
    }

    const stakeAmountValue = parseFloat(stakeAmount);
    const assetPricePerUnit = asset.value / asset.amount;
    const stakeValue = stakeAmountValue * assetPricePerUnit;

    const senderWallets = [...wallets];
    const senderWalletIndex = senderWallets.findIndex(w => w.address === selectedWallet.address);
    const senderAssetIndex = senderWallets[senderWalletIndex].portfolio.findIndex(a => a.symbol === stakeAsset);

    senderWallets[senderWalletIndex].portfolio[senderAssetIndex].amount -= stakeAmountValue;
    senderWallets[senderWalletIndex].portfolio[senderAssetIndex].value -= stakeValue;

    if (senderWallets[senderWalletIndex].portfolio[senderAssetIndex].amount <= 0) {
      senderWallets[senderWalletIndex].portfolio.splice(senderAssetIndex, 1);
    }

    if (!senderWallets[senderWalletIndex].stakedAssets) {
      senderWallets[senderWalletIndex].stakedAssets = [];
    }

    const stakedAssetIndex = senderWallets[senderWalletIndex].stakedAssets.findIndex(a => a.symbol === stakeAsset);
    if (stakedAssetIndex !== -1) {
      senderWallets[senderWalletIndex].stakedAssets[stakedAssetIndex].amount += stakeAmountValue;
      senderWallets[senderWalletIndex].stakedAssets[stakedAssetIndex].value += stakeValue;
    } else {
      senderWallets[senderWalletIndex].stakedAssets.push({
        symbol: stakeAsset,
        name: asset.name,
        amount: stakeAmountValue,
        value: stakeValue,
        annualYield: 5, // Пример доходности
        stakingStart: new Date().toISOString(),
        stakingDuration: 30, // Пример длительности в днях
        image: asset.image
      });
    }

    senderWallets[senderWalletIndex].balance = senderWallets[senderWalletIndex].portfolio.reduce(
      (sum, asset) => sum + (asset.value || 0), 0
    );

    localStorage.setItem(`cryptoWallets_${user.login}`, JSON.stringify(senderWallets));
    setWallets(senderWallets);
    setSelectedWallet({
      ...senderWallets[senderWalletIndex],
      balance: senderWallets[senderWalletIndex].balance,
      portfolio: senderWallets[senderWalletIndex].portfolio,
      stakedAssets: senderWallets[senderWalletIndex].stakedAssets
    });

    setOpenStakeDialog(false);
    setStakeAsset('');
    setStakeAmount('');
    setAlertOpen(true);
    setAlertMessage(t.stakeSuccessful);
    setAlertSeverity('success');
  };

  const handleCopyAddress = () => {
    if (selectedWallet && selectedWallet.address) {
      navigator.clipboard.writeText(selectedWallet.address).then(() => {
        setAlertOpen(true);
        setAlertMessage(t.copied);
        setAlertSeverity('success');
      }).catch(err => {
        setAlertOpen(true);
        setAlertMessage(t.failedToCopy);
        setAlertSeverity('error');
      });
    }
  };

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5', minHeight: '100vh' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4
        }}>
          {selectedWallet && selectedWallet.address ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mr: 2, 
                  color: theme === 'dark' ? '#ffffff' : '#000000'
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
                color: theme === 'dark' ? '#ffffff' : '#000000'
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
                  }
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
                  }
                }}
              }
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
                  }
                }}
              }
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
                    }
                  }}
                }
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
          open={openStakeDialog} 
          onClose={() => setOpenStakeDialog(false)}
          PaperProps={{
            sx: {
              bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }
          }}
        >
          <DialogTitle>{t.stakeAsset}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}>
                {t.selectAsset}
              </InputLabel>
              <Select
                value={stakeAsset}
                onChange={(e) => setStakeAsset(e.target.value)}
                label={t.selectAsset}
                sx={{
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme === 'dark' ? '#333' : '#e0e0e0'
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
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputLabelProps={{
                sx: { color: theme === 'dark' ? '#ffffff' : '#000000' }
              }}
              InputProps={{
                sx: { 
                  color: theme === 'dark' ? '#ffffff' : '#000000',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme === 'dark' ? '#333' : '#e0e0e0'
                  }
                }}
              }
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setOpenStakeDialog(false)}
              sx={{ color: theme === 'dark' ? '#f44336' : '#d32f2f' }}
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={confirmStake}
              sx={{ color: theme === 'dark' ? '#4caf50' : '#2e7d32' }}
            >
              {t.stakeConfirm}
            </Button>
          </DialogActions>
        </Dialog>

        {selectedWallet && (
          <>
            <Box sx={{ overflow: 'hidden' }}>
              <Box sx={{ 
                overflowX: 'auto',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none'
              }}>
                <Grid container spacing={3} wrap="nowrap">
                  <Grid item xs={7} sx={{ flexShrink: 0 }}>
                    <Paper sx={{ 
                      p: 3,
                      bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                      borderRadius: 2,
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                      mb: 3
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t.assets}
                      </Typography>
                      {selectedWallet.portfolio?.length > 0 ? (
                        selectedWallet.portfolio.map((asset, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              py: 2,
                              borderBottom: index !== selectedWallet.portfolio.length - 1 ? `1px solid ${theme === 'dark' ? '#333' : '#eee'}` : 'none'
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
                                  {t.available}
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

                    <Paper sx={{ 
                      p: 3,
                      bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                      borderRadius: 2,
                      color: theme === 'dark' ? '#ffffff' : '#000000'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t.stakedAssets}
                      </Typography>
                      {selectedWallet.stakedAssets?.length > 0 ? (
                        selectedWallet.stakedAssets.map((asset, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              py: 2,
                              borderBottom: index !== selectedWallet.stakedAssets.length - 1 ? `1px solid ${theme === 'dark' ? '#333' : '#eee'}` : 'none'
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
                                  {t.staked}
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
                              <Typography variant="body2">
                                {t.annualYield}: {asset.annualYield}%
                              </Typography>
                              <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => handleUnstake(asset.symbol)}
                                sx={{ mt: 1 }}
                              >
                                {t.unstake}
                              </Button>
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
                      bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                      borderRadius: 2,
                      color: theme === 'dark' ? '#ffffff' : '#000000'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t.earn}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<SendIcon />}
                            onClick={handleSend}
                            sx={{
                              p: 2,
                              borderColor: theme === 'dark' ? '#333' : '#e0e0e0',
                              color: theme === 'dark' ? '#ffffff' : '#000000',
                              '&:hover': {
                                borderColor: theme === 'dark' ? '#555' : '#bdbdbd',
                                bgcolor: theme === 'dark' ? '#2e2e2e' : '#f5f5f5'
                              }
                            }}
                          >
                            {t.send}
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<LockIcon />}
                            onClick={handleStake}
                            sx={{
                              p: 2,
                              borderColor: theme === 'dark' ? '#333' : '#e0e0e0',
                              color: theme === 'dark' ? '#ffffff' : '#000000',
                              '&:hover': {
                                borderColor: theme === 'dark' ? '#555' : '#bdbdbd',
                                bgcolor: theme === 'dark' ? '#2e2e2e' : '#f5f5f5'
                              }
                            }}
                          >
                            {t.stake}
                          </Button>
                        </Grid>
                      </Grid>
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
      />
    </Container>
  );
};

export default Earn;