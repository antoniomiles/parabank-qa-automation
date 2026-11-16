# Ejecución real

## Actualización tras auditoría del PDF

La ejecución ampliada final empezó a las 18:31:42 UTC del 16/11/2026 y duró 69,34 s: 19 ejecutadas, 17 aprobadas, 2 fallidas por discrepancias del producto, 0 bloqueadas, 0 omitidas y 0 inestables. Desglose: 5 API aprobadas; 14 web, de las que 12 aprobaron y PAY-04/05 fallaron. Los dos defectos se reprodujeron en dos ejecuciones independientes. El retorno de `npm test` fue 1; no se ocultó.

Se comprobó captura final en los 14 casos web, además de una captura de confirmación de pago y dos capturas automáticas de fallo: 17 PNG y 67 adjuntos en total. Reportes HTML, JSON y JUnit consistentes; trazas/vídeos de los fallos presentes. La comprobación automática de integridad se realizó con una herramienta auxiliar posteriormente retirada de la entrega; sus registros anteriores se conservan en los históricos. Esta verificación no reproduce los vídeos ni certifica autenticidad externa.

La primera ejecución ampliada empezó 18:18:23 UTC, duró 67,91 s y también terminó 17/19: se conserva en `reports/runs/2026-11-16T18-21-37.384Z`. Detectó los dos defectos del producto y la ausencia de capturas en algunos casos nuevos. Después se corrigió AUTO-03 y se repitió la suite final; no se fabricaron capturas para completar la ejecución anterior.

Validaciones locales posteriores: TypeScript, sintaxis JS, CSV de siete filas con campos completos, YAML del workflow, OpenAPI, lockfiles y estructura JMeter aprobados. El plan fue deserializado por JMeter 5.6.3 y la aserción Groovy compiló, sin ejecutar el script, motor o muestras. Log y checksum oficial en `docs/jmeter-validation.txt`/`.json`. No se ejecutó carga.

La resolución de dependencias mobile detectó avisos: actualización a WebdriverIO 10.2.0 reduce 14 a 4 moderados; detalle conservado en `mobile-dependency-audit.json`. No hay ejecución Appium ni run GitHub Actions. El requisito G pide una descripción, que ahora también cubre app nativa; no se acredita una app o dispositivo inexistente.

El historial siguiente corresponde a la suite anterior al PDF y no debe interpretarse como resultado final de pagos. Los entregables A–G se resumen en el README.

## Historial anterior a la auditoría

Fecha: 16 de noviembre de 2026. Destino: `https://parabank.parasoft.com`. Windows x64, Node 26.13.1, Playwright 1.65.1, TypeScript 5.9.3, Chromium build 1255. El pipeline propone Node 24 LTS; no se verificó ese entorno en esta máquina.

| Inicio UTC | Resultado | Archivo histórico |
| --- | --- | --- |
| 17:58:42 | 0 aprobadas, 11 fallidas por acceso de red restringido; 14,28 s | `reports/runs/2026-11-16T17-59-01.950Z` |
| 17:59:05 | 9 aprobadas, 2 fallidas en automatización; 19,84 s | `reports/runs/2026-11-16T17-59-41.892Z` |
| 18:05:29 | 11 aprobadas, 0 fallidas, 0 omitidas, 0 inestables; 17,12 s | `reports/runs/2026-11-16T18-05-58.964Z` |

Resultado de esa versión: 7 casos web y 4 API aprobados. Typecheck aprobado antes de ejecutar esa versión. El XML JMeter original solo se había validado sintácticamente con PowerShell. Instalación npm inicial: auditoría de 7 paquetes sin vulnerabilidades reportadas en ese momento; esto no constituye una auditoría de seguridad ni describe el lockfile mobile añadido posteriormente.

Las dos primeras ejecuciones no se borraron. La primera conserva los bloqueos `EACCES` y `ERR_NETWORK_ACCESS_DENIED`. La segunda conserva los errores de ruta y mensaje descritos en `defects.md`. El contrato real se descargó desde `/parabank/services/bank/openapi.yaml` y se conserva en `docs/openapi.yaml`. Las consultas previas a `application.wadl` y `api-docs/swagger.json` devolvieron 404; no corresponden a defectos del producto.

Cada histórico contiene HTML, JSON, JUnit y artefactos. El histórico de las 18:05 UTC también incluye copia del código de pruebas, configuración y lockfile. Los dos primeros conservan su código relevante en los contextos de error y trazas, pero no un snapshot completo. Los archivos posteriores incluyen además documentación, casos, scripts, workflow y ejemplo mobile. `environment.json` registra momento de archivo, no inicio de ejecución; el inicio real está en `results.json`.

Evidencias de esa versión: siete capturas finales web y cuerpos/estados API. Los artefactos de fallo anteriores contienen capturas, vídeos y trazas cuando fue posible generarlos. No se generaron resultados mobile ni de rendimiento.

En esa etapa no había defectos de producto confirmados; la ampliación identificó BUG-01/02. Pendientes actuales: publicación y ejecución GitHub con autorización; corrección de los dos defectos por el responsable del aplicativo; resolver avisos mobile y preparar dispositivo si se decide ejecutar ese ejemplo. La entrega documental G y la validación sin carga del plan JMeter ya están comprobadas.
