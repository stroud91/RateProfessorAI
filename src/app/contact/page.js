'use client';

import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function ContactPage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', my: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" gutterBottom>
        We are here to help! Fill out the form below or reach us at contact@flashcardsaas.com.
      </Typography>
      <Box component="form" sx={{ mt: 4 }}>
        <TextField label="Name" fullWidth margin="normal" required />
        <TextField label="Email" type="email" fullWidth margin="normal" required />
        <TextField label="Message" multiline rows={4} fullWidth margin="normal" required />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
          Send Message
        </Button>
      </Box>
      <Typography variant="body2" sx={{ mt: 4 }}>
        You can also reach us at (123) 456-7890 or visit our office at 123 Flashcard St., Learning City.
      </Typography>
    </Container>
  );
}
