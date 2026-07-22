import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import net from 'net';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = process.env.POCKETBASE_HOST || '127.0.0.1';
const port = Number(process.env.POCKETBASE_PORT || '8090');
const apiUrl = `http://${host}:${port}/api/`;
const pocketbaseExe = path.join(__dirname, '..', 'pocketbase.exe');

function checkTcpPort(hostname, portToCheck) {
	return new Promise((resolve) => {
		const socket = new net.Socket();
		socket.setTimeout(1000);
		socket.once('connect', () => {
			socket.destroy();
			resolve(true);
		});
		socket.once('error', () => {
			resolve(false);
		});
		socket.once('timeout', () => {
			socket.destroy();
			resolve(false);
		});
		socket.connect(portToCheck, hostname);
	});
}

async function checkPocketBaseReady() {
	try {
		const response = await fetch(apiUrl, { method: 'GET' });
		return response.ok || response.status === 404 || response.status === 403;
	} catch {
		return false;
	}
}

async function main() {
	const portInUse = await checkTcpPort(host, port);

	if (portInUse) {
		const ready = await checkPocketBaseReady();
		if (ready) {
			console.log(`PocketBase is already available at ${apiUrl}. Skipping startup.`);
			return;
		}

		console.error(`Port ${port} is already in use and PocketBase is not responding on ${apiUrl}.`);
		console.error('Stop the existing service or set POCKETBASE_PORT to a different port.');
		process.exit(1);
	}

	const proc = spawn(pocketbaseExe, ['serve', '--automigrate=false', `--http=${host}:${port}`], {
		cwd: path.join(__dirname, '..'),
		stdio: 'inherit',
	});

	proc.on('error', (err) => {
		console.error('Failed to start PocketBase:', err.message || err);
		process.exit(1);
	});

	proc.on('exit', (code) => {
		process.exit(code);
	});
}

main().catch((error) => {
	console.error('PocketBase start wrapper failed:', error);
	process.exit(1);
});
