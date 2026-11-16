import { appendFileSync, existsSync, readFileSync } from 'node:fs';

let summary;
if (!existsSync('reports/latest/results.json')) {
  summary = '## Pruebas funcionales\n\nNo hay resultados: revisar los pasos previos. No equivale a una suite aprobada.\n';
} else {
  const { stats } = JSON.parse(readFileSync('reports/latest/results.json', 'utf8'));
  summary = `## Pruebas funcionales\n\nAprobadas: ${stats.expected}; fallidas: ${stats.unexpected}; omitidas: ${stats.skipped}; inestables: ${stats.flaky}.\n\nLos bloqueos requieren clasificación en el informe de ejecución; no se reinterpretan como aprobados.\n`;
}
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
else process.stdout.write(summary);
