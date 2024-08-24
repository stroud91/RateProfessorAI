'use client';

import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

export default function PricingPage() {
  const plans = [
    {
      title: 'Free',
      price: '$0',
      features: ['10 Flashcards', 'Basic Features', 'Community Support'],
      buttonText: 'Get Started'
    },
    {
      title: 'Pro',
      price: '$10/mo',
      features: ['Unlimited Flashcards', 'Advanced Features', 'Priority Support'],
      buttonText: 'Go Pro'
    },
    {
      title: 'Enterprise',
      price: 'Contact Us',
      features: ['Custom Solutions', 'Team Collaboration', 'Dedicated Support'],
      buttonText: 'Contact Us'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', my: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Pricing Plans
      </Typography>
      <Typography variant="body1" gutterBottom>
        Choose the plan that best suits your needs and get started today!
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {plan.title}
                </Typography>
                <Typography variant="h6" sx={{ my: 2 }}>
                  {plan.price}
                </Typography>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="primary" fullWidth>
                  {plan.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
