const { spawn } = require('node:child_process');
const path = require('node:path');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const projectRoot = path.resolve(__dirname, '..');
const processes = [
  spawn(`"${process.execPath}" index.js`, { cwd: path.join(projectRoot, 'server'), stdio: 'inherit', shell: true }),
  spawn(`${npmCommand} run dev`, { cwd: path.join(projectRoot, 'client'), stdio: 'inherit', shell: true })
];

let shuttingDown = false;

const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  processes.forEach(child => child.kill());
  process.exit(code);
};

processes.forEach(child => {
  child.on('error', error => {
    console.error('[CrisisMap] Development process failed:', error.message);
    shutdown(1);
  });
  child.on('exit', code => {
    if (!shuttingDown && code !== 0) shutdown(code || 1);
  });
});

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
