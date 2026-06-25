const I18n = (() => {
  const KEY = 'soncag-lang';
  let strings = {};
  let current = 'tr';

  async function load(lang) {
    const depth = location.pathname.split('/').length - 2;
    const prefix = '../'.repeat(Math.max(0, depth));
    const res = await fetch(`${prefix}locales/${lang}.json`);
    return res.json();
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) el.textContent = strings[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (strings[key]) el.placeholder = strings[key];
    });
    document.documentElement.lang = current;
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = current === 'tr' ? 'EN' : 'TR';
  }

  async function setLang(lang) {
    current = lang;
    strings = await load(lang);
    localStorage.setItem(KEY, lang);
    apply();
  }

  async function init() {
    const saved = localStorage.getItem(KEY) || 'tr';
    await setLang(saved);
  }

  return { init, setLang, get: (k) => strings[k] || k };
})();

window.I18n = I18n;
