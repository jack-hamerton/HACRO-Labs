import fs from 'fs';
import path from 'path';

const logFile = path.resolve(path.join(process.cwd(), 'logs', 'api.log'));
function appendLog(...parts) { try { fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${parts.join(' ')}\n`); } catch (e) {} }

export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack || err);
  appendLog('[ERROR]', err.stack || err.message || err);
  const message = process.env.NODE_ENV === 'production' ? 'Something went wrong!' : (err.message || 'Internal Error');
  res.status(500).json({ error: message });
};
