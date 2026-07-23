function requireAuth() {
  var user = null;
  try { user = JSON.parse(localStorage.getItem('smk3_currentUser')); } catch(e) {}
  if (!user) { window.location.href = '../login.html'; return null; }

  // Fill navbar elements if present
  var els = document.querySelectorAll('.user-display-name');
  for (var i=0;i<els.length;i++) els[i].textContent = user.nama || user.email || 'User';
  els = document.querySelectorAll('.role-badge');
  var ROLE_LABELS = {super_admin:'Super Admin',admin_kebun:'Admin Kebun',supervisor_k3:'Supervisor K3',petugas_k3:'Petugas K3',operator:'Operator',viewer:'Viewer',admin:'Administrator',petugas:'Petugas'};
  for (var i=0;i<els.length;i++) els[i].textContent = ROLE_LABELS[user.role] || (user.role || 'User');
  els = document.querySelectorAll('.user-avatar-circle');
  for (var i=0;i<els.length;i++) els[i].textContent = (user.nama || user.email || 'U').charAt(0).toUpperCase();

  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn && !logoutBtn.dataset.bound) {
    logoutBtn.dataset.bound = '1';
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var doLogout = function() {
        if (window.dbService && window.dbService.client) {
          window.dbService.client.auth.signOut().finally(function() {
            localStorage.removeItem('smk3_currentUser');
            window.location.href = '../login.html';
          });
        } else {
          localStorage.removeItem('smk3_currentUser');
          window.location.href = '../login.html';
        }
      };
      if (window.Swal) {
        Swal.fire({
          title: 'Logout?', text: 'Anda yakin ingin keluar?', icon: 'question',
          showCancelButton: true, confirmButtonColor: '#c9aa3b', cancelButtonColor: '#6c757d',
          confirmButtonText: 'Ya', cancelButtonText: 'Batal'
        }).then(function(r) { if (r.isConfirmed) doLogout(); });
      } else {
        if (confirm('Anda yakin?')) doLogout();
      }
    });
  }
  return user;
}

function isAdmin() {
  try { var u = JSON.parse(localStorage.getItem('smk3_currentUser')); return u && (u.role === 'admin' || u.role === 'super_admin' || u.role === 'admin_kebun'); }
  catch(e) { return false; }
}

window.requireAuth = requireAuth;
window.isAdmin = isAdmin;
