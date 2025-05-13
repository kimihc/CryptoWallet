import React, { useState, useContext, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { 
  AccountCircle as UserIcon, 
  Logout as LogoutIcon, 
  CameraAlt as CameraIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { 
  Box, 
  Container, 
  Avatar, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  IconButton, 
  CssBaseline,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

emailjs.init('7rEu1cM_sH3sKlaEt');

const PassportDisplay = ({ passportData, themeMode, language }) => {
  const texts = {
    ru: {
      passportNumber: "Номер паспорта",
      fullName: "ФИО",
      dob: "Дата рождения",
      country: "Страна",
      address: "Адрес"
    },
    en: {
      passportNumber: "Passport Number",
      fullName: "Full Name",
      dob: "Date of Birth",
      country: "Country",
      address: "Address"
    }
  };

  const getFullName = (data, lang) => {
    if (lang === 'ru') {
      return `${data.FirstName || ''} ${data.LastName || ''} ${data.Surname || ''}`.trim();
    }
    return `${data.FirstName || ''} ${data.LastName || ''}`.trim();
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2} sx={{ backgroundColor: themeMode === 'dark' ? '#2a2a2a' : '#f0f4f8', color: themeMode === 'dark' ? '#ffffff' : '#000000' }}>
              <Typography variant="h6">{language === 'ru' ? 'Паспорт' : 'Passport'}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: themeMode === 'dark' ? '#d1d5db' : '#4b5563' }}>{texts[language].passportNumber}</TableCell>
            <TableCell>{passportData?.['Passport Number'] || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: themeMode === 'dark' ? '#d1d5db' : '#4b5563' }}>{texts[language].fullName}</TableCell>
            <TableCell>{getFullName(passportData, language) || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: themeMode === 'dark' ? '#d1d5db' : '#4b5563' }}>{texts[language].dob}</TableCell>
            <TableCell>{passportData?.['Date of Birth'] || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: themeMode === 'dark' ? '#d1d5db' : '#4b5563' }}>{texts[language].country}</TableCell>
            <TableCell>{passportData?.Страна || passportData?.Country || 'N/A'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', color: themeMode === 'dark' ? '#d1d5db' : '#4b5563' }}>{texts[language].address}</TableCell>
            <TableCell>{passportData?.Адрес || passportData?.Address || 'N/A'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Profile = () => {
  const { user, updateUserData, logout } = useContext(AuthContext);
  const { theme: themeMode } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [codeExpiration, setCodeExpiration] = useState(null);

  const [personalData, setPersonalData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dob: user?.dob || null,
    country: user?.country || '',
    address: user?.address || '',
  });
  
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [kycFiles, setKycFiles] = useState({
    passport: null,
  });
  const [passportData, setPassportData] = useState(user?.passportData || null);
  const [kycStatus, setKycStatus] = useState(user?.kycStatus || 'Not Verified');
  
  const [email, setEmail] = useState(user?.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    if (user) {
      setPersonalData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dob: user.dob ? new Date(user.dob) : null,
        country: user.country || '',
        address: user.address || '',
      });
      setAvatar(user.avatar || null);
      setEmail(user.email || '');
      setKycStatus(user.kycStatus || 'Not Verified');
      setPassportData(user.passportData || null);

      if (user.kycStatus === (language === 'ru' ? 'Подтвержден' : 'Verified') && user.passportData) {
        const updatedPersonalData = {
          firstName: user.passportData.FirstName || personalData.firstName,
          lastName: user.passportData.LastName || personalData.lastName,
          dob: user.passportData['Date of Birth'] ? new Date(user.passportData['Date of Birth']) : personalData.dob,
          country: user.passportData.Страна || user.passportData.Country || personalData.country,
          address: user.passportData.Адрес || user.passportData.Address || personalData.address,
        };
        setPersonalData(updatedPersonalData);
        updateUserData({
          ...user,
          ...updatedPersonalData,
          email,
          avatar,
          kycStatus: user.kycStatus,
          emailVerified: user.emailVerified || false,
          createdAt: user.createdAt || new Date().toISOString(),
          passportData: user.passportData,
        });
      }
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result;
        setAvatar(newAvatar);
        updateUserData({
          ...user,
          ...personalData,
          avatar: newAvatar,
          email,
          kycStatus,
          emailVerified: user.emailVerified || false,
          createdAt: user.createdAt || new Date().toISOString(),
          passportData,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendVerificationCode = async () => {
    const expirationTime = new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US');

    if (!email) {
      setError(language === 'ru' ? 'Пожалуйста, введите email' : 'Please enter email');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    const expiration = Date.now() + 10 * 60 * 1000; 
    setCodeExpiration(expiration);

    if (Date.now() > codeExpiration) {
      setError(language === 'ru' ? 'Срок действия кода истёк. Запросите новый код.' : 'The code has expired. Request a new one.');
      return;
    }

    try {
      await emailjs.send(
        'service_mlfanfl',
        'template_e219bz8',
        {
          to_email: email,
          verification_code: code,
          user_name: user?.firstName || (language === 'ru' ? 'Пользователь' : 'User'),
          expiration_time: expirationTime
        }
      );
      
      setIsCodeSent(true);
      setIsDialogOpen(true);
      setSuccessMessage(language === 'ru' ? 'Код верификации отправлен на вашу почту' : 'Verification code sent to your email');
      setOpenSnackbar(true);
    } catch (err) {
      setError(language === 'ru' ? 'Ошибка при отправке кода. Попробуйте позже.' : 'Error sending code. Try again later.');
      console.error('Ошибка отправки письма:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setError(language === 'ru' ? 'Пожалуйста, введите код верификации' : 'Please enter verification code');
      return;
    }

    if (verificationCode === generatedCode) {
      setIsDialogOpen(false);
      setSuccessMessage(language === 'ru' ? 'Email успешно подтвержден!' : 'Email successfully verified!');
      setOpenSnackbar(true);
      setError('');
      updateUserData({
        ...user,
        ...personalData,
        email,
        avatar,
        kycStatus,
        emailVerified: true,
        createdAt: user.createdAt || new Date().toISOString(),
        passportData,
      });
    } else {
      setError(language === 'ru' ? 'Неверный код верификации' : 'Invalid verification code');
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (name === 'passport' && file) {
      if (file.type !== 'application/json') {
        alert(language === 'ru' ? 'Пожалуйста, загрузите файл в формате JSON' : 'Please upload a file in JSON format');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          setPassportData(jsonData);
          setKycFiles((prev) => ({ ...prev, [name]: file }));
        } catch (err) {
          alert(language === 'ru' ? 'Ошибка при чтении JSON файла' : 'Error reading JSON file');
          console.error('Ошибка парсинга JSON:', err);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleKycSubmit = () => {
    if (kycFiles.passport && passportData) {
      const newStatus = language === 'ru' ? 'В обработке' : 'In Progress';
      setKycStatus(newStatus);
      updateUserData({
        ...personalData,
        email,
        avatar,
        kycStatus: newStatus,
        emailVerified: user.emailVerified || false,
        createdAt: user.createdAt || new Date().toISOString(),
        passportData,
      });
    } else {
      alert(language === 'ru' ? 'Пожалуйста, загрузите паспорт' : 'Please upload passport');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const texts = {
    ru: {
      profile: "Профиль",
      login: "Логин",
      email: "Email",
      createdAt: "Дата регистрации",
      firstName: "Имя",
      lastName: "Фамилия",
      dob: "Дата рождения",
      country: "Страна",
      address: "Адрес",
      logout: "Выйти",
      kycTitle: "KYC Верификация",
      kycStatus: "Статус KYC",
      uploadPassport: "Загрузить паспорт (JSON)",
      verify: "Пройти верификацию",
      verifyEmail: "Подтвердить email",
      verificationCode: "Код подтверждения",
      resendCode: "Отправить код повторно"
    },
    en: {
      profile: "Profile",
      login: "Login",
      email: "Email",
      createdAt: "Registration Date",
      firstName: "First Name",
      lastName: "Last Name",
      dob: "Date of Birth",
      country: "Country",
      address: "Address",
      logout: "Logout",
      kycTitle: "KYC Verification",
      kycStatus: "KYC Status",
      uploadPassport: "Upload Passport (JSON)",
      verify: "Verify",
      verifyEmail: "Verify Email",
      verificationCode: "Verification Code",
      resendCode: "Resend Code"
    }
  };

  const countries = ['Россия', 'США', 'Великобритания', 'Германия', 'Франция', 'Япония', 'Китай'];

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

  const formattedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')
    : 'N/A';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 3, md: 5 }, background: themeMode === 'dark' ? 'linear-gradient(135deg, #1e1e1e, #2a2a2a)' : 'linear-gradient(135deg, #ffffff, #f0f4f8)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                <Avatar
                  src={avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 3,
                    bgcolor: themeMode === 'dark' ? '#ffffff' : '#e0e0e0',
                    color: themeMode === 'dark' ? '#121212' : '#000000',
                    border: '4px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  {!avatar && <UserIcon fontSize="large" />}
                </Avatar>
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                hidden
              />
              <Typography variant="h3" color="text.primary" fontWeight="bold">
                {texts[language].profile}
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {texts[language].login}
                </Typography>
                <Typography variant="body1" color="text.primary" paragraph>
                  {user?.login || 'N/A'}
                </Typography>

                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {texts[language].email}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isCodeSent || user?.emailVerified}
                    sx={{ mb: 2 }}
                  />
                  {user?.emailVerified ? (
                    <Box sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                      <CheckIcon sx={{ mr: 0.5 }} /> {language === 'ru' ? 'Подтвержден' : 'Verified'}
                    </Box>
                  ) : (
                    <Button 
                      onClick={handleSendVerificationCode}
                      disabled={isLoading || !email || isCodeSent}
                      variant="contained"
                      sx={{ minWidth: 120 }}
                    >
                      {isLoading ? <CircularProgress size={24} /> : texts[language].verifyEmail}
                    </Button>
                  )}
                </Box>

                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {texts[language].createdAt}
                </Typography>
                <Typography variant="body1" color="text.primary" paragraph>
                  {formattedDate}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {texts[language].profile}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={texts[language].firstName}
                        name="firstName"
                        value={personalData.firstName}
                        disabled
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={texts[language].lastName}
                        name="lastName"
                        value={personalData.lastName}
                        disabled
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label={texts[language].dob}
                          value={personalData.dob}
                          disabled
                          renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={texts[language].country}
                        value={personalData.country}
                        disabled
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={texts[language].address}
                        value={personalData.address}
                        disabled
                        variant="outlined"
                        multiline
                        rows={2}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {texts[language].kycTitle}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {texts[language].kycStatus}: {kycStatus}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        startIcon={<CameraIcon />}
                        sx={{ mb: 2, borderRadius: 2 }}
                      >
                        {texts[language].uploadPassport}
                        <input
                          type="file"
                          hidden
                          name="passport"
                          onChange={handleFileChange}
                          accept="application/json"
                        />
                      </Button>
                      {kycFiles.passport && (
                        <Typography variant="caption" color="text.secondary">
                         
                        </Typography>
                      )}
                      {passportData && <PassportDisplay passportData={passportData} themeMode={themeMode} language={language} />}
                    </Grid>
                    <Grid item xs={12}>
                      {kycStatus !== (language === 'ru' ? 'Подтвержден' : 'Verified') && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleKycSubmit}
                          fullWidth
                          sx={{ borderRadius: 2 }}
                          disabled={kycStatus === (language === 'ru' ? 'В обработке' : 'In Progress')}
                        >
                          {texts[language].verify}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ borderRadius: 2 }}
              >
                {texts[language].logout}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{texts[language].verifyEmail}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={texts[language].verificationCode}
            type="text"
            fullWidth
            variant="standard"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            sx={{ mt: 2 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button 
              size="small"
              onClick={handleSendVerificationCode}
              disabled={isLoading}
            >
              {texts[language].resendCode}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>{texts[language].cancel}</Button>
          <Button 
            onClick={handleVerifyCode}
            disabled={!verificationCode}
            variant="contained"
          >
            {texts[language].verify}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Profile;