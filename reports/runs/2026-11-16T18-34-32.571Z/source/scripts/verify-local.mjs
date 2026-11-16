import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { parse as csvParse } from 'csv-parse/sync';
import { parse as yamlParse } from 'yaml';
import { DOMParser } from '@xmldom/xmldom';

const text = file => readFileSync(file, 'utf8');
const cases = csvParse(text('casos/casos-pagos.csv'), { columns: true, skip_empty_lines: true });
const columns = ['ID', 'Escenario', 'Precondiciones', 'Datos', 'Pasos', 'Resultado esperado', 'Prioridad', 'Criterio de aceptación'];
assert.ok(cases.length >= 5);
assert.equal(new Set(cases.map(row => row.ID)).size, cases.length);
for (const row of cases) for (const column of columns) assert.ok(row[column]?.trim(), `${row.ID}: ${column}`);
assert.ok(cases.some(row => row.Tipo.includes('Positivo')));
assert.ok(cases.some(row => row.Tipo.includes('Negativo')));
assert.ok(cases.some(row => row.Tipo.includes('regresión')));
for (const row of cases) assert.ok(existsSync(row.Automatización.split(':')[0]));

const workflowText = text('.github/workflows/qa.yml');
const workflow = yamlParse(workflowText);
assert.ok(workflow.on.workflow_dispatch !== undefined || Object.hasOwn(workflow.on, 'workflow_dispatch'));
const steps = workflow.jobs.functional.steps;
for (const command of ['npm ci', 'npx playwright install --with-deps chromium', 'npm run typecheck', 'npm run verify:local', 'npm test']) {
  assert.ok(steps.some(step => step.run === command), `Workflow: ${command}`);
}
assert.ok(steps.some(step => step.uses?.startsWith('actions/upload-artifact@') && step.if === 'always()' && step.with.path === 'reports/latest/'));
assert.ok(steps.some(step => step.run === 'node scripts/summarize.mjs' && step.if === 'always()'));
assert.ok(!steps.some(step => step['continue-on-error'] === true));
assert.ok(!workflowText.includes('|| true'));

const spec = yamlParse(text('docs/openapi.yaml'));
assert.ok(spec.paths['/accounts/{accountId}'].get);
assert.ok(spec.paths['/accounts/{accountId}/transactions'].get);
assert.ok(spec.paths['/billpay'].post);

const document = new DOMParser({ onError: level => { throw new Error(`XML inválido: ${level}`); } }).parseFromString(text('performance/parabank.jmx'), 'text/xml');
const elements = name => Array.from(document.getElementsByTagName(name));
assert.equal(document.documentElement.tagName, 'jmeterTestPlan');
const groups = elements('ThreadGroup');
assert.equal(groups.length, 2);
for (const [index, group] of groups.entries()) {
  const properties = Array.from(group.getElementsByTagName('stringProp'));
  const values = Object.fromEntries(properties.map(item => [item.getAttribute('name'), item.textContent]));
  assert.equal(group.getAttribute('enabled'), 'false');
  const prefix = index === 0 ? 'base' : 'incremental';
  assert.equal(values['ThreadGroup.num_threads'], '${__P(' + prefix + '.users,' + (index === 0 ? '5' : '10') + ')}');
  assert.equal(values['ThreadGroup.ramp_time'], '${__P(' + prefix + '.ramp,' + (index === 0 ? '10' : '30') + ')}');
  assert.equal(values['LoopController.loops'], '${__P(' + prefix + '.loops,' + (index === 0 ? '3' : '5') + ')}');
}
assert.equal(elements('HTTPSamplerProxy').length, 2);
assert.equal(elements('ResultCollector').length, 1);
assert.equal(elements('JSR223Assertion').length, 1);
assert.equal(elements('ResponseAssertion').length, 1);
for (const sampler of elements('HTTPSamplerProxy')) assert.ok(sampler.textContent.includes('/transactions'));
for (const tree of elements('hashTree')) {
  const children = Array.from(tree.childNodes).filter(node => node.nodeType === 1);
  assert.equal(children.length % 2, 0, 'Cada componente JMeter requiere hashTree hermano');
  for (let i = 1; i < children.length; i += 2) assert.equal(children[i].nodeName, 'hashTree');
}
assert.ok(text('performance/parabank.jmx').includes('${__P(host,localhost)}'));
for (const file of ['README.md', 'docs/test-plan.md', 'docs/execution.md', 'docs/defects.md', 'docs/mobile-appium.md', 'performance/analisis-simulado.md', 'docs/auditoria-ag.md', 'mobile/smoke.mjs', 'mobile/package-lock.json']) {
  assert.ok(existsSync(file), file);
}
const packageJson = JSON.parse(text('package.json'));
const lock = JSON.parse(text('package-lock.json'));
assert.deepEqual(lock.packages[''].devDependencies, packageJson.devDependencies);
const mobile = JSON.parse(text('mobile/package.json'));
const mobileLock = JSON.parse(text('mobile/package-lock.json'));
assert.deepEqual(mobileLock.packages[''].dependencies, mobile.dependencies);
console.log(`Validación local aprobada: ${cases.length} casos CSV, workflow YAML, contrato REST, dos escenarios JMeter y lockfiles. No se ejecutó tráfico ni el motor JMeter.`);
