import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import pocketbaseProxy from './routes/pocketbaseProxy.js';
import { errorMiddleware } from './middleware/error.js';
import { globalRateLimit } from './middleware/global-rate-limit.js';
import logger from './utils/logger.js';
import { BodyLimit } from './constants/common.js';
import { setupAdminCredentials } from './utils/setupAdmin.js';
import { waitForPocketBase } from './utils/pocketbaseClient.js';
import { createServer } from 'http';
import attachSignaling from './signaling.js';

const app = express();

app.set('trust proxy', process.env.TRUST_PROXY || 'loopback');

process.on('uncaughtException', (error) => {
	logger.error('Uncaught exception:', error);
});
  
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
	logger.info('Interrupted');
	process.exit(0);
});

process.on('SIGTERM', async () => {
	logger.info('SIGTERM signal received');

	await new Promise(resolve => setTimeout(resolve, 3000));

	logger.info('Exiting');
	process.exit();
});

app.disable('x-powered-by');
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
	.split(',')
	.map((origin) => origin.trim().replace(/\/+$/, '').toLowerCase())
	.filter(Boolean);

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			return callback(null, true);
		}

		const normalizedOrigin = origin.trim().replace(/\/+$/, '').toLowerCase();
		const isLocalOrigin = /^(http:\/\/localhost:\d+|http:\/\/127\.0\.0\.1:\d+)$/.test(normalizedOrigin);
		if (allowedOrigins.includes(normalizedOrigin) || isLocalOrigin) {
			return callback(null, true);
		}

		return callback(new Error('CORS policy: This origin is not allowed.'));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	preflightContinue: false,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	return next();
});
app.use(globalRateLimit);
app.use(express.json({
	limit: BodyLimit,
}));
app.use(express.urlencoded({
	extended: true,
	limit: BodyLimit,
}));

app.use(['/api/pocketbase', '/pocketbase'], pocketbaseProxy);
app.get('/api', (req, res) => {
	res.json({
		message: 'HACRO Labs API server',
		timestamp: new Date().toISOString(),
		status: 'ok',
	});
});
app.use('/api', routes());
app.use('/', routes());

app.use(errorMiddleware);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

const defaultPort = 3001;
const port = Number(process.env.PORT || defaultPort);

function listenOnPort(server, portToUse) {
	return new Promise((resolve, reject) => {
		const onError = (err) => {
			server.removeListener('listening', onListen);
			reject(err);
		};

		const onListen = () => {
			server.removeListener('error', onError);
			resolve(portToUse);
		};

		server.once('error', onError);
		server.once('listening', onListen);
		server.listen(portToUse, '127.0.0.1');
	});
}

async function start() {
	try {
		logger.info('Waiting for PocketBase to be reachable...');
		await waitForPocketBase({ timeoutMs: 30000, intervalMs: 500 });
		logger.info('PocketBase reachable, starting API server');
	} catch (err) {
		logger.warn('PocketBase did not become reachable in time, continuing to start API:', err.message || err);
	}

	const server = createServer(app);

	

	attachSignaling(server);

	let activePort = port;
	for (let offset = 0; offset < 10; offset++) {
		const tryPort = port + offset;
		try {
			activePort = await listenOnPort(server, tryPort);
			break;
		} catch (err) {
			if (err.code === 'EADDRINUSE' && offset < 9) {
				logger.warn(`Port ${tryPort} is already in use. Trying port ${tryPort + 1}.`);
			} else {
				throw err;
			}
		}
	}

	await setupAdminCredentials();

	

	if (process.env.POCKETBASE_AUTO_MIGRATE === 'true') {
		try {
			logger.info('POCKETBASE_AUTO_MIGRATE enabled — running migrations');
			const migrate = await import('../../pocketbase/migrate-conferences.js');
			

			logger.info('PocketBase migrations executed');
		} catch (err) {
			logger.error('Failed to run PocketBase migrations:', err);
		}
	}

	logger.info(`API Server running on http://localhost:${activePort}`);
}

start();

export default app;
