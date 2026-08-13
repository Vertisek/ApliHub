const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
const indexHtmlPath = path.join(rootDir, 'index.html');
const mainJsPath = path.join(rootDir, 'js', 'main.js');
const styleCssPath = path.join(rootDir, 'css', 'style.css');

// 1. Update index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const sandboxHtml = `  <!-- Fullscreen Live Interactive App Sandbox (Tryb Testowy Bez Pobierania) -->
  <div class="app-test-sandbox" id="appTestSandbox">
    <div class="sandbox-header">
      <div class="sandbox-left">
        <div class="sandbox-icon" id="sandboxAppIcon">⚡</div>
        <div>
          <div class="sandbox-title" id="sandboxAppTitle">Algo Analyzer v1.0.0</div>
          <div class="sandbox-badge">🧪 TRYB TESTOWY NA ŻYWO (BEZ POBIERANIA)</div>
        </div>
      </div>

      <div class="sandbox-center">
        <button class="btn-sandbox-nav active" id="btnSwitchAlgo" onclick="window.switchSandboxApp('algo')">📊 Algo Analyzer</button>
        <button class="btn-sandbox-nav" id="btnSwitchKonwerter" onclick="window.switchSandboxApp('konwerter')">⚡ Fast Konwerter</button>
        <button class="btn-sandbox-action" onclick="window.reloadSandboxFrame()" title="Przeładuj aplikację">🔄</button>
      </div>

      <div class="sandbox-right">
        <button class="btn-sandbox-download" id="btnSandboxDownload">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span id="sandboxDownloadText">Pobierz .EXE</span>
        </button>
        <button class="btn-sandbox-close" id="btnCloseSandbox" onclick="window.closeSandboxApp()" title="Zamknij tryb testowy">&times;</button>
      </div>
    </div>

    <div class="sandbox-frame-wrapper">
      <iframe id="sandboxIframe" src="about:blank" title="Aplikacja Testowa ApliHub" frameborder="0"></iframe>
    </div>
  </div>
`;

if (!indexHtml.includes('id="appTestSandbox"')) {
  indexHtml = indexHtml.replace('  <!-- Toast Notification Container -->', sandboxHtml + '\n  <!-- Toast Notification Container -->');
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  console.log('[SUCCESS] Updated index.html');
}

// 2. Append CSS for Sandbox and Modals to style.css
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

const additionalCss = `
/* ==========================================================================
   APP TEST SANDBOX & LAUNCH MODAL (TRYB TESTOWY BEZ POBIERANIA)
   ========================================================================== */
.btn-test-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
}

.btn-test-live:hover {
  background: rgba(59, 130, 246, 0.3);
  color: #93c5fd;
  border-color: #3b82f6;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.app-test-sandbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #090a0f;
  z-index: 99999;
  display: none;
  flex-direction: column;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.app-test-sandbox.active {
  display: flex;
  opacity: 1;
  pointer-events: auto;
}

.sandbox-header {
  height: 60px;
  background: #11131c;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
}

.sandbox-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sandbox-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.sandbox-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
}

.sandbox-badge {
  font-size: 0.68rem;
  font-weight: 800;
  color: #34d399;
  letter-spacing: 0.5px;
}

.sandbox-center {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.btn-sandbox-nav {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sandbox-nav:hover {
  color: #fff;
}

.btn-sandbox-nav.active {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
}

.btn-sandbox-action {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: 0.2s;
}

.btn-sandbox-action:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.sandbox-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-sandbox-download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000;
  font-weight: 800;
  font-size: 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.btn-sandbox-download:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
}

.btn-sandbox-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 4px;
  transition: 0.2s;
}

.btn-sandbox-close:hover {
  color: #ef4444;
}

.sandbox-frame-wrapper {
  flex: 1;
  width: 100%;
  height: calc(100vh - 60px);
  position: relative;
  background: #000;
}

.sandbox-frame-wrapper iframe {
  width: 100%;
  height: 100%;
  border: none;
}
`;

if (!styleCss.includes('app-test-sandbox')) {
  styleCss += '\n' + additionalCss;
  fs.writeFileSync(styleCssPath, styleCss, 'utf8');
  console.log('[SUCCESS] Updated style.css');
}

// 3. Update js/main.js
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

// Global sandbox runner functions
const sandboxJsFunctions = `
/* ==========================================================================
   APP TEST SANDBOX CONTROLLER (URUCHAMIANIE W PRZEGLĄDARCE BEZ POBIERANIA)
   ========================================================================== */
window.currentSandboxApp = 'algo';

window.openLiveAppSandbox = function(appType) {
  const sandbox = document.getElementById('appTestSandbox');
  const iframe = document.getElementById('sandboxIframe');
  const title = document.getElementById('sandboxAppTitle');
  const icon = document.getElementById('sandboxAppIcon');
  const btnAlgo = document.getElementById('btnSwitchAlgo');
  const btnKonw = document.getElementById('btnSwitchKonwerter');
  const dlText = document.getElementById('sandboxDownloadText');
  const dlBtn = document.getElementById('btnSandboxDownload');

  if (!sandbox || !iframe) return;

  window.currentSandboxApp = appType;

  if (appType === 'algo' || appType === 'app-1') {
    iframe.src = 'Algo analyzer/index.html';
    if (title) title.textContent = 'Algo Analyzer v1.0.0 (ApliHub Social Intelligence)';
    if (icon) {
      icon.textContent = '📊';
      icon.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    }
    if (btnAlgo) btnAlgo.classList.add('active');
    if (btnKonw) btnKonw.classList.remove('active');
    if (dlText) dlText.textContent = 'Pobierz .EXE (Algo Analyzer)';
    if (dlBtn) {
      dlBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
        a.download = 'ApliHub_AlgoAnalyzer_Setup.exe';
        a.click();
      };
    }
  } else {
    iframe.src = 'Fast Konwerter/index.html';
    if (title) title.textContent = 'Fast Konwerter v1.2.0 (ReTrap YouTube Studio & Extension)';
    if (icon) {
      icon.textContent = '⚡';
      icon.style.background = 'linear-gradient(135deg, #2563eb, #06b6d4)';
    }
    if (btnAlgo) btnAlgo.classList.remove('active');
    if (btnKonw) btnKonw.classList.add('active');
    if (dlText) dlText.textContent = 'Pobierz .EXE (Fast Konwerter)';
    if (dlBtn) {
      dlBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = 'assets/installer/ApliHub_FastKonwerter_Setup.exe';
        a.download = 'ApliHub_FastKonwerter_Setup.exe';
        a.click();
      };
    }
  }

  sandbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (typeof SoundFX !== 'undefined' && SoundFX.playNavHover) SoundFX.playNavHover();
};

window.switchSandboxApp = function(type) {
  window.openLiveAppSandbox(type);
};

window.reloadSandboxFrame = function() {
  const iframe = document.getElementById('sandboxIframe');
  if (iframe) {
    iframe.contentWindow.location.reload();
  }
};

window.closeSandboxApp = function() {
  const sandbox = document.getElementById('appTestSandbox');
  const iframe = document.getElementById('sandboxIframe');
  if (sandbox) {
    sandbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (iframe) iframe.src = 'about:blank';
};

// Modal for download choices
window.openAppLaunchModal = function(item) {
  const backdrop = document.getElementById('modalBackdrop');
  const title = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');

  if (!backdrop || !title || !content) return;

  const isAlgo = item.id === 'app-1' || item.name.includes('Algo Analyzer');
  const isKonwerter = item.id === 'plug-2' || item.name.includes('Fast Konwerter');

  title.innerHTML = \`⚡ \${item.name} <span style="font-size: 0.8rem; opacity: 0.7;">(\${item.version})</span>\`;

  let downloadUrl = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
  let downloadLabel = 'Pobierz Instalator Windows (.exe)';
  let extDownloadHtml = '';

  if (isAlgo) {
    downloadUrl = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
    downloadLabel = 'Pobierz Instalator Algo Analyzer (.exe)';
  } else if (isKonwerter) {
    downloadUrl = 'assets/installer/ApliHub_FastKonwerter_Setup.exe';
    downloadLabel = 'Pobierz Instalator Fast Konwerter (.exe)';
    extDownloadHtml = \`
      <a href="assets/installer/Fast_Konwerter_Chrome_Extension.zip" download="Fast_Konwerter_Chrome_Extension.zip" class="btn-download" style="text-decoration: none; justify-content: center; background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); padding: 12px; border-radius: 8px;">
        📦 Pobierz Paczkę Chrome Web Store (.zip)
      </a>
    \`;
  }

  content.innerHTML = \`
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div style="display: flex; align-items: center; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
        <div style="font-size: 2.2rem;">\${item.icon || '⚡'}</div>
        <div>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: #fff;">\${item.name}</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">\${item.desc}</p>
        </div>
      </div>

      <!-- Choice 1: Run In Browser (Recommended) -->
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 0.95rem; color: #60a5fa; display: flex; align-items: center; gap: 8px;">
            <span>🚀</span> Tryb Testowy w Przeglądarce
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; background: #2563eb; color: #fff; padding: 2px 8px; border-radius: 12px;">Bez Instalacji</span>
        </div>
        <p style="font-size: 0.8rem; color: #cbd5e1;">
          Uruchom pełną wersję aplikacji ze wszystkimi funkcjami, logowaniem, rejestracją i analizami AI bezpośrednio w oknie przeglądarki.
        </p>
        <button class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.9rem; background: linear-gradient(135deg, #2563eb, #06b6d4); color: #fff;" onclick="window.closeApliHubModal(); window.openLiveAppSandbox('\${isAlgo ? 'algo' : 'konwerter'}');">
          🧪 Uruchom Aplikację Teraz (Test Online)
        </button>
      </div>

      <!-- Choice 2: Download Executable -->
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="font-weight: 800; font-size: 0.9rem; color: #fff; display: flex; align-items: center; gap: 8px;">
          <span>🖥️</span> Plik Wykonywalny dla Windows
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          Pobierz natywny plik wykonywalny .exe gotowy do uruchomienia na Twoim komputerze.
        </p>
        <a href="\${downloadUrl}" download class="btn-download" style="text-decoration: none; justify-content: center; padding: 12px; font-size: 0.88rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000;">
          ⬇️ \${downloadLabel}
        </a>
        \${extDownloadHtml}
      </div>
    </div>
  \`;

  backdrop.classList.add('active');
};
`;

if (!mainJs.includes('openLiveAppSandbox')) {
  mainJs = sandboxJsFunctions + '\n' + mainJs;
}

// Replace card button rendering in createToolCard
const oldCardButtonsRegex = /\/\/ Create Tool Card HTML Element[\s\S]*?function createToolCard\(item\) \{[\s\S]*?const user = typeof getApliHubUserData[\s\S]*?let buttonHtml = '';[\s\S]*?return card;\s*\}/;

const newCreateToolCard = `// Create Tool Card HTML Element
  function createToolCard(item) {
    const card = document.createElement('div');
    card.className = 'card glowing-card';

    const isAlgo = item.id === 'app-1' || item.name.includes('Algo Analyzer');
    const isKonwerter = item.id === 'plug-2' || item.name.includes('Fast Konwerter');
    const appTypeKey = isAlgo ? 'algo' : (isKonwerter ? 'konwerter' : 'app');

    let buttonHtml = \`
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <button class="btn-test-live" onclick="event.stopPropagation(); window.openLiveAppSandbox('\${appTypeKey}')" title="Uruchom aplikację w przeglądarce bez instalacji">
          <span>🧪</span> Testuj
        </button>
        <button class="btn-download btn-card-download" data-download-id="\${item.id}" data-download-name="\${item.name}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Pobierz
        </button>
      </div>
    \`;

    card.innerHTML = \`
      <div>
        <div class="card-top">
          <div class="card-icon" style="position: relative;">
            \${item.id === 'app-1' ? \`<img src="assets/images/algo_app_icon.png" alt="Algo Icon" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover;">\` : item.icon}
          </div>
          <div class="card-info">
            <h3 class="card-title">\${item.name}</h3>
            <span class="card-badge">\${item.badge}</span>
          </div>
        </div>
        <p class="card-desc">\${item.desc}</p>
      </div>

      <div class="card-meta">
        <div class="card-stats">
          <span>\${item.rating}</span>
          <span>•</span>
          <span>\${item.downloads} pobrań</span>
        </div>
        \${buttonHtml}
      </div>
    \`;

    // Sound FX 2 on card hover
    card.addEventListener('mouseenter', () => SoundFX.playCardHover());

    const downloadBtn = card.querySelector('.btn-card-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.openAppLaunchModal(item);
      });
    }

    return card;
  }`;

mainJs = mainJs.replace(oldCardButtonsRegex, newCreateToolCard);

fs.writeFileSync(mainJsPath, mainJs, 'utf8');
console.log('[SUCCESS] Updated main.js with sandbox and download choice modal.');
