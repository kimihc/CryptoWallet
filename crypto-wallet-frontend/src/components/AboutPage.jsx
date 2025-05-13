import React, { useContext } from 'react';
import { 
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import CustomAlert from './CustomAlert';
import { Info, ContactMail, RocketLaunch } from '@mui/icons-material';

const AboutPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const texts = {
    en: {
      title: "About Us",
      description: "The developer is late, it will be later",
      mission: "Our Mission",
      missionText: "Attract people to use digital currencies",
      contact: "Get in Touch",
      contactText: "Email: tarabesh.akim@gail.com | Phone: +375 44 547 63 70",
      backToHome: "Back to Home"
    },
    ru: {
      title: "О Нас",
      description: "Разработчик опаздывает, будет позже",
      mission: "Наша Миссия",
      missionText: "Привлечь людей к использованию цифровых валют",
      contact: "Свяжитесь с Нами",
      contactText: "Email: tarabesh.akim@gail.com | Телефон: +375 44 547 63 70",
      backToHome: "Вернуться на Главную"
    }
  };
  const t = texts[language];

  return (
    <Container maxWidth="md">
      <Box sx={{
        p: 4,
        bgcolor: theme === 'dark' ? 'linear-gradient(135deg, #1a1a2e, #16213e)' : 'linear-gradient(135deg, #f5f7fa, #e0e7ff)',
        minHeight: '100vh',
        borderRadius: 2,
        boxShadow: theme === 'dark' ? '0 8px 16px rgba(0, 0, 0, 0.5)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{
            fontWeight: 800,
            marginLeft: '40%',
            color: theme === 'dark' ? '#ffffff' : '#1e3a8a',
            textTransform: 'uppercase',
            letterSpacing: 2,
            background: theme === 'dark' ? 'linear-gradient(45deg, #7c3aed 30%, #F7931A 90%)' : 'linear-gradient(45deg, #7c3aed 30%, #F7931A 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t.title}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{
          color: theme === 'dark' ? '#d1d5db' : '#374151',
          mb: 4,
          fontStyle: 'italic',
          textAlign: 'center',
          animation: 'fadeIn 1s ease-in'
        }}>
          {t.description}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{
              bgcolor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#ffffff',
              border: theme === 'dark' ? '1px solid #2d3748' : '1px solid #e5e7eb',
              borderRadius: 2,
              p: 3,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RocketLaunch sx={{ color: theme === 'dark' ? '#4ecdc4' : '#3b82f6', mr: 2 }} />
                  <Typography variant="h6" sx={{ color: theme === 'dark' ? '#ffffff' : '#1e3a8a', fontWeight: 700 }}>
                    {t.mission}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563', lineHeight: 1.8 }}>
                  {t.missionText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{
              bgcolor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#ffffff',
              border: theme === 'dark' ? '1px solid #2d3748' : '1px solid #e5e7eb',
              borderRadius: 2,
              p: 3,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ContactMail sx={{ color: theme === 'dark' ? '#ff6b6b' : '#ef4444', mr: 2 }} />
                  <Typography variant="h6" sx={{ color: theme === 'dark' ? '#ffffff' : '#1e3a8a', fontWeight: 700 }}>
                    {t.contact}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: theme === 'dark' ? '#d1d5db' : '#4b5563', lineHeight: 1.8 }}>
                  {t.contactText}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <CustomAlert
          open={false}
          onClose={() => {}}
          message=""
          severity="info"
        />
      </Box>
    </Container>
  );
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default AboutPage;