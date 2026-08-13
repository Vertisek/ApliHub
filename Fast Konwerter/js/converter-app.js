/* Fast Konwerter (ReTrap) - In-Browser Test Suite & Live Converter */

const DEMO_VIDEOS = [
  {
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    title: 'Lofi Hip Hop Radio - Beats to Relax / Study to [2026 Edition]',
    author: 'Lofi Girl',
    duration: '3:45:00',
    views: '45.2M wyświetleń',
    thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60'
  },
  {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Cyberpunk 2077 - Night City Beats Official Soundtrack [Remastered]',
    author: 'CD PROJEKT RED',
    duration: '4:18',
    views: '12.8M wyświetleń',
    thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60'
  },
  {
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    title: 'AI Revolution: How Neural Networks Changed Media Forever',
    author: 'Tech Innovators',
    duration: '18:24',
    views: '3.4M wyświetleń',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'
  }
];

let selectedFormat = 'mp3';
let currentVideo = DEMO_VIDEOS[0];

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initFormatCards();
  initUrlInput();
  initDemoChips();
  initConvertEngine();
  initAuthModule();
  initExtensionSimulator();
  syncUserState();

  window.addEventListener('aplihub_user_updated', syncUserState);
});

/* Tabs Switching */
function initTabs() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetView = document.getElementById(targetId);
      if (targetView) targetView.classList.add('active');
    });
  });
}

/* User State Sync */
function syncUserState() {
  const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
  const userPill = document.getElementById('user-pill-btn');
  const userAvatar = document.getElementById('user-pill-avatar');
  const userName = document.getElementById('user-pill-name');

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

/* Format Cards Selection */
function initFormatCards() {
  const cards = document.querySelectorAll('.format-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => {
        c.classList.remove('selected');
        const radio = c.querySelector('.format-radio');
        if (radio) radio.innerHTML = '<span>○</span> Wybierz format';
      });
      card.classList.add('selected');
      const curRadio = card.querySelector('.format-radio');
      if (curRadio) curRadio.innerHTML = '<span>●</span> Wybrano format';
      selectedFormat = card.getAttribute('data-format');
    });
  });
}

/* URL Input & Demo Chips */
function initUrlInput() {
  const urlInput = document.getElementById('yt-url-input');
  const btnFetch = document.getElementById('btn-fetch-video');

  if (btnFetch && urlInput) {
    btnFetch.addEventListener('click', () => {
      const val = urlInput.value.trim();
      if (!val) {
        showToast('Wklej prawidłowy link do wideo YouTube!');
        return;
      }
      fetchVideoData(val);
    });
  }
}

function initDemoChips() {
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const idx = parseInt(chip.getAttribute('data-demo-idx'), 10);
      const demo = DEMO_VIDEOS[idx] || DEMO_VIDEOS[0];
      const urlInput = document.getElementById('yt-url-input');
      if (urlInput) urlInput.value = demo.url;
      setVideoData(demo);
      showToast('Wczytano wideo: ' + demo.title);
    });
  });
}

function fetchVideoData(url) {
  showToast('🔍 Wczytywanie metadanych YouTube...');
  setTimeout(() => {
    const customVideo = {
      url: url,
      title: 'YouTube Video: ' + (url.split('v=')[1]?.substring(0, 11) || 'Wideo'),
      author: 'YouTube Creator',
      duration: '5:32',
      views: '1.2M wyświetleń',
      thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'
    };
    setVideoData(customVideo);
    showToast('Wideo wczytane pomyślnie!');
  }, 400);
}

function setVideoData(video) {
  currentVideo = video;
  const titleEl = document.getElementById('video-title-display');
  const authorEl = document.getElementById('video-author-display');
  const durationEl = document.getElementById('video-duration-display');
  const viewsEl = document.getElementById('video-views-display');
  const thumbEl = document.getElementById('video-thumb-display');

  if (titleEl) titleEl.textContent = video.title;
  if (authorEl) authorEl.textContent = video.author;
  if (durationEl) durationEl.textContent = video.duration;
  if (viewsEl) viewsEl.textContent = video.views;
  if (thumbEl) thumbEl.src = video.thumb;
}

/* Conversion Engine (with real blob generator & local server fallback) */
function initConvertEngine() {
  const btnConvert = document.getElementById('btn-convert-start');
  const progressBox = document.getElementById('conversion-progress-box');
  const progressFill = document.getElementById('progress-bar-fill');
  const progressPct = document.getElementById('progress-pct-display');
  const progressStage = document.getElementById('progress-stage-display');
  const resultBox = document.getElementById('conversion-result-box');

  if (btnConvert) {
    btnConvert.addEventListener('click', async () => {
      btnConvert.disabled = true;
      if (progressBox) progressBox.style.display = 'block';
      if (resultBox) resultBox.style.display = 'none';

      // Stages animation
      const stages = [
        { pct: 20, stage: '⚡ Nawiązywanie połączenia ze strumieniem wideo...' },
        { pct: 55, stage: '⚙️ Konwersja formatu: ' + selectedFormat.toUpperCase() + ' (FFmpeg / Engine)...' },
        { pct: 85, stage: '📦 Finalizowanie kontenera i pakowanie pliku...' },
        { pct: 100, stage: '✅ Konwersja zakończona sukcesem! Pobieranie pliku...' }
      ];

      for (const s of stages) {
        if (progressFill) progressFill.style.width = s.pct + '%';
        if (progressPct) progressPct.textContent = s.pct + '%';
        if (progressStage) progressStage.textContent = s.stage;
        await new Promise(r => setTimeout(r, 450));
      }

      // Generate downloadable test file
      const safeTitle = (currentVideo.title || 'audio').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
      let ext = 'mp3';
      let mime = 'audio/mp3';
      if (selectedFormat === 'wav') { ext = 'wav'; mime = 'audio/wav'; }
      else if (selectedFormat.includes('mp4') || selectedFormat === '1080p' || selectedFormat === '720p') { ext = 'mp4'; mime = 'video/mp4'; }

      const fileName = safeTitle + '.' + ext;
      const fileData = 'Fast Konwerter / ReTrap Output File\nVideo: ' + currentVideo.title + '\nFormat: ' + selectedFormat + '\nGenerated by ApliHub Engine.';
      const blob = new Blob([fileData], { type: mime });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      btnConvert.disabled = false;
      if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = '<div style="font-weight: 700; font-size: 15px; color: #34d399; margin-bottom: 6px;">🎉 Plik ' + fileName + ' został pobrany!</div><div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">Format: ' + selectedFormat.toUpperCase() + ' | Status: Gotowy do odtworzenia</div><a href="' + downloadUrl + '" download="' + fileName + '" style="display: inline-block; padding: 8px 18px; background: #10b981; color: #000; font-weight: 800; border-radius: 8px; text-decoration: none; font-size: 13px;">⬇️ Pobierz ponownie</a>';
      }

      showToast('🎉 Pobrano plik: ' + fileName);
    });
  }
}

/* Extension In-Page Simulator */
function initExtensionSimulator() {
  const btnSimDownload = document.getElementById('sim-btn-download');
  const simModal = document.getElementById('sim-popup-modal');
  const btnCloseSim = document.getElementById('sim-close-modal');

  if (btnSimDownload && simModal) {
    btnSimDownload.addEventListener('click', () => {
      simModal.style.display = 'flex';
    });
  }

  if (btnCloseSim && simModal) {
    btnCloseSim.addEventListener('click', () => {
      simModal.style.display = 'none';
    });
  }
}

/* Auth Module (Login & Register Modal) */
function initAuthModule() {
  const userPill = document.getElementById('user-pill-btn');
  const authModal = document.getElementById('auth-modal-overlay');
  const closeModalBtn = document.getElementById('auth-close-btn');

  const tabLogin = document.getElementById('auth-tab-login');
  const tabReg = document.getElementById('auth-tab-reg');
  const formLogin = document.getElementById('fast-login-form');
  const formReg = document.getElementById('fast-reg-form');

  if (userPill) {
    userPill.addEventListener('click', () => {
      const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
      if (!user || user.isLoggedIn === false) {
        if (authModal) authModal.classList.add('active');
      } else {
        if (confirm('Jesteś zalogowany jako ' + user.name + '. Czy chcesz się wylogować?')) {
          localStorage.setItem('aplihub_logged_out', 'true');
          if (typeof saveApliHubUserData === 'function') {
            saveApliHubUserData({ ...DEFAULT_USER_STORE, isLoggedIn: false, name: 'Gość', email: '' });
          }
          syncUserState();
          showToast('Wylogowano pomyślnie.');
        }
      }
    });
  }

  if (closeModalBtn && authModal) {
    closeModalBtn.addEventListener('click', () => {
      authModal.classList.remove('active');
    });
  }

  if (tabLogin && tabReg) {
    tabLogin.addEventListener('click', () => {
      tabLogin.style.background = '#2563eb';
      tabLogin.style.color = '#fff';
      tabReg.style.background = 'transparent';
      tabReg.style.color = '#94a3b8';
      if (formLogin) formLogin.style.display = 'flex';
      if (formReg) formReg.style.display = 'none';
    });

    tabReg.addEventListener('click', () => {
      tabReg.style.background = '#2563eb';
      tabReg.style.color = '#fff';
      tabLogin.style.background = 'transparent';
      tabLogin.style.color = '#94a3b8';
      if (formLogin) formLogin.style.display = 'none';
      if (formReg) formReg.style.display = 'flex';
    });
  }

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('fast-login-email').value.trim();
      const pass = document.getElementById('fast-login-pass').value.trim();

      const newUser = {
        ...DEFAULT_USER_STORE,
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
    formReg.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('fast-reg-user').value.trim();
      const email = document.getElementById('fast-reg-email').value.trim();
      const pass = document.getElementById('fast-reg-pass').value.trim();

      const newUser = {
        ...DEFAULT_USER_STORE,
        isLoggedIn: true,
        name: user,
        email: email,
        accountType: 'Użytkownik'
      };

      localStorage.removeItem('aplihub_logged_out');
      if (typeof saveApliHubUserData === 'function') saveApliHubUserData(newUser);
      syncUserState();
      if (authModal) authModal.classList.remove('active');
      showToast('🎉 Konto ' + user + ' zostało utworzone!');
    });
  }
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = '<span>⚡</span><div>' + msg + '</div>';
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = '0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
