import { getDefaultConsent, loadConsent } from './consent';
import { loadThirdPartyScripts } from './scriptLoader';

const getInitialConsent = () => loadConsent() ?? getDefaultConsent();

// Initial load based on existing consent cookie (if present)
loadThirdPartyScripts(getInitialConsent());

// React to changes (banner/preferences updates)
window.addEventListener('gdpr-consent-updated', (e) => {
  const detail = (e as CustomEvent).detail;
  if (!detail) return;
  loadThirdPartyScripts(detail);
});

