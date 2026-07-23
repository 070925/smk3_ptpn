// Notification System for SMK3
(function(){
window.SMK3_NOTIF = {
  MAX_NOTIF: 50,
  
  getNotifs: function(){
    try { return JSON.parse(localStorage.getItem('smk3_notif')) || []; } catch(e) { return []; }
  },
  
  saveNotifs: function(arr){
    localStorage.setItem('smk3_notif', JSON.stringify(arr.slice(0,this.MAX_NOTIF)));
  },
  
  add: function(title, message, type, module){
    var notif = {
      id: 'N'+Date.now().toString(36)+Math.random().toString(36).substr(2,5),
      title: title,
      message: message,
      type: type||'info',
      module: module||'',
      read: false,
      created_at: new Date().toISOString()
    };
    var all = this.getNotifs();
    all.unshift(notif);
    this.saveNotifs(all);
    this.updateBadge();
    return notif;
  },
  
  markRead: function(id){
    var all = this.getNotifs();
    for(var i=0;i<all.length;i++){
      if(all[i].id===id) all[i].read = true;
    }
    this.saveNotifs(all);
    this.updateBadge();
  },
  
  markAllRead: function(){
    var all = this.getNotifs();
    for(var i=0;i<all.length;i++) all[i].read = true;
    this.saveNotifs(all);
    this.updateBadge();
  },
  
  clearAll: function(){
    this.saveNotifs([]);
    this.updateBadge();
  },
  
  getUnreadCount: function(){
    var all = this.getNotifs();
    return all.filter(function(n){return !n.read}).length;
  },
  
  updateBadge: function(){
    var count = this.getUnreadCount();
    var badges = document.querySelectorAll('.badge-count');
    for(var i=0;i<badges.length;i++){
      var b = badges[i];
      if(count===0){
        b.classList.add('d-none');
      } else {
        b.classList.remove('d-none');
        b.textContent = count > 99 ? '99+' : count;
      }
    }
  },
  
  renderDropdown: function(containerId){
    var container = document.getElementById(containerId||'notifList');
    if(!container) return;
    var all = this.getNotifs();
    if(!all||all.length===0){
      container.innerHTML = '<div class="notif-empty">Belum ada notifikasi</div>';
      return;
    }
    var html = '';
    for(var i=0;i<all.length;i++){
      var n = all[i];
      var iconMap = {info:'fa-info-circle bg-blue',success:'fa-check-circle bg-green',warning:'fa-exclamation-triangle bg-orange',error:'fa-times-circle bg-red',data:'fa-database bg-teal',user:'fa-user bg-purple'};
      var ic = iconMap[n.type]||iconMap.info;
      var parts = ic.split(' ');
      var iconClass = parts[0];
      var bgClass = parts[1]||'bg-blue';
      var style = n.read ? 'opacity:0.55' : '';
      html += '<div class="notif-item" style="'+style+'" onclick="SMK3_NOTIF.markRead(\''+n.id+'\');SMK3_NOTIF.renderDropdown(\''+(containerId||'notifList')+'\')"><span class="ni-icon '+bgClass+'" style="color:#fff"><i class="fas '+iconClass+'"></i></span><div style="flex:1"><strong>'+n.title+'</strong><br>'+n.message+'</div><div class="ni-time">'+timeAgo(n.created_at)+'</div></div>';
    }
    container.innerHTML = html;
    this.updateBadge();
  }
};

function timeAgo(ts){
  if(!ts) return '';
  var now = new Date();
  var d = new Date(ts);
  var diff = Math.floor((now-d)/1000);
  if(diff<60) return 'Baru saja';
  if(diff<3600) return Math.floor(diff/60)+' menit lalu';
  if(diff<86400) return Math.floor(diff/3600)+' jam lalu';
  if(diff<604800) return Math.floor(diff/86400)+' hari lalu';
  return d.toLocaleDateString('id-ID');
}

// Auto-init bell toggle
document.addEventListener('DOMContentLoaded', function(){
  window.SMK3_NOTIF.updateBadge();
  var bell = document.getElementById('notifBell');
  var dropdown = document.getElementById('notifDropdown');
  if(bell && dropdown){
    bell.addEventListener('click', function(e){
      e.stopPropagation();
      dropdown.classList.toggle('show');
      if(dropdown.classList.contains('show')){
        window.SMK3_NOTIF.renderDropdown('notifList');
      }
    });
    document.addEventListener('click', function(){ dropdown.classList.remove('show'); });
  }
});

window.markAllRead = function(){
  window.SMK3_NOTIF.markAllRead();
  window.SMK3_NOTIF.renderDropdown('notifList');
};

console.log('[SMK3] Notification system ready');
})();
