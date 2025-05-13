import React, { useState, useContext, useEffect } from "react";
import { 
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  alpha
} from "@mui/material";
import { 
  Language as LanguageIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Menu as MenuIcon,
  AccountCircle as UserIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
  AccountBalanceWallet as WalletIcon,
  Logout as LogoutIcon,
  MonetizationOn as EarnIcon
} from "@mui/icons-material";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const texts = {
    ru: {
      home: "Главная",
      dashboard: "Монеты",
      nft: "Статьи",
      explorer: "О нас",
      title: "CashCoin", 
      profile: "Профиль",
      settings: "Кошелек",
      earn: "Заработок",
      logout: "Выйти",
      login: "Войти",
      register: "Зарегистрироваться"
    },
    en: {
      home: "Home",
      dashboard: "Tokens",
      nft: "Blogs",
      explorer: "About Us",
      title: "CashCoin",
      profile: "Profile",
      settings: "Wallet",
      earn: "Earn",
      logout: "Logout",
      login: "Login",
      register: "Register"
    }
  };

  const navItems = [
    { name: texts[language].home, path: "/" },
    { name: texts[language].dashboard, path: "/tokens" },
    { name: texts[language].nft, path: "/blogs" },
    { name: texts[language].explorer, path: "/about" }
  ];

  const handleLanguageMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    handleClose();
    navigate(path);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.name}
            component={Link}
            to={item.path}
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
         <IconButton color="inherit" onClick={toggleLanguage}>
            <LanguageIcon />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {language === 'en' ? 'EN' : 'RU'}
              </Typography>
         </IconButton>
      </Box>
      {!user && (
        <>
          <Divider />
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 1 }}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              fullWidth
              startIcon={<LoginIcon />}
            >
              {texts[language].login}
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              fullWidth
              startIcon={<RegisterIcon />}
            >
              {texts[language].register}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        color="default"
        elevation={scrolled ? 4 : 0}
        sx={{ 
          bgcolor: scrolled 
            ? alpha(theme === 'dark' ? '#121212' : '#ffffff', 0.1)
            : theme === 'dark' ? '#121212' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#000000',
          borderBottom: theme === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          transition: 'all 0.3s ease',
          py: scrolled ? 0 : 0
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          minHeight: { xs: 56, sm: 64 },
          transition: 'all 0.3s ease'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography 
              variant="h6" 
              component={Link}
              to="/"
              sx={{ 
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              {texts[language].title}
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    mx: 1,
                    color: 'inherit',
                    '&:hover': {
                      bgcolor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={toggleTheme} 
              color="inherit"
              sx={{ ml: 1 }}
            >
              {theme === 'dark' ? <LightIcon /> : <DarkIcon />}
            </IconButton>
            
            <IconButton color="inherit" onClick={toggleLanguage}>
              <LanguageIcon />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {language === 'en' ? 'EN' : 'RU'}
              </Typography>
            </IconButton>

            {user ? (
              <IconButton
                onClick={handleUserMenu}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Avatar 
                  src={user.avatar || undefined}
                  sx={{ 
                    width: 34, 
                    height: 34,
                    bgcolor: theme === 'dark' ? '#ffffff' : '#e0e0e0',
                    color: theme === 'dark' ? '#121212' : '#000000',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {!user.avatar && <UserIcon fontSize="small" />}
                </Avatar>
              </IconButton>
            ) : !isMobile && (
              <>
                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  startIcon={<LoginIcon />}
                  sx={ { 
                    ml: 1,
                    '&:hover': {
                      bgcolor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  {texts[language].login}
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  startIcon={<RegisterIcon />}
                  sx={{ 
                    ml: 1,
                    bgcolor: theme === 'dark' ? '#ffffff' : '#1976d2',
                    color: theme === 'dark' ? '#121212' : '#ffffff',
                    '&:hover': {
                      bgcolor: theme === 'dark' ? '#e0e0e0' : '#1565c0'
                    }
                  }}
                >
                  {texts[language].register}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

    
      {user && (
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              minWidth: '200px'
            }
          }}
        >
          <MenuItem 
            onClick={() => handleNavigation("/profile")}
          >
            <ListItemIcon>
              <UserIcon fontSize="small" />
            </ListItemIcon>
            {texts[language].profile}
          </MenuItem>
          <MenuItem 
            onClick={() => handleNavigation("/wallet")}
          >
            <ListItemIcon>
              <WalletIcon fontSize="small" />
            </ListItemIcon>
            {texts[language].settings}
          </MenuItem>
          <MenuItem 
            onClick={() => handleNavigation("/earn")}
          >
            <ListItemIcon>
              <EarnIcon fontSize="small" />
            </ListItemIcon>
            {texts[language].earn}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {texts[language].logout}
          </MenuItem>
        </Menu>
      )}
    </>
  );
};

export default Header;