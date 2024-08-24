'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';
import { Modal, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/'); 
  };

  return (
    <Modal open={true} onClose={handleClose}>
      <Box 
        sx={{
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
        }}
      >
        <SignIn />
      </Box>
    </Modal>
  );
}
