# Automatización mobile con Appium

Alcance: ParaBank web en Chrome Android, no una app nativa. No se proporcionó APK/IPA. Esta guía y el ejemplo no se ejecutaron; no hay evidencia mobile.

Preparación en un entorno separado:

1. Instalar Node y JDK compatibles con la versión elegida de Appium; instalar Android Studio, SDK Platform Tools y un emulador con Chrome.
2. Configurar ANDROID_HOME y JAVA_HOME; comprobar `adb devices` con un dispositivo autorizado.
3. Ejecutar `npm install -g appium`, `appium driver install uiautomator2` y `appium driver doctor uiautomator2`.
4. Instalar cliente: desde `mobile`, ejecutar `npm install`. Estas dependencias son independientes y no se instalaron en esta práctica.
5. Iniciar Appium local con `appium --address 127.0.0.1 --port 4723`. Proporcionar un Chromedriver compatible con Chrome mediante `appium:chromedriverExecutable`; no habilitar descargas inseguras globales.
6. Definir ANDROID_UDID y CHROMEDRIVER_PATH. Ejecutar `node smoke.mjs` desde `mobile`.

El ejemplo usa esperas explícitas, aserciones y cierre de sesión técnica en finally. Conserva captura real si llega a abrir una sesión. Para regresión: ejecutar WEB-02, WEB-04 y WEB-06 con Page Objects mobile; agregar teclado virtual, rotación y viewport pequeño. Validar iOS Safari en macOS con Xcode y XCUITest como trabajo separado.

Registrar versión de Appium, driver, SDK, Android, Chrome, Chromedriver, resolución y UDID anonimizado. Conservar log del servidor y capturas por caso; no atribuir ejecución hasta contar con dispositivo y resultados.

Referencia: [inicio oficial de Appium](https://appium.io/docs/en/latest/quickstart/).

## Automatización de una app nativa

Para el requisito G, elegiría Appium por soportar Android e iOS mediante WebDriver. ParaBank proporciona un sitio web: no se asume que exista una app oficial ni se inventa APK/IPA. El ejemplo ejecutable de este proyecto es mobile web; los pasos siguientes describen cómo proceder al recibir una app de prueba autorizada.

1. Obtener APK de pruebas, identificador `appPackage`, actividad inicial `appActivity` y ambiente backend. En iOS, obtener `.app` de simulador o `.ipa` firmada y bundleId. Preparar usuarios sintéticos y criterios de aceptación.
2. Preparar Android SDK, JDK, dispositivo/emulador, Appium y UiAutomator2; comprobar `adb devices` y doctor del driver. Para iOS usar macOS, Xcode, simulador y XCUITest; resolver firma/WebDriverAgent en dispositivo físico.
3. Crear sesión con `platformName`, `appium:automationName`, `appium:udid`, `appium:app` y, cuando corresponda, `appium:appPackage`/`appium:appActivity`. Omitir browserName para una app nativa. Instalar/restablecer solo la app de pruebas según la estrategia de aislamiento.
4. Usar Appium Inspector para encontrar accessibility IDs estables; organizar pantallas como Page Objects y los datos por fixture. Preferir accessibility id a XPath dependiente de jerarquía. En apps híbridas inspeccionar contexts y alternar NATIVE_APP/WEBVIEW con un driver compatible.
5. Automatizar login válido, pago válido con comprobante y movimiento, campos obligatorios y monto no positivo. Usar esperas por estado visible/habilitado, aserciones de UI y negocio; controlar teclado, permisos, scroll y rotación sin pausas fijas.
6. Preparar datos independientes y cerrar sesiones en finally. Capturar pantalla, fuente de UI, log Appium y versión/dispositivo ante fallos. Correlacionar evidencia con ID de caso y resultado real, sin registrar secretos.
7. Ejecutar primero un smoke en emulador y luego una matriz acotada en dispositivos físicos/versiones representativas. Integrar en un job mobile con SDK/dispositivo disponible y artefactos. Una guía no acredita una ejecución: este proyecto no contiene resultados mobile.

Ejemplo conceptual Android (reemplazar rutas e identificadores por los de la app recibida):

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:udid": "emulator-5554",
  "appium:app": "/ruta/app-de-pruebas.apk",
  "appium:appPackage": "com.example.practice",
  "appium:appActivity": ".MainActivity"
}
```
