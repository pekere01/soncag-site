const Nav = (() => {
  function init() {
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('nav-menu');
    if (!burger || !menu) return;

    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    const header = document.getElementById('site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }
  }

  return { init };
})();

window.Nav = Nav;
