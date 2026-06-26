# ShuffleGolf: AdMob + Legal Compliance Implementation

## Overview
Complete implementation of Google AdMob monetization and legal compliance for Android deployment.

---

## 1. Files Created/Modified

### New Files
- **`assets/admob.js`** — Google AdMob manager singleton
  - `init()` — Initialize AdMob on deviceready event
  - `showInterstitial(callback)` — Show full-screen ad between holes
  - `showRewarded(callback)` — Show rewarded video (optional feature)
  - `isReady()`, `isInterstitialLoaded()` — Status checks
  - Uses test Ad IDs during development (set `isTesting: false` for production)

- **`assets/legal.js`** — Legal text & consent manager
  - Privacy Policy (Spanish)
  - Terms of Service (Spanish)
  - GDPR Consent message
  - Ads Disclosure notice
  - localStorage-based consent tracking
  - Functions to display legal documents in modal

- **`config.xml`** — Cordova configuration
  - Android platform preferences (SDK 24-34)
  - Hardware acceleration enabled
  - AdMob plugin configuration
  - Launcher icon setup
  - Permissions for internet & advertising ID

- **`ANDROID_SETUP.md`** — Complete Android build guide
  - Step-by-step Cordova setup
  - Icon generation instructions
  - AdMob integration walkthrough
  - Release APK signing process
  - Google Play Store submission checklist
  - Troubleshooting guide

### Modified Files
- **`index.html`**
  - Added legal consent overlay (id: legal-consent-overlay)
  - Added legal documents modal (id: legal-modal-overlay)
  - Added Cordova.js reference (required for Android)
  - Added script references: legal.js, admob.js

- **`src/core.js`**
  - Modified `holeComplete()` queue system
  - Added AdMob interstitial call every 3 holes
  - Checks `LegalManager.hasAdsConsent()` before showing ads
  - Ads show between holes 3, 6, 9, 12, 15, 18

---

## 2. How It Works

### First App Launch
1. `legal.js` checks `localStorage` for 'dg_privacy_accepted' key
2. If not found, displays legal consent overlay
3. User chooses:
   - **Accept & Continue** → Sets both flags, starts game
   - **Decline Ads** → Only accepts privacy, `hasAdsConsent()` returns false

### Gameplay Ad Flow
1. Player completes a hole
2. `holeComplete()` runs callback queue
3. Before proceeding to next hole, checks:
   - Is `AdMobManager` loaded?
   - Does user consent to ads?
   - Is this a hole divisible by 3 (and not hole 18)?
4. If all true: `AdMobManager.showInterstitial()` → ad displays → callback continues to next hole
5. If any false: Skip ad, proceed immediately

### Legal Document Access
- Privacy Policy, Terms, Ads Disclosure can be viewed via settings (future UI integration)
- Each has dedicated method: `LegalManager.showPrivacyPolicy()`, etc.
- Displays in full-screen modal with scrollable content

---

## 3. Configuration Steps

### Step 1: Get AdMob App ID
1. Visit https://admob.google.com
2. Sign in with Google Account
3. Click **Apps** > **Add App**
4. Select **Android**
5. Copy your **App ID** (format: ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX)

### Step 2: Update config.xml
```xml
<preference name="ADMOB_APP_ID" value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX" />
```

### Step 3: Update assets/admob.js
```javascript
const config = {
  appId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // Your ID
  interstitialId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Production ID
  rewardedId: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',     // Production ID
  isTesting: false  // Set to false for production
};
```

### Step 4: Create Privacy Policy
- Write privacy policy explaining data collection (ID, location, usage)
- Host at publicly accessible URL (e.g., privacy.example.com/shufflegolf)
- Include in Google Play Store listing and AdMob setup

### Step 5: Generate Launcher Icons
```
res/android/
├── mdpi.png     (48×48)
├── hdpi.png     (72×72)
├── xhdpi.png    (96×96)
├── xxhdpi.png   (144×144)
├── xxxhdpi.png  (192×192)
└── splash.png   (512×512 or 1024×512)
```

---

## 4. Testing Locally

### During Development
- Keep `isTesting: true` in admob.js
- Use Google's test Ad IDs (already set)
- Ads will show as "Test Ad" label
- No revenue generated from test ads

### Debug Build
```bash
cordova build android
adb install platforms/android/app/build/outputs/apk/debug/app-debug.apk
adb logcat -s CordovaActivity chromium Admob
```

Watch for:
- "AdMob initialized" message
- Ad load/show/close events
- JavaScript console errors

---

## 5. Production Checklist

- [ ] Generated launcher icons (all 5 sizes)
- [ ] Obtained real AdMob App ID from admob.google.com
- [ ] Updated `config.xml` with App ID
- [ ] Updated `assets/admob.js` with production ad unit IDs
- [ ] Set `isTesting: false` in admob.js
- [ ] Created and hosted Privacy Policy
- [ ] Tested ads on real Android device
- [ ] Incremented version code in `config.xml`
- [ ] Built release APK/AAB
- [ ] Signed release build
- [ ] Submitted to Google Play Store
- [ ] Completed Play Store content rating form
- [ ] Completed Data Safety form (declare Advertising ID)

---

## 6. Ad Frequency & User Experience

### Current Implementation
- Interstitial ads show after holes **3, 6, 9, 12, 15** (not 18)
- Each ad takes ~3-5 seconds, non-intrusive
- Users can decline personalized ads (consent still required for ads themselves)
- Ads only show on Android, not web/dev environment (graceful fallback)

### Optional Enhancements (Future)
- Rewarded ads: "Watch ad for 50 coins"
- Banner ads: Persistent footer during gameplay
- Native ads: Cards styled like game UI

---

## 7. Compliance & Privacy

### EU GDPR
- Legal consent modal shown on first launch
- Users can opt out of personalized ads
- All text in Spanish (can add EN translations)
- Consent persisted in localStorage

### Google Play Store Requirements
1. **Privacy Policy** — Must be hosted online and declare:
   - Data types collected (ID, location, usage)
   - Third parties (Google AdMob, Analytics)
   - User control (reset ad ID)

2. **Data Safety Form** — Declare:
   - Data types: Advertising ID
   - Third parties: Google
   - Security: HTTPS only

3. **Content Rating** — Questionnaire for game category

---

## 8. Troubleshooting

### Ads Not Showing
- Confirm `isTesting: true` during dev (test ad IDs always work)
- Check device internet connection
- View logs: `adb logcat | grep -i admob`
- Ads may take 30+ seconds to load first time

### "AdMob not available (web/dev mode)"
- Normal when running in browser — not an error
- App only initializes AdMob when running via Cordova on Android

### Legal Modal Won't Close
- Check browser console for JavaScript errors
- Verify `legal-accept-btn` and `legal-decline-btn` elements exist
- Clear localStorage: `localStorage.clear()`

### Privacy Policy Text Wrong
- Edit `assets/legal.js` — all policies hardcoded in Spanish
- To add EN: Create separate translations in i18n.js or legal.js

---

## 9. Next Phase: Rewarded Ads

Optional feature for future monetization:

```javascript
// In shop or currency system:
if(LegalManager.hasAdsConsent()) {
  showButton("Watch ad for 50 coins", () => {
    AdMobManager.showRewarded((rewardData) => {
      if(rewardData.amount > 0) {
        state.money += 50;
        updateUI();
      }
    });
  });
}
```

The infrastructure is already in place in admob.js.

---

## Summary

✅ Full AdMob integration ready for Android  
✅ Legal compliance with GDPR consent  
✅ Test environment (Test IDs enabled)  
✅ Web fallback (graceful degradation)  
✅ Complete build and deployment guide  

**Next: Generate icons, get AdMob IDs, build APK, test on device, submit to Play Store.**
