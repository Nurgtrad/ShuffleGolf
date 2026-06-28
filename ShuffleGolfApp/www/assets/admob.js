/**
 * SHUFFLE GOLF — Google AdMob Integration
 * Uses cordova-admob-plus plugin
 */

window.AdMobManager = (function() {
  let isReady = false;
  let interstitial = null;
  let onAdClosedCallback = null;

  const config = {
    interstitialId: 'ca-app-pub-5076664753284203/6554876030',
    isTesting: true // Cambiar a false antes de publicar en Play Store
  };

  const init = () => {
    if (typeof admob === 'undefined') {
      console.warn('AdMob not available (web/dev mode)');
      return;
    }

    document.addEventListener('deviceready', async () => {
      if (typeof admob === 'undefined') return;

      try {
        await admob.start();
        isReady = true;
        console.log('AdMob initialized');
        preloadInterstitial();
      } catch(e) {
        console.warn('AdMob init error:', e);
      }
    }, false);
  };

  const preloadInterstitial = async () => {
    if (!isReady) return;
    try {
      interstitial = new admob.InterstitialAd({
        adUnitId: config.interstitialId,
        isTesting: config.isTesting
      });

      interstitial.on('dismiss', () => {
        if (onAdClosedCallback) {
          const cb = onAdClosedCallback;
          onAdClosedCallback = null;
          cb();
        }
        preloadInterstitial(); // Reload for next time
      });

      await interstitial.load();
    } catch(e) {
      console.warn('AdMob preload error:', e);
    }
  };

  const showInterstitial = async (onClosed) => {
    if (!isReady || !interstitial) {
      if (onClosed) onClosed();
      return;
    }

    onAdClosedCallback = onClosed;

    try {
      await interstitial.show();
    } catch(e) {
      console.warn('AdMob show error:', e);
      if (onClosed) {
        onAdClosedCallback = null;
        onClosed();
      }
    }
  };

  return {
    init,
    showInterstitial,
    isReady: () => isReady
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  AdMobManager.init();
});
