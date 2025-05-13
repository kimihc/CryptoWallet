import { useState, useEffect, useRef } from 'react';
import { pipeline, env } from '@xenova/transformers';
import {
  Box, Button, TextField, Typography, CircularProgress
} from '@mui/material';

env.allowRemoteModels = true;

export default function GPT2Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Привет! Я GPT-бот. Напиши что-нибудь.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const pipe = await pipeline('text-generation', 'Xenova/distilgpt2');
        setModel(pipe);
      } catch (err) {
        console.error('Ошибка загрузки модели:', err);
        setMessages(prev => [...prev, {
          sender: 'error',
          text: '⚠️ Не удалось загрузить модель.'
        }]);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const output = await model(input, {
        max_new_tokens: 50,
        temperature: 0.7
      });

      const reply = output[0]?.generated_text?.slice(input.length) || '(пустой ответ)';
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (err) {
      console.error('Ошибка генерации:', err);
      setMessages(prev => [...prev, {
        sender: 'error',
        text: '⚠️ Ошибка генерации текста.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>Чат мб в будущем</Typography>

      <Box sx={{
        height: '60vh',
        overflowY: 'auto',
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid #ccc',
        mb: 2
      }}>
        {messages.map((msg, i) => (
          <Box key={i} sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left', mb: 2 }}>
            <Box sx={{
              display: 'inline-block',
              bgcolor:
                msg.sender === 'user' ? 'primary.light' :
                msg.sender === 'error' ? 'error.light' :
                'grey.100',
              color: msg.sender === 'error' ? 'error.main' : 'inherit',
              p: 1.5,
              borderRadius: 2,
              maxWidth: '80%',
              wordBreak: 'break-word'
            }}>
              {msg.text}
            </Box>
          </Box>
        ))}
        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
        <div ref={endRef} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={loading}
          placeholder="Введите сообщение..."
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  );
}
