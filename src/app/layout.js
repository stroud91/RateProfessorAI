'use client';

import React from 'react';
import { ClerkProvider, SignedOut, SignedIn, UserButton } from '@clerk/nextjs';
import { Typography, Button } from '@mui/material';
import Link from 'next/link';
import './styles/globals.css';



export default function RootLayout({ children }) {
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
                  <Link href="/" passHref legacyBehavior>
                    <Typography variant="h6" component="div" className="logo">
                      Luxury AI
                    </Typography>
                  </Link>
                </div>
                <nav className="nav-menu">
                  <Link href="/features" passHref legacyBehavior>
                    <Button className="nav-button">Features</Button>
                  </Link>
                  <Link href="/pricing" passHref legacyBehavior>
                    <Button className="nav-button">Pricing</Button>
                  </Link>
                  <Link href="/contact" passHref legacyBehavior>
                    <Button className="nav-button">Contact</Button>
                  </Link>
                  <SignedOut>
                    <Link href="/sign-in" passHref legacyBehavior>
                      <Button className="nav-button">Sign In</Button>
                    </Link>
                    <Link href="/sign-up" passHref legacyBehavior>
                      <Button className="nav-button">Sign Up</Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard" passHref legacyBehavior>
                      <Button className="nav-button">Dashboard</Button>
                    </Link>
                    <Link href="/generate" passHref legacyBehavior>
                      <Button className="nav-button">Generate</Button>
                    </Link>
                    <Link href="/flashcards" passHref legacyBehavior>
                      <Button className="nav-button">Flashcards</Button>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </nav>
              </header>
              <main className="main-content">{children}</main>
              <footer className="footer">
                <div className="footer-text">&copy; 2024 Luxury AI. All rights reserved.</div>
                <div className="footer-links">
                  <Link href="/terms" passHref legacyBehavior>
                    Terms of Service
                  </Link>
                  <Link href="/privacy" passHref legacyBehavior>
                    Privacy Policy
                  </Link>
                </div>
              </footer>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
