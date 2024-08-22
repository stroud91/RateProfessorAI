'use client';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [minRating, setMinRating] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };

  const handleSubmit = async () => {
    await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    setUrl('');
    alert('Data has been scraped and added to the database.');
  };

  const handleSearch = async () => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, subject, minRating }),
    });

    const data = await response.json();
    setSearchResults(data.results);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="auto"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant' ? 'primary.main' : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="RMP URL"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Submit URL
          </Button>
        </Stack>
        <Typography variant="h6">Advanced Search</Typography>
        <TextField
          label="Search Query"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <TextField
          label="Subject"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          label="Minimum Rating"
          type="number"
          fullWidth
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        {searchResults.length > 0 && (
          <Box>
            <Typography variant="h6">Search Results</Typography>
            {searchResults.map((result, index) => (
              <Box key={index} border="1px solid gray" borderRadius={8} p={2} mb={2}>
                <Typography variant="subtitle1">
                  Professor: {result.professor}
                </Typography>
                <Typography variant="body2">
                  Review: {result.review}
                </Typography>
                <Typography variant="body2">
                  Subject: {result.subject}
                </Typography>
                <Typography variant="body2">
                  Rating: {result.stars}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
