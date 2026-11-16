# Registro de incidencias

La primera suite detectó incidencias de infraestructura y automatización. La ampliación durante la auditoría identificó dos discrepancias reales de ParaBank frente a CA-03/CA-05 del PDF. Todos los resultados originales se conservan; los fallos de producto permanecen activos.

| ID | Clasificación / prioridad | Reproducción y resultado real | Corrección y estado |
| --- | --- | --- | --- |
| ENV-01 | Infraestructura / P1 | Ejecutar `npm test` con red restringida: API devuelve EACCES y navegador ERR_NETWORK_ACCESS_DENIED; 11 fallos | Ejecutar con acceso de red autorizado. Resuelto para la ejecución final; el entorno restringido sigue bloqueando HTTPS |
| AUTO-01 | Automatización / P1 | API-01: GET `/services/bank/status`; esperado 200, recibido 404 | Verificar OpenAPI publicado: no existe esa ruta. Sustituir el supuesto chequeo de estado por disponibilidad y contenido del contrato `openapi.yaml`. Corregido y aprobado |
| AUTO-02 | Automatización / P2 | API-03: GET cuenta 2147483647; HTTP 400 correcto, texto `Could not find account #2147483647` fuera de la expresión esperada | Aserción exacta del error para esa cuenta. Corregido y aprobado |

Evidencia ENV-01: `reports/runs/2026-11-16T17-59-01.950Z/results.json` y `artifacts/`.

Evidencia AUTO-01 y AUTO-02: `reports/runs/2026-11-16T17-59-41.892Z/results.json`, reporte HTML y trazas. Confirmación posterior: `reports/runs/2026-11-16T18-05-58.964Z/results.json`.

Para un futuro defecto de producto registrar: ID, título, versión y entorno, precondiciones, datos ficticios, pasos mínimos, esperado con su criterio de aceptación, observado, severidad, prioridad, evidencia, reproducibilidad y estado. No registrar como defecto un comportamiento desconocido sin verificar el contrato o requisito.

## BUG-01: pago cero confirmado y registrado

Estado: abierto, reproducido a las 18:18 y 18:31 UTC del 16/11/2026 en cuentas distintas. Severidad media; prioridad P1. Origen del esperado: CA-03 y CA-05 del PDF, no una especificación propia de ParaBank.

Pasos: crear cliente ficticio; iniciar sesión; abrir Bill Pay; completar beneficiario Practice Utility y cuenta 123456789; ingresar monto 0; enviar; consultar movimientos de la cuenta propia.

Esperado: rechazar monto no positivo, sin confirmación exitosa ni nuevo movimiento. Obtenido: Bill Payment Complete; movimiento Debit de 0, ID 149452, cuenta 102255; saldo 515.50 permanece igual. El defecto es la aceptación y el registro, no una variación monetaria.

Evidencia: caso PAY-04 en `reports/runs/2026-11-16T18-21-37.384Z/results.json`; adjunto `payment-business-check`; captura, vídeo y traza en `artifacts/web-payments-PAY-04-negative-regression-reject-amount-0-chromium/` del mismo histórico.

## BUG-02: pago negativo aumenta el saldo

Estado: abierto, reproducido en las dos ejecuciones ampliadas. Severidad alta; prioridad P1. Origen del esperado: CA-03 y CA-05 del PDF.

Pasos: crear otro cliente ficticio; abrir Bill Pay; completar beneficiario válido; registrar saldo y movimientos; ingresar monto -1; enviar; consultar cuenta y movimientos.

Esperado: rechazo, sin éxito ni movimiento y saldo intacto. Obtenido: Bill Payment Complete por $-1.00; débito de -1, ID 149563, cuenta 102366; saldo aumenta de 515.50 a 516.50.

Evidencia: PAY-05 en el JSON del mismo histórico; adjunto `payment-business-check`; captura, vídeo y traza en `artifacts/web-payments-PAY-05-negative-regression-reject-amount--1-chromium/`. Son cuentas sintéticas propias; no se consultaron ni alteraron cuentas ajenas.

Ambos casos requieren corrección del servidor y validación del formulario por el responsable del aplicativo, seguida de regresión en entorno autorizado. El repositorio de pruebas no debe adaptar el esperado para aprobar el comportamiento.

Confirmación final a las 18:31 UTC: PAY-04 usó cuenta 106140 y registró movimiento 155668 por 0; PAY-05 usó cuenta 106473, registró movimiento 156223 por -1 y aumentó saldo de 515.50 a 516.50. El reporte `reports/latest/results.json` y su copia histórica final conservan estos adjuntos; los IDs anteriores corresponden exclusivamente a la primera reproducción.

## DEP-01: dependencias del ejemplo mobile

Resolver el ejemplo con WebdriverIO 9 produjo 14 avisos npm (10 altos y 4 moderados). Se actualizó a 10.2.0 y se fijó lockfile: quedan 4 moderados en la cadena archiver/readdir-glob/minimatch/WebdriverIO. El detalle real está en `docs/mobile-dependency-audit.json`. No se aplicaron overrides incompatibles ni `audit fix --force`; queda pendiente una actualización compatible del proveedor y validación con dispositivo. La suite Playwright es independiente.

## AUTO-03: captura final omitida al reutilizar fixtures entre archivos

Severidad baja; prioridad P2; corregido. En la primera ejecución ampliada, el hook afterEach declarado al importar fixtures no se registró en todas las suites del mismo worker: PAY-01/02/03 carecían de captura final. Se preservó el histórico de las 18:18 UTC y se sustituyó el hook por una fixture automática que se ejecuta por caso. Se añadió captura explícita de la confirmación de PAY-02 y se repitió la suite. El verificador ahora exige captura final en cada caso web de la ejecución actual.
