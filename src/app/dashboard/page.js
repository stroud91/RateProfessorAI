'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" className="dashboard-title">
        Welcome to Luxury AI Dashboard
      </Typography>
      <Typography variant="h6" className="dashboard-subtitle">
        Choose a feature to get started:
      </Typography>
      <Box className="feature-options">
        <Button
          variant="contained"
          color="primary"
          className="feature-button"
          onClick={() => handleNavigation('/chat')}
        >
          Normal Chat
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="feature-button"
          onClick={() => handleNavigation('/link-reader')}
        >
          Link Reader
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="feature-button"
          onClick={() => handleNavigation('/advanced-search')}
        >
          Advanced Search
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="feature-button"
          onClick={() => handleNavigation('/sentiment-analysis')}
        >
          Sentiment Analysis
        </Button>
      </Box>
    </Box>
  );
}
