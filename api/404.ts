import type { VercelRequest, VercelResponse } from '@vercel/node';
import { error } from './_utils';

export default (_req: VercelRequest, res: VercelResponse) => {
  error(404, res);
};
