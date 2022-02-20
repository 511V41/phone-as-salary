import React, { useState } from 'react';
import {
  Box, Chip, CssBaseline, Container, Link, TextField, Typography,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import {
  Error, Phone, PhoneForwarded, PhoneInTalk, PhoneMissed,
} from '@mui/icons-material';
import axios from 'axios';

// Statuses are listed at https://www.twilio.com/docs/voice/api/call-resource#call-status-values
const finishedStatuses = ['canceled', 'completed', 'busy', 'no-answer', 'failed'];
// Really I'm sorry to using any.
const statusToChip: any = {
  queued: <Chip icon={<PhoneForwarded />} label='Waiting...' />,
  ringing: <Chip icon={<PhoneForwarded />} label='Ringing...' />,
  'in-progress': <Chip icon={<PhoneInTalk />} label='Calling...' />,
  completed: <Chip icon={<Phone />} label='Done!' />,
  busy: <Chip icon={<PhoneMissed />} label='Failed. Reason: busy' />,
  failed: <Chip icon={<PhoneMissed />} label='Failed. Reason: failed' />,
  'no-answer': <Chip icon={<PhoneMissed />} label='Failed. Reason: no-answer' />,
  canceled: <Chip icon={<PhoneMissed />} label='Failed. Reason: canceled' />,
};

// Message must be 140 characters or less. like Twitter!
const maxMessageLength = 140;

export default () => {
  // state
  const [message, setMessage] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [error, setError] = useState('');
  // Let's call!
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.length > maxMessageLength || message === '') {
      return;
    }
    setCallStatus('queued');
    const reset = () => {
      // Delay to show status.
      setTimeout(() => {
        setMessage('');
        setCallStatus('');
        setError('');
      }, 10000);
    };
    const call = async () => {
      const callResponse = await axios.post('/api/call', { message });
      if (callResponse.status !== 200) {
        setError('Couldn\'t create calling. To check more detail, Open developer console.');
        console.error(callResponse);
        return;
      }
      const { sid } = callResponse.data;
      for (;;) {
        const statusResponse = await axios.get(`/api/status?sid=${sid}`);
        if (statusResponse.status !== 200) {
          setError('Couldn\'t get status. To check more detail, Open developer console.');
          console.error(statusResponse);
          break;
        }
        const { status } = statusResponse.data;
        setCallStatus(status);
        if (finishedStatuses.includes(status)) {
          break;
        }
      }
    };
    call().then(() => {
      reset();
    });
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: blueGrey.A200,
      }}
    >
      <CssBaseline />
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Phone as salary
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          You can make a phone call to Mission-chan.
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          About story, please refer to <Link rel="noreferrer" href="https://github.com/511V41/phone-as-salary">github repository</Link>.
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          日本人向け: <Link rel="noreferrer" href="https://twitter.com/t0de5tr1eb">ゆっくりしない</Link>に対してイタ電をかけることができます。
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 5 }}>
          <TextField
            label="Message for Mission-chan."
            variant="standard"
            fullWidth
            autoComplete='off'
            value={message}
            error={message.length > maxMessageLength}
            helperText={message.length > maxMessageLength ? `Message must be ${maxMessageLength} characters or less. Current length is ${message.length}.` : `${message.length} / ${maxMessageLength}`}
            disabled={callStatus !== '' || error !== ''}
            onChange={(event) => {
              const { value } = event.target;
              setMessage(value);
            }}
          />
        </Box>
        {callStatus !== '' && error === '' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom align="center">
              {statusToChip[callStatus]}
            </Typography>
          </Box>
        )}
        {error !== '' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom align="center">
              <Chip icon={<Error />} label={error} color="error" />
            </Typography>
          </Box>
        )}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: blueGrey.A700,
        }}
      >
        <Typography variant="body2" color="white" align="center">
          {'Copyright © '}
          <Link color={blueGrey[50]} rel="noreferrer" href="https://511v41.github.io">
            511V41
          </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
      </Box>
    </Box>
  );
};
