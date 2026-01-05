import { getConsent, getDefaultConsent, loadConsent, saveConsent } from './consent';

type ConsentRootEls = {
  root: HTMLElement;
  banner: HTMLElement | null;
  modal: HTMLElement | null;
  modalPanel: HTMLElement | null;
  form: HTMLFormElement | null;
};

const getElements = (root: HTMLElement): ConsentRootEls => ({
  root,
  banner: root.querySelector<HTMLElement>('.gdpr-banner'),
  modal: root.querySelector<HTMLElement>('.gdpr-modal'),
  modalPanel: root.querySelector<HTMLElement>('.gdpr-modal__panel'),
  form: root.querySelector<HTMLFormElement>('[data-gdpr-form]'),
});

const setVisible = (el: HTMLElement | null, visible: boolean) => {
  if (!el) return;
  el.classList.toggle('gdpr-hidden', !visible);
};

const setModalVisible = (modal: HTMLElement | null, visible: boolean) => {
  if (!modal) return;
  setVisible(modal, visible);
  document.documentElement.classList.toggle('gdpr-modal-open', visible);
};

export function initCookieConsent(root: HTMLElement) {
  const { banner, modal, modalPanel, form } = getElements(root);

  const showModal = () => {
    if (!modal || !form) return;
    const current = loadConsent() ?? getConsent() ?? getDefaultConsent();

    const analytics = form.querySelector<HTMLInputElement>('input[name="analytics"]');
    const marketing = form.querySelector<HTMLInputElement>('input[name="marketing"]');
    if (analytics) analytics.checked = Boolean(current.analytics);
    if (marketing) marketing.checked = Boolean(current.marketing);

    setModalVisible(modal, true);
    modalPanel?.focus();
  };

  const hideModal = () => setModalVisible(modal, false);

  const applyConsent = (data: { essential: true; analytics: boolean; marketing: boolean }) => {
    try {
      saveConsent(data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[gdpr] Failed to save consent', e);
    }
    setVisible(banner, false);
    hideModal();
  };

  // Initial decision: show banner only if no consent cookie yet
  const existing = loadConsent();
  setVisible(banner, !existing);

  root.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.getAttribute('data-gdpr-action');
    if (!action) return;

    if (action === 'accept-all') {
      applyConsent({ essential: true, analytics: true, marketing: true });
    } else if (action === 'reject-all') {
      applyConsent({ essential: true, analytics: false, marketing: false });
    } else if (action === 'open-preferences') {
      showModal();
    } else if (action === 'close') {
      hideModal();
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const analytics = form.querySelector<HTMLInputElement>('input[name="analytics"]')?.checked ?? false;
    const marketing = form.querySelector<HTMLInputElement>('input[name="marketing"]')?.checked ?? false;
    applyConsent({ essential: true, analytics, marketing });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('gdpr-hidden')) {
      hideModal();
    }
  });

  window.addEventListener('open-gdpr-preferences', () => showModal());
}

// Auto-init on all instances
document.querySelectorAll<HTMLElement>('[data-gdpr-consent-root]').forEach((root) => initCookieConsent(root));

