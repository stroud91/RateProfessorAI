'use client';

import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';

export default function FeaturesPage() {
  const features = [
    {
      title: 'AI-Powered Flashcards',
      description: 'Automatically generate flashcards from your notes using cutting-edge AI technology.',
      icon: '💡'
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your study habits and improve over time with detailed analytics.',
      icon: '📊'
    },
    {
      title: 'Collaborative Learning',
      description: 'Share flashcards with friends and study together.',
      icon: '🤝'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', my: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Features
      </Typography>
      <Typography variant="body1" gutterBottom>
        Discover the powerful features that make our Flashcard SaaS stand out.
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h3">{feature.icon}</Typography>
              <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
                {feature.title}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
