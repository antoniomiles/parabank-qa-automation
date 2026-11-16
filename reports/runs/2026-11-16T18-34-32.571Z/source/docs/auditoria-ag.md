# Auditoría contra Prueba QA Automation.pdf

Fuente comprobada: PDF de tres páginas encontrado en Descargas, extraído en `requirements-extracted.txt`; nombre y SHA-256 en `requirements-source.json`. Fecha: 16/11/2026. Esta es una práctica independiente asistida por IA. El PDF prohíbe IA: el cumplimiento técnico no la convierte en una evaluación válida sin asistencia.

La entrega anterior no cubría el flujo de pagos exigido: no había CSV, pruebas de Bill Pay, dos escenarios JMeter ni análisis simulado. La auditoría corrigió estas omisiones y volvió a ejecutar las pruebas funcionales. «Cumple» significa entregable comprobado; no significa que todos los criterios de negocio del aplicativo hayan aprobado. Los dos fallos reales permanecen en rojo.

## Matriz de requisitos y comprobaciones

| Requisito | Estado | Evidencia comprobada | Acción necesaria |
| --- | --- | --- | --- |
| A: Excel/CSV con mínimo cinco casos de pago | cumple | `casos/casos-pagos.csv`: siete filas PAY-01 a PAY-07; parseo CSV automático | Ninguna |
| A: ID, escenario, precondiciones, datos, pasos, esperado, prioridad y aceptación | cumple | Once columnas; ocho campos exigidos presentes y no vacíos en cada fila | Ninguna |
| A: positivos, negativos y regresión | cumple | PAY-01/02 positivos; PAY-03 a 07 negativos; todos marcados para regresión | Ninguna |
| A: selección y justificación de automatización | cumple | Columnas Automatización y Justificación; los siete IDs aparecen en resultados reales | Ninguna |
| B: Playwright/Cypress y al menos tres casos de A ejecutados | cumple | `tests/web/payments.spec.ts`: siete casos de A ejecutados; 5 aprobados y 2 fallidos por discrepancias del producto | Corregir producto para aprobar PAY-04/05; no cambiar el esperado |
| B: login válido de usuario del entorno demo | cumple | PAY-01 crea cliente sintético, cierra sesión, inicia con credenciales válidas y abre Bill Pay | Ninguna; no depende de credenciales públicas compartidas |
| B: pago válido y comprobación del resultado mostrado | cumple | PAY-02: confirmación, beneficiario, monto 10.25 y cuenta; débito y saldo vía API; movimiento visible en UI | Ninguna |
| B: negativo de formulario de pagos | cumple | PAY-03 obligatorio vacío y PAY-07 cuentas discrepantes, ambos aprobados; capturas adjuntas | Ninguna |
| B: aserciones, datos organizados, reutilización y sin esperas fijas | cumple | `payments-page.ts`, `bank-page.ts`, `data.ts`, fixtures; sin waitForTimeout | Ninguna |
| B: código, instrucciones y reportes/capturas | cumple | `README.md`, HTML/JSON/JUnit, 14 capturas finales web y evidencias de dos fallos | Ninguna |
| C: al menos dos operaciones REST documentadas relacionadas con negocio | cumple | OpenAPI conserva GET cuenta, GET movimientos y POST billpay; API-04/05 las ejercitan | Ninguna |
| C: estado, contenido y datos de negocio | cumple | API-05 aprobado: HTTP 200, JSON, accountId, amount, payeeName, débito 2.50 y reducción de saldo 2.50 | Ninguna |
| C: código y evidencia; diagnóstico si API inaccesible | cumple | `bank-api.ts` adjunta solicitud/respuesta y error de transporte; histórico ENV-01 conserva acceso bloqueado y alternativa de red autorizada | Ninguna |
| D: YAML instala dependencias y navegador y ejecuta pruebas | cumple | `.github/workflows/qa.yml`, parseado: npm ci, Chromium, typecheck, validación local y npm test | Ejecutar posteriormente en GitHub |
| D: resultados y artefactos aun con fallos, sin forzar éxito | cumple | Resumen con always(), upload-artifact con always(); sin continue-on-error ni `|| true` | Ninguna local |
| D: instrucciones y enlace/captura de ejecución cuando sea posible | parcial | Instrucciones en README; no hay repositorio remoto ni run de GitHub verificado | Publicar solo con autorización; ejecutar workflow y conservar URL/artefactos reales |
| E: resumen ejecutadas, aprobadas, fallidas y bloqueadas | cumple | `execution.md`: 19 ejecutadas, 17 aprobadas, 2 fallidas de producto, 0 bloqueadas en ejecución ampliada | Ninguna |
| E: defectos con título, pasos, esperado, obtenido, severidad y evidencia | cumple | `defects.md`: BUG-01/02 con cuentas sintéticas, resultados monetarios, capturas, trazas y JSON | Responsable de ParaBank debe resolver discrepancias |
| E: integridad y conservación de reportes reales | cumple | `evidence-audit.json`: históricos, JUnit/JSON consistentes, firmas PNG/ZIP, adjuntos y hashes; no certifica autenticidad externa | No borrar históricos al compartir |
| F: API de consulta de negocio y justificación por frecuencia/importancia/riesgo | cumple | GET movimientos en `.jmx` y `performance/README.md`; sustituye el chequeo de documentación anterior | Ninguna |
| F: HTTP Request, variables/parámetros, aserciones y listeners | cumple | Dos HTTP samplers; host/port/protocol/accountId; HTTP 200 y Groovy JSON; Summary Report | Configurar cuenta y destino propios antes de una futura ejecución autorizada |
| F: escenario base con usuarios, ramp-up e iteraciones | cumple | Grupo base: 5 usuarios, 10 s, 3 iteraciones por usuario; deshabilitado | Ninguna para entrega sin carga |
| F: escenario incremental con usuarios, ramp-up e iteraciones | cumple | Grupo incremental: 10 usuarios, 30 s, 5 iteraciones; aumento respecto a base, grupos secuenciales | Ninguna para entrega sin carga |
| F: promedio, p95, throughput y porcentaje de errores | cumple | Métricas y límites de interpretación en `performance/README.md` | Medir solo en un entorno autorizado si se solicita después |
| F: análisis de valores simulados 450/1800 ms y 0/8% | cumple | `performance/analisis-simulado.md`: 4× latencia, +8 puntos, hipótesis, investigación y bloqueo provisional justificado | Ninguna; valores identificados como simulados |
| F: archivo listo y comprobado sin ejecutar carga/estrés | cumple | JMeter 5.6.3 SaveService deserializó ambos grupos; aserción Groovy compilada sin ejecutar; exit 0, log/metadata y SHA-512 en `jmeter-validation.txt`/`.json` | Solo configurar instancia/cuenta propias y habilitar una copia si se autoriza una ejecución futura |
| G: elegir herramienta y describir pasos para automatizar una app | cumple | `mobile-appium.md`: Appium, Android/iOS, appPackage/activity, APK/IPA, Inspector, IDs, contexts, Page Objects, esperas y reportes | Ninguna para el requisito documental |
| G: ejemplo ejecutable complementario mobile web | parcial | `mobile/smoke.mjs`, package.json y lockfile; sintaxis válida; no hay SDK/dispositivo ni ejecución | Para ejecutarlo, preparar dispositivo/Appium y resolver avisos residuales npm; no es evidencia nativa |
| General: README y estructura clara | cumple | README, casos, tests/web, tests/api, performance, docs, reports, .github y mobile | Ninguna |
| General: no inventar evidencia ni ocultar fallos | cumple | Histórico previo 11/11 aprobado se distingue del actual 17/19; BUG-01/02 permanecen fallidos | Ninguna |
| General: repositorio accesible y envío a talento humano | pendiente | No hay remoto publicado ni envío; el usuario no autorizó publicación ni mensajes a terceros | Requiere autorización explícita y datos de destino; no se realizó |
| General: prohibición de IA en la evaluación | pendiente | README declara asistencia; el proyecto fue desarrollado con IA | No presentarlo como entrega sin asistencia; requerir aceptación expresa de una práctica asistida o elaborar evaluación independiente bajo sus reglas |

## Aceptación del negocio contrastada con el aplicativo

| Regla del PDF | Estado | Resultado real | Acción necesaria |
| --- | --- | --- | --- |
| CA-01: autenticación para operaciones | cumple | Login válido permite Bill Pay; ruta de pagos sin sesión no permite enviar | Mantener regresión PAY-01/06; no equivale a auditoría completa de autorización REST |
| CA-02: datos obligatorios de pago | cumple | PAY-03 y PAY-07 rechazan formulario vacío/cuentas distintas | Mantener regresión |
| CA-03: monto mayor que cero | pendiente | PAY-04/05: ParaBank acepta 0 y -1; se verifican movimientos y saldo | Corregir validación del aplicativo y volver a probar |
| CA-04: evidencia de éxito y movimiento | cumple | PAY-02 y API-05 verifican confirmación, movimiento y saldo | Mantener regresión |
| CA-05: rechazo no tratado como éxito | parcial | Rechazos por campos se muestran correctamente; montos no positivos se aceptan como éxito | Corregir BUG-01/02 |

La revisión automática valida existencia, contenido y consistencia; no reproduce cada vídeo ni certifica origen remoto. Las capturas de ambos fallos se inspeccionaron visualmente. No se califica el puntaje del candidato ni se declara aprobada la evaluación formal.
