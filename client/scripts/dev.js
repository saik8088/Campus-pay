import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const clientDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverDir = path.resolve(clientDir, '..', 'server');
const viteCli = path.join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js');

const processes = [
  spawn(process.execPath, ['app.js'], { cwd: serverDir, stdio: 'inherit' }),
  spawn(process.execPath, [viteCli], { cwd: clientDir, stdio: 'inherit' }),
];

let stopping = false;

const stop = (exitCode) => {
  if (stopping) return;
  stopping = true;
  processes.forEach((child) => {
    if (!child.killed) child.kill();
  });
  process.exitCode = exitCode;
};

processes.forEach((child) => {
  child.on('error', (error) => {
    console.error(`[DEV] Could not start a development service: ${error.message}`);
    stop(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) {
      console.error(`[DEV] A development service exited (${signal || code}); stopping the other service.`);
      stop(code || 0);
    }
  });
});

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
