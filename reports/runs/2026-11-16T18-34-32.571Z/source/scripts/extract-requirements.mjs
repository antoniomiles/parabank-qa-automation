import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

if (!process.argv[2]) throw new Error('Uso: npm run requirements:extract -- <ruta-pdf>');
const bytes = readFileSync(process.argv[2]);
const document = await getDocument({ data: new Uint8Array(bytes) }).promise;
let extracted = '';
for (let number = 1; number <= document.numPages; number++) {
  const page = await document.getPage(number);
  const text = await page.getTextContent();
  extracted += `\n--- Página ${number} ---\n${text.items.map(item => item.str + (item.hasEOL ? '\n' : ' ')).join('')}`;
}
writeFileSync('docs/requirements-extracted.txt', extracted);
writeFileSync('docs/requirements-source.json', JSON.stringify({
  filename: basename(process.argv[2]), sha256: createHash('sha256').update(bytes).digest('hex'),
  pages: document.numPages, extractedAt: new Date().toISOString(),
}, null, 2));
console.log(`Extraídas ${document.numPages} páginas; no se modifica el PDF original.`);
