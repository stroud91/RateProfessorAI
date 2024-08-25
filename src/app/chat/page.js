'use client';

import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    reader.read().then(function processText({ done, value }) {
      if (done) {
        setMessages((messages) => {
          const newMessages = [...messages];
          newMessages[newMessages.length - 1].content = result;
          return newMessages;
        });
        return;
      }

      const text = decoder.decode(value || new Uint8Array(), { stream: true });
      result += text;

      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].content += text;
        return newMessages;
      });

      reader.read().then(processText);
    });

    setMessage('');
  };

  return (
    <Box className="chat-container">
      <Typography variant="h4" className="chat-title">
        Rate My Professor Chat
      </Typography>
      <Stack spacing={2} className="chat-box">
        {messages.map((msg, idx) => (
          <Box key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </Box>
        ))}
      </Stack>
      <Stack direction="row" spacing={2} className="chat-input">
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Box>
  );
}
