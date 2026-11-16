# Automatización mobile con Appium

Herramienta elegida: Appium con UiAutomator2 para Android y XCUITest para iOS. El ejemplo del proyecto es Chrome Android; no se proporcionó APK/IPA ni se ejecutó en dispositivo. Instalación, variables y comandos: [README](../README.md#mobile-con-appium).

## Pasos para automatizar una app

1. Obtener APK o app/IPA autorizada, identificadores de la aplicación, ambiente backend y usuarios de prueba.
2. Preparar Node, JDK, Android SDK, Appium, driver y emulador/dispositivo con depuración autorizada. Para iOS se necesitan macOS, Xcode y XCUITest; configurar firma y WebDriverAgent cuando corresponda.
3. Verificar el dispositivo con adb y los requisitos con Appium doctor. Crear sesión con platformName, automationName, udid y app; agregar appPackage/appActivity o bundleId. Para una app nativa, omitir browserName.
4. Identificar elementos con Appium Inspector y accessibility IDs; organizar pantallas en Page Objects y separar datos. En una app híbrida, alternar los contextos NATIVE_APP/WEBVIEW.
5. Automatizar login válido, pago válido con movimiento y validaciones de campos/montos. Usar esperas por estado y aserciones; controlar teclado, permisos y scroll.
6. Aislar los datos y cerrar sesiones. Conservar resultado, código de salida, versiones, capturas y logs; ejecutar primero un smoke y luego regresión en dispositivos representativos.

El smoke actual solo verifica carga de página, campo de usuario y título. Sus evidencias, cuando se ejecute, serán consola, log Appium y captura; no genera HTML/JUnit. La ejecución y los reportes funcionales disponibles están resumidos en el [README](../README.md#resultados-defectos-y-limitaciones).
