# ParaBank QA Automation

Práctica independiente con asistencia de IA: pruebas web y API con Playwright/TypeScript, pipeline, evidencias, plan JMeter y guía Appium. No presentar como evaluación realizada sin asistencia cuando sus reglas prohíban IA. No se publicó el repositorio.

La auditoría del PDF está en [docs/auditoria-ag.md](docs/auditoria-ag.md), con requisito, estado, evidencia y acción. Se añadieron siete casos CSV y su automatización de pagos; la suite ampliada contiene 14 pruebas web y 5 API. ParaBank acepta pagos cero y negativos contra las reglas del ejercicio: esos casos permanecen fallidos y se documentan como BUG-01/02.

## Instalación y ejecución

Requisitos: Node.js 24 LTS, npm y conexión HTTPS. En Windows PowerShell usar `npm.cmd` y `npx.cmd` si la política bloquea los archivos `.ps1`.

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm run verify:local
npm test
npm run archive
npm run report
```

En Linux instalar navegador y librerías con `npx playwright install --with-deps chromium`. `npm test` ejecuta todos los casos con un trabajador y sin reintentos. Un fallo devuelve código distinto de cero; no usar `&&` para impedir archivar cuando hay fallos. API-04/05 también necesitan Chromium para crear clientes independientes.

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
| `casos/casos-pagos.csv` | Siete casos completos del flujo de pago; importar como CSV UTF-8 |
| `reports/latest` | HTML, JSON, JUnit y artefactos de la última ejecución |
| `reports/runs` | Copias históricas reales, conservadas antes de repetir pruebas |
| `docs/test-plan.md` | Alcance, matriz, criterios y exclusiones |
| `docs/execution.md`, `docs/defects.md` | Resultado real y clasificación de fallos |
| `performance` | Plan JMeter deshabilitado, sin carga ejecutada |
| `mobile` y `docs/mobile-appium.md` | Ejemplo y preparación Appium, sin ejecución |
| `.github/workflows/qa.yml` | CI con typecheck, pruebas y artefactos incluso ante fallos |
| `docs/auditoria-ag.md`, `docs/evidence-audit.json` | Auditoría de requisitos e integridad de evidencias |

Las capturas de cierre se adjuntan a cada caso web; los fallos retienen traza, vídeo y captura. API adjunta estado y cuerpo HTTP. Abrir una traza con `npx playwright show-trace <archivo.zip>`. Archivar con `npm run archive` antes de repetir: Playwright reemplaza el directorio `latest`. Los archivos originales Java/IntelliJ del directorio se conservaron.

`npm run verify:local` valida CSV, YAML, contrato, estructura JMeter y lockfiles sin tráfico. `npm run audit:evidence` verifica reportes históricos, adjuntos, consistencia JUnit/JSON y trazabilidad con el CSV; genera hashes en `docs/evidence-audit.json`. Un chequeo de integridad aprobado no convierte pruebas funcionales fallidas en aprobadas. Para extraer otro PDF: `npm run requirements:extract -- <ruta-pdf>`.

JMeter 5.6.3 deserializó los dos escenarios y compiló la aserción Groovy sin ejecutarla. Evidencia: `docs/jmeter-validation.txt` y `.json`. Para reproducir con JMeter y un JDK instalados: `node scripts/validate-jmeter.mjs <jmeter-home> <java-bin>`. No inicia grupos ni motor. Parámetros, métricas y análisis simulado: [performance/README.md](performance/README.md). No se ejecutó carga.

Los clientes son ficticios y únicos. No se usan cuentas preexistentes, datos personales reales, limpieza global o carga contra el demo. El entorno público puede reiniciarse y no permite una limpieza individual segura en esta práctica. Los reportes pueden contener credenciales sintéticas y deben revisarse antes de compartirlos.

El workflow queda preparado para un repositorio futuro; su ejecución en GitHub no se ha verificado. No instala ni ejecuta JMeter o Appium. La suite funcional no equivale a cobertura completa bancaria.

Después de autorizar y realizar una publicación: abrir Actions, seleccionar «ParaBank functional QA» y Run workflow, o crear un pull request. Revisar el estado real, el resumen y descargar el artefacto `parabank-results-<run_id>`; conservar URL de ejecución y reportes. No hay enlace/captura de GitHub en esta entrega porque no se publicó ni ejecutó allí.

Mobile: el requisito documental G está cubierto en [docs/mobile-appium.md](docs/mobile-appium.md), incluyendo app nativa Android/iOS. El ejemplo adicional es Chrome Android y no se ejecutó. WebdriverIO se actualizó a 10.2.0; cuatro avisos moderados residuales se conservan en `docs/mobile-dependency-audit.json`. Resolverlos y preparar dispositivo antes de adoptar el ejemplo en un entorno operativo.

Referencias: [ParaBank](https://parabank.parasoft.com/parabank/index.htm), [API de ParaBank](https://parabank.parasoft.com/parabank/api-docs/index.html), [configuración Playwright](https://playwright.dev/docs/test-configuration). Consultar resultados medidos en `docs/execution.md`.
