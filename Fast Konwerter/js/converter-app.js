/* Plixy (ReTrap) - In-Browser Test Suite & Live Converter */

var conversionState = 'idle';
var activeDownloadBlobUrl = null;
var activeDownloadFileName = '';

document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  checkDirectTabActivation();
  initStudioConverter();
  initExtensionSimulator();
  initAuthModule();
  syncUserState();

  window.addEventListener('aplihub_user_updated', syncUserState);
});

/* Tabs Switching */
function initTabs() {
  var tabBtns = document.querySelectorAll('.nav-tab-btn');
  var tabViews = document.querySelectorAll('.tab-view');

  tabBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tabBtns.forEach(function(b) { b.classList.remove('active'); });
      tabViews.forEach(function(v) { v.classList.remove('active'); });

      btn.classList.add('active');
      var targetId = btn.getAttribute('data-tab');
      var targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active');
    });
  });
}

/* User State Sync */
function syncUserState() {
  var user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
  var userPill = document.getElementById('user-pill-btn');
  var userAvatar = document.getElementById('user-pill-avatar');
  var userName = document.getElementById('user-pill-name');

  if (!user || user.isLoggedIn === false) {
    if (userName) userName.textContent = 'Zaloguj się';
    if (userAvatar) userAvatar.innerHTML = '🔑';
    if (userPill) userPill.title = 'Zaloguj się do ApliHub';
  } else {
    if (userName) userName.textContent = user.name || 'Oskar';
    if (userAvatar) userAvatar.innerHTML = (user.name || 'O')[0].toUpperCase();
    if (userPill) userPill.title = 'Konto: ' + user.name;
  }
}

/* Studio Converter Logic */
function initStudioConverter() {
  var urlInput = document.getElementById('yt-url-input');
  var statusMsg = document.getElementById('studio-status-msg');
  var formatSelect = document.getElementById('format-select-dropdown');
  var btnAction = document.getElementById('btn-convert-action');
  var progressWrap = document.getElementById('studio-progress-wrap');
  var progressFill = document.getElementById('progress-fill-blue');
  var progressPct = document.getElementById('progress-pct-text');
  var progressStage = document.getElementById('progress-stage-text');
  var errorBox = document.getElementById('studio-error-box');

  if (!btnAction) return;

  btnAction.addEventListener('click', function() {
    // If already completed, trigger download
    if (conversionState === 'completed' && activeDownloadBlobUrl) {
      var a = document.createElement('a');
      a.href = activeDownloadBlobUrl;
      a.download = activeDownloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Pobieranie rozpoczęte: ' + activeDownloadFileName);
      return;
    }

    var inputUrl = urlInput ? urlInput.value.trim() : '';
    if (!inputUrl) {
      if (errorBox) {
        errorBox.textContent = 'Proszę wkleić prawidłowy link do materiału wideo!';
        errorBox.style.display = 'block';
      }
      return;
    }

    // Start conversion
    conversionState = 'converting';
    if (errorBox) errorBox.style.display = 'none';
    if (urlInput) urlInput.style.display = 'none';
    if (statusMsg) statusMsg.style.display = 'flex';
    if (progressWrap) progressWrap.style.display = 'block';

    btnAction.disabled = true;
    btnAction.textContent = 'Konwertowanie...';

    var selectedFormat = formatSelect ? formatSelect.value : 'mp3';

    var stages = [
      { pct: 25, stage: 'Pobieranie strumienia materiału...' },
      { pct: 60, stage: 'Przetwarzanie audio/wideo (' + selectedFormat.toUpperCase() + ')...' },
      { pct: 90, stage: 'Pakowanie i optymalizacja pliku...' },
      { pct: 100, stage: 'Konwersja zakończona sukcesem!' }
    ];

    var currentStageIdx = 0;
    var interval = setInterval(function() {
      if (currentStageIdx < stages.length) {
        var s = stages[currentStageIdx];
        if (progressFill) progressFill.style.width = s.pct + '%';
        if (progressPct) progressPct.textContent = s.pct + '%';
        if (progressStage) progressStage.textContent = s.stage;
        currentStageIdx++;
      } else {
        clearInterval(interval);
        finishConversion(inputUrl, selectedFormat);
      }
    }, 450);
  });

  function finishConversion(inputUrl, selectedFormat) {
    var ext = 'mp3';
    var mime = 'audio/mp3';
    if (selectedFormat === 'wav') { ext = 'wav'; mime = 'audio/wav'; }
    else if (selectedFormat.indexOf('mp4') !== -1 || selectedFormat === '1080p' || selectedFormat === '720p') { ext = 'mp4'; mime = 'video/mp4'; }

    var rawTitle = inputUrl.indexOf('v=') !== -1 ? inputUrl.split('v=')[1].substring(0, 10) : 'material';
    activeDownloadFileName = 'Plixy_' + rawTitle + '_' + selectedFormat + '.' + ext;
    var fileContent = 'ReTrap Plixy\nFormat: ' + selectedFormat.toUpperCase() + '\nSource: ' + inputUrl + '\nGenerated by ApliHub Engine.';
    var blob = new Blob([fileContent], { type: mime });
    activeDownloadBlobUrl = URL.createObjectURL(blob);

    conversionState = 'completed';
    btnAction.disabled = false;
    btnAction.textContent = 'Pobierz';
    btnAction.style.background = 'linear-gradient(135deg, #0284c7, #0369a1)';

    if (statusMsg) {
      statusMsg.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="#34d399" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg><span style="color: #34d399; font-weight: 700;">Gotowe! Kliknij Pobierz, aby zapisać plik.</span>';
    }

    var autoLink = document.createElement('a');
    autoLink.href = activeDownloadBlobUrl;
    autoLink.download = activeDownloadFileName;
    document.body.appendChild(autoLink);
    autoLink.click();
    document.body.removeChild(autoLink);

    showToast('Pobrano plik: ' + activeDownloadFileName);
  }
}

/* Simulator Multi-Platform View */
function initExtensionSimulator() {
  var contentEl = document.getElementById('sim-platform-content');
  var navBtns = document.querySelectorAll('.sim-nav-btn');
  var simModal = document.getElementById('sim-popup-modal');
  var btnCloseSim = document.getElementById('sim-close-modal');

  var currentPlatform = 'yt';

  function renderPlatformMock(p) {
    if (!contentEl) return;

    if (p === 'yt') {
      contentEl.innerHTML = '<div style="background: #0f0f0f; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06);">' +
        '<div style="display: flex; align-items: center; gap: 10px;">' +
          '<span style="color: #ff0000; font-size: 20px; font-weight: 900;">▶</span>' +
          '<span style="font-weight: 800; font-size: 16px; letter-spacing: -0.5px; color: #fff;">YouTube</span>' +
        '</div>' +
        '<div style="background: #1f1f1f; padding: 6px 16px; border-radius: 20px; font-size: 12px; color: #aaa; width: 260px;">Szukaj na YouTube...</div>' +
        '<div style="width: 28px; height: 28px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff;">O</div>' +
      '</div>' +
      '<div style="position: relative; width: 100%; height: 320px; background: #000; display: flex; align-items: center; justify-content: center;">' +
        '<img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.75;" alt="YouTube video frame">' +
        '<div style="position: absolute; width: 56px; height: 56px; background: rgba(0,0,0,0.75); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #fff;">▶</div>' +
      '</div>' +
      '<div style="padding: 18px;">' +
        '<h2 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 12px;">Lofi Hip Hop Radio - Beats to Relax / Study to [Official Stream]</h2>' +
        '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">' +
          '<div style="display: flex; align-items: center; gap: 10px;">' +
            '<div style="width: 38px; height: 38px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000;">LG</div>' +
            '<div>' +
              '<div style="font-weight: 700; font-size: 13px; color: #fff;">Lofi Girl ✓</div>' +
              '<div style="font-size: 11px; color: #888;">14.3M subskrybentów</div>' +
            '</div>' +
          '</div>' +
          '<button id="sim-techno-btn-yt" style="background: #0e1118; color: #f1f5f9; border: 1px solid rgba(59, 130, 246, 0.45); padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 7px; cursor: pointer; box-shadow: 0 0 12px rgba(37,99,235,0.3); transition: all 0.2s;">' +
            '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
              '<polyline points="7 10 12 15 17 10"></polyline>' +
              '<line x1="12" y1="15" x2="12" y2="3"></line>' +
            '</svg>' +
            '<span>Pobierz</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    } else if (p === 'tt') {
      contentEl.innerHTML = '<div style="background: #000; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06);">' +
        '<span style="font-weight: 900; font-size: 18px; color: #fff;">TikTok</span>' +
        '<span style="font-size: 12px; color: #888;">Dla Ciebie</span>' +
      '</div>' +
      '<div style="display: flex; height: 360px; background: #050508;">' +
        '<div style="flex: 1; position: relative; display: flex; align-items: center; justify-content: center; background: #000;">' +
          '<img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" alt="TikTok Video">' +
          '<div style="position: absolute; bottom: 20px; left: 20px; color: #fff;">' +
            '<div style="font-weight: 700; font-size: 14px;">@cyber_creator</div>' +
            '<div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">Nowy filtr AI zrewolucjonizował montaż wideo! #ai #tech</div>' +
          '</div>' +
        '</div>' +
        '<div style="width: 180px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; border-left: 1px solid rgba(255,255,255,0.08);">' +
          '<div style="text-align: center; font-size: 12px; color: #aaa;">42.5K polubień</div>' +
          '<div style="text-align: center; font-size: 12px; color: #aaa;">1.2K komentarzy</div>' +
          '<button id="sim-techno-btn-tt" style="background: #0e1118; color: #f1f5f9; border: 1px solid rgba(59, 130, 246, 0.45); padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 0 12px rgba(37,99,235,0.3); width: 100%; justify-content: center;">' +
            '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#60a5fa" stroke-width="2.5">' +
              '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
              '<polyline points="7 10 12 15 17 10"></polyline>' +
              '<line x1="12" y1="15" x2="12" y2="3"></line>' +
            '</svg>' +
            '<span>Pobierz</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    } else if (p === 'ig') {
      contentEl.innerHTML = '<div style="background: #000; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06);">' +
        '<span style="font-weight: 800; font-size: 18px; color: #fff; font-family: serif;">Instagram</span>' +
        '<span style="font-size: 12px; color: #888;">Reels</span>' +
      '</div>' +
      '<div style="display: flex; height: 360px; background: #050508;">' +
        '<div style="flex: 1; position: relative; display: flex; align-items: center; justify-content: center; background: #000;">' +
          '<img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" alt="Instagram Reel">' +
          '<div style="position: absolute; bottom: 20px; left: 20px; color: #fff;">' +
            '<div style="font-weight: 700; font-size: 14px;">music_producer_hub</div>' +
            '<div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">Studio Session WAV Master 2026</div>' +
          '</div>' +
        '</div>' +
        '<div style="width: 180px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; border-left: 1px solid rgba(255,255,255,0.08);">' +
          '<div style="text-align: center; font-size: 12px; color: #aaa;">18.2K polubień</div>' +
          '<div style="text-align: center; font-size: 12px; color: #aaa;">480 komentarzy</div>' +
          '<button id="sim-techno-btn-ig" style="background: #0e1118; color: #f1f5f9; border: 1px solid rgba(59, 130, 246, 0.45); padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 0 12px rgba(37,99,235,0.3); width: 100%; justify-content: center;">' +
            '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#60a5fa" stroke-width="2.5">' +
              '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
              '<polyline points="7 10 12 15 17 10"></polyline>' +
              '<line x1="12" y1="15" x2="12" y2="3"></line>' +
            '</svg>' +
            '<span>Pobierz</span>' +
          '</button>' +
        '</div>' +
      '</div>';
    }

    var anyBtn = contentEl.querySelector('button[id^="sim-techno-btn"]');
    if (anyBtn && simModal) {
      anyBtn.addEventListener('click', function() {
        simModal.style.display = 'flex';
      });
    }
  }

  navBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      navBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentPlatform = btn.getAttribute('data-platform');
      renderPlatformMock(currentPlatform);
    });
  });

  renderPlatformMock('yt');

  // Modal option buttons handler
  var modalOptions = document.querySelectorAll('.sim-modal-option');
  modalOptions.forEach(function(opt) {
    opt.addEventListener('click', function() {
      var format = opt.getAttribute('data-format') || 'mp3';
      if (simModal) simModal.style.display = 'none';

      var ext = 'mp3';
      var mime = 'audio/mp3';
      if (format === 'wav') { ext = 'wav'; mime = 'audio/wav'; }
      else if (format.indexOf('mp4') !== -1 || format === '1080p' || format === '720p') { ext = 'mp4'; mime = 'video/mp4'; }

      var fileName = 'Plixy_Download_' + format + '.' + ext;
      var blob = new Blob(['ReTrap Download - Format: ' + format], { type: mime });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast('Pobieranie rozpoczęte: ' + fileName);
    });
  });

  if (btnCloseSim && simModal) {
    btnCloseSim.addEventListener('click', function() {
      simModal.style.display = 'none';
    });
  }
}

/* Auth Module (Login & Register Modal) */
function initAuthModule() {
  var userPill = document.getElementById('user-pill-btn');
  var authModal = document.getElementById('auth-modal-overlay');
  var closeModalBtn = document.getElementById('auth-close-btn');

  var tabLogin = document.getElementById('auth-tab-login');
  var tabReg = document.getElementById('auth-tab-reg');
  var formLogin = document.getElementById('fast-login-form');
  var formReg = document.getElementById('fast-reg-form');

  if (userPill) {
    userPill.addEventListener('click', function() {
      var user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
      if (!user || user.isLoggedIn === false) {
        if (authModal) authModal.classList.add('active');
      } else {
        if (confirm('Jesteś zalogowany jako ' + user.name + '. Czy chcesz się wylogować?')) {
          localStorage.setItem('aplihub_logged_out', 'true');
          if (typeof saveApliHubUserData === 'function') {
            saveApliHubUserData({ isLoggedIn: false, name: 'Gość', email: '' });
          }
          syncUserState();
          showToast('Wylogowano pomyślnie.');
        }
      }
    });
  }

  if (closeModalBtn && authModal) {
    closeModalBtn.addEventListener('click', function() {
      authModal.classList.remove('active');
    });
  }

  if (tabLogin && tabReg) {
    tabLogin.addEventListener('click', function() {
      tabLogin.style.background = '#2563eb';
      tabLogin.style.color = '#fff';
      tabReg.style.background = 'transparent';
      tabReg.style.color = '#94a3b8';
      if (formLogin) formLogin.style.display = 'flex';
      if (formReg) formReg.style.display = 'none';
    });

    tabReg.addEventListener('click', function() {
      tabReg.style.background = '#2563eb';
      tabReg.style.color = '#fff';
      tabLogin.style.background = 'transparent';
      tabLogin.style.color = '#94a3b8';
      if (formLogin) formLogin.style.display = 'none';
      if (formReg) formReg.style.display = 'flex';
    });
  }

  if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('fast-login-email').value.trim();

      var newUser = {
        isLoggedIn: true,
        name: email.split('@')[0],
        email: email,
        accountType: 'PRO VIP'
      };

      localStorage.removeItem('aplihub_logged_out');
      if (typeof saveApliHubUserData === 'function') saveApliHubUserData(newUser);
      syncUserState();
      if (authModal) authModal.classList.remove('active');
      showToast('Witaj, ' + newUser.name + '! Zalogowano pomyślnie.');
    });
  }

  if (formReg) {
    formReg.addEventListener('submit', function(e) {
      e.preventDefault();
      var user = document.getElementById('fast-reg-user').value.trim();
      var email = document.getElementById('fast-reg-email').value.trim();

      var newUser = {
        isLoggedIn: true,
        name: user,
        email: email,
        accountType: 'Użytkownik'
      };

      localStorage.removeItem('aplihub_logged_out');
      if (typeof saveApliHubUserData === 'function') saveApliHubUserData(newUser);
      syncUserState();
      if (authModal) authModal.classList.remove('active');
      showToast('Konto ' + user + ' zostało utworzone!');
    });
  }
}

function showToast(msg) {
  var container = document.getElementById('toast-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#60a5fa" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><div>' + msg + '</div>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = '0.3s';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3500);
}
/* Global Tab Switcher for parent window & direct activation */
window.switchTab = function(tabId) {
  try {
    var targetBtn = document.querySelector('.nav-tab-btn[data-tab="' + tabId + '"]');
    if (targetBtn) {
      targetBtn.click();
    }
  } catch (e) {
    console.error('Error in switchTab:', e);
  }
};

function checkDirectTabActivation() {
  function activate() {
    try {
      var hash = window.location.hash;
      var params = new URLSearchParams(window.location.search);
      var targetTabId = params.get('tab') || (hash ? hash.replace('#', '') : '');

      if (targetTabId && window.switchTab) {
        window.switchTab(targetTabId);
      }
    } catch (e) {}
  }

  activate();
  window.addEventListener('hashchange', activate);
  setTimeout(activate, 50);
  setTimeout(activate, 150);
  setTimeout(activate, 350);
}
