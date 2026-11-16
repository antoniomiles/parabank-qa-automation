# Ejecución real

Fecha: 16 de noviembre de 2026. Destino: `https://parabank.parasoft.com`. Windows x64, Node 26.13.1, Playwright 1.65.1, TypeScript 5.9.3, Chromium build 1255. El pipeline propone Node 24 LTS; no se verificó ese entorno en esta máquina.

| Inicio UTC | Resultado | Archivo histórico |
| --- | --- | --- |
| 17:58:42 | 0 aprobadas, 11 fallidas por acceso de red restringido; 14,28 s | `reports/runs/2026-11-16T17-59-01.950Z` |
| 17:59:05 | 9 aprobadas, 2 fallidas en automatización; 19,84 s | `reports/runs/2026-11-16T17-59-41.892Z` |
| 18:05:29 | 11 aprobadas, 0 fallidas, 0 omitidas, 0 inestables; 17,12 s | `reports/runs/2026-11-16T18-05-58.964Z` |

Resultado final: 7 casos web y 4 API aprobados. Typecheck aprobado antes de ejecutar la versión final. XML JMeter validado sintácticamente con el parser XML de PowerShell; no se abrió ni ejecutó en JMeter. Instalación npm: auditoría de 7 paquetes sin vulnerabilidades reportadas en ese momento; esto no constituye una auditoría de seguridad.

Las dos primeras ejecuciones no se borraron. La primera conserva los bloqueos `EACCES` y `ERR_NETWORK_ACCESS_DENIED`. La segunda conserva los errores de ruta y mensaje descritos en `defects.md`. El contrato real se descargó desde `/parabank/services/bank/openapi.yaml` y se conserva en `docs/openapi.yaml`. Las consultas previas a `application.wadl` y `api-docs/swagger.json` devolvieron 404; no corresponden a defectos del producto.

Cada histórico contiene HTML, JSON, JUnit y artefactos. El histórico final también incluye una copia del código de pruebas, configuración y lockfile. Los dos primeros conservan su código relevante en los contextos de error y trazas, pero no un snapshot completo de código. `environment.json` registra momento de archivo, no inicio de ejecución; el inicio real está en `results.json`.

Evidencias web: siete capturas finales adjuntas en el reporte final. Evidencias API: cuerpos y estados HTTP adjuntos. Los artefactos de fallo anteriores contienen capturas, vídeos y trazas cuando fue posible generarlos. No se generaron resultados mobile ni de rendimiento.

Pendientes: ejecutar GitHub Actions después de publicar con autorización; validar mobile con SDK/dispositivo; abrir el plan en JMeter sin ejecutar carga. El alcance funcional ampliado está declarado en el plan de pruebas. No hay defectos de producto confirmados en los casos ejecutados.
