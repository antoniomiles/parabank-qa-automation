# Plan de pruebas

Práctica independiente elaborada con asistencia de IA. No representa una evaluación sin asistencia ni certifica seguridad o aptitud bancaria.

Objetivo: validar navegación pública, registro, autenticación, consulta de cuentas y contratos REST mediante pruebas funcionales acotadas. Entorno compartido: los datos pueden desaparecer por reinicios externos. Se crean únicamente usuarios ficticios únicos. No se llama a inicialización, limpieza global, administración ni operaciones sobre cuentas ajenas.

Entrada: Node, Chromium, conectividad HTTPS y disponibilidad de ParaBank. Salida: suite ejecutada, resultados archivados y fallos clasificados. Un fallo mantiene el pipeline rojo; no se usan reintentos ni resultados esperados fallidos para disimularlo. Un problema de infraestructura no se clasifica automáticamente como defecto del producto.

| ID | Tipo / prioridad | Pasos resumidos | Resultado esperado |
| --- | --- | --- | --- |
| WEB-01 | Positivo, smoke / P1 | Abrir inicio | Título, login y registro visibles |
| WEB-02 | Negativo, regresión / P1 | Enviar login vacío | Mensaje de campos obligatorios |
| WEB-03 | Negativo, regresión / P1 | Login con usuario único inexistente | Credenciales rechazadas |
| WEB-04 | Negativo, regresión / P1 | Enviar registro vacío | Nueve campos obligatorios señalados |
| WEB-05 | Negativo, regresión / P2 | Enviar contraseñas distintas | Mensaje de discrepancia |
| WEB-06 | Positivo, regresión / P1 | Registrar; consultar; salir; entrar; abrir cuenta | Registro, sesión y detalle válidos |
| WEB-07 | Positivo, regresión / P2 | Abrir About Us | Contenido institucional |
| API-01 | Positivo, smoke / P1 | GET openapi.yaml | HTTP 200, OpenAPI 3 y rutas login/cuentas publicadas |
| API-02 | Negativo, regresión / P1 | GET login con usuario inexistente | HTTP 400 y error de autenticación |
| API-03 | Negativo, regresión / P2 | GET cuenta 2147483647 | HTTP 400 y cuenta no encontrada |
| API-04 | Positivo, regresión / P1 | Registrar por UI; login API; listar y consultar cuentas | Identidad, tipos y relación cliente/cuenta consistentes |

Los IDs coinciden con los títulos ejecutables. API-04 necesita Chromium para crear sus datos por UI; no depende de WEB-06. Cada prueba usa un contexto aislado. El reporte registra duración, estado y adjuntos; las capturas muestran únicamente el estado final, no cada acción.

Fuera de esta ejecución: transferencias, préstamos, facturas, recuperación con datos personales, compatibilidad multinavegador y auditoría de seguridad. Para ampliar regresión en una instancia propia: transferencia entre dos cuentas del mismo usuario (conservación de saldo), importe cero/negativo, facturación con campos faltantes, apertura de cuenta y actualización de perfil. Estos escenarios están pendientes y no cuentan como automatizados.
