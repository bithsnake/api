const _fileName = process?.argv[2] || null;

if (!_fileName) {
  console.error('Please provide a name for the migration file.');

  process?.exit(1);
}

import { exec } from 'child_process';

exec(
  `npx prisma migrate dev --name ${_fileName} --create-only`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Migration failed: ${error.message}`);
      return;
    }

    if (stderr) {
      // Prisma may print non-fatal info here
      console.warn(stderr);
    }

    console.log(`Migration created successfully:\n${stdout}`);
  },
);
