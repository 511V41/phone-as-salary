import type { VercelResponse } from '@vercel/node';
import { getReasonPhrase } from 'http-status-codes';
import Twilio = require('twilio');
import xmlescape = require('xml-escape');
import querystring = require('querystring');

// Respond error.
export const error = (code: number, res: VercelResponse) => {
  res.status(code).json({ message: `${code} ${getReasonPhrase(code)}` });
};

// Extremely slipshod. About Header, read vercel.json.
export const isPreflight = (method: string): boolean => method === 'OPTIONS';

// Generate TwiML and call API of Twilio.
export const call = async (message: string): Promise<boolean> => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const to = process.env.TO;
  const from = process.env.FROM;
  if (!sid || !token || !to || !from) {
    return false;
  }
  const twilio = Twilio(sid, token);
  // About twiml: https://www.twilio.com/docs/voice/twiml
  const twiml = `<Response><Pause length="2"></Pause><Say voice="alice" language="ja-JP">${xmlescape(message)}</Say></Response>`;
  // twimlets.com is awesome! About: https://www.twilio.com/labs/twimlets/echo
  await twilio.calls.create({
    url: `http://twimlets.com/echo?Twiml=${querystring.escape(twiml)}`,
    to,
    from,
  });
  return true;
};
