import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const pocketbaseUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
const logFile = path.resolve(path.join(process.cwd(), 'logs', 'api.log'));

function appendLog(...parts) {
  try {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${parts.join(' ')}\n`);
  } catch (e) {
    // ignore logging errors
  }
}

router.use(async (req, res, next) => {
  const targetPath = req.url || '/';
  const targetUrl = `${pocketbaseUrl}${targetPath}`;
  appendLog('[PB PROXY]', req.method, '->', targetUrl);
  const proxyHeaders = { ...req.headers };
  delete proxyHeaders.host;
  delete proxyHeaders['content-length'];

  try {
    const proxyResponse = await fetch(targetUrl, {
      method: req.method,
      headers: proxyHeaders,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
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
    appendLog('[PB PROXY] ERROR', error.message || error);
    next(error);
  }
});

export default router;
