import React, { useState, useContext, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Select,
  Pagination,
  LinearProgress,
  Avatar,
  IconButton,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { alpha } from '@mui/material/styles';

const translations = {
  en: {
    title: "Crypto Assets",
    search: "Search...",
    all: "All",
    favorites: "Favorites",
    gainers: "Gainers",
    losers: "Losers",
    name: "Name",
    price: "Price",
    change24h: "24h %",
    marketCap: "Market Cap",
    volume: "Volume (24h)",
    noAssets: "No assets found",
    error: "Error",
    tryAgain: "Please try again later.",
    updated: "Updated:",
    loginToFavorite: "Please log in to add to favorites"
  },
  ru: {
    title: "Криптоактивы",
    search: "Поиск...",
    all: "Все",
    favorites: "Избранные",
    gainers: "Растущие",
    losers: "Падающие",
    name: "Название",
    price: "Цена",
    change24h: "24ч %",
    marketCap: "Капитализация",
    volume: "Объем (24ч)",
    noAssets: "Активы не найдены",
    error: "Ошибка",
    tryAgain: "Попробуйте позже.",
    updated: "Обновлено:",
    loginToFavorite: "Пожалуйста, войдите, чтобы добавить в избранное"
  }
};


const CryptoAssetsPage = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const navigate = useNavigate();
  const muiTheme = useTheme();
  
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'desc' });
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const itemsPerPage = 10;

  const [favorites, setFavorites] = useState(() => {
    if (user && user.login) {
      const storedFavorites = localStorage.getItem(`cryptoFavorites_${user.login}`);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    }
    return [];
  });

  const getTextColor = () => theme === 'dark' ? '#ffffff' : '#000000';
  const getBackgroundColor = () => theme === 'dark' ? '#121212' : '#ffffff';
  const getElementBackgroundColor = () => theme === 'dark' ? '#1e1e1e' : '#f5f5f5';

  useEffect(() => {
    if (user && user.login) {
      const storedFavorites = localStorage.getItem(`cryptoFavorites_${user.login}`);
      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.login) {
      localStorage.setItem(`cryptoFavorites_${user.login}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  useEffect(() => {
    let isMounted = true;
    const fetchInterval = 30000; 

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
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
          volume: coin.total_volume,
          image: coin.image,
          favorite: user && favorites.includes(coin.id) 
        })));
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, fetchInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [favorites, user]);

  const filteredAndSortedAssets = useMemo(() => {
    if (assets.length === 0) return [];
    
    const filtered = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
                          (filter === 'favorites' && asset.favorite) ||
                          (filter === 'gainers' && asset.change24h > 0) ||
                          (filter === 'losers' && asset.change24h < 0);
      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      if (sortConfig.key === 'name' || sortConfig.key === 'symbol') {
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [assets, searchTerm, sortConfig, filter]);

  const paginatedAssets = filteredAndSortedAssets.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const toggleFavorite = (id, e) => {
    if (!user) {
      alert(t.loginToFavorite); 
      return;
    }
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };

  const handlePageChange = (event, value) => {
    setPage(value);
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
      p: 3,
      bgcolor: getBackgroundColor(),
      minHeight: '100vh',
      minWidth: '80%',
      marginLeft: '10%',
      marginRight: '10%',
      color: getTextColor()
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {t.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {lastUpdated && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t.updated} {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
          <TextField
            variant="outlined"
            size="small"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                bgcolor: getElementBackgroundColor(),
                borderRadius: 1,
                '& .MuiInputBase-input': {
                  color: getTextColor()
                }
              }
            }}
          />
          
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            IconComponent={FilterIcon}
            sx={{
              bgcolor: getElementBackgroundColor(),
              borderRadius: 1,
              minWidth: 120,
              color: getTextColor(),
              '& .MuiSelect-icon': {
                color: getTextColor()
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: getElementBackgroundColor(),
                  color: getTextColor()
                }
              }
            }}
          >
            <MenuItem value="all">{t.all}</MenuItem>
            <MenuItem value="favorites">{t.favorites}</MenuItem>
            <MenuItem value="gainers">{t.gainers}</MenuItem>
            <MenuItem value="losers">{t.losers}</MenuItem>
          </Select>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Paper sx={{ 
        mb: 3,
        bgcolor: getElementBackgroundColor(),
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: alpha(theme === 'dark' ? '#ffffff' : '#000000', 0.1)
              }}>
                <TableCell sx={{ width: '50px' }}></TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'name'}
                    direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('name')}
                    IconComponent={sortConfig.key === 'name' ? 
                      (sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon) : null}
                    sx={{ color: getTextColor() }}
                  >
                    {t.name}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortConfig.key === 'price'}
                    direction={sortConfig.key === 'price' ? sortConfig.direction : 'desc'}
                    onClick={() => handleSort('price')}
                    IconComponent={sortConfig.key === 'price' ? 
                      (sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon) : null}
                    sx={{ color: getTextColor() }}
                  >
                    {t.price}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortConfig.key === 'change24h'}
                    direction={sortConfig.key === 'change24h' ? sortConfig.direction : 'desc'}
                    onClick={() => handleSort('change24h')}
                    IconComponent={sortConfig.key === 'change24h' ? 
                      (sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon) : null}
                    sx={{ color: getTextColor() }}
                  >
                    {t.change24h}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortConfig.key === 'marketCap'}
                    direction={sortConfig.key === 'marketCap' ? sortConfig.direction : 'desc'}
                    onClick={() => handleSort('marketCap')}
                    IconComponent={sortConfig.key === 'marketCap' ? 
                      (sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon) : null}
                    sx={{ color: getTextColor() }}
                  >
                    {t.marketCap}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortConfig.key === 'volume'}
                    direction={sortConfig.key === 'volume' ? sortConfig.direction : 'desc'}
                    onClick={() => handleSort('volume')}
                    IconComponent={sortConfig.key === 'volume' ? 
                      (sortConfig.direction === 'asc' ? ArrowUpIcon : ArrowDownIcon) : null}
                    sx={{ color: getTextColor() }}
                  >
                    {t.volume}
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAssets.length > 0 ? (
                paginatedAssets.map((asset) => (
                  <TableRow 
                    key={asset.id}
                    hover
                    onClick={() => navigate(`/tokens/${asset.id}`)}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': {
                        cursor: "pointer",
                        bgcolor: alpha(theme === 'dark' ? '#ffffff' : '#000000', 0.05)
                      }
                    }}
                  >
                    <TableCell>
                      <Tooltip title={!user ? t.loginToFavorite : ''}>
                        <span>
                          <IconButton 
                            onClick={(e) => toggleFavorite(asset.id, e)} 
                            size="small"
                            disabled={!user}
                          >
                            {asset.favorite ? (
                              <StarIcon color="primary" />
                            ) : (
                              <StarBorderIcon sx={{ color: getTextColor() }} />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={asset.image}
                          sx={{ 
                            width: 24, 
                            height: 24,
                            bgcolor: theme === 'dark' ? '#333' : '#e0e0e0'
                          }}
                        />
                        <Box>
                          <Typography>{asset.name}</Typography>
                          <Typography variant="body2" sx={{ color: theme === 'dark' ? '#aaaaaa' : '#666666' }}>
                            {asset.symbol.toUpperCase()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(asset.price)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${asset.change24h > 0 ? '+' : ''}${asset.change24h.toFixed(2)}%`}
                        size="small"
                        sx={{
                          bgcolor: asset.change24h >= 0 
                            ? alpha('#4caf50', theme === 'dark' ? 0.2 : 0.1)
                            : alpha('#f44336', theme === 'dark' ? 0.2 : 0.1),
                          color: asset.change24h >= 0 ? '#4caf50' : '#f44336'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatLargeNumber(asset.marketCap)}
                    </TableCell>
                    <TableCell align="right">
                      {formatLargeNumber(asset.volume)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography>{t.noAssets}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredAndSortedAssets.length > itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(filteredAndSortedAssets.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: getTextColor()
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default CryptoAssetsPage;