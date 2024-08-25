'use client';

import React, { useState } from 'react';
import { ClerkProvider, SignedOut, SignedIn, UserButton, SignIn, SignUp } from '@clerk/nextjs';
import { Typography, Button, Modal, Box } from '@mui/material';
import Link from 'next/link';
import './styles/globals.css';

export default function RootLayout({ children }) {
  
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  
  const handleOpenSignIn = () => setOpenSignIn(true);
  const handleCloseSignIn = () => setOpenSignIn(false);
  const handleOpenSignUp = () => setOpenSignUp(true);
  const handleCloseSignUp = () => setOpenSignUp(false);

  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <head>
          {/* Font Awesome CDN */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
            integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMbctD5G4gA1J6ljTzKr0kZ1meZp9A28FUxUfmW"
            crossOrigin="anonymous"
          />
          {/* Material Icons CDN */}
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
          {/* Bootstrap Icons CDN */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css"
          />
          {/* Heroicons CDN */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/heroicons/1.0.6/outline/heroicons-outline.min.css"
          />
        </head>
        <body>
          <div className="background-overlay">
            <div className="page-container">
              <header className="header">
                <div className="logo">
                  <Link href="/" passHref>
                    <Typography variant="h6" component="div" className="logo">
                      Luxury AI
                    </Typography>
                  </Link>
                </div>
                <nav className="nav-menu">
                  <Link href="/features" passHref>
                    <Button className="nav-button">Features</Button>
                  </Link>
                  <Link href="/pricing" passHref>
                    <Button className="nav-button">Pricing</Button>
                  </Link>
                  <Link href="/contact" passHref>
                    <Button className="nav-button">Contact</Button>
                  </Link>
                  <SignedOut>
                    <Button className="nav-button" onClick={handleOpenSignIn}>
                      Sign In
                    </Button>
                    <Button className="nav-button" onClick={handleOpenSignUp}>
                      Sign Up
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard" passHref>
                      <Button className="nav-button">Dashboard</Button>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </nav>
              </header>
              <main className="main-content">{children}</main>
              <footer className="footer">
                <div className="footer-text">&copy; 2024 Luxury AI. All rights reserved.</div>
                <div className="footer-links">
                  <Link href="/terms" passHref>
                    Terms of Service
                  </Link>
                  <Link href="/privacy" passHref>
                    Privacy Policy
                  </Link>
                </div>
              </footer>
            </div>
          </div>

          {/* Modals for Sign In and Sign Up */}
          <Modal open={openSignIn} onClose={handleCloseSignIn}>
            <Box sx={modalStyles}>
            <Button href="/sign-in"><SignIn /></Button>
            </Box>
          </Modal>
          <Modal open={openSignUp} onClose={handleCloseSignUp}>
            <Box sx={modalStyles}>
            <Button href="/sign-up"><SignUp /></Button>
            </Box>
          </Modal>
        </body>
      </html>
    </ClerkProvider>
  );
}


const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  padding: '0px',
  borderRadius: '8px',
};