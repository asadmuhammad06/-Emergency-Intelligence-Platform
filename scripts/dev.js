const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const projectRoot = path.resolve(__dirname, '..');
const processes = [];

const isPortOpen = port => new Promise(resolve => {
  const socket = net.createConnection({ host: '127.0.0.1', port });
  socket.once('connect', () => {
    socket.destroy();
    resolve(true);
  });
  socket.once('error', () => resolve(false));
});

const watchProcess = child => {
  processes.push(child);
  child.on('error', error => {
    console.error('[CrisisMap] Development process failed:', error.message);
    shutdown(1);
  });
  child.on('exit', code => {
    if (!shuttingDown && code !== 0) shutdown(code || 1);
  });
};

const start = async () => {
  if (await isPortOpen(3001)) {
    console.log('[CrisisMap] API already running on http://localhost:3001');
  } else {
    watchProcess(spawn(process.execPath, ['index.js'], {
      cwd: path.join(projectRoot, 'server'),
      stdio: 'inherit'
    }));
  }

  if (await isPortOpen(5173)) {
    console.log('[CrisisMap] Frontend already running on http://localhost:5173');
  } else {
    watchProcess(spawn(`${npmCommand} run dev`, {
      cwd: path.join(projectRoot, 'client'),
      stdio: 'inherit',
      shell: true
    }));
  }
};

let shuttingDown = false;

const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  processes.forEach(child => child.kill());
  process.exit(code);
};

start().catch(error => {
  console.error('[CrisisMap] Development launcher failed:', error.message);
  shutdown(1);
});

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
