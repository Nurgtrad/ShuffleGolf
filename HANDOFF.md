# Shuffle Golf — Traspaso a Mac (build Android + testing)

Documento para continuar el desarrollo/empaquetado Android en otro equipo (Mac).
Última actualización: tras resolver crash de arranque, guardado, rotación y layout horizontal.

---

## 1. Qué es el proyecto

Juego de golf "deck-building" en **HTML5/Canvas vanilla** (sin frameworks), envuelto con **Cordova** para generar un APK Android. Monetización con **Google AdMob** (intersticiales).

Dos carpetas separadas:

| Carpeta | Qué es | ¿Va a GitHub? |
|---------|--------|---------------|
| `ShuffleGolf-main/` | **El juego** (código fuente: HTML/CSS/JS) | ✅ Sí (este repo) |
| `ShuffleGolfApp/` | **Wrapper Cordova** (genera el APK) | Parcial (ver abajo) |

El juego se desarrolla en `ShuffleGolf-main/` y luego se **copia a** `ShuffleGolfApp/www/` para compilar.

### Estructura del juego (`ShuffleGolf-main/`)
- `index.html` — punto de entrada, carga todos los scripts
- `css/style.css` — todos los estilos (incluye layout responsive/horizontal)
- `src/` — lógica del juego:
  - `core.js` — bucle, golpes, hoyos, fin de hoyo, menú, guardado-enganches
  - `cards.js` — cartas, mazo, tienda, deck builder
  - `data.js` — estado (`state`), pools de cartas/mejoras, **sistema de guardado**
  - `drawing.js` — render del canvas, `resizeCanvases`, input táctil
  - `golfers.js` — definición de golfistas (¡tienen MÉTODOS! ver gotcha)
  - `i18n.js` — traducciones ES/EN
  - `audio.js` — sonido
- `assets/` — iconos SVG (`icons-data.js`), `admob.js`, `legal.js`, logo, iconos de la app
- `res/android/` — iconos del launcher (mdpi…xxxhdpi + playstore-512)

---

## 2. Stack y versiones EXACTAS (críticas)

Estas versiones costó mucho ajustarlas. **Respetarlas en el Mac.**

| Herramienta | Versión | Notas |
|-------------|---------|-------|
| **Java JDK** | **17** (Temurin) | ⚠️ NO usar 21. cordova-android 13 requiere 17. Con 21 el `aaptcompiler` falla. |
| Node.js | LTS reciente | para Cordova |
| Cordova CLI | reciente | `npm i -g cordova` |
| cordova-android | **13** (AGP 8.3, Gradle 8.7) | |
| Android SDK Build-Tools | **34.0.0** | ⚠️ NO dejar instaladas 36/37, el aapt2 rechaza recursos. |
| Android SDK Platform | API 34 (compile/target) | minSdk 24 |
| Plugin AdMob | `cordova-admob-plus` | con variable `APP_ID_ANDROID` |

### Instalación en Mac
```bash
# Java 17
brew install --cask temurin@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Node + Cordova
brew install node
npm install -g cordova

# Android Studio (instala SDK). Luego en SDK Manager:
#  - SDK Platforms: Android 14 (API 34)
#  - SDK Tools: Android SDK Build-Tools 34.0.0, Command-line Tools, Platform-Tools
#  - IMPORTANTE: desinstalar Build-Tools 36.x / 37.x si aparecen.

export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
```
(Añadir los `export` a `~/.zshrc`.)

---

## 3. Recrear el proyecto Cordova en el Mac

`ShuffleGolfApp/platforms/`, `plugins/` y `node_modules/` se **regeneran** (no hace falta copiarlos). Lo que necesitas llevar al Mac de `ShuffleGolfApp/`:
- `config.xml`
- `package.json`
- `res/android/` (iconos)
- `www/` (o copiar el juego ahí, ver paso 4)
- `platforms/android/app/build-extras.gradle` ← **OJO, ver gotcha #3**

Pasos:
```bash
cd ShuffleGolfApp
npm install                 # restaura dependencias de package.json
cordova platform add android@13
cordova plugin add cordova-admob-plus --variable APP_ID_ANDROID="ca-app-pub-5076664753284203~6230186799"
# (otros plugins se restauran desde config.xml/package.json)
```

Tras `platform add`, **recrear** `platforms/android/app/build-extras.gradle` (ver gotcha #3).

---

## 4. Compilar (flujo normal)

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
cd ShuffleGolfApp

# 1) Sincronizar el juego al wrapper
rm -rf www/*
cp -r ../ShuffleGolf-main/* www/   # (excluye .git, node_modules, etc. si hace falta)

# 2) Compilar
cordova build android
# APK: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

> En Windows existe `build-apk.bat` que hace esto con doble clic. En Mac, crear un `build-apk.sh` equivalente si se quiere.

---

## 5. GOTCHAS (errores ya resueltos — NO repetir)

**#1 — JDK 17 obligatorio.** Con JDK 21 falla `aaptcompiler` con errores raros de recursos. Usar 17.

**#2 — Color en formato `0x` rompe TODO el build.** Síntoma: `aaptcompiler ... Invalid <color>` apuntando (falsamente) a appcompat. Causa real: `config.xml` tenía `BackgroundColor="0xff1a2e1a"`. Android exige `#AARRGGBB`. **Ya está como `#ff1a2e1a`.** No volver a `0x`.

**#3 — Crash al arrancar en Android 12+ (WorkManager).** El plugin AdMob arrastra `androidx.work` antiguo → `PendingIntent ... FLAG_IMMUTABLE` → la app se cierra sola. Fix en `ShuffleGolfApp/platforms/android/app/build-extras.gradle`:
```gradle
dependencies { implementation 'androidx.work:work-runtime:2.9.0' }
configurations.all { resolutionStrategy { force 'androidx.work:work-runtime:2.9.0' } }
```
⚠️ Este archivo se BORRA al hacer `cordova platform remove/add`. Recrearlo siempre.

**#4 — AdMob App ID se quedaba en "test".** Añadir el plugin SIEMPRE con `--variable APP_ID_ANDROID="ca-app-pub-5076664753284203~6230186799"`, o el manifest queda con `APPLICATION_ID="test"` y crashea.

**#5 — Solo Build-Tools 34.0.0.** Si hay 36/37 instaladas, el aapt2 rechaza recursos. Borrar las nuevas.

**#6 — Métodos perdidos al guardar (save).** `state.golfer` tiene métodos (`getControlMultiplier`, `getPowerMultiplier`). Al serializar a JSON se pierden → al continuar y golpear, crash. `loadProgress()` los re-vincula desde `GOLFERS` por `id`. Cualquier objeto con funciones que se guarde debe re-vincularse al cargar.

---

## 6. AdMob

- **App ID:** `ca-app-pub-5076664753284203~6230186799`
- **Intersticial:** `ca-app-pub-5076664753284203/6554876030`
- Config en `assets/admob.js`. **`isTesting: true`** ahora (anuncios de prueba). **Cambiar a `false` antes de publicar.**
- Anuncios entre hoyos 5-6, 12-13, tras 18 y tras la tienda.

---

## 7. Sistema de guardado (localStorage)

- Clave: `shufflegolf_save_v1`. Funciones en `src/data.js`.
- Guarda: golfista, mazo, mano, gemas, mejoras, dinero, hoyo, puntuaciones, handicaps **y `holeData` (diseño del hoyo)**.
- `startHole(idx, keepHole)`: con `keepHole=true` (Continuar) reutiliza el hoyo guardado (no lo regenera).
- Menú: botón **Continuar** / **Nueva Partida**.

---

## 8. Layout / orientación

- Rotación libre (`config.xml` Orientation=default).
- **Horizontal (solo tablet, `@media (orientation:landscape) and (min-width:820px)` en `style.css`):** campo 67% a la izquierda + panel de controles 33% a la derecha; cartas en 3+2. El vertical no se toca (se ve genial).
- Limitación conocida: rotar a MITAD de un hoyo puede descolocar el render un instante (el hoyo se dibuja según la orientación en que empezó). Mejor elegir orientación al empezar.

---

## 9. Testing en dispositivo (adb)

```bash
adb devices                              # ¿se ve el dispositivo? (cuidado cables solo-carga)
adb install -r .../app-debug.apk
adb logcat -c && adb logcat | grep -iE "FATAL|chromium.*CONSOLE"   # ver crashes / console JS
adb exec-out screencap -p > shot.png     # captura
```
Tablet de pruebas: Xiaomi Pad 6 (model 23043RP34G). Requiere Depuración USB.

---

## 10. Estado actual y pendientes

### Funciona / arreglado
- ✅ Build Android estable (JDK 17, build-tools 34, WorkManager fix)
- ✅ No crashea al arrancar
- ✅ Sin zoom por doble-tap
- ✅ Guardado Continuar/Nueva Partida (conserva el hoyo exacto)
- ✅ Rotación libre + layout horizontal de tablet (campo 67% / UI 33%, cartas 3+2)
- ✅ Icono de la app personalizado
- ✅ Botón Continuar no se cuela entre hoyos
- ✅ Putt rueda plano (no se eleva)

### Pendiente para publicar en Play Store
1. **Testeo completo** en dispositivo (lo que se va a hacer en el Mac)
2. **`isTesting: false`** en `assets/admob.js`
3. **Firmar release** (crear keystore — ¡guardarlo MUY bien, sin él no se puede actualizar la app!)
   ```bash
   keytool -genkey -v -keystore shufflegolf.keystore -alias shufflegolf -keyalg RSA -keysize 2048 -validity 10000
   cordova build android --release -- --packageType=bundle   # genera .aab
   ```
4. **Política de privacidad** hospedada en una URL (obligatoria por AdMob)
5. Formulario de **Seguridad de los datos** en Play Console (declarar Advertising ID + Google como terceros)
6. Assets de la ficha: icono 512×512 (ya en `res/android/playstore-512.png`), gráfico 1024×500, capturas

---

## 11. Memoria de decisiones (por si se usa Claude Code en el Mac)
Las "skills" y memoria del proyecto están en `.claude/` (si se sincroniza). Puntos clave ya cubiertos arriba. El idioma del juego es ES/EN (motor en `src/i18n.js`).
