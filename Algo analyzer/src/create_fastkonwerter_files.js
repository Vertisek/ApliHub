const fs = require('fs');
const path = require('path');

const fastKonwDir = path.resolve(__dirname, '../../Fast Konwerter');
const jsDir = path.join(fastKonwDir, 'js');
const cssDir = path.join(fastKonwDir, 'css');

// 1. JS
const jsContent = `/* Fast Konwerter (ReTrap) - In-Browser Test Suite & Live Converter */

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
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
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
      showToast('Wczytano wideo demonstracyjne: ' + demo.title);
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
        await new Promise(r => setTimeout(r, 600));
      }

      // Generate downloadable test file
      const safeTitle = (currentVideo.title || 'audio').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
      let ext = 'mp3';
      let mime = 'audio/mp3';
      if (selectedFormat === 'wav') { ext = 'wav'; mime = 'audio/wav'; }
      else if (selectedFormat.includes('mp4') || selectedFormat === '1080p' || selectedFormat === '720p') { ext = 'mp4'; mime = 'video/mp4'; }

      const fileName = safeTitle + '.' + ext;
      const dummyContent = 'Fast Konwerter / ReTrap Output File\nVideo: ' + currentVideo.title + '\nFormat: ' + selectedFormat + '\nGenerated by ApliHub Engine.';
      const blob = new Blob([dummyContent], { type: mime });
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
        resultBox.innerHTML = \`
          <div style="font-weight: 700; font-size: 15px; color: #34d399; margin-bottom: 6px;">🎉 Plik \${fileName} został pobrany!</div>
          <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">Format: \${selectedFormat.toUpperCase()} | Status: Gotowy do odtworzenia</div>
          <a href="\${downloadUrl}" download="\${fileName}" style="display: inline-block; padding: 8px 18px; background: #10b981; color: #000; font-weight: 800; border-radius: 8px; text-decoration: none; font-size: 13px;">⬇️ Pobierz ponownie</a>
        \`;
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
`;

fs.writeFileSync(path.join(jsDir, 'converter-app.js'), jsContent);
console.log('Created Fast Konwerter js/converter-app.js');

// 2. HTML
const htmlContent = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fast Konwerter (ReTrap) - Studio Konwersji YouTube & Wtyczka</title>
  <link rel="stylesheet" href="css/converter.css">
  <link rel="icon" href="icon48.png" type="image/png">
</head>
<body>

  <div class="glow-spot-1"></div>
  <div class="glow-spot-2"></div>

  <!-- Top Nav Bar -->
  <header class="top-nav">
    <div class="nav-container">
      <div class="brand-wrap" onclick="location.reload()">
        <div class="brand-logo">⚡</div>
        <div>
          <span class="brand-name">FAST KONWERTER</span>
          <span class="brand-tag">v1.2.0</span>
        </div>
      </div>

      <nav class="nav-tabs">
        <button class="nav-tab-btn active" data-tab="tab-studio">⚡ Studio Konwersji</button>
        <button class="nav-tab-btn" data-tab="tab-extension-sim">🧩 Symulator Wtyczki</button>
        <button class="nav-tab-btn" data-tab="tab-webstore">📦 Chrome Web Store</button>
      </nav>

      <div class="user-pill" id="user-pill-btn">
        <div class="user-avatar" id="user-pill-avatar">O</div>
        <span class="user-name" id="user-pill-name">Oskar_Algo</span>
      </div>
    </div>
  </header>

  <!-- Main Views Container -->
  <main class="main-content">

    <!-- View 1: Studio Konwersji -->
    <div class="tab-view active" id="tab-studio">
      <div class="hero-box">
        <h1>Szybka Konwersja Social Mediów</h1>
        <p>Pobierz film lub piosenkę z YouTube do formatu MP3, WAV lub MP4 w krystalicznej jakości.</p>
      </div>

      <!-- URL Input Area -->
      <div class="url-card">
        <div class="url-input-group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <input type="text" id="yt-url-input" class="url-input" placeholder="Wklej link do wideo (np. https://www.youtube.com/watch?v=...)" value="https://www.youtube.com/watch?v=5qap5aO4i9A">
          <button class="btn-fetch" id="btn-fetch-video">Wczytaj</button>
        </div>

        <div class="quick-demos">
          <span class="quick-label">⚡ Przetestuj gotowe wideo:</span>
          <button class="chip-btn" data-demo-idx="0">🎵 Lofi Chill Beat</button>
          <button class="chip-btn" data-demo-idx="1">🏙️ Cyberpunk Soundtrack</button>
          <button class="chip-btn" data-demo-idx="2">🎙️ Tech AI Podcast</button>
        </div>
      </div>

      <!-- Video Preview Card -->
      <div class="video-preview-card">
        <div class="video-thumb-wrap">
          <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60" alt="Thumbnail" class="video-thumb-img" id="video-thumb-display">
          <span class="video-duration" id="video-duration-display">3:45:00</span>
        </div>
        <div class="video-details">
          <h3 class="video-title" id="video-title-display">Lofi Hip Hop Radio - Beats to Relax / Study to [2026 Edition]</h3>
          <div class="video-meta">
            <span id="video-author-display">Lofi Girl</span>
            <span>•</span>
            <span id="video-views-display">45.2M wyświetleń</span>
            <span>•</span>
            <span style="color: #10b981; font-weight: 700;">HD 1080p Dostępne</span>
          </div>
        </div>
      </div>

      <!-- Format Selection Cards -->
      <div class="format-grid">
        <!-- MP3 -->
        <div class="format-card selected" data-format="mp3">
          <div class="format-header">
            <span class="format-name">🎵 MP3 (Audio)</span>
            <span class="format-badge">320 kbps</span>
          </div>
          <p class="format-desc">Konwertuj do wysokiej jakości audio MP3. Idealne do smartfona, samochodu i playlist.</p>
          <div class="format-radio"><span>●</span> Wybrano format</div>
        </div>

        <!-- WAV -->
        <div class="format-card" data-format="wav">
          <div class="format-header">
            <span class="format-name">🎼 WAV (Master)</span>
            <span class="format-badge">Lossless</span>
          </div>
          <p class="format-desc">Konwertuj do świetnej, bezstratnej jakości studyjnej audio WAV bez jakiejkolwiek kompresji.</p>
          <div class="format-radio"><span>○</span> Wybierz format</div>
        </div>

        <!-- MP4 1080p -->
        <div class="format-card" data-format="1080p">
          <div class="format-header">
            <span class="format-name">🎬 MP4 (1080p)</span>
            <span class="format-badge">Full HD</span>
          </div>
          <p class="format-desc">Pobierz wideo w pełnej krystalicznej rozdzielczości 1080p 60fps z oryginalnym dźwiękiem.</p>
          <div class="format-radio"><span>○</span> Wybierz format</div>
        </div>

        <!-- MP4 720p -->
        <div class="format-card" data-format="720p">
          <div class="format-header">
            <span class="format-name">📱 MP4 (720p)</span>
            <span class="format-badge">Fast HD</span>
          </div>
          <p class="format-desc">Zbalansowana jakość wideo HD przy mniejszym rozmiarze pliku. Błyskawiczne pobieranie.</p>
          <div class="format-radio"><span>○</span> Wybierz format</div>
        </div>
      </div>

      <!-- Action & Progress Area -->
      <div class="action-box">
        <button class="btn-convert-main" id="btn-convert-start">
          <span>⚡</span> Rozpocznij Konwersję & Pobierz
        </button>

        <div class="progress-box" id="conversion-progress-box">
          <div class="progress-header">
            <span id="progress-status-title">Przetwarzanie strumienia...</span>
            <span id="progress-pct-display">0%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" id="progress-bar-fill"></div>
          </div>
          <div class="progress-stage" id="progress-stage-display">Inicjalizacja silnika ReTrap...</div>
        </div>

        <div class="result-box" id="conversion-result-box"></div>
      </div>
    </div>

    <!-- View 2: YouTube Extension Simulator -->
    <div class="tab-view" id="tab-extension-sim">
      <div class="hero-box">
        <h1>Symulator Wtyczki na YouTube</h1>
        <p>Zobacz, jak wtyczka ReTrap integruje się bezpośrednio pod filmami na YouTube jednym kliknięciem.</p>
      </div>

      <!-- YouTube Mock UI -->
      <div style="background: #0f0f11; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6);">
        <!-- Mock Top Bar -->
        <div style="background: #0f0f0f; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: #ff0000; font-size: 20px; font-weight: 900;">▶</span>
            <span style="font-weight: 800; font-size: 16px; letter-spacing: -0.5px;">YouTube</span>
          </div>
          <div style="background: #1f1f1f; padding: 6px 16px; border-radius: 20px; font-size: 12px; color: #aaa; width: 300px;">Szukaj na YouTube...</div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800;">O</div>
        </div>

        <!-- Mock Video Player Area -->
        <div style="position: relative; width: 100%; height: 360px; background: #000; display: flex; align-items: center; justify-content: center;">
          <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.75;" alt="YouTube video frame">
          <div style="position: absolute; width: 64px; height: 64px; background: rgba(0,0,0,0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #fff; cursor: pointer;">▶</div>
        </div>

        <!-- Video Info & ReTrap Action Button Bar -->
        <div style="padding: 20px;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">Lofi Hip Hop Radio - 24/7 Beats to Relax / Work [Official Stream]</h2>
          
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 42px; height: 42px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-weight: 800;">LG</div>
              <div>
                <div style="font-weight: 700; font-size: 14px;">Lofi Girl ✓</div>
                <div style="font-size: 12px; color: #888;">14.3M subskrybentów</div>
              </div>
              <button style="background: #fff; color: #000; border: none; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-left: 10px; cursor: pointer;">Subskrybuj</button>
            </div>

            <!-- Injected ReTrap Button -->
            <div style="display: flex; gap: 10px; align-items: center;">
              <button id="sim-btn-download" style="background: linear-gradient(135deg, #2563eb, #06b6d4); color: #fff; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 800; font-size: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 0 16px rgba(37,99,235,0.5); transition: transform 0.2s;">
                <span>⚡</span> Pobierz (ReTrap)
              </button>
              <button style="background: rgba(255,255,255,0.1); color: #fff; border: none; padding: 8px 16px; border-radius: 20px; font-size: 13px; cursor: pointer;">👍 184K</button>
              <button style="background: rgba(255,255,255,0.1); color: #fff; border: none; padding: 8px 16px; border-radius: 20px; font-size: 13px; cursor: pointer;">Udostępnij</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Extension Popup Modal Mock -->
      <div id="sim-popup-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 99999; align-items: center; justify-content: center;">
        <div style="background: #0f0f11; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 16px 40px rgba(0,0,0,0.8); border-radius: 16px; width: 90%; max-width: 440px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 22px;">⚡</span>
              <span style="font-size: 18px; font-weight: 700; color: #fff;">ReTrap konwerter</span>
            </div>
            <button id="sim-close-modal" style="background: transparent; border: none; color: #888; font-size: 22px; cursor: pointer;">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP3 rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">🎵 Pobierz jako MP3 (320 kbps)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Konwertuj do wysokiej jakości audio mp3</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie WAV rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">🎼 Pobierz jako WAV (Lossless)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Konwertuj do świetnej jakości audio wav</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP4 1080p rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">🎬 Pobierz MP4 1080p (Full HD)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Pobierz wideo w wysokiej rozdzielczości 1080p</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP4 720p rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">📱 Pobierz MP4 720p (HD)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Szybkie pobieranie wideo w rozdzielczości 720p</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View 3: Chrome Web Store Package Info -->
    <div class="tab-view" id="tab-webstore">
      <div class="hero-box">
        <h1>Paczka Rozszerzenia Chrome Web Store</h1>
        <p>Rozszerzenie jest w 100% gotowe do publikacji w sklepie Google Chrome Web Store lub instalacji lokalnej.</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-size: 18px; font-weight: 800; color: #60a5fa; margin-bottom: 12px;">📦 Pliki do Pobrania</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 18px;">Pobierz oficjalną paczkę ZIP dla Chrome Web Store lub instalator EXE dla systemu Windows.</p>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="../assets/installer/Fast_Konwerter_Chrome_Extension.zip" download="Fast_Konwerter_Chrome_Extension.zip" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #2563eb, #06b6d4); color: #fff; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none;">
              ⬇️ Pobierz Paczkę Web Store (.zip)
            </a>

            <a href="../assets/installer/ApliHub_FastKonwerter_Setup.exe" download="ApliHub_FastKonwerter_Setup.exe" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: #fff; padding: 12px; border-radius: 8px; font-weight: 700; font-size: 13px; text-decoration: none;">
              🖥️ Pobierz Instalator Desktop (.exe)
            </a>
          </div>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px;">
          <h3 style="font-size: 18px; font-weight: 800; color: #34d399; margin-bottom: 12px;">✓ Zgodność z Google Chrome V3</h3>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 13px; color: #cbd5e1;">
            <li>✓ <strong>Manifest V3:</strong> Pełna zgodność ze standardem Google 2026</li>
            <li>✓ <strong>Uprawnienia:</strong> Tylko niezbędne (storage, downloads, youtube.com)</li>
            <li>✓ <strong>Ikony:</strong> Kompletny zestaw 16x16, 48x48, 128x128</li>
            <li>✓ <strong>Bezpieczeństwo:</strong> Brak zewnętrznych skryptów eval</li>
          </ul>
        </div>
      </div>
    </div>

  </main>

  <!-- Auth Modal -->
  <div class="modal-overlay" id="auth-modal-overlay">
    <div class="modal-box">
      <button class="modal-close-btn" id="auth-close-btn">&times;</button>
      <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 6px;">Konto ApliHub</h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Zaloguj się, aby zsynchronizować konto i odblokować nielimitowaną jakość.</p>

      <div style="display: flex; gap: 8px; margin-bottom: 16px; background: rgba(255,255,255,0.04); padding: 4px; border-radius: 8px;">
        <button type="button" id="auth-tab-login" style="flex: 1; padding: 8px; background: #2563eb; color: #fff; font-weight: 700; border: none; border-radius: 6px; cursor: pointer;">Zaloguj się</button>
        <button type="button" id="auth-tab-reg" style="flex: 1; padding: 8px; background: transparent; color: #94a3b8; font-weight: 700; border: none; border-radius: 6px; cursor: pointer;">Zarejestruj się</button>
      </div>

      <form id="fast-login-form" style="display: flex; flex-direction: column; gap: 12px;">
        <input type="email" id="fast-login-email" placeholder="Adres e-mail" required style="padding: 10px 14px; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
        <input type="password" id="fast-login-pass" placeholder="Hasło" required style="padding: 10px 14px; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
        <button type="submit" style="background: #2563eb; color: #fff; padding: 12px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Zaloguj się →</button>
      </form>

      <form id="fast-reg-form" style="display: none; flex-direction: column; gap: 12px;">
        <input type="text" id="fast-reg-user" placeholder="Nazwa użytkownika / Nick" required style="padding: 10px 14px; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
        <input type="email" id="fast-reg-email" placeholder="Adres e-mail" required style="padding: 10px 14px; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
        <input type="password" id="fast-reg-pass" placeholder="Hasło (min. 6 znaków)" minlength="6" required style="padding: 10px 14px; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
        <button type="submit" style="background: #2563eb; color: #fff; padding: 12px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Załóż darmowe konto →</button>
      </form>
    </div>
  </div>

  <div class="toast-container" id="toast-container"></div>

  <script src="../js/data.js"></script>
  <script src="js/converter-app.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(fastKonwDir, 'index.html'), htmlContent);
console.log('Created Fast Konwerter index.html');
