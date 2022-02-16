import type { VercelResponse } from '@vercel/node';
import { getReasonPhrase } from 'http-status-codes';
import Twilio = require('twilio');
import xmlescape = require('xml-escape');

// Respond error.
export const error = (code: number, res: VercelResponse) => {
  res.status(code).json({ message: `${code} ${getReasonPhrase(code)}` });
};

// Extremely slipshod. About Header, read vercel.json.
export const isPreflight = (method: string): boolean => method === 'OPTIONS';

// Generate TwiML and call API of Twilio.
export const call = async (message: string): Promise<string | undefined> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const to = process.env.TO;
  const from = process.env.FROM;
  if (!accountSid || !token || !to || !from) {
    return undefined;
  }
  const twilio = Twilio(accountSid, token);
  // About twiml: https://www.twilio.com/docs/voice/twiml
  const twiml = `<Response><Pause length="2"></Pause><Say voice="alice" language="ja-JP">${xmlescape(message)}</Say></Response>`;
  const { sid } = await twilio.calls.create({
    twiml,
    to,
    from,
  });
  return sid;
};

// Get status of calling. About status: https://www.twilio.com/docs/voice/api/call-resource#call-status-values
export const getStatus = async (sid: string): Promise<string | undefined> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !token) {
    return undefined;
  }
  const twilio = Twilio(accountSid, token);
  const response = await twilio.calls(sid).fetch();
  return response.status;
};
