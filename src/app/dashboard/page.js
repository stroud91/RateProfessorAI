'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <Box className="dashboard">
      <Typography variant="h4" className="welcome-text">
        Welcome to the Dashboard
      </Typography>
      <Typography variant="h6" className="subheading">
        Select an AI Feature to Get Started:
      </Typography>
      <Box className="feature-options">
        <Button className="feature-button" onClick={() => handleNavigation('/chat')}>
          Normal Chat
        </Button>
        <Button className="feature-button" onClick={() => handleNavigation('/link-reader')}>
          Link Reader
        </Button>
        <Button className="feature-button" onClick={() => handleNavigation('/search')}>
          Advanced Search
        </Button>
        <Button className="feature-button" onClick={() => handleNavigation('/sentiment-analysis')}>
          Sentiment Analysis
        </Button>
      </Box>
    </Box>
  );
}
