'use client';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import './styles/globals.css';

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <Box className="main-content">
      <SignedIn>
        <Box className="dashboard">
          <Typography variant="h4" className="welcome-text">
            Welcome, {user?.firstName}
          </Typography>
          <Typography variant="h6" className="subheading">
            What would you like to do today?
          </Typography>
          <Box className="feature-options">
            <Button
              className="feature-button"
              onClick={() => handleNavigation('/chat')}
            >
              Normal Chat
            </Button>
            <Button
              className="feature-button"
              onClick={() => handleNavigation('/link-reader')}
            >
              Link Reader
            </Button>
            <Button
              className="feature-button"
              onClick={() => handleNavigation('/search')}
            >
              Advanced Search
            </Button>
            <Button
              className="feature-button"
              onClick={() => handleNavigation('/sentiment-analysis')}
            >
              Sentiment Analysis
            </Button>
          </Box>
        </Box>
      </SignedIn>
      <SignedOut>
        <Box className="dashboard sign-in-container">
          <Typography variant="h6" className="subheading">
            Please sign in to continue.
          </Typography>
          <SignInButton />
        </Box>
      </SignedOut>
    </Box>
  );
}
