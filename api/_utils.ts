import type { VercelResponse } from '@vercel/node';
import { getReasonPhrase } from 'http-status-codes';

// Respond error.
export const error = (code: number, res: VercelResponse) => {
  res.status(code).json({ message: `${code} ${getReasonPhrase(code)}` });
};

// Extremely slipshod. About Header, read vercel.json.
export const isPreflight = (method: string): boolean => method === 'OPTIONS';
