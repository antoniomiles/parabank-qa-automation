# ParaBank QA Automation

Práctica independiente desarrollada con asistencia de IA: pruebas de pagos web/API con Playwright y TypeScript, CI, plan JMeter y ejemplo Appium. Los registros de procedencia y herramientas se conservan en docs y en los históricos; no se publicó el repositorio.

## Entrega final: componentes A–G

| Componente | Puntos del documento | Entregable y ubicación | Actividad completada o pendiente |
| --- | --- | --- | --- |
| A. Diseño de pruebas | 15 | [casos/casos-pagos.csv](casos/casos-pagos.csv) | Siete casos con datos, pasos, aceptación y prioridad |
| B. Automatización web | 25 | [tests/web](tests/web) | 14 pruebas ejecutadas: 12 aprobadas y 2 fallidas por defectos del aplicativo |
| C. Pruebas API | 20 | [tests/api](tests/api) | Cinco pruebas ejecutadas y aprobadas |
| D. Pipeline CI/CD | 15 | [.github/workflows/qa.yml](.github/workflows/qa.yml) | Configurado; ejecución real en GitHub pendiente |
| E. Evidencias y defectos | 5 | [reports/runs](reports/runs), [resultados](docs/execution.md) y [defectos](docs/defects.md) | Reportes y evidencias reales conservados; defectos documentados |
| F. Rendimiento JMeter | 20 | [performance](performance) | Dos escenarios configurados y validados sin carga; análisis simulado documentado |
| G. Automatización móvil | 20 | [mobile](mobile) y [documentación](docs/mobile-appium.md) | Guía Appium y ejemplo preparados; ejecución con dispositivo pendiente |

Los puntos son los criterios del documento, no una calificación obtenida. La estructura propuesta allí es ilustrativa: tests/web equivale a /web, tests/api a /api, reports a /evidencias y .github/workflows a /pipeline. Las instrucciones de reproducción y las limitaciones se detallan a continuación.

La entrega del enlace a talento humano queda pendiente de publicar el repositorio con autorización y disponer del destinatario. No se ha publicado ni enviado ningún enlace.

## Flujo y reglas de aceptación

El alcance es iniciar sesión, abrir pagos, completar beneficiario, elegir cuenta, confirmar el monto y consultar los movimientos. Se comprueba autenticación, información obligatoria, monto mayor que cero, confirmación con movimiento verificable y rechazo sin mensaje de éxito. Las diferencias reales de ParaBank se registran como defectos; no se modifica el aplicativo ni se cambia el esperado para aprobarlas.

El CSV contiene precondiciones, datos, pasos, resultados esperados, prioridad, criterio relacionado y justificación de la selección. PAY-01, PAY-02 y PAY-03 cubren respectivamente login válido, pago válido y formulario negativo; PAY-04 a PAY-07 amplían la regresión. Las pruebas REST verifican estado, contenido y coherencia de pagos, saldos y movimientos.

## Requisitos e instalación

Los comandos son para PowerShell, desde la raíz. Usar Node 24 LTS actualizado (24.22.1 o posterior dentro de esa rama para mobile), npm 10+ y conectividad HTTPS. La ejecución registrada usó Node 26.13.1; GitHub Actions configura Node 24. En Linux/macOS sustituir npm.cmd/npx.cmd/appium.cmd por npm/npx/appium y adaptar las variables con export.

~~~powershell
Set-Location 'C:/Users/TOÑO/Desktop/Prueba'
node --version
npm.cmd --version
npm.cmd ci
npx.cmd playwright install chromium
npm.cmd run typecheck
~~~

En Linux, instalar navegador y librerías con npx playwright install --with-deps chromium. El lockfile raíz no instala Appium, SDK, JMeter ni las dependencias del paquete mobile.

## Pruebas web y API

Elegir la suite necesaria; las líneas no son fases que deban ejecutarse todas:

~~~powershell
npm.cmd test
npm.cmd run test:web
npm.cmd run test:api
npm.cmd run test:smoke
~~~

La suite completa descubre 19 casos: 14 web y 5 API; smoke selecciona 2. API-04/05 también usan Chromium para crear clientes ficticios. Se ejecuta un trabajador, sin reintentos; un fallo devuelve código distinto de cero.

Para comprobar la selección sin contactar ParaBank ni regenerar reportes:

~~~powershell
npm.cmd run test:web -- --list --reporter=list
npm.cmd run test:api -- --list --reporter=list
npm.cmd run test:smoke -- --list --reporter=list
~~~

Destino predeterminado: https://parabank.parasoft.com. BASE_URL debe contener solo el origen, sin /parabank; .env.example es una referencia y no se carga automáticamente:

~~~powershell
$env:BASE_URL='http://localhost:8080'
npm.cmd test
Remove-Item Env:BASE_URL
~~~

En Bash: export BASE_URL=http://localhost:8080; para restaurar el demo, unset BASE_URL. Esta variable solo afecta Playwright; mobile tiene URL fija y JMeter usa propiedades independientes.

## Reportes y evidencias

Cada ejecución, incluso parcial, reemplaza reports/latest. Archivar los resultados existentes antes de repetir y los nuevos al terminar, aunque fallen las pruebas:

~~~powershell
npm.cmd run archive
npm.cmd run report
~~~

El servidor muestra la dirección del HTML; detenerlo con Ctrl+C. Abrir cada caso y sus adjuntos: captura final, confirmación de pago, solicitudes/respuestas API y, ante fallos, captura, vídeo y traza. Algunos adjuntos están embebidos en JSON/HTML. Los archivos estructurados son reports/latest/results.json y junit.xml; los archivos de fallo están en artifacts.

Para consultar el histórico final conservado:

~~~powershell
npx.cmd playwright show-report 'reports/runs/2026-11-16T18-34-32.571Z/html' --host 127.0.0.1 --port 9323
npx.cmd playwright show-trace 'reports/runs/2026-11-16T18-34-32.571Z/artifacts/web-payments-PAY-05-negative-regression-reject-amount--1-chromium/trace.zip'
~~~

## GitHub Actions

Tras autorizar una publicación, incluir package-lock.json y [.github/workflows/qa.yml](.github/workflows/qa.yml), habilitar Actions y disponer de permisos de escritura y runners. Para ejecución manual, el workflow debe existir en la rama predeterminada: Actions → ParaBank functional QA → Run workflow → seleccionar rama → Run workflow. También se dispara por push a main y pull requests; ajustar el filtro si la rama principal tiene otro nombre.

El job instala dependencias/Chromium, valida TypeScript y archivos locales, ejecuta la suite y publica resumen y artefactos incluso ante fallos. Descargar parabank-results-<run_id> (14 días de retención), extraerlo completo y ejecutar npx playwright show-report '<ruta-extraida>/html'. Contiene latest, no los históricos. Los fallos mantienen el job rojo; si falla la preparación antes de generar reportes, revisar los logs porque puede no existir artefacto. No hay ejecución remota verificada.

## JMeter: solo entorno autorizado

Instalar JMeter 5.6.3 de Apache y un JDK con compilador. El plan [performance/parabank.jmx](performance/parabank.jmx) consulta movimientos de una cuenta; ambos grupos están deshabilitados y el destino predeterminado es localhost.

| Escenario | Usuarios | Ramp-up | Iteraciones por usuario |
| --- | --- | --- | --- |
| Base | 5 | 10 s | 3 |
| Incremental | 10 | 30 s | 5 |

Si se habilitan ambos, se ejecutan secuencialmente; cada grupo aumenta gradualmente desde cero hasta su concurrencia objetivo. No son escalones sostenidos en un solo grupo. Propiedades: host, port, protocol, accountId, base.users/ramp/loops e incremental.users/ramp/loops.

Desde la raíz, reemplazar las rutas por instalaciones existentes. El validador solo deserializa el plan original y compila Groovy; escribe docs/jmeter-validation.txt y .json, sin ejecutar muestras. La GUI abre una copia sin iniciarla:

~~~powershell
$env:JAVA_HOME='C:/ruta/al/jdk'
$env:JMETER_HOME='C:/tools/apache-jmeter-5.6.3'
node scripts/validate-jmeter.mjs $env:JMETER_HOME "$env:JAVA_HOME/bin/java.exe"
Copy-Item performance/parabank.jmx performance/parabank-local.jmx
& "$env:JMETER_HOME/bin/jmeter.bat" -t performance/parabank-local.jmx
~~~

Para una ejecución futura autorizada: preparar una instancia propia y una cuenta sintética con movimientos, habilitar solo el grupo elegido en la copia, guardar y cerrar la GUI. Sustituir 12345 por el accountId real de esa instancia. No ejecutar carga contra el demo público. El siguiente comando es ilustrativo para localhost, no se ha ejecutado:

~~~powershell
New-Item -ItemType Directory -Force performance/results | Out-Null
& "$env:JMETER_HOME/bin/jmeter.bat" -n -t performance/parabank-local.jmx '-Jhost=localhost' '-Jport=8080' '-Jprotocol=http' '-JaccountId=12345' '-Jbase.users=5' '-Jbase.ramp=10' '-Jbase.loops=3' -l performance/results/base.jtl -e -o performance/results/base-html
~~~

Para incremental, habilitar solo el segundo grupo; sustituir las tres opciones base por '-Jincremental.users=10' '-Jincremental.ramp=30' '-Jincremental.loops=5' y usar incremental.jtl/incremental-html. Las comillas preservan los puntos en PowerShell. Usar un JTL nuevo y una carpeta HTML inexistente o vacía; después abrir su index.html. Sin grupos habilitados no hay muestras. En Linux/macOS, definir JAVA_HOME/JMETER_HOME con export y usar "$JMETER_HOME/bin/jmeter".

La [justificación y métricas](performance/README.md) y el [análisis simulado](performance/analisis-simulado.md) son referencias técnicas: los valores simulados no son mediciones propias.

Resumen del análisis solicitado: con los datos simulados del documento, duplicar usuarios de 5 a 10 cuadruplica el promedio de 450 a 1.800 ms y eleva errores de 0% a 8%. Se investigaría saturación, conexiones, consultas, dependencias y capacidad del generador; se bloquearía provisionalmente el despliegue hasta aclarar los errores y verificar objetivos acordados en un entorno autorizado. Esos datos no permiten deducir p95 ni causa raíz.

## Mobile con Appium

El ejemplo [mobile/smoke.mjs](mobile/smoke.mjs) abre Chrome Android, espera el login y verifica el título. No ejecuta pagos ni una app nativa. Requiere JDK compatible con el SDK (por ejemplo 17), Android Studio/SDK con Platform Tools, Build Tools, plataforma y emulador o dispositivo con Chrome. La combinación documentada es Appium 4/UiAutomator2 9, con Android 8/API 26 o posterior.

WebdriverIO 10.2.0 está fijado en mobile/package-lock.json y exige Node >=22.23.4 <23, >=24.22.1 <25 o >=26.12.1. Appium/driver/SDK se instalan aparte. Sustituir rutas; JAVA_HOME apunta al JDK y ANDROID_HOME al SDK:

~~~powershell
$env:JAVA_HOME='C:/ruta/al/jdk-17'
$env:ANDROID_HOME="$env:LOCALAPPDATA/Android/Sdk"
$env:PATH="$env:JAVA_HOME/bin;$env:ANDROID_HOME/platform-tools;$env:ANDROID_HOME/emulator;$env:PATH"
java -version
adb version
npm.cmd ci --prefix mobile
npm.cmd install --global appium@4
appium.cmd --version
appium.cmd driver install uiautomator2@9
appium.cmd driver list --installed
appium.cmd driver doctor uiautomator2
~~~

Emulador: crear e iniciar un AVD con Chrome/Google Play desde Android Studio Device Manager; desbloquearlo y completar la bienvenida de Chrome. Alternativa: emulator -list-avds y emulator -avd NOMBRE_REAL_DEL_AVD en otra terminal. Dispositivo físico: habilitar depuración USB, aceptar la autorización RSA y, si corresponde, instalar el driver USB. En adb devices -l debe aparecer como device, no offline/unauthorized.

~~~powershell
adb devices -l
$env:ANDROID_UDID='emulator-5554'
adb -s $env:ANDROID_UDID shell getprop ro.build.version.release
adb -s $env:ANDROID_UDID shell dumpsys package com.android.chrome | Select-String 'versionName'
$env:CHROMEDRIVER_PATH='C:/tools/chromedriver.exe'
if (-not (Test-Path -LiteralPath $env:CHROMEDRIVER_PATH)) { throw 'Chromedriver no existe en esa ruta' }
& $env:CHROMEDRIVER_PATH --version
~~~

Usar el serial real del dispositivo y un Chromedriver oficial compatible con su Chrome y con el sistema anfitrión. Abrir ParaBank manualmente para comprobar conectividad. Resolver los errores de doctor antes de ejecutar.

Terminal 1, desde la raíz y con JAVA_HOME/ANDROID_HOME/PATH preparados:

~~~powershell
New-Item -ItemType Directory -Force mobile/evidence | Out-Null
appium.cmd --address 127.0.0.1 --port 4723 --base-path / --log './mobile/evidence/appium.log'
~~~

Mantener el servidor abierto. En terminal 2, volver a la raíz y repetir las variables anteriores, incluidas ANDROID_UDID y CHROMEDRIVER_PATH; no se heredan entre terminales:

~~~powershell
Invoke-RestMethod -Uri 'http://127.0.0.1:4723/status'
New-Item -ItemType Directory -Force mobile/evidence | Out-Null
npm.cmd --prefix mobile test 2>&1 | Tee-Object -FilePath mobile/evidence/client.log
$mobileExitCode = $LASTEXITCODE
Write-Output "Código de salida mobile: $mobileExitCode"
~~~

Conservar/devolver ese código al integrar en scripts. En Bash exportar las variables y ejecutar npm --prefix mobile test > mobile/evidence/client.log 2>&1; guardar inmediatamente mobile_exit=$?. El comando npm usa mobile como directorio de trabajo. El script espera 127.0.0.1:4723 y /, y tiene URL fija de ParaBank: no lee BASE_URL. Detener Appium con Ctrl+C.

Las evidencias mobile son client.log, appium.log y <timestamp>.png dentro de mobile/evidence; no genera HTML/JUnit ni vídeo. Puede no haber PNG si falla la sesión/captura. Copiar los logs antes de repetir, pues sus nombres son fijos; npm run archive no incluye esa carpeta. Registrar fecha, versiones, dispositivo anonimizado, aserciones y código real. Si falta webdriverio, instalar el paquete mobile; si falla la conexión, comprobar /status; si no aparece el dispositivo o Chrome no inicia, revisar adb, autorización y versiones de Chromedriver. La [propuesta para app nativa Android/iOS](docs/mobile-appium.md) no acredita ejecución en dispositivo.

## Resultados, defectos y limitaciones

Última ejecución funcional conservada: 16/11/2026, 20:07:42 UTC; duración 78,09 s, código de salida 1. Se repitió la suite completa a solicitud del usuario y se reprodujeron BUG-01/02.

| Suite | Ejecutadas | Aprobadas | Fallidas |
| --- | --- | --- | --- |
| Web | 14 | 12 | 2 |
| API | 5 | 5 | 0 |
| Total | 19 | 17 | 2 |

Cero bloqueadas, omitidas o inestables en esa ejecución; 17 PNG y 67 adjuntos, con los históricos anteriores conservados. [Defectos y reproducciones](docs/defects.md):

- BUG-01: ParaBank confirma y registra un pago de 0; severidad media.
- BUG-02: acepta -1 y aumenta el saldo de la cuenta de prueba de 515.50 a 516.50; severidad alta. Ambos siguen fallidos frente a las reglas del ejercicio.
- DEP-01: quedan cuatro avisos moderados en dependencias mobile, según el análisis npm conservado; requiere actualización compatible y validación.

Se usan clientes ficticios únicos y cuentas propias de prueba. El entorno público puede reiniciarse; no se realiza limpieza global. Revisar credenciales sintéticas en los reportes antes de compartirlos. Quedan pendientes GitHub Actions remoto, Appium con SDK/dispositivo y la corrección externa de BUG-01/02. No se ejecutó carga ni estrés; JMeter solo se deserializó y compiló sin muestras. La cobertura no constituye una auditoría bancaria o de seguridad.

## Documentos y procedencia

| Referencia | Contenido conservado |
| --- | --- |
| [Casos CSV](casos/casos-pagos.csv) y [plan de pruebas](docs/test-plan.md) | Alcance, aceptación, datos y trazabilidad |
| [Ejecuciones](docs/execution.md) y [defectos](docs/defects.md) | Resultados, incidencias y limitaciones históricas |
| [Fuente del PDF](docs/requirements-source.json) y [texto extraído](docs/requirements-extracted.txt) | Hash, procedencia y requisitos originales |
| [Validación JMeter](docs/jmeter-validation.json) y [log](docs/jmeter-validation.txt) | Herramientas, versiones, checksum y resultado real |
| [Dependencias mobile](docs/mobile-dependency-audit.json) | Análisis npm registrado |

Código: tests/web, tests/api, tests/support, mobile y scripts. Los originales Java/IntelliJ se conservaron. El PDF contiene una prohibición de IA; esta práctica asistida mantiene su procedencia explícita y no se declara realizada sin asistencia.

Referencias oficiales: [Playwright](https://playwright.dev/docs/test-configuration), [ParaBank API](https://parabank.parasoft.com/parabank/api-docs/index.html), [GitHub Actions](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), [JMeter](https://jmeter.apache.org/usermanual/get-started.html), [Appium](https://appium.io/docs/en/latest/quickstart/requirements/) y [UiAutomator2](https://appium.github.io/appium-uiautomator2-driver/latest/getting-started/).
