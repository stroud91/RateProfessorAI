'use client';

import React from 'react';
import { 
  ClerkProvider,  
  SignedOut,
  SignedIn,
  UserButton
} from '@clerk/nextjs';
import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link'; // Import Link component from Next.js
import './styles/globals.css'; // Import the global CSS file


export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
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
                <div className="nav-menu">
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
                    <Link href="/sign-in" passHref>
                      <Button className="nav-button">Sign In</Button>
                    </Link>
                    <Link href="/sign-up" passHref>
                      <Button className="nav-button">Sign Up</Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard" passHref>
                      <Button className="nav-button">Dashboard</Button>
                    </Link>
                    <Link href="/generate" passHref>
                      <Button className="nav-button">Generate</Button>
                    </Link>
                    <Link href="/flashcards" passHref>
                      <Button className="nav-button">Flashcards</Button>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
              </header>
              <main className="main-content">{children}</main>
              <footer className="footer">
                <div className="footer-text">&copy; 2024 Luxury AI. All rights reserved.</div>
                <div className="footer-links">
                  <a href="/terms">Terms of Service</a>
                  <a href="/privacy">Privacy Policy</a>
                </div>
              </footer>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
