# ShuffleGolf — Android Setup Guide

Complete guide for building and deploying to Android with Google AdMob.

---

## 1. Prerequisites

- **Node.js** v14+
- **Android SDK** (API 34 recommended)
- **Java JDK** 11+ (for Android builds)
- **Cordova**: `npm install -g cordova`
- **Google AdMob** account: https://admob.google.com

---

## 2. Generate Launcher Icons

Create icons at these sizes (or use a tool like Android Asset Studio):

```
res/android/
├── mdpi.png     (48×48 px)
├── hdpi.png     (72×72 px)
├── xhdpi.png    (96×96 px)
├── xxhdpi.png   (144×144 px)
├── xxxhdpi.png  (192×192 px)
└── splash.png   (512×512 px or landscape 1024×512 px)
```

These directories should be in the Cordova project root, not the web root.

---

## 3. Create Cordova Project

```bash
# Create a new Cordova app
cordova create ShuffleGolfApp com.yourname.shufflegolf ShuffleGolf
cd ShuffleGolfApp

# Add Android platform
cordova platform add android

# Copy game files
rm -rf www/*
cp -r ../ShuffleGolf-main/* www/
```

---

## 4. Get AdMob IDs

1. Go to **Google AdMob** (https://admob.google.com)
2. Sign in with your Google Account
3. Click **Apps** → **Add App**
4. Fill in app details (name, category, platform: Android)
5. Create ad units:
   - **Interstitial**: ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
   - **Rewarded**: ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
6. Copy your **App ID**: ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX

---

## 5. Update config.xml

Edit `ShuffleGolfApp/config.xml`:

```xml
<preference name="ADMOB_APP_ID" value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX" />
```

Replace with your actual AdMob App ID.

---

## 6. Install Required Plugins

```bash
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-admob-free \
  --variable ADMOB_APP_ID="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
```

---

## 7. Update AdMob Test IDs

Edit `www/assets/admob.js`:

```javascript
const config = {
  appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // Your App ID here
  interstitialId: 'ca-app-pub-3940256099942544/1033173712', // Test (during dev)
  rewardedId: 'ca-app-pub-3940256099942544/5224354917',      // Test (during dev)
  isTesting: true // Set to false for production
};
```

**Test Ad IDs** (don't change these during development):
- **Interstitial**: ca-app-pub-3940256099942544/1033173712
- **Rewarded**: ca-app-pub-3940256099942544/5224354917
- **Banner**: ca-app-pub-3940256099942544/6300978111

---

## 8. Build Debug APK

```bash
# Build unsigned debug APK
cordova build android

# Output: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Install on emulator or device:

```bash
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 9. Test on Android Device/Emulator

1. Enable USB Debugging: **Settings > Developer Options > USB Debugging**
2. Connect device via USB
3. Run: `adb devices` (should list your device)
4. Install APK: `adb install app-debug.apk`
5. Launch app and complete 3 holes — you should see an interstitial ad

---

## 10. Debug Logs

View app logs while testing:

```bash
adb logcat -s CordovaActivity chromium Admob
```

Look for:
- `"AdMob initialized"` — Plugin loaded successfully
- Ad events (LOAD, SHOW, CLOSE)
- Any JavaScript errors

---

## 11. Build Release APK

### Step 1: Generate Keystore (one-time)

```bash
keytool -genkey -v -keystore shufflegolf.keystore \
  -alias shufflegolf \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

**Store this file safely** — you'll need it for all future updates.

### Step 2: Build Release APK

```bash
cordova build android --release

# Output: platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### Step 3: Sign APK

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore shufflegolf.keystore \
  platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk \
  shufflegolf
```

### Step 4: Align (optional but recommended)

```bash
zipalign -v 4 app-release-unsigned.apk ShuffleGolf.apk
```

---

## 12. Create App Bundle (AAB) for Play Store

**Recommended over APK** — Play Store's preferred format.

```bash
cordova build android --release -- --packageType=bundle

# Output: platforms/android/app/build/outputs/bundle/release/app-release.aab
```

---

## 13. Google Play Store Submission

### Checklist:
- [ ] Signed AAB with incremented version code
- [ ] Update `config.xml` version: `<widget version="1.0.1">`
- [ ] Change `isTesting: false` in `assets/admob.js`
- [ ] Create/verify Privacy Policy URL
- [ ] Prepare app description, keywords, screenshots (1080×1920 min)
- [ ] Content rating questionnaire (Category: Games)
- [ ] Data Safety form:
  - Check: "Advertising ID" collected
  - Third parties: Google (AdMob)

### Upload Process:
1. Go to **Google Play Console** (play.google.com/console)
2. Create new app
3. Fill in app details (name, description, category)
4. Upload AAB under "Releases > Production"
5. Fill in Data Safety & Privacy forms
6. Submit for review (takes 2-4 hours typically)

---

## 14. Legal Compliance

### Privacy Policy
Required by Google Play. Must include:
- Data collection (ID, location, usage)
- Third parties (Google AdMob, Analytics)
- User controls (reset ad ID, opt-out personalization)

**Example**: See `assets/legal.js` for template.

Host at: `privacy.example.com/shufflegolf-privacy` and update in Play Store listing.

### Terms of Service
Optional but recommended for games with in-app features.

### GDPR Consent (EU)
- `LegalManager.checkAndShowConsent()` displays on first launch
- User can decline personalized ads → `LegalManager.hasAdsConsent()` returns false
- Ads still show but are not targeted

---

## 15. Troubleshooting

### "AdMob not available (web/dev mode)"
**Cause**: Running in browser, not Android app.  
**Fix**: Build and run on Android device/emulator.

### Ads not showing
- Confirm `isTesting: true` and test ad unit IDs
- Check `adb logcat` for ad load failures
- Verify device has internet connection
- Ads may take 30+ seconds to load first time

### App crashes on startup
- Check `adb logcat` for errors
- Verify AndroidManifest.xml has `<meta-data>` tag with AdMob App ID
- Ensure all plugins installed correctly: `cordova plugin list`

### Privacy policy not showing
- `LegalManager.checkAndShowConsent()` checks localStorage
- Clear app data: **Settings > Apps > ShuffleGolf > Storage > Clear Data**
- Reload app

---

## 16. Version Updates

When publishing new version:

1. Update `config.xml`:
   ```xml
   <widget id="..." version="1.0.1">
   ```

2. Update `versionCode` in `build.gradle`:
   ```gradle
   versionCode 2  // Increment by 1
   ```

3. Build release AAB and upload to Play Store

Play Store requires incrementing versionCode for each release.

---

## 17. Performance Notes

- Game runs at 60 FPS on mid-range Android (Snapdragon 660+)
- Canvas rendering uses hardware acceleration (AndroidHardwareAccelerated: true)
- Audio Engine uses Web Audio API (supported on Android 5+)
- Ads load asynchronously and don't block gameplay

---

## 18. Next Steps

- [ ] Generate launcher icons (multiple sizes)
- [ ] Create AdMob account and get App ID
- [ ] Update `config.xml` and `assets/admob.js`
- [ ] Build and test on Android device
- [ ] Create Privacy Policy document
- [ ] Submit to Google Play Store

Good luck! 🎯⛳
