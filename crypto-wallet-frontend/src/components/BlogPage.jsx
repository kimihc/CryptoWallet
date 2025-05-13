import React, { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea, 
  Grid, 
  Divider 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import CustomAlert from './CustomAlert';

const BlogPage = () => {
  const { theme } = useContext(ThemeContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');

  const texts = {
    en: {
      title: "Crypto Blogs",
      readMore: "Read More",
      error: "Unable to load blog details",
      blog1Title: "The Rise of DeFi: Opportunities and Challenges",
      blog1Description: "Exploring the growth of decentralized finance and its impact on the crypto market.",
      blog2Title: "Ethereum 2.0: The Future of Scalability",
      blog2Description: "How Ethereum's transition to Proof of Stake is shaping the future of blockchain scalability.",
      blog3Title: "Solana's High-Speed Blockchain: A Game Changer?",
      blog3Description: "An analysis of Solana's architecture and its potential to revolutionize crypto transactions.",
      blog4Title: "The Role of Stablecoins in Crypto Markets",
      blog4Description: "How stablecoins are providing stability and liquidity in the volatile crypto space.",
      blog5Title: "NFT Boom: The Future of Digital Ownership",
      blog5Description: "A deep dive into the rise of NFTs and their implications for digital art and ownership.",
      blog6Title: "Crypto Regulation: What to Expect in 2025",
      blog6Description: "An overview of upcoming regulatory changes and their potential impact on the crypto industry."
    },
    ru: {
      title: "Крипто Блоги",
      readMore: "Читать Далее",
      error: "Не удалось загрузить детали блога",
      blog1Title: "Рост DeFi: Возможности и Проблемы",
      blog1Description: "Изучение роста децентрализованных финансов и их влияния на крипторынок.",
      blog2Title: "Ethereum 2.0: Будущее Масштабируемости",
      blog2Description: "Как переход Ethereum на Proof of Stake формирует будущее масштабируемости блокчейна.",
      blog3Title: "Высокоскоростной блокчейн Solana: Изменение правил игры?",
      blog3Description: "Анализ архитектуры Solana и её потенциала в революции криптовалютных транзакций.",
      blog4Title: "Роль стейблкоинов на крипторынках",
      blog4Description: "Как стейблкоины обеспечивают стабильность и ликвидность в волатильном криптопространстве.",
      blog5Title: "Бум NFT: Будущее цифровой собственности",
      blog5Description: "Глубокое погружение в рост NFT и их значение для цифрового искусства и владения.",
      blog6Title: "Регулирование криптовалют: Чего ожидать в 2025 году",
      blog6Description: "Обзор предстоящих изменений в регулировании и их потенциального влияния на криптоиндустрию."
    }
  };
  const t = texts[language];

  const blogs = [
    {
      id: 1,
      title: t.blog1Title,
      description: t.blog1Description,
      image: "https://www.coindesk.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fs3y3vcno%2Fproduction%2Fabc41dc4370d46cb980b736d2d7d11355816cbf4-1333x999.jpg%3Fauto%3Dformat&w=1080&q=75",
      date: "May 5, 2025",
      source: "https://www.coindesk.com",
      content: "Decentralized Finance (DeFi) has seen exponential growth over the past few years, offering new opportunities for investors and developers alike. From decentralized lending to yield farming, DeFi platforms are reshaping how we interact with financial systems. However, with growth comes challenges, including security risks, scalability issues, and regulatory scrutiny. This article explores the current state of DeFi, its potential to disrupt traditional finance, and the hurdles it must overcome to achieve mainstream adoption."
    },
    {
      id: 2,
      title: t.blog2Title,
      description: t.blog2Description,
      image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "April 28, 2025",
      source: "https://www.cointelegraph.com",
      content: "Ethereum 2.0 marks a pivotal shift for the Ethereum network, moving from Proof of Work to Proof of Stake. This transition aims to address longstanding issues of scalability and energy consumption. With the introduction of shard chains and a more efficient consensus mechanism, Ethereum 2.0 promises to handle thousands of transactions per second, making it a more viable platform for decentralized applications. This article delves into the technical details, potential challenges, and the expected impact on Ethereum's price and adoption."
    },
    {
      id: 3,
      title: t.blog3Title,
      description: t.blog3Description,
      image: "https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "April 25, 2025",
      source: "https://www.coindesk.com",
      content: "Solana has gained significant attention in the crypto space due to its high-speed blockchain capable of processing thousands of transactions per second. Its unique Proof of History consensus mechanism allows for unparalleled scalability and low transaction costs. However, recent network outages have raised concerns about its reliability. This article examines Solana's architecture, its competitive edge over other blockchains, and whether it can truly become a game-changer in the industry."
    },
    {
      id: 4,
      title: t.blog4Title,
      description: t.blog4Description,
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEHERUSExIVEhAXGRIYFhcQFRcaFRUXFRUXHRYcGhoZHyggGBolHRcXITEhJS0tLi8uGB8zODMtNyotLisBCgoKDg0OGhAQGi0lICUtKy8yMy0tLTEtMjAtLS81Ny0yNSstLy8yLy0tLS0tLy0yNy0tKy0uLTU3MC0rNy0zLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAEAAwEBAQEBAAAAAAAAAAAABAUGAwcCAQj/",
      date: "April 20, 2025",
      source: "https://www.cointelegraph.com",
      content: "Stablecoins have become a cornerstone of the cryptocurrency market, providing a bridge between volatile digital assets and traditional fiat currencies. By pegging their value to assets like the US dollar, stablecoins offer stability and liquidity for traders and investors. This article explores the different types of stablecoins, their role in DeFi ecosystems, and the regulatory challenges they face as governments scrutinize their operations."
    },
    {
      id: 5,
      title: t.blog5Title,
      description: t.blog5Description,
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUREhEVFRUWFhgWGBYWFhgXFhUVGBcbFxcXFxUdHiggGB0lGxYXIjEhJSorMi4uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLy0tLS0tMC0tLTItLS0tLS0tLS0tLS8tLS01LS8tLS0vLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAAAwQFBgcBAv/",
      date: "April 15, 2025",
      source: "https://www.coindesk.com",
      content: "Non-Fungible Tokens (NFTs) have taken the digital world by storm, enabling new forms of ownership for art, collectibles, and virtual assets. The NFT boom has attracted artists, celebrities, and investors, but it has also raised questions about sustainability, intellectual property, and market speculation. This article dives into the technology behind NFTs, their impact on digital ownership, and what the future holds for this rapidly evolving market."
    },
    {
      id: 6,
      title: t.blog6Title,
      description: t.blog6Description,
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      date: "April 10, 2025",
      source: "https://www.cointelegraph.com",
      content: "As the cryptocurrency industry continues to grow, governments worldwide are introducing stricter regulations to address concerns about fraud, money laundering, and investor protection. In 2025, we expect to see significant regulatory developments, including clearer guidelines for stablecoins, DeFi platforms, and crypto exchanges. This article provides an overview of the anticipated changes and their potential impact on the crypto market, offering insights for investors and developers."
    }
  ];

  const handleCardClick = (blog) => {
    if (blog && blog.id) {
      navigate(`/blogs/${blog.id}`, { state: { blog } });
    } else {
      setAlertOpen(true);
      setAlertMessage(t.error);
      setAlertSeverity('error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 3, bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5', minHeight: '100vh' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: theme === 'dark' ? '#ffffff' : '#000000', mb: 4 }}>
          {t.title}
        </Typography>
        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={6} key={blog.id}>
              <Card sx={{ 
                bgcolor: theme === 'dark' ? '#1e1e1e' : '#ffffff', 
                color: theme === 'dark' ? '#ffffff' : '#000000',
                borderRadius: 2,
                boxShadow: theme === 'dark' ? '0 4px 8px rgba(255,255,255,0.1)' : '0 4px 8px rgba(0,0,0,0.1)',
              }}>
                <CardActionArea onClick={() => handleCardClick(blog)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.image}
                    alt={blog.title}
                    sx={{
                      maxHeight: '200px',
                      maxWidth: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666', mb: 1 }}>
                      {blog.description}
                    </Typography>
                    <Divider sx={{ mb: 1, bgcolor: theme === 'dark' ? '#333' : '#e0e0e0' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: theme === 'dark' ? '#bbbbbb' : '#666666' }}>
                        {blog.date}
                      </Typography>
                      <Typography variant="caption" sx={{ color: theme === 'dark' ? '#7c3aed' : '#2e7d32' }}>
                        {t.readMore}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
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

export default BlogPage;