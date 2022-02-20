import type { VercelRequest, VercelResponse } from '@vercel/node';
import { error, getStatus } from './_utils';

export default async (req: VercelRequest, res: VercelResponse) => {
  // Allow GET only.
  if (req.method !== 'GET') {
    error(405, res);
    return;
  }
  // Get sid from query.
  const { sid } = req.query;
  if (typeof sid !== 'string') {
    error(400, res);
    return;
  }
  // Get status from sid.
  const status = await getStatus(sid).catch(() => undefined);
  if (!status) {
    error(404, res);
    return;
  }
  res.json({
    status,
  });
};
