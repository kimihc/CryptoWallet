import React, { useContext, useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Container,
  Avatar,
  TextField,
  Autocomplete,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Divider
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Search as SearchIcon,
  TrendingUp as TradeIcon,
  Security as SecureIcon,
  Speed as SpeedIcon,
  Language as GlobeIcon,
  Newspaper as NewsIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const HomePage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const texts = {
    en: {
      heroTitle: "CashCoin: Your Trusted Crypto Wallet",
      heroSubtitle: "Trade, manage, and secure your crypto with confidence.",
      heroCta: "Get Started",
      searchPlaceholder: "Search for a cryptocurrency...",
      moreDetails: "More Details",
      marketTitle: "Top Cryptocurrencies",
      marketSubtitle: "Explore the top performing assets in the market.",
      newsTitle: "Latest Crypto News",
      newsSubtitle: "Stay updated with the latest trends and updates in the crypto world.",
      newsItem1: "Bitcoin Hits New All-Time High at $100K",
      newsItem2: "Ethereum 2.0 Upgrade Boosts Staking Rewards",
      newsItem3: "DeFi Market Sees 20% Growth in Q1 2025",
      benefitsTitle: "Why Choose CashCoin?",
      benefit1Title: "Real-Time Analytics",
      benefit1Text: "Access live market data and advanced charting tools to make informed decisions.",
      benefit2Title: "Secure Wallet",
      benefit2Text: "Your assets are protected with multi-layer security and cold storage options.",
      benefit3Title: "Seamless Trading",
      benefit3Text: "Trade over 90+ assets with low fees and instant execution.",
      ctaTitle: "Take Your Crypto Game to the Next Level",
      ctaText: "Join CryptoHub today and unlock a world of opportunities in crypto trading.",
      ctaButton: "Sign Up Now",
      error: "Error loading assets",
      tryAgain: "Please try again later.",
      noData: "No data available"
    },
    ru: {
      heroTitle: "CashCoin: Ваш надежный криптокошелек",
      heroSubtitle: "Торгуйте, управляйте и защищайте свои криптоактивы с уверенностью.",
      heroCta: "Начать",
      searchPlaceholder: "Поиск криптовалюты...",
      moreDetails: "Подробнее",
      marketTitle: "Популярные криптовалюты",
      marketSubtitle: "Изучите самые успешные активы на рынке.",
      newsTitle: "Последние новости криптовалют",
      newsSubtitle: "Будьте в курсе последних трендов и обновлений в мире криптовалют.",
      newsItem1: "Биткоин достиг нового максимума в $100 тыс.",
      newsItem2: "Обновление Ethereum 2.0 увеличило награды за стейкинг",
      newsItem3: "Рынок DeFi вырос на 20% в первом квартале 2025 года",
      benefitsTitle: "Почему выбирают CashCoin?",
      benefit1Title: "Аналитика в реальном времени",
      benefit1Text: "Доступ к живым рыночным данным и продвинутым инструментам для анализа.",
      benefit2Title: "Безопасный кошелек",
      benefit2Text: "Ваши активы защищены многоуровневой безопасностью и холодным хранением.",
      benefit3Title: "Удобная торговля",
      benefit3Text: "Торгуйте более 90+ активами с низкими комиссиями и мгновенным исполнением.",
      ctaTitle: "Выведите свою криптоигру на новый уровень",
      ctaText: "Присоединяйтесь к CryptoHub сегодня и откройте мир возможностей в криптотрейдинге.",
      ctaButton: "Зарегистрироваться",
      error: "Ошибка загрузки активов",
      tryAgain: "Попробуйте позже.",
      noData: "Данные отсутствуют"
    }
  };
  const t = texts[language];

  const benefits = [
    { icon: <TradeIcon fontSize="large" />, title: t.benefit1Title, text: t.benefit1Text },
    { icon: <SecureIcon fontSize="large" />, title: t.benefit2Title, text: t.benefit2Text },
    { icon: <SpeedIcon fontSize="large" />, title: t.benefit3Title, text: t.benefit3Text }
  ];

  const newsItems = [
    { title: t.newsItem1, date: "May 06, 2025" },
    { title: t.newsItem2, date: "May 05, 2025" },
    { title: t.newsItem3, date: "May 04, 2025" }
  ];

  const sectionBackground = theme === 'dark'
    ? '#121212'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.95))';

  const sectionBackgroundTwo = theme === 'dark'
    ? '#000000'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.95))';

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (!isMounted) return;
        
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        );
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        if (!isMounted) return;

        setAssets(data.map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          current_price: coin.current_price || null,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0
        })));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const topAssets = assets.slice(0, 5);

  const handleGetStarted = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/wallet');
    }
  };

  const handleCryptoSelect = (cryptoId) => {
    navigate(`/tokens/${cryptoId}`);
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{t.error}: {error}</Typography>
        <Typography>{t.tryAgain}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: sectionBackgroundTwo,
      pt: 8,
      pb: 10,
      color: theme === 'dark' ? '#ffffff' : '#1a1a2e',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Container maxWidth="lg" sx={{ flex: '1 0 auto' }}>
        <Box sx={{ 
          textAlign: 'center',
          mb: 10,
          py: 6,
          px: 3,
          borderRadius: 3,
          background: sectionBackground,
          boxShadow: theme === 'dark' ? '0 8px 20px rgba(0, 0, 0, 0.5)' : '0 8px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(45deg, #7c3aed 30%, #F7931A 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '3.5rem' }
            }}
          >
            {t.heroTitle}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              color: theme === 'dark' ? '#d1d1d6' : '#616161',
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            {t.heroSubtitle}
          </Typography>
          <Box sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
            <Autocomplete
              freeSolo
              options={assets}
              getOptionLabel={(option) => option.name || searchValue}
              inputValue={searchValue}
              onInputChange={(event, newInputValue) => setSearchValue(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t.searchPlaceholder}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <SearchIcon sx={{ color: theme === 'dark' ? '#ffffff' : '#000000', mr: 1 }} />
                    ),
                    sx: {
                      bgcolor: theme === 'dark' ? '#2c2c3e' : '#ffffff',
                      borderRadius: 2,
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
              renderOption={(props, option) => (
                <ListItem
                  {...props}
                  onClick={() => handleCryptoSelect(option.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: theme === 'dark' ? '#2e2e2e' : '#f5f5f5'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={option.image} sx={{ bgcolor: theme === 'dark' ? '#333' : '#eeeeee' }} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={option.name} 
                    secondary={option.symbol.toUpperCase()}
                    secondaryTypographyProps={{ color: theme === 'dark' ? '#aaaaaa' : '#666666' }}
                  />
                </ListItem>
              )}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<WalletIcon />}
              onClick={handleGetStarted}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #7c3aed 30%, #F7931A 90%)',
                color: '#ffffff',
                '&:hover': {
                  background: 'linear-gradient(45deg, #6b2cc2, #d67e0b)'
                }
              }}
            >
              {t.heroCta}
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/tokens')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                borderColor: theme === 'dark' ? '#555' : '#bdbdbd',
                color: theme === 'dark' ? '#fff' : '#000',
                '&:hover': {
                  borderColor: theme === 'dark' ? '#777' : '#999'
                }
              }}
            >
              {t.moreDetails}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 10 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center',
              mb: 2,
              fontWeight: 700,
              color: theme === 'dark' ? '#ffffff' : '#1a1a2e'
            }}
          >
            {t.marketTitle}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              mb: 4,
              color: theme === 'dark' ? '#d1d1d6' : '#666'
            }}
          >
            {t.marketSubtitle}
          </Typography>
          <Paper sx={{ 
            p: 4,
            background: sectionBackground,
            borderRadius: 2,
            boxShadow: theme === 'dark' ? '0 6px 18px rgba(0, 0, 0, 0.4)' : '0 6px 18px rgba(0, 0, 0, 0.1)'
          }}>
            {loading ? (
              <Typography textAlign="center">Loading...</Typography>
            ) : topAssets.length === 0 ? (
              <Typography textAlign="center">{t.noData}</Typography>
            ) : (
              topAssets.map((asset, index) => (
                <Box key={asset.id}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    py: 2,
                    px: 2,
                    '&:hover': { bgcolor: theme === 'dark' ? '#3a3a50' : '#f0f0f5' },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCryptoSelect(asset.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={asset.image} sx={{ mr: 2, bgcolor: theme === 'dark' ? '#444' : '#e0e0e0' }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: theme === 'dark' ? '#ffffff' : '#1a1a2e' }}>
                          {asset.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme === 'dark' ? '#d1d1d6' : '#666' }}>
                          {asset.symbol.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ color: theme === 'dark' ? '#ffffff' : '#1a1a2e' }}>
                        {asset.current_price !== null ? `$${asset.current_price.toLocaleString()}` : t.noData}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {asset.price_change_percentage_24h >= 0 ? (
                          <UpIcon sx={{ color: '#00C853', mr: 0.5 }} fontSize="small" />
                        ) : (
                          <DownIcon sx={{ color: '#D32F2F', mr: 0.5 }} fontSize="small" />
                        )}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: asset.price_change_percentage_24h >= 0 ? '#00C853' : '#D32F2F'
                          }}
                        >
                          {asset.price_change_percentage_24h.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {index < topAssets.length - 1 && <Divider sx={{ bgcolor: theme === 'dark' ? '#444' : '#e0e0e0' }} />}
                </Box>
              ))
            )}
          </Paper>
        </Box>

        <Box sx={{ 
          mb: 10, 
          py: 6, 
          px: 3, 
          borderRadius: 3, 
          background: sectionBackground,
          boxShadow: theme === 'dark' ? '0 8px 20px rgba(0, 0, 0, 0.5)' : '0 8px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: theme === 'dark' ? '#ffffff' : '#1a1a2e'
            }}
          >
            {t.benefitsTitle}
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ 
                  p: 4,
                  height: '100%',
                  background: sectionBackground,
                  borderRadius: 2,
                  textAlign: 'center',
                  boxShadow: theme === 'dark' ? '0 6px 18px rgba(0, 0, 0, 0.4)' : '0 6px 18px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    mb: 3,
                    bgcolor: theme === 'dark' ? '#444' : '#e0e0e0',
                    borderRadius: '50%',
                    color: theme === 'dark' ? '#7c3aed' : '#F7931A'
                  }}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme === 'dark' ? '#ffffff' : '#1a1a2e' }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme === 'dark' ? '#d1d1d6' : '#666' }}>
                    {benefit.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
  
    </Box>
  );
};

export default HomePage;