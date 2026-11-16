import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DOMParser } from '@xmldom/xmldom';
import { parse } from 'csv-parse/sync';

function specs(suite) {
  return [...(suite.specs || []), ...(suite.suites || []).flatMap(specs)];
}
function files(directory) {
  return readdirSync(directory).flatMap(name => {
    const file = path.join(directory, name);
    return statSync(file).isDirectory() ? files(file) : [file];
  });
}
function inspect(directory) {
  const report = JSON.parse(readFileSync(path.join(directory, 'results.json'), 'utf8'));
  assert.ok(statSync(path.join(directory, 'html/index.html')).size > 0);
  const xml = new DOMParser().parseFromString(readFileSync(path.join(directory, 'junit.xml'), 'utf8'), 'text/xml');
  const tests = specs(report).flatMap(spec => spec.tests.map(test => ({ title: spec.title, ...test })));
  assert.equal(Number(xml.documentElement.getAttribute('tests')), tests.length);
  const junitFailures = Number(xml.documentElement.getAttribute('failures'));
  const junitErrors = Number(xml.documentElement.getAttribute('errors'));
  assert.equal(junitFailures + junitErrors, report.stats.unexpected);
  let attachments = 0;
  let screenshots = 0;
  for (const test of tests) {
    for (const result of test.results) for (const attachment of result.attachments) {
      let bytes;
      if (attachment.body !== undefined) bytes = Buffer.from(attachment.body, 'base64');
      else {
        const normalized = attachment.path.replaceAll('\\', '/');
        const relative = normalized.split('/reports/latest/')[1];
        assert.ok(relative, `Ruta de adjunto desconocida: ${attachment.path}`);
        const file = path.join(directory, relative);
        assert.ok(existsSync(file), `Adjunto ausente: ${file}`);
        bytes = readFileSync(file);
      }
      assert.ok(bytes.length > 0, `Adjunto vacío: ${attachment.name}`);
      if (attachment.contentType === 'image/png') {
        assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        screenshots++;
      }
      if (attachment.contentType === 'application/zip') assert.equal(bytes.subarray(0, 2).toString(), 'PK');
      if (attachment.contentType === 'application/json') JSON.parse(bytes.toString('utf8'));
      attachments++;
    }
  }
  const manifest = files(directory).map(file => ({
    file: path.relative(directory, file).replaceAll('\\', '/'), bytes: statSync(file).size,
    sha256: createHash('sha256').update(readFileSync(file)).digest('hex'),
  }));
  return {
    directory, stats: report.stats, total: tests.length, junitFailures, junitErrors,
    projects: Object.fromEntries([...new Set(tests.map(test => test.projectName))].map(project => [project, tests.filter(test => test.projectName === project).length])),
    failures: tests.filter(test => test.status !== 'expected').map(test => test.title),
    attachments, screenshots, manifest,
  };
}

const directories = readdirSync('reports/runs').map(name => `reports/runs/${name}`).filter(directory => existsSync(`${directory}/results.json`));
const runs = directories.map(inspect);
const latest = inspect('reports/latest');
const report = JSON.parse(readFileSync('reports/latest/results.json', 'utf8'));
const executed = specs(report).map(spec => spec.title.split(' ')[0]);
for (const spec of specs(report)) for (const test of spec.tests) {
  if (test.projectName === 'chromium') assert.ok(test.results.some(result => result.attachments.some(attachment => attachment.name === 'final-page')), `Captura final ausente: ${spec.title}`);
}
for (const row of parse(readFileSync('casos/casos-pagos.csv'), { columns: true, skip_empty_lines: true })) {
  assert.ok(executed.includes(row.ID), `Sin evidencia ejecutada: ${row.ID}`);
}
const output = { checkedAt: new Date().toISOString(), scope: 'Integridad local; firmas y existencia, no certificación de autenticidad externa ni reproducción de vídeos.', latest, runs };
writeFileSync('docs/evidence-audit.json', JSON.stringify(output, null, 2));
console.log(JSON.stringify({ latest: { total: latest.total, stats: latest.stats, projects: latest.projects, screenshots: latest.screenshots, attachments: latest.attachments }, historicalRuns: runs.length, status: 'Integridad y trazabilidad verificadas; se conservan los fallos del producto.' }, null, 2));
