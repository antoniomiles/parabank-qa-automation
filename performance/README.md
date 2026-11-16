# Diseño del plan JMeter

La instalación, propiedades, validación y comandos de ejecución se centralizan en el [README: JMeter](../README.md#jmeter-solo-entorno-autorizado). El archivo [parabank.jmx](parabank.jmx) conserva los dos grupos deshabilitados; no se ejecutó carga ni estrés.

## Selección del endpoint

GET /parabank/services/bank/accounts/{accountId}/transactions está publicado en [OpenAPI](../docs/openapi.yaml). Se consulta después del pago para confirmar el débito; su frecuencia e importancia justifican evaluarlo. El riesgo es degradar el acceso al historial al crecer los datos o devolver movimientos de otra cuenta.

El plan incluye HTTP Request, Accept JSON, timeouts, HTTP 200 exacto, aserción Groovy de JSON/pertenencia a cuenta, pausa de un segundo y Summary Report. No guarda cuerpos bajo carga.

## Métricas e interpretación

Examinar promedio de elapsed, p95, throughput en solicitudes completadas/s y errores como muestras fallidas / total × 100, incluidas las aserciones. Comparar por etiqueta y periodo estable; correlacionar CPU, memoria/GC, conexiones, consultas lentas, bloqueos y red. Los volúmenes didácticos no bastan para concluir capacidad ni un p95 estable. Objetivos orientativos, no SLA acordado: errores <1% y p95 <2 s.

Los valores 450/1.800 ms y 0/8% del [análisis simulado](analisis-simulado.md) proceden del ejercicio, no de mediciones propias.

## Registro de validación conservado

JMeter 5.6.3 deserializó el archivo mediante SaveService y compiló la aserción Groovy sin ejecutarla; no se instanció motor ni se iniciaron grupos. Se usó Java 25 de IntelliJ; la advertencia real de XStream/Unsafe queda en el [log](../docs/jmeter-validation.txt). El ZIP de JMeter se verificó contra su SHA-512 oficial; [metadatos](../docs/jmeter-validation.json). No se generaron JTL ni reportes de rendimiento.
