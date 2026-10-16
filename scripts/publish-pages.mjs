// Build first with npm run build:pages. This publishes only the generated site.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, '.pages-build/app/out');
const remote = 'https://github.com/jay-rtl/Dennis-ross.git';
if (
  !existsSync(path.join(output, '.nojekyll')) ||
  !readFileSync(path.join(output, 'index.html'), 'utf8').includes(
    'https://jay-rtl.github.io/Dennis-ross',
  )
)
  throw new Error('Run npm run build:pages before publishing');
function git(args, cwd = output) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'inherit'],
  }).trim();
}
const revision = git(['rev-parse', '--short', 'HEAD'], root);
if (!existsSync(path.join(output, '.git'))) {
  git(['init', '-b', 'gh-pages']);
  git(['remote', 'add', 'origin', remote]);
}
for (const setting of ['user.name', 'user.email']) {
  git(['config', setting, git(['config', '--get', setting], root)]);
}
if (git(['remote', 'get-url', 'origin']) !== remote) throw new Error('Unexpected publish remote');
if (git(['ls-remote', '--heads', 'origin', 'gh-pages'])) {
  git(['fetch', 'origin', 'gh-pages']);
  // Preserve published history, while keeping the freshly generated files.
  git(['reset', '--mixed', 'FETCH_HEAD']);
}
git(['add', '--all']);
if (git(['diff', '--cached', '--name-only'])) {
  git(['commit', '-m', `Deploy GitHub Pages from ${revision}`]);
  git(['push', '-u', 'origin', 'gh-pages']);
}
console.log('Published gh-pages. Hosting URL: https://jay-rtl.github.io/Dennis-ross/');
