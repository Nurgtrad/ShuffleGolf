---
name: android-export
description: Guía completa para exportar ShuffleGolf como APK Android con Cordova, integrar Google AdMob, firmar y optimizar el APK, y publicar en Google Play. Usa esta skill cuando el usuario quiera empaquetar el juego para Android, configurar Cordova, añadir anuncios AdMob, preparar iconos y assets para distintas pantallas, hacer testing en emulador o dispositivo real, o subir la app a la Play Store.
---

# Android Export — HTML5 Game via Cordova

Complete workflow for wrapping ShuffleGolf (vanilla HTML5/Canvas) into an Android APK.

## Cordova Configuration Workflow

### Initial Setup
```bash
npm install -g cordova
cordova create ShuffleGolfApp com.yourname.shufflegolf ShuffleGolf
cd ShuffleGolfApp
cordova platform add android
```

### Copy Game Files
```bash
rm -rf www/*
cp -r ../ShuffleGolf-main/* www/
```

### `config.xml` — Key Settings for Games
```xml
<?xml version="1.0" encoding="utf-8"?>
<widget id="com.yourname.shufflegolf" version="1.0.0"
        xmlns="http://www.w3.org/ns/widgets"
        xmlns:cdv="http://cordova.apache.org/ns/1.0">

  <name>ShuffleGolf</name>
  <description>Deck-building golf game</description>
  <author email="you@example.com">Your Name</author>

  <content src="index.html" />

  <preference name="DisallowOverscroll" value="true" />
  <preference name="EnableViewportScale" value="false" />
  <preference name="BackgroundColor" value="0xff1a2e1a" />
  <preference name="Orientation" value="landscape" />
  <preference name="FullScreen" value="true" />
  <preference name="SplashScreenDelay" value="2000" />

  <platform name="android">
    <preference name="android-minSdkVersion" value="24" />
    <preference name="android-targetSdkVersion" value="34" />
    <preference name="GradlePluginKotlinVersion" value="1.9.0" />
    <preference name="AndroidHardwareAccelerated" value="true" />
  </platform>

  <access origin="*" />
  <allow-navigation href="*" />
  <allow-intent href="https://*.google.com/*" />
  <allow-intent href="https://*.googlesyndication.com/*" />
  <allow-intent href="https://*.doubleclick.net/*" />

</widget>
```

### Essential Cordova Plugins
```bash
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-admob-free --variable ADMOB_APP_ID="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
```

---

## Google AdMob Integration

### Setup in AdMob Console
1. Create app at `admob.google.com`
2. Create ad units:
   - **Banner** (320×50 or adaptive) — shown during gameplay UI
   - **Interstitial** (full-screen) — shown between holes or on game over

### Banner Ad Integration
```js
document.addEventListener('deviceready', () => {
  admob.banner.config({
    id: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    isTesting: true,   // set false for production
    autoShow: true,
    position: admob.banner.config.POSITION.BOTTOM_CENTER,
  });
  admob.banner.prepare();
  admob.banner.show();
}, false);
```

### Interstitial Ad Integration
```js
function preloadInterstitial() {
  admob.interstitial.config({
    id: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    isTesting: true,
  });
  admob.interstitial.prepare();
}

// Show every 3 holes
function maybeShowInterstitial() {
  if (state.hole % 3 === 0 && admob.interstitial.isReady()) {
    admob.interstitial.show();
    preloadInterstitial();
  }
}
```

### Ad Lifecycle Events
```js
document.addEventListener('admob.interstitial.events.CLOSE', () => {
  continueToNextHole();
});
document.addEventListener('admob.banner.events.LOAD_FAIL', (e) => {
  console.warn('Ad load failed:', e.detail);
});
```

### AdMob Best Practices
- Never show interstitials mid-shot — only on natural pause points (hole complete, shop screen)
- Banner should not overlap game controls — add CSS `padding-bottom` ~60 px
- Always use test IDs during development
- Test Ad IDs (Android): `ca-app-pub-3940256099942544/6300978111` (banner), `ca-app-pub-3940256099942544/1033173712` (interstitial)

---

## APK Build Process

### Debug Build
```bash
cordova build android
# Output: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Release Build (signed)
```bash
# 1. Generate keystore (only once — keep this file safe!)
keytool -genkey -v -keystore shufflegolf.keystore \
  -alias shufflegolf -keyalg RSA -keysize 2048 -validity 10000

# 2. Build release
cordova build android --release

# 3. Sign
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore shufflegolf.keystore \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  shufflegolf

# 4. Align
zipalign -v 4 app-release-unsigned.apk ShuffleGolf.apk
```

### App Bundle (AAB) — Preferred for Play Store
```bash
cordova build android --release -- --packageType=bundle
# Output: platforms/android/app/build/outputs/bundle/release/app-release.aab
```
AAB reduces download size ~15–20% via Play's dynamic delivery.

---

## Android Manifest Requirements

```xml
<manifest>
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="com.google.android.gms.permission.AD_ID" />

  <application
    android:hardwareAccelerated="true"
    android:usesCleartextTraffic="false">

    <!-- REQUIRED — app crashes without this -->
    <meta-data
      android:name="com.google.android.gms.ads.APPLICATION_ID"
      android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX" />

    <activity
      android:screenOrientation="landscape"
      android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale"
      android:theme="@android:style/Theme.Black.NoTitleBar.Fullscreen" />

  </application>
</manifest>
```

---

## Testing

### Android Emulator
```bash
emulator -list-avds
emulator -avd Pixel_6_API_34 &
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk
adb logcat -s CordovaActivity:V chromium:V
```

### Real Device
```bash
# Enable USB Debugging: Settings > Developer Options > USB Debugging
adb devices
adb install app.apk
adb logcat
```

### Chrome Remote Debugging (WebView)
1. Connect device via USB
2. Open `chrome://inspect` on desktop Chrome
3. Find your app's WebView → click Inspect
4. Full DevTools inside the APK's WebView

### What to Test
- [ ] Canvas renders at correct DPR (no blurry graphics)
- [ ] Touch input responsive (power meter, aim meter, card selection)
- [ ] Audio plays on first tap (Web Audio unlock)
- [ ] Banner ad visible without covering controls
- [ ] Interstitial shows and dismisses correctly
- [ ] App resumes after phone call / backgrounding
- [ ] Back button behavior (pause vs exit prompt)
- [ ] Memory stable over full 18-hole round
- [ ] No ANR during hole generation

---

## Asset Preparation for Screen Sizes

### Launcher Icons (required for Play Store)
```
res/
├── mipmap-mdpi/    icon.png  (48×48)
├── mipmap-hdpi/    icon.png  (72×72)
├── mipmap-xhdpi/   icon.png  (96×96)
├── mipmap-xxhdpi/  icon.png  (144×144)
├── mipmap-xxxhdpi/ icon.png  (192×192)
└── (Play Store upload: 512×512 PNG)
```

```xml
<platform name="android">
  <icon src="res/android/mdpi.png"    density="mdpi" />
  <icon src="res/android/hdpi.png"    density="hdpi" />
  <icon src="res/android/xhdpi.png"   density="xhdpi" />
  <icon src="res/android/xxhdpi.png"  density="xxhdpi" />
  <icon src="res/android/xxxhdpi.png" density="xxxhdpi" />
</platform>
```

### Play Store Assets
| Asset | Spec |
|-------|------|
| Icon | 512×512 PNG |
| Feature graphic | 1024×500 PNG/JPG |
| Screenshots | ≥ 2 phone (1080×1920 min) |

---

## Google Play Submission Checklist

- [ ] Signed AAB with incremented `versionCode`
- [ ] `isTesting: false` in all AdMob configs
- [ ] Privacy Policy URL ready (AdMob requires it)
- [ ] Content rating questionnaire completed (games category)
- [ ] Target SDK ≥ 33
- [ ] Data Safety form: declare Advertising ID + Google as third party
- [ ] Release to Internal Testing first → Alpha → Beta → Production (10% rollout)
