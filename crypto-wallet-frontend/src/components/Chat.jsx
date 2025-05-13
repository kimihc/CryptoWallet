import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Avatar, List, ListItem, ListItemText } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        setMessages(prev => [...prev, { text: input, isUser: true }]);
        setInput('');
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: input
            });
            const answer = await response.text();
            setMessages(prev => [...prev, { text: answer, isUser: false }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <List sx={{ flex: 1, overflow: 'auto' }}>
                {messages.map((msg, i) => (
                    <ListItem key={i}>
                        <Paper sx={{ 
                            p: 2, 
                            bgcolor: msg.isUser ? '#e3f2fd' : '#f5f5f5',
                            borderRadius: msg.isUser ? '18px 18px 0 18px' : '18px 18px 18px 0'
                        }}>
                            <ListItemText primary={msg.text} />
                        </Paper>
                    </ListItem>
                ))}
                {loading && <ListItem>:Ждем...</ListItem>}
                <div ref={messagesEndRef} />
            </List>
            
            <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                    InputProps={{
                        endAdornment: (
                            <Button 
                                variant="contained" 
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                endIcon={<SendIcon />}
                            >
                                Отправить
                            </Button>
                        )
                    }}
                />
            </Box>
        </Box>
    );
}