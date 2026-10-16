import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
const env = {
  ...process.env,
  CONTENT_DIRECTORY: 'test-fixtures',
  BUILD_DIRECTORY: '.next-qa',
  SITE_URL: 'http://localhost:3001',
  STRIPE_SECRET_KEY: '',
  NEXT_TELEMETRY_DISABLED: '1',
};
function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { env, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`Command failed: ${code}`)),
    );
  });
}
const preserved = await Promise.all(
  ['tsconfig.json', 'next-env.d.ts'].map(async (file) => ({
    file,
    contents: await fs.readFile(file).catch(() => null),
  })),
);
try {
  await run(['node_modules/next/dist/bin/next', 'build']);
  await run([
    'node_modules/@playwright/test/cli.js',
    'test',
    '--config',
    'playwright.content.config.ts',
  ]);
} finally {
  for (const { file, contents } of preserved) {
    if (contents) await fs.writeFile(file, contents);
    else await fs.rm(file, { force: true });
  }
}
