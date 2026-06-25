const AdminPanel = (() => {
  const SUPABASE_URL = 'https://rtkvyxvotjbjwrahmiuc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0a3Z5eHZvdGpiandyYWhtaXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNzExNDMsImV4cCI6MjA5Nzk0NzE0M30.sG_HOfpSyA0GAD3phTB2H5a2paREvaKYL0o-n3c5V64';

  let sb;

  function headers(token) {
    return {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    };
  }

  async function getSession() {
    const stored = localStorage.getItem('sb-rtkvyxvotjbjwrahmiuc-auth-token');
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
  }

  async function checkAuth() {
    const session = await getSession();
    const loginPanel = document.getElementById('login-panel');
    const adminPanel = document.getElementById('admin-panel');
    if (!session || !session.access_token) {
      loginPanel.hidden = false;
      adminPanel.hidden = true;
    } else {
      loginPanel.hidden = true;
      adminPanel.hidden = false;
      loadJobs(session.access_token);
    }
  }

  async function login(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.error) { alert('Giriş başarısız: ' + data.error_description); return; }
    localStorage.setItem('sb-rtkvyxvotjbjwrahmiuc-auth-token', JSON.stringify(data));
    checkAuth();
  }

  async function logout() {
    const session = await getSession();
    if (session) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${session.access_token}` }
      });
    }
    localStorage.removeItem('sb-rtkvyxvotjbjwrahmiuc-auth-token');
    checkAuth();
  }

  async function loadJobs(token) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/jobs?order=created_at.asc`, {
      headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` }
    });
    const jobs = await res.json();
    renderAdminJobs(jobs, token);
  }

  function renderAdminJobs(jobs, token) {
    const tbody = document.getElementById('admin-jobs-tbody');
    if (!tbody) return;
    tbody.innerHTML = jobs.map(j => `
      <tr>
        <td>${j.title}</td>
        <td>${j.department}</td>
        <td>${j.location}</td>
        <td>${j.type}</td>
        <td><label class="toggle-switch"><input type="checkbox" ${j.is_active ? 'checked' : ''} onchange="AdminPanel.toggleActive('${j.id}', this.checked)"><span></span></label></td>
        <td><button class="btn-delete" onclick="AdminPanel.deleteJob('${j.id}')">Sil</button></td>
      </tr>
    `).join('');
  }

  async function addJob(formData) {
    const session = await getSession();
    if (!session) return;
    await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
      method: 'POST',
      headers: { ...headers(session.access_token), 'Prefer': 'return=minimal' },
      body: JSON.stringify(formData)
    });
    loadJobs(session.access_token);
  }

  async function deleteJob(id) {
    if (!confirm('Bu pozisyonu silmek istediğinize emin misiniz?')) return;
    const session = await getSession();
    if (!session) return;
    await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, {
      method: 'DELETE',
      headers: headers(session.access_token)
    });
    loadJobs(session.access_token);
  }

  async function toggleActive(id, is_active) {
    const session = await getSession();
    if (!session) return;
    await fetch(`${SUPABASE_URL}/rest/v1/jobs?id=eq.${id}`, {
      method: 'PATCH',
      headers: headers(session.access_token),
      body: JSON.stringify({ is_active })
    });
  }

  function init() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        login(loginForm.email.value, loginForm.password.value);
      });
    }
    // Add job form
    const addForm = document.getElementById('add-job-form');
    if (addForm) {
      addForm.addEventListener('submit', e => {
        e.preventDefault();
        addJob({
          title: addForm.title.value,
          department: addForm.department.value,
          location: addForm.location.value || 'İSTANBUL',
          type: addForm.type.value || 'TAM ZAMANLI'
        });
        addForm.reset();
      });
    }
    checkAuth();
  }

  return { init, deleteJob, toggleActive, logout };
})();
