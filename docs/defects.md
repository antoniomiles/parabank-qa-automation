# Defectos y limitaciones

Última ejecución local: 16/11/2026, 20:07 UTC. Resultado: 19 pruebas, 17 aprobadas y 2 fallidas. Los dos defectos siguientes siguen abiertos y se contrastan con las reglas de aceptación del ejercicio.

## BUG-01: pago de monto cero aceptado

- Severidad: media. Prioridad: P1. Caso: PAY-04.
- Pasos: registrar un cliente ficticio; abrir Bill Pay; completar beneficiario y cuenta válidos; enviar monto 0; consultar movimientos.
- Esperado: rechazo sin confirmación de éxito ni nuevo movimiento.
- Obtenido: Bill Payment Complete y débito de 0; cuenta 17007, movimiento 22690; saldo 515.50 sin variación.
- Evidencia: [reporte JSON](../reports/runs/2026-11-16T20-09-41.960Z/results.json) y [captura/traza/vídeo](../reports/runs/2026-11-16T20-09-41.960Z/artifacts/web-payments-PAY-04-negative-regression-reject-amount-0-chromium).

## BUG-02: pago negativo aumenta el saldo

- Severidad: alta. Prioridad: P1. Caso: PAY-05.
- Pasos: registrar otro cliente ficticio; abrir Bill Pay; completar datos válidos; registrar saldo; enviar monto -1; consultar cuenta y movimientos.
- Esperado: rechazo, saldo intacto y ningún movimiento nuevo.
- Obtenido: Bill Payment Complete y débito de -1; cuenta 17118, movimiento 22801; saldo aumenta de 515.50 a 516.50.
- Evidencia: [reporte JSON](../reports/runs/2026-11-16T20-09-41.960Z/results.json) y [captura/traza/vídeo](../reports/runs/2026-11-16T20-09-41.960Z/artifacts/web-payments-PAY-05-negative-regression-reject-amount--1-chromium).

## Limitaciones

GitHub Actions no inició pasos ni pruebas por un bloqueo de facturación de la cuenta: [ejecución real](https://github.com/antoniomiles/parabank-qa-automation/actions/runs/43954503559). No generó artefactos.

Mobile no se ejecutó con dispositivo. Quedan cuatro avisos moderados en dependencias: [análisis npm](../reports/validation/mobile-dependency-audit.json). JMeter se validó sin carga, como exige el documento.

Las incidencias anteriores de infraestructura y automatización y sus resultados permanecen en los [históricos](../reports/runs). No se modificaron expectativas para ocultar fallos.
