import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.resolve(path.join(__dirname, '../../../logs', 'api.log'));
function appendLog(...parts) {
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${parts.join(' ')}\n`);
  } catch (e) {
    console.error('[ERROR LOG WRITE FAILED]', e);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  const errorMessage = err.stack || err.message || err;
  console.error(errorMessage);
  appendLog('[ERROR]', errorMessage);
  const isProduction = process.env.NODE_ENV === 'production';
  const responsePayload = {
    error: isProduction ? 'Something went wrong!' : (err.message || 'Internal Error'),
  };
  if (!isProduction && err.stack) {
    responsePayload.stack = err.stack;
  }
  res.status(500).json(responsePayload);
};
