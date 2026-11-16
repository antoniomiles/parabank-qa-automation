import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { delimiter, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

if (!process.argv[2]) throw new Error('Uso: node scripts/validate-jmeter.mjs <jmeter-home> [java-bin]');
const home = resolve(process.argv[2]);
const java = process.argv[3] || 'java';
const result = spawnSync(java, [
  '-Djava.awt.headless=true', '--class-path', `${home}/lib/*${delimiter}${home}/lib/ext/*`,
  'scripts/ValidateJmeter.java', home, 'performance/parabank.jmx',
], { encoding: 'utf8', timeout: 60_000 });
const log = `${result.stdout || ''}${result.stderr || ''}\nExit code: ${result.status}\n`;
writeFileSync('docs/jmeter-validation.txt', log);
const sha512 = file => createHash('sha512').update(readFileSync(file)).digest('hex');
const archive = '.tools/jmeter-download.zip';
const checksum = '.tools/jmeter-download.zip.sha512';
let archiveIntegrity;
if (existsSync(archive) && existsSync(checksum)) {
  const actual = sha512(archive);
  const expected = readFileSync(checksum, 'utf8').trim().split(/\s+/)[0].toLowerCase();
  assert.equal(actual, expected);
  archiveIntegrity = { sha512: actual, matchesOfficialChecksum: true };
}
writeFileSync('docs/jmeter-validation.json', JSON.stringify({
  validatedAt: new Date().toISOString(), exitCode: result.status,
  mode: 'SaveService.loadTree y compilación Groovy; sin motor ni muestras',
  jmxSha512: sha512('performance/parabank.jmx'), archiveIntegrity,
  javaVersion: spawnSync(java, ['-version'], { encoding: 'utf8' }).stderr?.trim(),
}, null, 2));
process.stdout.write(log);
if (result.error) throw result.error;
assert.equal(result.status, 0, 'Validación JMeter fallida');
