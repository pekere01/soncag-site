const Contact = (() => {
  const SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
  const TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
  const PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';

  function init() {
    if (typeof emailjs === 'undefined') return;
    emailjs.init(PUBLIC_KEY);

    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const successEl = document.getElementById('form-success');
      const errorEl = document.getElementById('form-error');

      btn.disabled = true;
      btn.textContent = '...';
      if (successEl) successEl.className = 'form-status';
      if (errorEl) errorEl.className = 'form-status';

      const params = {
        from_name: form.elements['from_name'].value,
        company: form.elements['company'].value,
        from_email: form.elements['from_email'].value,
        phone: form.elements['phone'].value,
        subject: form.elements['subject'].value,
        message: form.elements['message'].value
      };

      try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, params);
        if (successEl) successEl.className = 'form-status success';
        form.reset();
      } catch {
        if (errorEl) errorEl.className = 'form-status error';
      } finally {
        btn.disabled = false;
        btn.setAttribute('data-i18n', 'contact.form.submit');
        if (window.I18n) I18n.init();
      }
    });
  }

  return { init };
})();
