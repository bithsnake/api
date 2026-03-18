const _fileName = process?.argv[2] || null;

if (!_fileName) {
  console.error('Please provide a name for the migration file.');

  process?.exit(1);
}

import { spawn } from 'child_process';
const child = spawn(
  'npx',
  [
    'prisma',
    'migrate',
    'dev',
    '--schema',
    './prisma/schema.prisma',
    '--name',
    _fileName,
    '--create-only',
  ],
  {
    stdio: 'inherit',
    shell: true,
  },
);

child.on('exit', (code) => {
  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
