'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import '../styles/globals.css'; 

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const handleSendMessage = async () => {
    setLoading(true);
    setOutput('');

    try {
     
      const response = await fetch('/chat/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ role: 'user', content: message }]), 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setOutput('An error occurred while fetching the response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="chat-container">
      <TextField
        className="chat-input"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your question here..."
        variant="outlined"
        sx={{ marginBottom: 2 }}
      />
      <Button
        className="chat-button"
        variant="contained"
        onClick={handleSendMessage}
        disabled={loading}
        sx={{ marginBottom: 2 }}
      >
        {loading ? <CircularProgress size={24} className="loading-indicator" /> : 'Send Message'}
      </Button>
      {output && (
        <Box className="chat-output">
          <Typography variant="body1">{output}</Typography>
        </Box>
      )}
    </Box>
  );
}


export async function POST(req, res) {
  try {
    const { content } = await req.json();
    const userMessage = content;

 
    const pinecone = new PineconeClient({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pinecone.Index('rag');

   
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: userMessage,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error(`Failed to generate embedding. Status: ${embeddingResponse.status}`);
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;


    const results = await index.query({
      topK: 5,
      includeMetadata: true,
      vector: embedding,
    });

 
    let resultString = '';
    results.matches.forEach((match) => {
      resultString += `
      Returned Results:
      Professor: ${match.id}
      Review: ${match.metadata.review}
      Subject: ${match.metadata.subject}
      Stars: ${match.metadata.stars}
      \n\n`;
    });

   
    const lastMessageContent = userMessage + resultString;

   
    const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: lastMessageContent },
        ],
        max_tokens: 300,
        stream: true,
      }),
    });

    if (!completionResponse.ok) {
      throw new Error(`Failed to fetch response from OpenAI. Status: ${completionResponse.status}`);
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const reader = completionResponse.body.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new NextResponse('Error processing request.', { status: 500 });
  }
}
