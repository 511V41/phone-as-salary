import type { VercelResponse } from '@vercel/node';
import { getReasonPhrase } from 'http-status-codes';

// Respond error.
export const error = (code: number, res: VercelResponse) => {
  res.status(code).json({ message: `${code} ${getReasonPhrase(code)}` });
};

// Handle CORS
export const isPreflight = (method: string): boolean => method === 'OPTIONS';
