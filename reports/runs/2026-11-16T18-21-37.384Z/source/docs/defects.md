# Registro de incidencias

Los hallazgos son de infraestructura y automatización. No se encontraron defectos de producto confirmados en el alcance ejecutado. Los resultados fallidos originales se conservan y no se convierten en aprobados retroactivamente.

| ID | Clasificación / prioridad | Reproducción y resultado real | Corrección y estado |
| --- | --- | --- | --- |
| ENV-01 | Infraestructura / P1 | Ejecutar `npm test` con red restringida: API devuelve EACCES y navegador ERR_NETWORK_ACCESS_DENIED; 11 fallos | Ejecutar con acceso de red autorizado. Resuelto para la ejecución final; el entorno restringido sigue bloqueando HTTPS |
| AUTO-01 | Automatización / P1 | API-01: GET `/services/bank/status`; esperado 200, recibido 404 | Verificar OpenAPI publicado: no existe esa ruta. Sustituir el supuesto chequeo de estado por disponibilidad y contenido del contrato `openapi.yaml`. Corregido y aprobado |
| AUTO-02 | Automatización / P2 | API-03: GET cuenta 2147483647; HTTP 400 correcto, texto `Could not find account #2147483647` fuera de la expresión esperada | Aserción exacta del error para esa cuenta. Corregido y aprobado |

Evidencia ENV-01: `reports/runs/2026-11-16T17-59-01.950Z/results.json` y `artifacts/`.

Evidencia AUTO-01 y AUTO-02: `reports/runs/2026-11-16T17-59-41.892Z/results.json`, reporte HTML y trazas. Confirmación posterior: `reports/runs/2026-11-16T18-05-58.964Z/results.json`.

Para un futuro defecto de producto registrar: ID, título, versión y entorno, precondiciones, datos ficticios, pasos mínimos, esperado con su criterio de aceptación, observado, severidad, prioridad, evidencia, reproducibilidad y estado. No registrar como defecto un comportamiento desconocido sin verificar el contrato o requisito.
