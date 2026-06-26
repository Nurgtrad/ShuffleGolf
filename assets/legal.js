/**
 * SHUFFLE GOLF — Legal Texts & Consent Management
 */

window.LegalManager = (function() {
  const PRIVACY_ACCEPTED_KEY = 'dg_privacy_accepted';
  const ADS_CONSENT_KEY = 'dg_ads_consent';

  const getLang = () => {
    return (typeof I18N !== 'undefined' && I18N.currentLang) ? I18N.currentLang : 'es';
  };

  const privacyPolicy_ES = `
    <h3>Política de Privacidad</h3>
    <p><strong>Última actualización: Junio 2026</strong></p>

    <h4>1. Información que Recopilamos</h4>
    <p>ShuffleGolf recopila:</p>
    <ul>
      <li>Datos de juego (puntuaciones, progreso)</li>
      <li>Datos de dispositivo (Android ID, tipo de dispositivo)</li>
      <li>ID de Publicidad (para anuncios personalizados)</li>
      <li>Datos de uso de la aplicación</li>
    </ul>

    <h4>2. Cómo Usamos Tu Información</h4>
    <ul>
      <li>Mejorar y mantener la aplicación</li>
      <li>Mostrar anuncios relevantes</li>
      <li>Analizar tendencias de uso</li>
      <li>Cumplir con obligaciones legales</li>
    </ul>

    <h4>3. Terceros</h4>
    <p>Compartimos información con:</p>
    <ul>
      <li><strong>Google AdMob</strong> — para servir publicidad</li>
      <li><strong>Google Analytics</strong> — para análisis de uso</li>
    </ul>

    <h4>4. Tu Control</h4>
    <p>Puedes resetear tu ID de publicidad en ajustes de Android: Configuración > Google > Privacidad > Ads > Resetear ID de publicidad.</p>

    <h4>5. Contacto</h4>
    <p>Email: arcadia.dsg@gmail.com</p>
  `;

  const privacyPolicy_EN = `
    <h3>Privacy Policy</h3>
    <p><strong>Last Updated: June 2026</strong></p>

    <h4>1. Information We Collect</h4>
    <p>ShuffleGolf collects:</p>
    <ul>
      <li>Game data (scores, progress)</li>
      <li>Device data (Android ID, device type)</li>
      <li>Advertising ID (for personalized ads)</li>
      <li>App usage data</li>
    </ul>

    <h4>2. How We Use Your Information</h4>
    <ul>
      <li>Improve and maintain the app</li>
      <li>Display relevant advertisements</li>
      <li>Analyze usage trends</li>
      <li>Comply with legal obligations</li>
    </ul>

    <h4>3. Third Parties</h4>
    <p>We share information with:</p>
    <ul>
      <li><strong>Google AdMob</strong> — to serve advertisements</li>
      <li><strong>Google Analytics</strong> — for usage analysis</li>
    </ul>

    <h4>4. Your Control</h4>
    <p>You can reset your Advertising ID in Android settings: Settings > Google > Privacy > Ads > Reset Advertising ID.</p>

    <h4>5. Contact</h4>
    <p>Email: arcadia.dsg@gmail.com</p>
  `;

  const termsOfService_ES = `
    <h3>Términos de Servicio</h3>
    <p><strong>Última actualización: Junio 2026</strong></p>

    <h4>1. Licencia de Uso</h4>
    <p>Te otorgamos una licencia limitada y no exclusiva para usar ShuffleGolf únicamente para tu uso personal.</p>

    <h4>2. Restricciones</h4>
    <p>No puedes:</p>
    <ul>
      <li>Modificar, hackear o descompilar la aplicación</li>
      <li>Usar bots o scripts automáticos</li>
      <li>Vender, alquilar o transferir tu cuenta</li>
      <li>Usar la aplicación para propósitos ilegales</li>
    </ul>

    <h4>3. Descargo de Responsabilidad</h4>
    <p>ShuffleGolf se proporciona "tal como está" sin garantías. No somos responsables por daños indirectos.</p>

    <h4>4. Cambios a los Términos</h4>
    <p>Nos reservamos el derecho de modificar estos términos. El uso continuado significa aceptación.</p>

    <h4>5. Terminación</h4>
    <p>Podemos terminar tu acceso por violación de estos términos.</p>
  `;

  const termsOfService_EN = `
    <h3>Terms of Service</h3>
    <p><strong>Last Updated: June 2026</strong></p>

    <h4>1. License to Use</h4>
    <p>We grant you a limited, non-exclusive license to use ShuffleGolf solely for your personal use.</p>

    <h4>2. Restrictions</h4>
    <p>You may not:</p>
    <ul>
      <li>Modify, hack, or decompile the app</li>
      <li>Use bots or automated scripts</li>
      <li>Sell, rent, or transfer your account</li>
      <li>Use the app for illegal purposes</li>
    </ul>

    <h4>3. Disclaimer</h4>
    <p>ShuffleGolf is provided "as is" without warranties. We are not responsible for indirect damages.</p>

    <h4>4. Changes to Terms</h4>
    <p>We reserve the right to modify these terms. Continued use means acceptance.</p>

    <h4>5. Termination</h4>
    <p>We may terminate your access for violation of these terms.</p>
  `;

  const adsDisclosure_ES = `
    <h3>Aviso sobre Publicidad</h3>
    <p><strong>Esta aplicación contiene publicidad de Google AdMob</strong></p>

    <p>Los anuncios que ves se personalizan según:</p>
    <ul>
      <li>Tu ID de Publicidad de Google</li>
      <li>Tu ubicación aproximada</li>
      <li>Tu historial de apps instaladas</li>
      <li>Tu actividad dentro de la app</li>
    </ul>

    <p><strong>Puedes controlar la personalización:</strong></p>
    <ol>
      <li>Abre Configuración > Google > Privacidad</li>
      <li>Desactiva "Ads Personalization"</li>
      <li>Toca "Resetear ID de publicidad" para empezar de nuevo</li>
    </ol>

    <p>Desactivar anuncios personalizados seguirá mostrando anuncios, pero serán menos relevantes para ti.</p>
  `;

  const adsDisclosure_EN = `
    <h3>Advertising Notice</h3>
    <p><strong>This app contains Google AdMob advertisements</strong></p>

    <p>The ads you see are personalized based on:</p>
    <ul>
      <li>Your Google Advertising ID</li>
      <li>Your approximate location</li>
      <li>Your installed apps history</li>
      <li>Your activity within the app</li>
    </ul>

    <p><strong>You can control personalization:</strong></p>
    <ol>
      <li>Open Settings > Google > Privacy</li>
      <li>Disable "Ads Personalization"</li>
      <li>Tap "Reset Advertising ID" to start fresh</li>
    </ol>

    <p>Disabling personalized ads will still show ads, but they will be less relevant to you.</p>
  `;

  const gdprConsent_ES = `
    <h3>Consentimiento GDPR / Privacidad</h3>
    <p style="margin-bottom: 20px;"><strong>Necesitamos tu consentimiento para:</strong></p>

    <h4 style="margin-top: 16px; margin-bottom: 8px;">Publicidad Personalizada</h4>
    <p style="margin-bottom: 18px;">Google AdMob utilizará tu ID de Publicidad para mostrar anuncios basados en tus intereses. Puedes cambiar esto en cualquier momento en Ajustes > Google > Privacidad.</p>

    <h4 style="margin-top: 16px; margin-bottom: 8px;">Análisis de Uso</h4>
    <p style="margin-bottom: 18px;">Recabamos datos anónimos de cómo usas la app para mejorar su calidad.</p>

    <h4 style="margin-top: 16px; margin-bottom: 8px;">Integración con Google</h4>
    <p style="margin-bottom: 18px;">Compartes datos con Google (AdMob, Analytics) como se describe en nuestra Política de Privacidad.</p>

    <p style="margin-top: 28px; font-weight: bold; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">Al aceptar, consientes a estas prácticas.</p>
  `;

  const gdprConsent_EN = `
    <h3>GDPR / Privacy Consent</h3>
    <p style="margin-bottom: 20px;"><strong>We need your consent for:</strong></p>

    <h4 style="margin-top: 16px; margin-bottom: 8px;">Personalized Advertising</h4>
    <p style="margin-bottom: 18px;">Google AdMob will use your Advertising ID to show ads based on your interests. You can change this anytime in Settings > Google > Privacy.</p>

    <h4 style="margin-top: 16px; margin-bottom: 8px;">Usage Analytics</h4>
    <p style="margin-bottom: 18px;">We collect anonymous data about how you use the app to improve its quality.</p>

    <h4 style="margin-top: 16px; margin-bottom: 8px;">Google Integration</h4>
    <p style="margin-bottom: 18px;">You share data with Google (AdMob, Analytics) as described in our Privacy Policy.</p>

    <p style="margin-top: 28px; font-weight: bold; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">By accepting, you consent to these practices.</p>
  `;

  const checkAndShowConsent = () => {
    if (!localStorage.getItem(PRIVACY_ACCEPTED_KEY)) {
      showPrivacyConsent();
      return false;
    }
    return true;
  };

  const showPrivacyConsent = () => {
    const overlay = document.getElementById('legal-consent-overlay');
    const contentDiv = document.getElementById('legal-content-gdpr');
    const lang = getLang();
    if (contentDiv) {
      contentDiv.innerHTML = lang === 'en' ? gdprConsent_EN : gdprConsent_ES;
    }
    if (overlay) overlay.style.display = 'flex';
  };

  const acceptPrivacy = () => {
    localStorage.setItem(PRIVACY_ACCEPTED_KEY, 'true');
    localStorage.setItem(ADS_CONSENT_KEY, 'true');
    const overlay = document.getElementById('legal-consent-overlay');
    if (overlay) overlay.style.display = 'none';
  };

  const declineAds = () => {
    localStorage.setItem(PRIVACY_ACCEPTED_KEY, 'true');
    localStorage.setItem(ADS_CONSENT_KEY, 'false');
    const overlay = document.getElementById('legal-consent-overlay');
    if (overlay) overlay.style.display = 'none';
  };

  const hasAdsConsent = () => {
    return localStorage.getItem(ADS_CONSENT_KEY) !== 'false';
  };

  const showLegalModal = (title, content) => {
    const modal = document.getElementById('legal-modal-overlay');
    const contentDiv = document.getElementById('legal-modal-content');
    if (contentDiv) {
      contentDiv.innerHTML = '<h3>' + title + '</h3>' + content;
    }
    if (modal) modal.style.display = 'flex';
  };

  return {
    checkAndShowConsent: checkAndShowConsent,
    acceptPrivacy: acceptPrivacy,
    declineAds: declineAds,
    hasAdsConsent: hasAdsConsent,
    showPrivacyPolicy: () => {
      const lang = getLang();
      const title = lang === 'en' ? 'Privacy Policy' : 'Política de Privacidad';
      const content = lang === 'en' ? privacyPolicy_EN : privacyPolicy_ES;
      showLegalModal(title, content);
    },
    showTermsOfService: () => {
      const lang = getLang();
      const title = lang === 'en' ? 'Terms of Service' : 'Términos de Servicio';
      const content = lang === 'en' ? termsOfService_EN : termsOfService_ES;
      showLegalModal(title, content);
    },
    showAdsDisclosure: () => {
      const lang = getLang();
      const title = lang === 'en' ? 'Advertising Notice' : 'Aviso sobre Publicidad';
      const content = lang === 'en' ? adsDisclosure_EN : adsDisclosure_ES;
      showLegalModal(title, content);
    }
  };
})();

// Initialize button listeners and event handlers
window.addEventListener('load', () => {
  // Wire up consent buttons
  const acceptBtn = document.getElementById('legal-accept-btn');
  const declineBtn = document.getElementById('legal-decline-btn');
  const modalClose = document.getElementById('legal-modal-close');

  if (acceptBtn) acceptBtn.addEventListener('click', LegalManager.acceptPrivacy);
  if (declineBtn) declineBtn.addEventListener('click', LegalManager.declineAds);
  if (modalClose) modalClose.addEventListener('click', () => {
    const modal = document.getElementById('legal-modal-overlay');
    if (modal) modal.style.display = 'none';
  });

  // Show consent on first load
  setTimeout(() => LegalManager.checkAndShowConsent(), 500);
});
