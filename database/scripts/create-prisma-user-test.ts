import * as readline from 'readline';
import { execSync } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const firstName = await ask('Enter first name: ');
  const lastName = await ask('Enter last name: ');
  const email = await ask('Enter email address: ');
  const specialization = await ask(
    'Enter specialization (optional, press Enter to skip): ',
  );
  rl.close();

  if (!firstName || !lastName) {
    console.error('Name is required. Exiting.');
    process.exit(1);
  }

  if (!email) {
    console.error('Email is required. Exiting.');
    process.exit(1);
  }

  const name = `${firstName} ${lastName}`;
  const spec = specialization || 'general';

  const body = JSON.stringify({
    name,
    firstName,
    lastName,
    email,
    specialization: spec,
  });

  const cmd = `curl.exe -s -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "${body.replace(/"/g, '\\"')}"`;

  console.log('\nRunning:', cmd, '\n');
  const result = execSync(cmd).toString();
  console.log('Response:', result);
}

void main();

process.on('SIGINT', () => {
  rl.close();
  process.exit(0);
});
