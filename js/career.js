const Career = (() => {
  const SUPABASE_URL = 'https://rtkvyxvotjbjwrahmiuc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0a3Z5eHZvdGpiandyYWhtaXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNzExNDMsImV4cCI6MjA5Nzk0NzE0M30.sG_HOfpSyA0GAD3phTB2H5a2paREvaKYL0o-n3c5V64';

  async function fetchJobs() {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/jobs?is_active=eq.true&order=created_at.asc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    if (!res.ok) return [];
    return res.json();
  }

  function renderJobs(jobs, container) {
    if (!jobs.length) {
      container.innerHTML = `<p class="career-empty" data-i18n="career.no_positions">Şu an açık pozisyonumuz bulunmamaktadır.</p>`;
      return;
    }
    container.innerHTML = jobs.map(job => `
      <div class="job-card card">
        <div class="job-info">
          <h3 class="job-title">${job.title}</h3>
          <div class="job-meta">
            <span class="badge">${job.department}</span>
            <span class="job-tag">📍 ${job.location}</span>
            <span class="job-tag">⏱ ${job.type}</span>
          </div>
        </div>
        <a href="/iletisim" class="btn btn-primary btn-sm" data-i18n="career.apply">Başvur</a>
      </div>
    `).join('');
  }

  async function init() {
    const container = document.getElementById('jobs-list');
    if (!container) return;
    container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text-muted)">Yükleniyor...</p>';
    const jobs = await fetchJobs();
    renderJobs(jobs, container);
    if (window.I18n) I18n.init();
  }

  return { init };
})();
