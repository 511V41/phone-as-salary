import {
  Box, CssBaseline, Container, Link, Typography,
} from '@mui/material';
import { blueGrey } from '@mui/material/colors';

const Copyright = () => (
  <Typography variant="body2" color="white" align="center">
    {'Copyright © '}
    <Link color="inherit" rel="noreferrer" href="https://511v41.github.io">
      511V41
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);

export default () => (
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
        {'You can make a phone call to Mission-chan.'}
      </Typography>
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
      <Copyright />
    </Box>
  </Box>
);
