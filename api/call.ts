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
  statusCode: number;
  message?: string;
}

const format = (req: VercelRequest): Log => {
  const log: Log = {
    date: formatToTimeZone(new Date(), 'YYYY-MM-DD HH:mm:ss', { timeZone: 'Asia/Tokyo' }),
    ipAddress: String(req.headers['x-forwarded-for']),
    statusCode: 200,
    message: undefined,
  };
  // Allow POST only.
  if (req.method !== 'POST') {
    log.statusCode = 405;
    return log;
  }
  // Allow application/json only.
  if (!req.body || !req.headers['content-type'] || req.headers['content-type'] !== 'application/json') {
    log.statusCode = 400;
    return log;
  }
  // Try to get message.
  log.message = getMessage(req.body);
  if (!log.message) {
    log.statusCode = 400;
    return log;
  }
  return log;
};

export default (req: VercelRequest, res: VercelResponse) => {
  // Handling Preflight request.
  if (isPreflight(req.method)) {
    res.status(200).end();
    return;
  }
  // Get needed data as Log from request.
  const log = format(req);
  // Logging
  console.log(log);
  // Error handling
  if (log.statusCode !== 200) {
    error(log.statusCode, res);
    return;
  }
  // TODO Call API of Twilio.
  res.json({
    message: 'success',
  });
};
