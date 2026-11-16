import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

if (!existsSync('reports/latest/results.json')) throw new Error('No hay resultados para archivar');
const destination = `reports/runs/${new Date().toISOString().replaceAll(':', '-')}`;
mkdirSync(destination, { recursive: true });
cpSync('reports/latest', destination, { recursive: true });
for (const directory of ['tests', 'casos', 'performance', 'docs', 'scripts', '.github']) {
  if (existsSync(directory)) cpSync(directory, `${destination}/source/${directory}`, { recursive: true });
}
for (const file of ['playwright.config.ts', 'tsconfig.json', 'package.json', 'package-lock.json', 'README.md', 'mobile/package.json', 'mobile/smoke.mjs']) {
  cpSync(file, `${destination}/source/${file}`);
}
writeFileSync(`${destination}/environment.json`, JSON.stringify({
  archivedAt: new Date().toISOString(), node: process.version, platform: process.platform,
  baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com',
  playwright: require('@playwright/test/package.json').version,
}, null, 2));
console.log(destination);
