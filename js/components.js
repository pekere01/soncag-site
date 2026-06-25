async function loadComponents() {
  const depth = location.pathname.split('/').length - 2;
  const prefix = '../'.repeat(Math.max(0, depth));

  const [headerRes, footerRes] = await Promise.all([
    fetch(`${prefix}components/header.html`),
    fetch(`${prefix}components/footer.html`)
  ]);

  const [headerHtml, footerHtml] = await Promise.all([
    headerRes.text(),
    footerRes.text()
  ]);

  document.getElementById('header-mount').innerHTML = headerHtml;
  document.getElementById('footer-mount').innerHTML = footerHtml;

  // Fix relative paths for logo
  document.querySelectorAll('.logo-main').forEach(img => {
    img.src = `${prefix}assets/soncag_logo.png`;
  });

  Theme.init();
  await I18n.init();
  Nav.init();

  // Active nav link
  const current = '/' + location.pathname.split('/').slice(1).join('/').replace(/\.html$/, '');
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
}
