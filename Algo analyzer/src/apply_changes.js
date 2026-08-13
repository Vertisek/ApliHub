const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const fastKonwDir = path.join(rootDir, 'Fast Konwerter');
const cssDir = path.join(fastKonwDir, 'css');
const jsDir = path.join(fastKonwDir, 'js');

// 1. Update manifest.json
const manifestPath = path.join(fastKonwDir, 'manifest.json');
const manifest = {
  "manifest_version": 3,
  "name": "ReTrap konwerter",
  "version": "1.0",
  "description": "Szybki konwerter wideo z YouTube, TikTok i Instagram do formatów MP3, WAV, MP4 1080p oraz MP4 720p w wysokiej jakości.",
  "permissions": [
    "storage",
    "downloads"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "*://*.youtube.com/*",
        "*://*.tiktok.com/*",
        "*://*.instagram.com/*",
        "*://*.twitter.com/*",
        "*://*.x.com/*",
        "*://*.facebook.com/*"
      ],
      "js": [
        "content.js"
      ],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
};
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log('[SUCCESS] Updated manifest.json with multi-platform matches.');

// 2. Update content.js to inject modern techno buttons without emojis across social platforms
let contentJs = fs.readFileSync(path.join(fastKonwDir, 'content.js'), 'utf8');

// Ensure content.js includes custom techno button injection
const technoInjectorCode = `
// ==========================================================================
// RETRAP MULTI-PLATFORM TECHNO BUTTON INJECTOR
// ==========================================================================

function createTechnoButton(platform) {
  const btn = document.createElement('button');
  btn.className = 'retrap-techno-btn retrap-techno-' + platform;
  btn.setAttribute('data-retrap-injected', 'true');
  btn.setAttribute('type', 'button');
  btn.setAttribute('title', 'Pobierz przez ReTrap');

  btn.innerHTML = \`
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #60a5fa; flex-shrink: 0;">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    <span>Pobierz</span>
  \`;

  btn.style.cssText = \`
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #0e1118;
    color: #f1f5f9;
    border: 1px solid rgba(59, 130, 246, 0.45);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    cursor: pointer;
    box-shadow: 0 0 12px rgba(37, 99, 235, 0.25);
    transition: all 0.2s ease;
    user-select: none;
    z-index: 999;
    margin: 0 4px;
  \`;

  btn.addEventListener('mouseenter', () => {
    btn.style.background = '#151b28';
    btn.style.borderColor = '#3b82f6';
    btn.style.boxShadow = '0 0 16px rgba(59, 130, 246, 0.5)';
    btn.style.transform = 'translateY(-1px)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.background = '#0e1118';
    btn.style.borderColor = 'rgba(59, 130, 246, 0.45)';
    btn.style.boxShadow = '0 0 12px rgba(37, 99, 235, 0.25)';
    btn.style.transform = 'none';
  });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openReTrapModal();
  });

  return btn;
}

function injectTechnoButtons() {
  const host = window.location.hostname.toLowerCase();

  // 1. YouTube
  if (host.includes('youtube.com') && window.location.href.includes('watch?v=')) {
    const actionsContainer = document.querySelector('#actions-inner #menu ytd-menu-renderer, #top-level-buttons-computed');
    if (actionsContainer && !actionsContainer.querySelector('[data-retrap-injected="true"]')) {
      const btn = createTechnoButton('youtube');
      actionsContainer.prepend(btn);
    }
  }

  // 2. TikTok
  if (host.includes('tiktok.com')) {
    const actionBars = document.querySelectorAll('[data-e2e="feed-video-action-bar"], [class*="DivActionItemContainer"], [class*="ActionBarWrapper"]');
    actionBars.forEach(bar => {
      if (!bar.querySelector('[data-retrap-injected="true"]')) {
        const btn = createTechnoButton('tiktok');
        btn.style.borderRadius = '8px';
        btn.style.padding = '6px 12px';
        bar.appendChild(btn);
      }
    });
  }

  // 3. Instagram
  if (host.includes('instagram.com')) {
    const actionBars = document.querySelectorAll('section [role="button"], article section, [class*="x126k92a"]');
    actionBars.forEach(bar => {
      if (bar.tagName === 'SECTION' && !bar.querySelector('[data-retrap-injected="true"]')) {
        const btn = createTechnoButton('instagram');
        btn.style.padding = '6px 12px';
        bar.appendChild(btn);
      }
    });
  }
}

setInterval(injectTechnoButtons, 1200);
`;

if (!contentJs.includes('createTechnoButton')) {
  contentJs += '\n' + technoInjectorCode;
  fs.writeFileSync(path.join(fastKonwDir, 'content.js'), contentJs, 'utf8');
  console.log('[SUCCESS] Updated content.js with multi-platform techno buttons without emojis.');
}

// 3. Update converter.css
const cssContent = `/* Fast Konwerter (ReTrap) - Dark Techno Cyberpunk Theme */
:root {
  --bg-primary: #0a0a0c;
  --bg-secondary: #121318;
  --bg-card: #14161f;
  --bg-card-hover: #1b1e2a;
  --accent-blue: #3b82f6;
  --accent-cyan: #06b6d4;
  --accent-blue-glow: rgba(59, 130, 246, 0.35);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(59, 130, 246, 0.5);
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --font-main: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-main);
  font-family: var(--font-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* Background Atmosphere */
.glow-spot-1 {
  position: fixed;
  top: -100px;
  left: 20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.glow-spot-2 {
  position: fixed;
  bottom: -150px;
  right: 10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Header */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 14px 24px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
}

.brand-logo-img {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 0 14px var(--accent-blue-glow);
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #fff;
}

.nav-tabs {
  display: flex;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.nav-tab-btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.nav-tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-tab-btn.active {
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.4);
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  padding: 6px 14px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-pill:hover {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
  color: #fff;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

/* Main Container */
.main-content {
  max-width: 900px;
  width: 100%;
  margin: 35px auto;
  padding: 0 20px 60px;
  position: relative;
  z-index: 1;
  flex: 1;
}

/* Tab Views */
.tab-view {
  display: none;
  animation: fadeIn 0.3s ease;
}

.tab-view.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hero Titles */
.hero-box {
  text-align: center;
  margin-bottom: 28px;
}

.hero-box h1 {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 40%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.hero-box p {
  color: var(--text-muted);
  font-size: 14px;
}

/* Single Sleek Conversion Studio Bar */
.studio-bar-container {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
  margin-top: 10px;
}

.studio-input-bar {
  display: flex;
  gap: 12px;
  background: #0c0d12;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 8px 8px 8px 16px;
  align-items: center;
  transition: all 0.2s ease;
}

.studio-input-bar:focus-within {
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
}

.studio-url-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.studio-status-msg {
  flex: 1;
  color: #60a5fa;
  font-size: 14px;
  font-weight: 600;
  display: none;
  align-items: center;
  gap: 8px;
}

.format-select {
  background: #181b24;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.format-select:focus {
  border-color: var(--accent-blue);
}

.btn-techno-action {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  padding: 11px 26px;
  border-radius: var(--radius-sm);
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
  text-decoration: none;
}

.btn-techno-action:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
  transform: translateY(-1px);
}

.btn-techno-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Blue Progress Bar */
.studio-progress-wrap {
  display: none;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 8px;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: #090a0f;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.progress-fill-blue {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #2563eb, #06b6d4);
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.5);
  transition: width 0.2s ease;
}

.error-message-box {
  display: none;
  margin-top: 14px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-sm);
  color: #f87171;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

/* Full Width Chrome Web Store & Download Guide Layout */
.downloads-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.download-cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.download-card-box {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.download-card-box h3 {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}

.download-card-box p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 20px;
}

.guide-box {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.guide-title {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.guide-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-col h4 {
  font-size: 15px;
  font-weight: 800;
  color: #60a5fa;
}

.guide-steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.guide-step-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.4;
}

.step-number {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.4);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Simulator Platform Tabs */
.sim-platform-nav {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: center;
}

.sim-nav-btn {
  padding: 7px 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.sim-nav-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.sim-nav-btn.active {
  background: #2563eb;
  color: #fff;
  border-color: #3b82f6;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.4);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.modal-box {
  background: #12131a;
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  border-radius: var(--radius-lg);
  padding: 24px;
  width: 90%;
  max-width: 440px;
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 24px;
  cursor: pointer;
}

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10000;
}

.toast {
  background: #181a22;
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #fff;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
`;

fs.writeFileSync(path.join(cssDir, 'converter.css'), cssContent, 'utf8');
console.log('[SUCCESS] Updated converter.css');

// 4. Update Fast Konwerter index.html
const htmlContent = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fast Konwerter (ReTrap) - Twój Szybki i Darmowy Konwerter</title>
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
        <img src="icon48.png" alt="ReTrap Logo" class="brand-logo-img">
        <span class="brand-name">FAST KONWERTER</span>
      </div>

      <nav class="nav-tabs">
        <button class="nav-tab-btn active" data-tab="tab-studio">Studio Konwersji</button>
        <button class="nav-tab-btn" data-tab="tab-extension-sim">Symulator Wtyczki</button>
        <button class="nav-tab-btn" data-tab="tab-webstore">Pobierz i Wgraj</button>
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
        <h1>Twój szybki i darmowy konwerter</h1>
        <p>Wklej link z YouTube, TikToka lub Instagrama, wybierz format i pobierz gotowy plik.</p>
      </div>

      <!-- Studio Input Bar Box -->
      <div class="studio-bar-container">
        <div class="studio-input-bar">
          <input type="text" id="yt-url-input" class="studio-url-input" placeholder="Wklej link do wideo (np. https://www.youtube.com/watch?v=...)" value="https://www.youtube.com/watch?v=5qap5aO4i9A">
          
          <div id="studio-status-msg" class="studio-status-msg">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#60a5fa" stroke-width="2.5" fill="none">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Konwersja w toku... proszę czekać.</span>
          </div>

          <select id="format-select-dropdown" class="format-select">
            <option value="mp3">MP3 (320 kbps)</option>
            <option value="wav">WAV (Studyjny Master)</option>
            <option value="1080p">MP4 (1080p Full HD)</option>
            <option value="720p">MP4 (720p HD)</option>
          </select>

          <button class="btn-techno-action" id="btn-convert-action">
            Konwertuj
          </button>
        </div>

        <!-- Blue Progress Bar -->
        <div class="studio-progress-wrap" id="studio-progress-wrap">
          <div class="progress-info">
            <span id="progress-stage-text">Przetwarzanie strumienia...</span>
            <span id="progress-pct-text">0%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill-blue" id="progress-fill-blue"></div>
          </div>
        </div>

        <!-- Error box if failed -->
        <div class="error-message-box" id="studio-error-box">
          Nie udało się pobrać strumienia wideo. Sprawdź poprawność linku i spróbuj ponownie.
        </div>
      </div>
    </div>

    <!-- View 2: YouTube & Socials Extension Simulator -->
    <div class="tab-view" id="tab-extension-sim">
      <div class="hero-box">
        <h1>Symulator Wtyczki na Social Mediach</h1>
        <p>Wybierz platformę i zobacz jak przyjemny przycisk techno integruje się bezpośrednio pod postami i filmami.</p>
      </div>

      <!-- Platform Switcher -->
      <div class="sim-platform-nav">
        <button class="sim-nav-btn active" data-platform="yt">YouTube</button>
        <button class="sim-nav-btn" data-platform="tt">TikTok</button>
        <button class="sim-nav-btn" data-platform="ig">Instagram</button>
      </div>

      <!-- Mock Container -->
      <div id="sim-platform-content" style="background: #0f0f11; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.6);">
        <!-- Dynamically rendered by converter-app.js -->
      </div>

      <!-- Extension Popup Modal Mock -->
      <div id="sim-popup-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 99999; align-items: center; justify-content: center;">
        <div style="background: #0f0f11; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 16px 40px rgba(0,0,0,0.8); border-radius: 16px; width: 90%; max-width: 440px; padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="icon48.png" alt="ReTrap Logo" style="width: 24px; height: 24px; border-radius: 6px;">
              <span style="font-size: 18px; font-weight: 700; color: #fff;">ReTrap konwerter</span>
            </div>
            <button id="sim-close-modal" style="background: transparent; border: none; color: #888; font-size: 22px; cursor: pointer;">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP3 rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">Pobierz jako MP3 (320 kbps)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Konwertuj do wysokiej jakości audio mp3</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie WAV rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">Pobierz jako WAV (Studyjny Master)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Konwertuj do świetnej bezstratnej jakości audio wav</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP4 1080p rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">Pobierz MP4 1080p (Full HD)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Pobierz wideo w wysokiej rozdzielczości 1080p</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP4 720p rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">Pobierz MP4 720p (HD)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Szybkie pobieranie wideo w rozdzielczości 720p</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View 3: Chrome Web Store & Download Guide -->
    <div class="tab-view" id="tab-webstore">
      <div class="hero-box">
        <h1>Pobierz i wgraj darmowy konwerter do swojej przeglądarki!</h1>
        <p>Ułatw sobie pobieranie materiałów z sociali jedną instalacją.</p>
      </div>

      <div class="downloads-container">
        <!-- Download Cards Row across full width -->
        <div class="download-cards-row">
          <!-- Card 1: EXE -->
          <div class="download-card-box">
            <div>
              <h3>Plik Wykonywalny (.EXE)</h3>
              <p>Automatyczny instalator dla systemu Windows. Błyskawiczna instalacja jednym kliknięciem.</p>
            </div>
            <a href="../assets/installer/ApliHub_FastKonwerter_Setup.exe" download="ApliHub_FastKonwerter_Setup.exe" class="btn-techno-action" style="text-decoration: none; width: 100%;">
              Pobierz Instalator .EXE
            </a>
          </div>

          <!-- Card 2: ZIP -->
          <div class="download-card-box">
            <div>
              <h3>Paczka Rozszerzenia (.ZIP)</h3>
              <p>Oficjalna paczka rozszerzenia dla przeglądarek Google Chrome, Brave, Microsoft Edge oraz Opera.</p>
            </div>
            <a href="../assets/installer/Fast_Konwerter_Chrome_Extension.zip" download="Fast_Konwerter_Chrome_Extension.zip" class="btn-techno-action" style="text-decoration: none; width: 100%; background: linear-gradient(135deg, #0ea5e9, #0284c7);">
              Pobierz Paczkę .ZIP
            </a>
          </div>
        </div>

        <!-- Step-by-Step Installation Guide -->
        <div class="guide-box">
          <div class="guide-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Instrukcja wgrania konwertera do przeglądarki</span>
          </div>

          <div class="guide-grid">
            <!-- Col 1: Instrukcja EXE -->
            <div class="guide-col">
              <h4>Opcja 1: Instalacja z pliku .EXE</h4>
              <ul class="guide-steps">
                <li class="guide-step-item">
                  <span class="step-number">1</span>
                  <span>Pobierz plik <strong>ApliHub_FastKonwerter_Setup.exe</strong> za pomocą przycisku powyżej.</span>
                </li>
                <li class="guide-step-item">
                  <span class="step-number">2</span>
                  <span>Uruchom pobrany plik instalatora (kliknij dwukrotnie w plik .exe).</span>
                </li>
                <li class="guide-step-item">
                  <span class="step-number">3</span>
                  <span>Kliknij przycisk „Zainstaluj w Chrome” lub „Uruchom Konwerter”. Gotowe!</span>
                </li>
              </ul>
            </div>

            <!-- Col 2: Instrukcja ZIP -->
            <div class="guide-col">
              <h4>Opcja 2: Instalacja z paczki .ZIP (Chrome / Edge / Brave / Opera)</h4>
              <ul class="guide-steps">
                <li class="guide-step-item">
                  <span class="step-number">1</span>
                  <span>Pobierz paczkę <strong>Fast_Konwerter_Chrome_Extension.zip</strong> i rozpakuj ją do wybranego folderu.</span>
                </li>
                <li class="guide-step-item">
                  <span class="step-number">2</span>
                  <span>Wpisz w pasku adresu przeglądarki <code>chrome://extensions/</code> (lub <code>edge://extensions/</code>).</span>
                </li>
                <li class="guide-step-item">
                  <span class="step-number">3</span>
                  <span>Włącz przełącznik <strong>„Tryb programisty”</strong> (Developer mode) w prawym górnym rogu.</span>
                </li>
                <li class="guide-step-item">
                  <span class="step-number">4</span>
                  <span>Kliknij przycisk <strong>„Załaduj rozpakowane”</strong> (Load unpacked) i wskaż rozpakowany folder.</span>
                </li>
                <li class="guide-step-item">
                  <span class="step-number">5</span>
                  <span>Gotowe! Przycisk „Pobierz” pojawi się bezpośrednio na YouTube, TikToku i Instagramie.</span>
                </li>
              </ul>
            </div>
          </div>
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
        <button type="submit" style="background: #2563eb; color: #fff; padding: 12px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Zaloguj się</button>
      </form>

      <form id="fast-reg-form" style="display: none; flex-direction: column; gap: 12px;">
        <input type="text" id="fast-reg-user" placeholder="Nazwa użytkownika / Nick" required style="padding: 10px 14px; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
        <input type="email" id="fast-reg-email" placeholder="Adres e-mail" required style="padding: 10px 14px; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
        <input type="password" id="fast-reg-pass" placeholder="Hasło (min. 6 znaków)" minlength="6" required style="padding: 10px 14px; background: #0f1015; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff;">
        <button type="submit" style="background: #2563eb; color: #fff; padding: 12px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Załóż darmowe konto</button>
      </form>
    </div>
  </div>

  <div class="toast-container" id="toast-container"></div>

  <script src="../js/data.js"></script>
  <script src="js/converter-app.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(fastKonwDir, 'index.html'), htmlContent, 'utf8');
console.log('[SUCCESS] Updated Fast Konwerter index.html');

// 5. Update converter-app.js
const jsContent = `/* Fast Konwerter (ReTrap) - In-Browser Test Suite & Live Converter */

let conversionState = 'idle'; // 'idle' | 'converting' | 'completed' | 'error'
let activeDownloadBlobUrl = null;
let activeDownloadFileName = '';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initStudioConverter();
  initExtensionSimulator();
  initAuthModule();
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

/* Studio Converter Logic */
function initStudioConverter() {
  const urlInput = document.getElementById('yt-url-input');
  const statusMsg = document.getElementById('studio-status-msg');
  const formatSelect = document.getElementById('format-select-dropdown');
  const btnAction = document.getElementById('btn-convert-action');
  const progressWrap = document.getElementById('studio-progress-wrap');
  const progressFill = document.getElementById('progress-fill-blue');
  const progressPct = document.getElementById('progress-pct-text');
  const progressStage = document.getElementById('progress-stage-text');
  const errorBox = document.getElementById('studio-error-box');

  if (!btnAction) return;

  btnAction.addEventListener('click', async () => {
    // If already completed, trigger download
    if (conversionState === 'completed' && activeDownloadBlobUrl) {
      const a = document.createElement('a');
      a.href = activeDownloadBlobUrl;
      a.download = activeDownloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Pobieranie rozpoczęte: ' + activeDownloadFileName);
      return;
    }

    const inputUrl = urlInput.value.trim();
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

    const selectedFormat = formatSelect ? formatSelect.value : 'mp3';

    const stages = [
      { pct: 25, stage: 'Pobieranie strumienia materiału...' },
      { pct: 60, stage: 'Przetwarzanie audio/wideo (' + selectedFormat.toUpperCase() + ')...' },
      { pct: 90, stage: 'Pakowanie i optymalizacja pliku...' },
      { pct: 100, stage: 'Konwersja zakończona sukcesem!' }
    ];

    for (const s of stages) {
      if (progressFill) progressFill.style.width = s.pct + '%';
      if (progressPct) progressPct.textContent = s.pct + '%';
      if (progressStage) progressStage.textContent = s.stage;
      await new Promise(r => setTimeout(r, 450));
    }

    // Generate output file
    let ext = 'mp3';
    let mime = 'audio/mp3';
    if (selectedFormat === 'wav') { ext = 'wav'; mime = 'audio/wav'; }
    else if (selectedFormat.includes('mp4') || selectedFormat === '1080p' || selectedFormat === '720p') { ext = 'mp4'; mime = 'video/mp4'; }

    const rawTitle = inputUrl.split('v=')[1]?.substring(0, 10) || 'material';
    activeDownloadFileName = 'ReTrap_' + rawTitle + '_' + selectedFormat + '.' + ext;
    const fileContent = 'ReTrap Fast Konwerter\\nFormat: ' + selectedFormat.toUpperCase() + '\\nSource: ' + inputUrl + '\\nGenerated by ApliHub Engine.';
    const blob = new Blob([fileContent], { type: mime });
    activeDownloadBlobUrl = URL.createObjectURL(blob);

    // Completed state
    conversionState = 'completed';
    btnAction.disabled = false;
    btnAction.textContent = 'Pobierz';
    btnAction.style.background = 'linear-gradient(135deg, #0284c7, #0369a1)';

    if (statusMsg) {
      statusMsg.innerHTML = \`
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="#34d399" stroke-width="2.5" fill="none">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span style="color: #34d399; font-weight: 700;">Gotowe! Kliknij Pobierz, aby zapisać plik.</span>
      \`;
    }

    // Auto-trigger first download
    const autoLink = document.createElement('a');
    autoLink.href = activeDownloadBlobUrl;
    autoLink.download = activeDownloadFileName;
    document.body.appendChild(autoLink);
    autoLink.click();
    document.body.removeChild(autoLink);

    showToast('Pobrano plik: ' + activeDownloadFileName);
  });
}

/* Simulator Multi-Platform View */
function initExtensionSimulator() {
  const contentEl = document.getElementById('sim-platform-content');
  const navBtns = document.querySelectorAll('.sim-nav-btn');
  const simModal = document.getElementById('sim-popup-modal');
  const btnCloseSim = document.getElementById('sim-close-modal');

  let currentPlatform = 'yt';

  function renderPlatformMock(p) {
    if (!contentEl) return;

    if (p === 'yt') {
      contentEl.innerHTML = \`
        <div style="background: #0f0f0f; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: #ff0000; font-size: 20px; font-weight: 900;">▶</span>
            <span style="font-weight: 800; font-size: 16px; letter-spacing: -0.5px; color: #fff;">YouTube</span>
          </div>
          <div style="background: #1f1f1f; padding: 6px 16px; border-radius: 20px; font-size: 12px; color: #aaa; width: 260px;">Szukaj na YouTube...</div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff;">O</div>
        </div>

        <div style="position: relative; width: 100%; height: 320px; background: #000; display: flex; align-items: center; justify-content: center;">
          <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.75;" alt="YouTube video frame">
          <div style="position: absolute; width: 56px; height: 56px; background: rgba(0,0,0,0.75); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #fff;">▶</div>
        </div>

        <div style="padding: 18px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 12px;">Lofi Hip Hop Radio - Beats to Relax / Study to [Official Stream]</h2>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000;">LG</div>
              <div>
                <div style="font-weight: 700; font-size: 13px; color: #fff;">Lofi Girl ✓</div>
                <div style="font-size: 11px; color: #888;">14.3M subskrybentów</div>
              </div>
            </div>

            <!-- Techno Button without emojis -->
            <button id="sim-techno-btn-yt" style="background: #0e1118; color: #f1f5f9; border: 1px solid rgba(59, 130, 246, 0.45); padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 7px; cursor: pointer; box-shadow: 0 0 12px rgba(37,99,235,0.3); transition: all 0.2s;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Pobierz</span>
            </button>
          </div>
        </div>
      \`;
    } else if (p === 'tt') {
      contentEl.innerHTML = \`
        <div style="background: #000; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <span style="font-weight: 900; font-size: 18px; color: #fff;">TikTok</span>
          <span style="font-size: 12px; color: #888;">Dla Ciebie</span>
        </div>

        <div style="display: flex; height: 360px; background: #050508;">
          <div style="flex: 1; position: relative; display: flex; align-items: center; justify-content: center; background: #000;">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" alt="TikTok Video">
            <div style="position: absolute; bottom: 20px; left: 20px; color: #fff;">
              <div style="font-weight: 700; font-size: 14px;">@cyber_creator</div>
              <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">Nowy filtr AI zrewolucjonizował montaż wideo! #ai #tech</div>
            </div>
          </div>

          <div style="width: 180px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; border-left: 1px solid rgba(255,255,255,0.08);">
            <div style="text-align: center; font-size: 12px; color: #aaa;">❤️ 42.5K</div>
            <div style="text-align: center; font-size: 12px; color: #aaa;">💬 1.2K</div>
            <div style="text-align: center; font-size: 12px; color: #aaa;">↗️ Udostępnij</div>

            <!-- Techno Button on TikTok -->
            <button id="sim-techno-btn-tt" style="background: #0e1118; color: #f1f5f9; border: 1px solid rgba(59, 130, 246, 0.45); padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 0 12px rgba(37,99,235,0.3); width: 100%; justify-content: center;">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#60a5fa" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Pobierz</span>
            </button>
          </div>
        </div>
      \`;
    } else if (p === 'ig') {
      contentEl.innerHTML = \`
        <div style="background: #000; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <span style="font-weight: 800; font-size: 18px; color: #fff; font-family: serif;">Instagram</span>
          <span style="font-size: 12px; color: #888;">Reels</span>
        </div>

        <div style="display: flex; height: 360px; background: #050508;">
          <div style="flex: 1; position: relative; display: flex; align-items: center; justify-content: center; background: #000;">
            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" alt="Instagram Reel">
            <div style="position: absolute; bottom: 20px; left: 20px; color: #fff;">
              <div style="font-weight: 700; font-size: 14px;">music_producer_hub</div>
              <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">Studio Session WAV Master 2026 🎵</div>
            </div>
          </div>

          <div style="width: 180px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; border-left: 1px solid rgba(255,255,255,0.08);">
            <div style="text-align: center; font-size: 12px; color: #aaa;">🤍 18.2K</div>
            <div style="text-align: center; font-size: 12px; color: #aaa;">💬 480</div>

            <!-- Techno Button on Instagram -->
            <button id="sim-techno-btn-ig" style="background: #0e1118; color: #f1f5f9; border: 1px solid rgba(59, 130, 246, 0.45); padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 0 12px rgba(37,99,235,0.3); width: 100%; justify-content: center;">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#60a5fa" stroke-width="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Pobierz</span>
            </button>
          </div>
        </div>
      \`;
    }

    // Attach click handler to simulated techno button
    const anyBtn = contentEl.querySelector('button[id^="sim-techno-btn"]');
    if (anyBtn && simModal) {
      anyBtn.addEventListener('click', () => {
        simModal.style.display = 'flex';
      });
    }
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPlatform = btn.getAttribute('data-platform');
      renderPlatformMock(currentPlatform);
    });
  });

  renderPlatformMock('yt');

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
      showToast('Konto ' + user + ' zostało utworzone!');
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

fs.writeFileSync(path.join(jsDir, 'converter-app.js'), jsContent, 'utf8');
console.log('[SUCCESS] Updated Fast Konwerter converter-app.js');
