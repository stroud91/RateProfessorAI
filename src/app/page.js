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
      <header className="hero-section">
        <Typography variant="h2" className="hero-title">
          Elevate Your Learning Experience with Luxury AI
        </Typography>
        <Typography variant="h6" className="hero-subtitle">
          Discover, learn, and connect with the best professors using our state-of-the-art AI technology.
        </Typography>
        <Box className="hero-cta">
          <Button className="cta-button" onClick={() => handleNavigation('/sign-up')}>
            Get Started
          </Button>
          <Button className="cta-button-outline" onClick={() => handleNavigation('/learn-more')}>
            Learn More
          </Button>
        </Box>
      </header>

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
        {/* <Box className="dashboard sign-in-container">
          <Typography variant="h6" className="subheading">
            Please sign in to continue.
          </Typography>
          <SignInButton />
        </Box> */}
      </SignedOut>

      <section className="features-section">
  <Typography variant="h4" className="section-title">
    Why Choose Luxury AI?
  </Typography>
  <Box className="feature-highlights">
    <div className="feature-item">
      <i class="fas fa-brain feature-icon"></i>
      <Typography variant="h6" className="feature-title">AI-Powered Insights</Typography>
      <Typography variant="body1" className="feature-description">
        Leverage advanced AI algorithms to get tailored professor recommendations and insights.
      </Typography>
    </div>
    <div className="feature-item">
      <i class="fas fa-sync-alt feature-icon"></i>
      <Typography variant="h6" className="feature-title">Real-Time Data</Typography>
      <Typography variant="body1" className="feature-description">
        Access up-to-date information on professor ratings and reviews to make informed decisions.
      </Typography>
    </div>
    <div className="feature-item">
      <i class="fas fa-user-friends feature-icon"></i>
      <Typography variant="h6" className="feature-title">User-Friendly Interface</Typography>
      <Typography variant="body1" className="feature-description">
        Navigate easily with our intuitive and beautifully designed user interface.
      </Typography>
    </div>
  </Box>
</section>

      <section className="testimonials-section">
        <Typography variant="h4" className="section-title">
          What Our Users Say
        </Typography>
        <Box className="testimonials">
          <div className="testimonial">
            <Typography variant="body1" className="testimonial-text">
              {"Luxury AI has transformed how I choose my courses. The insights are invaluable!"}
            </Typography>
            <Typography variant="body2" className="testimonial-author">
              {"- Sarah W., University Student"}
            </Typography>
          </div>
          <div className="testimonial">
            <Typography variant="body1" className="testimonial-text">
              {"A must-have tool for any student. Easy to use and very helpful!"}
            </Typography>
            <Typography variant="body2" className="testimonial-author">
              {"- James P., Graduate Student"}
            </Typography>
          </div>
        </Box>
      </section>

      <footer className="footer">
        <Typography variant="body2" className="footer-text">
          © 2024 Luxury AI. All rights reserved.
        </Typography>
        <Box className="footer-links">
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/contact">Contact Us</a>
        </Box>
      </footer>
    </Box>
  );
}
