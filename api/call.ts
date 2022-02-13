import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getReasonPhrase } from 'http-status-codes';
import { formatToTimeZone } from 'date-fns-timezone';

// エラーを返す
const error = (code: number, res: VercelResponse) => {
  res.status(code).json({ message: `${code} ${getReasonPhrase(code)}` });
};

// メッセージを取得する
const getMessage = (body: any): string | undefined => {
  const { message } = body;
  if (!message || typeof message !== 'string') {
    return undefined;
  }
  // 140文字までの制限をかける
  return String(message).substr(0, 140);
};

// ログの型
type Log = {
  date: string;
  ipAddress: string;
  message?: string;
}

// 実体
const handler = (req: VercelRequest, res: VercelResponse): Log => {
  const log = {
    date: formatToTimeZone(new Date(), 'YYYY-MM-DD HH:mm:ss', { timeZone: 'Asia/Tokyo' }),
    ipAddress: String(req.headers['x-forwarded-for']),
    message: undefined,
  };
  // POSTだけ許可する
  if (req.method !== 'POST') {
    error(405, res);
    return log;
  }
  // application/jsonだけ許可する
  if (!req.body || !req.headers['content-type'] || req.headers['content-type'] !== 'application/json') {
    error(400, res);
    return log;
  }
  // メッセージを取得して、取れなかったらエラーにする
  const message = getMessage(req.body);
  if (!message) {
    error(400, res);
    return log;
  }
  log.message = message;
  // TODO twilioのAPIを叩く
  res.json({
    message: 'success',
  });

  return log;
};

export default (req: VercelRequest, res: VercelResponse) => {
  const log = handler(req, res);
  // ログ取り
  console.info(log);
};
