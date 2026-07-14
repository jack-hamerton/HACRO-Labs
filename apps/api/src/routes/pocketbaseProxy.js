import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyAdminToken } from '../middleware/adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const pocketbaseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const logFile = path.resolve(path.join(__dirname, '../../../logs', 'api.log'));

function appendLog(...parts) {
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${parts.join(' ')}\n`);
  } catch (e) {
    console.error('[PB PROXY LOG ERROR]', e);
  }
}

router.use(verifyAdminToken);

router.use(async (req, res, next) => {
  const rawPath = req.url || '/';
  const mountedPrefix = req.baseUrl || '';
  const targetPath = mountedPrefix && rawPath.startsWith(mountedPrefix)
    ? rawPath.slice(mountedPrefix.length)
    : rawPath;
  const targetUrl = `${pocketbaseUrl}${targetPath || '/'}`;
  appendLog('[PB PROXY]', req.method, '->', targetUrl);
  const proxyHeaders = { ...req.headers };
  delete proxyHeaders.host;
  delete proxyHeaders['content-length'];

  let proxyBody;
  if (!['GET', 'HEAD'].includes(req.method)) {
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      proxyBody = JSON.stringify(req.body);
      proxyHeaders['content-type'] = 'application/json';
    } else {
      proxyBody = undefined;
    }
  }

  try {
    const proxyResponse = await fetch(targetUrl, {
      method: req.method,
      headers: proxyHeaders,
      body: proxyBody,
      redirect: 'manual',
    });

    proxyResponse.headers.forEach((value, name) => {
      if (name.toLowerCase() === 'transfer-encoding') return;
      // Ensure Set-Cookie is appended instead of replaced
      if (name.toLowerCase() === 'set-cookie') {
        const existing = res.getHeader('Set-Cookie');
        if (existing) {
          const arr = Array.isArray(existing) ? existing : [existing];
          res.setHeader('Set-Cookie', arr.concat(value));
        } else {
          res.setHeader('Set-Cookie', value);
        }
      } else {
        res.setHeader(name, value);
      }
    });
    res.status(proxyResponse.status);

    appendLog('[PB PROXY] RESPONSE', proxyResponse.status, targetUrl);

    if (proxyResponse.body) {
      for await (const chunk of proxyResponse.body) {
        res.write(chunk);
      }
      return res.end();
    }

    const body = await proxyResponse.text();
    res.send(body);
  } catch (error) {
    appendLog('[PB PROXY] ERROR', error.stack || error.message || error);
    console.error('[PB PROXY] ERROR', error);
    next(error);
  }
});

export default router;
