# Plan JMeter: consulta de movimientos

Endpoint elegido: `GET /parabank/services/bank/accounts/{accountId}/transactions`, publicado en `docs/openapi.yaml`. Se consulta después del pago para confirmar el débito; su frecuencia e importancia justifican evaluarlo. El riesgo es degradar el acceso al historial al crecer los datos o devolver movimientos de otra cuenta. Consultar OpenAPI mide documentación, no una operación de negocio.

No se ejecutó carga ni estrés. Ambos grupos están deshabilitados; destino por defecto localhost. Incluye HTTP Request, Accept JSON, timeouts, HTTP 200 exacto, aserción Groovy de JSON y pertenencia a cuenta, pausa de 1 segundo y listener Summary Report. No guarda cuerpos bajo carga.

| Escenario | Usuarios | Ramp-up | Iteraciones por usuario | Solicitudes esperadas |
| --- | --- | --- | --- | --- |
| Base | 5 | 10 s | 3 | 15 |
| Incremental | 10 | 30 s | 5 | 50 |

Los grupos se ejecutan secuencialmente al habilitar ambos. El segundo incrementa de 5 a 10 la concurrencia objetivo; cada grupo comienza desde cero y hace un ramp-up gradual, no escalones sostenidos dentro del mismo grupo. Propiedades: `base.users`, `base.ramp`, `base.loops`, `incremental.users`, `incremental.ramp`, `incremental.loops`. No hay bucle infinito ni duración que sustituya iteraciones.

Preparación futura: instalar Java/JMeter; abrir el archivo sin pulsar Start; crear una cuenta sintética con movimientos en una instancia propia autorizada y obtener `accountId`; habilitar el grupo elegido en una copia `parabank-local.jmx`; configurar host, port, protocol y accountId; crear `results`. Cada ejecución necesita archivos JTL y directorio HTML nuevos. No apuntar carga al demo público.

Ejemplo exclusivamente para un entorno local autorizado, tras habilitar el grupo:

```text
jmeter -n -t parabank-local.jmx -Jhost=localhost -Jport=8080 -Jprotocol=http -JaccountId=12345 -l results/base.jtl -e -o results/base-html
```

Métricas: promedio de elapsed para tendencia general; p95 para latencias de cola; throughput en solicitudes completadas/s; errores como muestras fallidas / total × 100, incluyendo aserciones. Comparar por etiqueta y periodo estable. Correlacionar CPU, memoria/GC, conexiones, consultas lentas, bloqueos y red. Los volúmenes didácticos no bastan para concluir capacidad ni un p95 estable.

Objetivos orientativos, no SLA acordado: errores <1% y p95 <2 s. No se generaron JTL ni reportes de rendimiento. La validación local comprueba XML, parámetros, grupos, aserciones y listener; no sustituye abrir el plan en JMeter, pendiente por falta de Java/JMeter. `node scripts/build-jmeter.mjs` reproduce el XML sin tráfico. El análisis de los valores simulados del PDF está en [analisis-simulado.md](analisis-simulado.md).

Referencia: [manual oficial JMeter](https://jmeter.apache.org/usermanual/get-started.html).
