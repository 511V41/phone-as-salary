import type { VercelRequest, VercelResponse } from '@vercel/node';
import { formatToTimeZone } from 'date-fns-timezone';
import { error, isPreflight } from './_utils';

// Get message from body. If it fails, return undefined;
const getMessage = (body: any): string | undefined => {
  const { message } = body;
  if (!message || typeof message !== 'string') {
    return undefined;
  }
  // The length of message is limited to 140. like Twitter.
  return String(message).substr(0, 140);
};

// Type of log.
type Log = {
  date: string;
  ipAddress: string;
  message?: string;
}

const handler = (req: VercelRequest, res: VercelResponse): Log => {
  const log = {
    date: formatToTimeZone(new Date(), 'YYYY-MM-DD HH:mm:ss', { timeZone: 'Asia/Tokyo' }),
    ipAddress: String(req.headers['x-forwarded-for']),
    message: undefined,
  };
  // Allow POST only.
  if (req.method !== 'POST') {
    error(405, res);
    return log;
  }
  // Allow application/json only.
  if (!req.body || !req.headers['content-type'] || req.headers['content-type'] !== 'application/json') {
    error(400, res);
    return log;
  }
  // Try to get message.
  const message = getMessage(req.body);
  if (!message) {
    error(400, res);
    return log;
  }
  log.message = message;
  // TODO Call API of Twilio.
  res.json({
    message: 'success',
  });

  return log;
};

export default (req: VercelRequest, res: VercelResponse) => {
  // Handling CORS.
  if (isPreflight(req.method)) {
    res.status(200).end();
    return;
  }
  const log = handler(req, res);
  // Logging
  console.log(log);
};
