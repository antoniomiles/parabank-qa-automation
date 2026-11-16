# ParaBank QA Automation

Práctica independiente con asistencia de IA: pruebas web y API con Playwright/TypeScript, pipeline, evidencias, plan JMeter y guía Appium. No presentar como evaluación realizada sin asistencia cuando sus reglas prohíban IA. No se publicó el repositorio.

## Instalación y ejecución

Requisitos: Node.js 24 LTS, npm y conexión HTTPS. En Windows PowerShell usar `npm.cmd` y `npx.cmd` si la política bloquea los archivos `.ps1`.

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm test
npm run archive
npm run report
```

En Linux instalar navegador y librerías con `npx playwright install --with-deps chromium`. `npm test` ejecuta todos los casos con un trabajador y sin reintentos. Un fallo devuelve código distinto de cero. API-04 también necesita Chromium para crear un cliente independiente.

```sh
npm run test:web
npm run test:api
npm run test:smoke
```

El destino por defecto es `https://parabank.parasoft.com`. Cambiar mediante variable de entorno `BASE_URL` (solo origen, sin `/parabank`); `.env.example` es una referencia y no se carga automáticamente. PowerShell: `$env:BASE_URL='http://localhost:8080'`.

## Organización

| Ruta | Contenido |
| --- | --- |
| `tests/web`, `tests/api` | Casos ejecutables con IDs trazables |
| `tests/support` | Page Object, fixtures, datos y cliente REST |
| `reports/latest` | HTML, JSON, JUnit y artefactos de la última ejecución |
| `reports/runs` | Copias históricas reales, conservadas antes de repetir pruebas |
| `docs/test-plan.md` | Alcance, matriz, criterios y exclusiones |
| `docs/execution.md`, `docs/defects.md` | Resultado real y clasificación de fallos |
| `performance` | Plan JMeter deshabilitado, sin carga ejecutada |
| `mobile` y `docs/mobile-appium.md` | Ejemplo y preparación Appium, sin ejecución |
| `.github/workflows/qa.yml` | CI con typecheck, pruebas y artefactos incluso ante fallos |

Las capturas de cierre se adjuntan a cada caso web; los fallos retienen traza, vídeo y captura. API adjunta estado y cuerpo HTTP. Abrir una traza con `npx playwright show-trace <archivo.zip>`. Archivar con `npm run archive` antes de repetir: Playwright reemplaza el directorio `latest`. Los archivos originales Java/IntelliJ del directorio se conservaron.

Los clientes son ficticios y únicos. No se usan cuentas preexistentes, datos personales reales, limpieza global o carga contra el demo. El entorno público puede reiniciarse y no permite una limpieza individual segura en esta práctica. Los reportes pueden contener credenciales sintéticas y deben revisarse antes de compartirlos.

El workflow queda preparado para un repositorio futuro; su ejecución en GitHub no se ha verificado. No instala ni ejecuta JMeter o Appium. La suite funcional no equivale a cobertura completa bancaria.

Referencias: [ParaBank](https://parabank.parasoft.com/parabank/index.htm), [API de ParaBank](https://parabank.parasoft.com/parabank/api-docs/index.html), [configuración Playwright](https://playwright.dev/docs/test-configuration). Consultar resultados medidos en `docs/execution.md`.
