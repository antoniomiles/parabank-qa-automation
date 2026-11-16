# Diseño mobile con Appium

La instalación, configuración, dispositivo, ejecución y evidencias del ejemplo se centralizan en el [README: Mobile con Appium](../README.md#mobile-con-appium). Esta referencia conserva únicamente la propuesta para app nativa.

Alcance: ParaBank web en Chrome Android, no una app nativa. No se proporcionó APK/IPA. Esta guía y el ejemplo no se ejecutaron; no hay evidencia mobile. La documentación y sintaxis se verificaron; los registros de dependencias y resultados anteriores se conservan en [auditoría npm](mobile-dependency-audit.json) y [ejecuciones](execution.md).

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
