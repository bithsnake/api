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
      // handle error
      console.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(`🎉 Migration created successfully:\n${stdout}`);
  },
);
