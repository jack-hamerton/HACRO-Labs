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

const app = express();

app.set('trust proxy', true);

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

app.use(helmet());

const corsOptions = {
	origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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

const port = process.env.PORT || 3001;

app.listen(port, () => {
	logger.info(`🚀 API Server running on http://localhost:${port}`);
});

export default app;
