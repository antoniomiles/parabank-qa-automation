# Análisis de datos simulados del PDF

Estos valores proceden del ejercicio, no de una ejecución propia ni de mediciones de ParaBank.

| Usuarios | Promedio simulado | Errores simulados |
| --- | --- | --- |
| 5 | 450 ms | 0% |
| 10 | 1.800 ms | 8% |

Al duplicar usuarios, el promedio se cuadruplica (+300%) y los errores aumentan 8 puntos porcentuales. Esto sugiere saturación o contención y riesgo de timeouts o indisponibilidad. En pagos puede provocar reintentos y dudas sobre el estado de la operación; no prueba que existan duplicados o pérdida de datos.

Investigaría códigos y cuerpos de error, timestamps, tamaño de muestra, duración, ramp-up, distribución de latencias y throughput. Correlacionaría con CPU, memoria/GC, pools de conexiones, consultas e índices, bloqueos y límites de servicios externos. Verificaría también que el generador no sea el cuello de botella y que ambas muestras usen datos y condiciones comparables. No se puede deducir p95, capacidad máxima o causa raíz a partir de dos promedios y porcentajes.

Bloquearía provisionalmente el despliegue hasta caracterizar el 8% de errores y acordar/verificar los objetivos con el equipo. La justificación es el riesgo sobre un flujo bancario crítico y una degradación marcada a baja concurrencia, no el incumplimiento de un SLA que el PDF no define. Solicitaría una prueba controlada en entorno autorizado, reproducción con monitoreo y validación de integridad de movimientos después de corregir la causa.
