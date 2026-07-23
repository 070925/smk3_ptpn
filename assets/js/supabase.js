(function() {
  var cfg = window.SMK3_SUPABASE_CONFIG || {};
  var supabaseClient = null;
  if (cfg.url && cfg.anonKey && window.supabase) {
    try { supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey); } catch(e) {}
  }

  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch(e) { return []; } }
  function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function genId() { return 'ID' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8); }

  // Map module names to Supabase table names
  var TABLE_MAP = {
    'karyawan': 'karyawan',
    'lokasi': 'lokasi',
    'risiko': 'risiko',
    'kejadian': 'kejadian',
    'inspeksi': 'inspeksi',
    'tindakan': 'tindakan',
    'users': 'users'
  };

  var dbService = {
    supabase: supabaseClient,
    useSupabase: !!supabaseClient,

    getCollection: function(coll) {
      return new Promise(function(resolve) {
        if (dbService.useSupabase && supabaseClient) {
          var table = TABLE_MAP[coll] || coll;
          supabaseClient.from(table).select('*').order('created_at', { ascending: false }).then(function(res) {
            if (res.error) { console.warn('[DB] Supabase error:', res.error.message); resolve(dbService.getLocalCollection(coll)); }
            else { resolve(res.data || []); }
          }).catch(function(err) { console.warn('[DB] Supabase error:', err); resolve(dbService.getLocalCollection(coll)); });
        } else {
          resolve(dbService.getLocalCollection(coll));
        }
      });
    },

    getLocalCollection: function(coll) {
      if (coll === 'users') return lsGet('smk3_users');
      var data = lsGet('smk3_' + coll);
      return data.slice().reverse();
    },

    addDocument: function(coll, data) {
      return new Promise(function(resolve) {
        if (dbService.useSupabase && supabaseClient) {
          var table = TABLE_MAP[coll] || coll;
          supabaseClient.from(table).insert(data).select().then(function(res) {
            if (res.error) { console.warn('[DB] Supabase error:', res.error.message); resolve(dbService.addLocalDocument(coll, data)); }
            else { resolve(res.data && res.data[0] ? res.data[0] : data); }
          }).catch(function(err) { console.warn('[DB] Supabase error:', err); resolve(dbService.addLocalDocument(coll, data)); });
        } else {
          resolve(dbService.addLocalDocument(coll, data));
        }
      });
    },

    addLocalDocument: function(coll, data) {
      var all = lsGet('smk3_' + coll);
      var doc = { id: genId(), created_at: new Date().toISOString() };
      for (var k in data) { if (data.hasOwnProperty(k)) doc[k] = data[k]; }
      all.push(doc);
      lsSet('smk3_' + coll, all);
      return doc;
    },

    updateDocument: function(coll, id, data) {
      return new Promise(function(resolve) {
        if (dbService.useSupabase && supabaseClient) {
          var table = TABLE_MAP[coll] || coll;
          data.updated_at = new Date().toISOString();
          supabaseClient.from(table).update(data).eq('id', id).select().then(function(res) {
            if (res.error) { console.warn('[DB] Supabase error:', res.error.message); resolve(dbService.updateLocalDocument(coll, id, data)); }
            else { resolve(res.data && res.data[0] ? res.data[0] : data); }
          }).catch(function(err) { console.warn('[DB] Supabase error:', err); resolve(dbService.updateLocalDocument(coll, id, data)); });
        } else {
          resolve(dbService.updateLocalDocument(coll, id, data));
        }
      });
    },

    updateLocalDocument: function(coll, id, data) {
      var all = lsGet('smk3_' + coll);
      for (var i = 0; i < all.length; i++) {
        if (all[i].id === id) {
          for (var k in data) { if (data.hasOwnProperty(k)) all[i][k] = data[k]; }
          all[i].updated_at = new Date().toISOString();
          lsSet('smk3_' + coll, all);
          return all[i];
        }
      }
      return null;
    },

    deleteDocument: function(coll, id) {
      return new Promise(function(resolve) {
        if (dbService.useSupabase && supabaseClient) {
          var table = TABLE_MAP[coll] || coll;
          supabaseClient.from(table).delete().eq('id', id).then(function(res) {
            if (res.error) { console.warn('[DB] Supabase error:', res.error.message); dbService.deleteLocalDocument(coll, id); resolve(true); }
            else { resolve(true); }
          }).catch(function(err) { console.warn('[DB] Supabase error:', err); dbService.deleteLocalDocument(coll, id); resolve(true); });
        } else {
          dbService.deleteLocalDocument(coll, id);
          resolve(true);
        }
      });
    },

    deleteLocalDocument: function(coll, id) {
      var all = lsGet('smk3_' + coll);
      lsSet('smk3_' + coll, all.filter(function(d) { return d.id !== id; }));
    },

    getLocalUsers: function() { return lsGet('smk3_users'); },
    saveLocalUsers: function(arr) { lsSet('smk3_users', arr); },
    getCurrentUser: function() {
      try { return JSON.parse(localStorage.getItem('smk3_currentUser')); } catch(e) { return null; }
    },

    addLocalUser: function(data) {
      var users = this.getLocalUsers();
      var nu = { id: genId(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), status: 'Aktif', role: 'petugas_k3', bagian: '', foto_url: '' };
      for (var k in data) { if (data.hasOwnProperty(k)) nu[k] = data[k]; }
      users.push(nu);
      this.saveLocalUsers(users);
      return nu;
    },

    updateLocalUser: function(id, data) {
      var users = this.getLocalUsers();
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
          for (var k in data) { if (data.hasOwnProperty(k)) users[i][k] = data[k]; }
          users[i].updated_at = new Date().toISOString();
          this.saveLocalUsers(users);
          return users[i];
        }
      }
      return null;
    },

    deleteLocalUser: function(id) {
      var users = this.getLocalUsers();
      this.saveLocalUsers(users.filter(function(u) { return u.id !== id; }));
      return true;
    }
  };

  window.dbService = dbService;
  console.log('[DB] Service ready (mode: ' + (supabaseClient ? 'Supabase' : 'LocalStorage') + ')');
})();