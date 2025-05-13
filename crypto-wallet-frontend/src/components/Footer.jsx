import React, { useContext } from "react";
import { Box, Typography, Link } from '@mui/material';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import discord from "../assets/discord2.svg";
import youtube from "../assets/youtube2.svg";
import paper from "../assets/paper.svg";
import blog from "../assets/blog.svg";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);

  const translations = {
    en: {
      copyright: "© 2025 Tarabesh Akim.",
      project: "Course Project: Multifunctional Crypto Wallet",
      institution: "BSUIR, ISiT"
    },
    ru: {
      copyright: "© 2025 Тарабеш Аким.",
      project: "Курсовой проект: Многофункциональный криптокошелек",
      institution: "БГУИР, ИСиТ"
    }
  };

  const t = translations[language];

  const sectionBackground = theme === 'dark'
    ? '#121212'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.95))';

  return (
    <Box
      sx={{
        background: sectionBackground,
        py: 4, 
        px: 0, 
        boxShadow: theme === 'dark' ? '0 8px 20px rgba(0, 0, 0, 0.5)' : '0 8px 20px rgba(0, 0, 0, 0.1)',
        color: theme === 'dark' ? '#ffffff' : '#1a1a2e',
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
          paddingLeft: 3,
          paddingRight: 3
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="body2">
            {t.copyright}
          </Typography>
          <Typography variant="body2">
            {t.project}
          </Typography>
          <Typography variant="body2">
            {t.institution}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;