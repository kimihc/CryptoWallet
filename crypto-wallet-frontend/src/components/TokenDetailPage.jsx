import React, { useState, useEffect, useContext, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Chip, 
  Avatar,
  Tabs,
  Tab,
  Divider,
  IconButton,
  LinearProgress,
  useTheme
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ShowChart as ChartIcon,
  Timeline as TimelineIcon,
  CandlestickChart as CandleIcon,
  BarChart as BarIcon,
  CurrencyExchange as ExchangeIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import LineChart from '../components/LineChart';
import CandleStickChart from '../components/CandleStickChart';
import VolumeChart from '../components/VolumeChart';
import { alpha } from '@mui/material/styles';

const translations = {
  en: {
    back: "Back to list",
    price: "Price",
    marketCap: "Market Cap",
    volume24h: "24h Volume",
    circulatingSupply: "Circulating Supply",
    allTimeHigh: "All Time High",
    allTimeLow: "All Time Low",
    priceChange: "24h Price Change",
    chart: {
      hour: "1H",
      day: "24H",
      week: "7D",
      month: "30D",
      year: "1Y",
      all: "ALL"
    },
    about: "About",
    stats: "Statistics",
    markets: "Markets"
  },
  ru: {
    back: "Назад к списку",
    price: "Цена",
    marketCap: "Капитализация",
    volume24h: "Объем 24ч",
    circulatingSupply: "Обращение",
    allTimeHigh: "Исторический максимум",
    allTimeLow: "Исторический минимум",
    priceChange: "Изменение за 24ч",
    chart: {
      hour: "1Ч",
      day: "24Ч",
      week: "7Д",
      month: "30Д",
      year: "1Г",
      all: "ВСЕ"
    },
    about: "О токене",
    stats: "Статистика",
    markets: "Рынки"
  }
};

const TokenDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const muiTheme = useTheme();

  const [tokenData, setTokenData] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('cryptoFavorites')) || []
  );
  const [activeTab, setActiveTab] = useState('chart');

  const getTextColor = () => theme === 'dark' ? '#ffffff' : '#000000';
  const getBackgroundColor = () => theme === 'dark' ? '#121212' : '#ffffff';
  const getElementBackgroundColor = () => theme === 'dark' ? '#1e1e1e' : '#f5f5f5';

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        
        const tokenResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        
        if (!tokenResponse.ok) throw new Error('Failed to fetch token data');
        const tokenJson = await tokenResponse.json();

        const historyResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365&interval=daily`
        );
        
        if (!historyResponse.ok) throw new Error('Failed to fetch history data');
        const historyJson = await historyResponse.json();

        setTokenData({
          ...tokenJson,
          tickers: tokenJson.tickers
            .filter(ticker => ticker.base === tokenJson.symbol.toUpperCase())
            .slice(0, 5) 
        });

        const formattedPrices = historyJson.prices.map(item => ({
          date: new Date(item[0]),
          price: item[1]
        }));

        const formattedVolumes = historyJson.total_volumes.map(item => ({
          date: new Date(item[0]),
          volume: item[1]
        }));

        setPriceData(formattedPrices);
        setVolumeData(formattedVolumes);
        
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [id]);

  useEffect(() => {
    localStorage.setItem('cryptoFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredPriceData = useMemo(() => {
    if (!priceData.length) return [];
    
    const now = new Date();
    let cutoffDate;
    
    switch (timeRange) {
      case 'hour':
        cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case 'day':
        cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return priceData;
    }
    
    return priceData.filter(item => item.date >= cutoffDate);
  }, [priceData, timeRange]);

  const toggleFavorite = () => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: num < 1 ? 6 : 2
    }).format(num);
  };

  const formatLargeNumber = (num) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}${language === 'ru' ? ' трлн' : 'T'}`;
    }
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}${language === 'ru' ? ' млрд' : 'B'}`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}${language === 'ru' ? ' млн' : 'M'}`;
    }
    return formatNumber(num);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!tokenData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Токен не найден</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: getBackgroundColor(),
      minHeight: '100vh',
      color: getTextColor(),
      p: 3
    }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon sx={{ color: getTextColor() }} />
          </IconButton>
          <Typography variant="h6">{t.back}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            src={tokenData.image?.large} 
            sx={{ 
              width: 48, 
              height: 48,
              mr: 2,
              bgcolor: theme === 'dark' ? '#333' : '#e0e0e0'
            }}
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {tokenData.name} ({tokenData.symbol.toUpperCase()})
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {formatNumber(tokenData.market_data.current_price.usd)}
            </Typography>
          </Box>
          <IconButton 
            onClick={toggleFavorite} 
            sx={{ ml: 'auto' }}
            size="large"
          >
            {favorites.includes(id) ? (
              <StarIcon color="primary" fontSize="large" />
            ) : (
              <StarBorderIcon sx={{ color: getTextColor() }} fontSize="large" />
            )}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip 
            label={`${t.price}: ${formatNumber(tokenData.market_data.current_price.usd)}`}
            sx={{ bgcolor: getElementBackgroundColor(), color: getTextColor() }}
          />
          <Chip 
            label={`${t.marketCap}: ${formatLargeNumber(tokenData.market_data.market_cap.usd)}`}
            sx={{ bgcolor: getElementBackgroundColor(), color: getTextColor() }}
          />
          <Chip 
            label={`${t.volume24h}: ${formatLargeNumber(tokenData.market_data.total_volume.usd)}`}
            sx={{ bgcolor: getElementBackgroundColor(), color: getTextColor() }}
          />
          {tokenData.market_data.circulating_supply && (
            <Chip 
              label={`${t.circulatingSupply}: ${tokenData.market_data.circulating_supply.toLocaleString()} ${tokenData.symbol.toUpperCase()}`}
              sx={{ bgcolor: getElementBackgroundColor(), color: getTextColor() }}
            />
          )}
          <Chip 
            label={`${t.allTimeHigh}: ${formatNumber(tokenData.market_data.ath.usd)}`}
            sx={{ bgcolor: getElementBackgroundColor(), color: getTextColor() }}
          />
          <Chip 
            label={`${t.allTimeLow}: ${formatNumber(tokenData.market_data.atl.usd)}`}
            sx={{ bgcolor: getElementBackgroundColor(), color: getTextColor() }}
          />
          <Chip 
            label={`${t.priceChange}: ${tokenData.market_data.price_change_percentage_24h.toFixed(2)}%`}
            sx={{
              bgcolor: tokenData.market_data.price_change_percentage_24h >= 0 
                ? alpha('#4caf50', theme === 'dark' ? 0.2 : 0.1)
                : alpha('#f44336', theme === 'dark' ? 0.2 : 0.1),
              color: tokenData.market_data.price_change_percentage_24h >= 0 ? '#4caf50' : '#f44336'
            }}
          />
        </Box>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab 
          value="chart" 
          label={t.chart.day} 
          icon={<ChartIcon />} 
          iconPosition="start"
          sx={{ color: getTextColor() }}
        />
        <Tab 
          value="stats" 
          label={t.stats} 
          icon={<InfoIcon />} 
          iconPosition="start"
          sx={{ color: getTextColor() }}
        />
        <Tab 
          value="markets" 
          label={t.markets} 
          icon={<ExchangeIcon />} 
          iconPosition="start"
          sx={{ color: getTextColor() }}
        />
      </Tabs>

      {activeTab === 'chart' && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {Object.entries(t.chart).map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  onClick={() => setTimeRange(key)}
                  variant={timeRange === key ? 'filled' : 'outlined'}
                  sx={{ 
                    bgcolor: timeRange === key ? muiTheme.palette.primary.main : getElementBackgroundColor(),
                    color: timeRange === key ? '#fff' : getTextColor()
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<TimelineIcon />}
                label="Line"
                onClick={() => setChartType('line')}
                variant={chartType === 'line' ? 'filled' : 'outlined'}
                sx={{ 
                  bgcolor: chartType === 'line' ? muiTheme.palette.primary.main : getElementBackgroundColor(),
                  color: chartType === 'line' ? '#fff' : getTextColor()
                }}
              />
              <Chip
                icon={<CandleIcon />}
                label="Candle"
                onClick={() => setChartType('candle')}
                variant={chartType === 'candle' ? 'filled' : 'outlined'}
                sx={{ 
                  bgcolor: chartType === 'candle' ? muiTheme.palette.primary.main : getElementBackgroundColor(),
                  color: chartType === 'candle' ? '#fff' : getTextColor()
                }}
              />
              <Chip
                icon={<BarIcon />}
                label="Volume"
                onClick={() => setChartType('volume')}
                variant={chartType === 'volume' ? 'filled' : 'outlined'}
                sx={{ 
                  bgcolor: chartType === 'volume' ? muiTheme.palette.primary.main : getElementBackgroundColor(),
                  color: chartType === 'volume' ? '#fff' : getTextColor()
                }}
              />
            </Box>
          </Box>

          <Paper sx={{ 
            p: 2, 
            mb: 3,
            bgcolor: getElementBackgroundColor(),
            borderRadius: 2,
            height: '400px'
          }}>
            {chartType === 'line' && (
              <LineChart 
                data={filteredPriceData} 
                theme={theme}
                height={350}
              />
            )}
            {chartType === 'candle' && (
              <CandleStickChart 
                data={filteredPriceData} 
                theme={theme}
                height={350}
              />
            )}
            {chartType === 'volume' && (
              <VolumeChart 
                data={volumeData} 
                theme={theme}
                height={350}
              />
            )}
          </Paper>
        </Box>
      )}

      {activeTab === 'stats' && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              bgcolor: getElementBackgroundColor(),
              borderRadius: 2,
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t.about} {tokenData.name}
              </Typography>
              <Typography sx={{ color: getTextColor() }}>
                {tokenData.description?.en || 'No description available.'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              bgcolor: getElementBackgroundColor(),
              borderRadius: 2,
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t.stats}
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 2
              }}>
                {Object.entries(tokenData.market_data).map(([key, value]) => {
                  if (typeof value === 'object' || key === 'current_price') return null;
                  return (
                    <Box key={key}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {key.replace(/_/g, ' ')}
                      </Typography>
                      <Typography sx={{ color: getTextColor() }}>
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 'markets' && tokenData.tickers && tokenData.tickers.length > 0 && (
        <Paper sx={{ 
          p: 3,
          bgcolor: getElementBackgroundColor(),
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {t.markets}
          </Typography>
          <Box sx={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ 
                  backgroundColor: alpha(theme === 'dark' ? '#ffffff' : '#000000', 0.1)
                }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left',
                    color: getTextColor()
                  }}>Exchange</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right',
                    color: getTextColor()
                  }}>Pair</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right',
                    color: getTextColor()
                  }}>Price</th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right',
                    color: getTextColor()
                  }}>Volume</th>
                </tr>
              </thead>
              <tbody>
                {tokenData.tickers.map((ticker, index) => (
                  <tr 
                    key={index}
                    style={{ 
                      borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`,
                      '&:hover': {
                        backgroundColor: alpha(theme === 'dark' ? '#ffffff' : '#000000', 0.05)
                      }
                    }}
                  >
                    <td style={{ 
                      padding: '12px',
                      color: getTextColor()
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={ticker.market.logo} 
                          sx={{ 
                            width: 24, 
                            height: 24,
                            bgcolor: theme === 'dark' ? '#333' : '#e0e0e0'
                          }}
                        />
                        {ticker.market.name}
                      </Box>
                    </td>
                    <td style={{ 
                      padding: '12px',
                      textAlign: 'right',
                      color: getTextColor()
                    }}>
                      {ticker.base}/{ticker.target}
                    </td>
                    <td style={{ 
                      padding: '12px',
                      textAlign: 'right',
                      color: getTextColor()
                    }}>
                      {formatNumber(ticker.last)}
                    </td>
                    <td style={{ 
                      padding: '12px',
                      textAlign: 'right',
                      color: getTextColor()
                    }}>
                      {formatLargeNumber(ticker.volume)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TokenDetailPage;