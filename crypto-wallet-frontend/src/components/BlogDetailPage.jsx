import React, { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Divider,
  IconButton 
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { ArrowBack } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import CustomAlert from './CustomAlert';

const BlogDetailPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  const blog = location.state?.blog;
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const texts = {
    en: {
      backToBlogs: "Back to Blogs",
      source: "Source",
      noBlog: "No blog data available",
    },
    ru: {
      backToBlogs: "Вернуться к блогам",
      source: "Источник",
      noBlog: "Данные блога отсутствуют",
    }
  };
  const t = texts[language];

  if (!blog) {
    setAlertOpen(true);
    setAlertMessage(t.noBlog);
    setAlertSeverity('error');
    return (
      <Container maxWidth="md">
        <Box sx={{ p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5', minHeight: '100vh' }}>
          <CustomAlert
            open={alertOpen}
            onClose={() => setAlertOpen(false)}
            message={alertMessage}
            severity={alertSeverity}
          />
          <Button variant="contained" color="primary" onClick={() => navigate('/blogs')}>
            {t.backToBlogs}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
            {blog.title}
          </Typography>
          <Tooltip title={t.backToBlogs}>
            <IconButton color="primary" onClick={() => navigate('/blogs')}>
              <ArrowBack />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ mb: 3 }}>
          <img src={blog.image} alt={blog.title} style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }} />
        </Box>
        <Typography variant="caption" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666', mb: 2, display: 'block' }}>
          {blog.date}
        </Typography>
        <Typography variant="body1" sx={{ color: theme === 'dark' ? '#ffffff' : '#000000', mb: 3, lineHeight: 1.8 }}>
          {blog.content}
        </Typography>
        <Divider sx={{ mb: 3, bgcolor: theme === 'dark' ? '#333' : '#e0e0e0' }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
            {t.source}:
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            href={blog.source}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textTransform: 'none' }}
          >
            {blog.source}
          </Button>
        </Box>
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

export default BlogDetailPage;