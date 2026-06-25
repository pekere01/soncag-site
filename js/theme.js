const Theme = (() => {
  const KEY = 'soncag-theme';
  const html = document.documentElement;

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
  }

  function toggle() {
    apply(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    apply(saved || preferred);
  }

  return { init, toggle };
})();

window.Theme = Theme;
