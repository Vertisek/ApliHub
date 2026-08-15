const fs = require('fs');
const path = require('path');

const apliHubDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(apliHubDir, 'Fast Konwerter');

console.log('Applying user flow updates: Algo Apli Pro removal, Przetestuj buttons, Plixy download/test routing...');

// 1. Remove Apli Pro button from Algo Analyzer index.html
const algoHtmlPath = path.resolve(algoDir, 'index.html');
if (fs.existsSync(algoHtmlPath)) {
  let html = fs.readFileSync(algoHtmlPath, 'utf8');
  html = html.replace(/<button class="btn-apli-pro" id="btnApliProApp"[\s\S]*?<\/button>\s*/, '');
  fs.writeFileSync(algoHtmlPath, html, 'utf8');
  console.log('[1/5] Removed Apli Pro button from Algo Analyzer index.html');
}

// 2. Remove Apli Pro listener from Algo Analyzer js/app.js
const algoJsPath = path.resolve(algoDir, 'js/app.js');
if (fs.existsSync(algoJsPath)) {
  let js = fs.readFileSync(algoJsPath, 'utf8');
  js = js.replace(/\/\/ Apli Pro button in App Header[\s\S]*?btnApliProApp\.addEventListener[\s\S]*?\}\s*\}/, '// Apli Pro button removed as requested');
  fs.writeFileSync(algoJsPath, js, 'utf8');
  console.log('[2/5] Cleaned up Apli Pro listener in Algo Analyzer js/app.js');
}

// 3. Update Fast Konwerter / Plixy converter-app.js to support direct tab activation via hash/param
const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');
if (fs.existsSync(konwJsPath)) {
  let js = fs.readFileSync(konwJsPath, 'utf8');
  
  if (!js.includes('checkDirectTabActivation')) {
    const tabActivationCode = `
/* Direct Tab Activation via Hash or URL Param */
function checkDirectTabActivation() {
  try {
    var hash = window.location.hash;
    var params = new URLSearchParams(window.location.search);
    var targetTabId = params.get('tab') || (hash ? hash.replace('#', '') : '');

    if (targetTabId) {
      var targetBtn = document.querySelector('.nav-tab-btn[data-tab="' + targetTabId + '"]');
      if (targetBtn) {
        targetBtn.click();
      }
    }
  } catch (e) {
    console.error('Error activating direct tab:', e);
  }
}
`;
    js = js.replace(/initTabs\(\);/, 'initTabs();\n  checkDirectTabActivation();');
    js += tabActivationCode;
    fs.writeFileSync(konwJsPath, js, 'utf8');
    console.log('[3/5] Added direct tab activation support to Fast Konwerter/js/converter-app.js');
  }
}

// 4. UPDATE js/main.js with "Przetestuj" vs "Pobierz" behavior
const mainJsPath = path.resolve(apliHubDir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

  // Replace openLiveAppSandbox with support for demo vs full modes
  const newSandboxLogic = `
window.currentSandboxApp = 'algo';

window.openLiveAppSandbox = function(appType, initialTab) {
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

  if (appType === 'algo' || appType === 'app-1' || appType === 'algo-demo') {
    iframe.src = 'Algo analyzer/index.html';
    if (title) title.textContent = 'Algo Analyzer v1.0.0 (Wersja Poglądowa / Test Działania)';
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
  } else if (appType === 'konwerter-sim' || appType === 'plixy-sim') {
    iframe.src = 'Fast Konwerter/index.html#tab-extension-sim';
    if (title) title.textContent = 'Plixy v1.2.0 (Symulator Wtyczki - Test Działania)';
    if (icon) {
      icon.textContent = '⚡';
      icon.style.background = 'linear-gradient(135deg, #2563eb, #06b6d4)';
    }
    if (btnAlgo) btnAlgo.classList.remove('active');
    if (btnKonw) btnKonw.classList.add('active');
    if (dlText) dlText.textContent = 'Pobierz .EXE (Plixy)';
    if (dlBtn) {
      dlBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = 'assets/installer/ApliHub_FastKonwerter_Setup.exe';
        a.download = 'ApliHub_FastKonwerter_Setup.exe';
        a.click();
      };
    }
  } else {
    // Standard Plixy full page (Studio & Download)
    iframe.src = initialTab ? 'Fast Konwerter/index.html#' + initialTab : 'Fast Konwerter/index.html';
    if (title) title.textContent = 'Plixy v1.2.0 (Studio Konwersji & Pobieranie Plików)';
    if (icon) {
      icon.textContent = '⚡';
      icon.style.background = 'linear-gradient(135deg, #2563eb, #06b6d4)';
    }
    if (btnAlgo) btnAlgo.classList.remove('active');
    if (btnKonw) btnKonw.classList.add('active');
    if (dlText) dlText.textContent = 'Pobierz .EXE (Plixy)';
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
`;

  mainJs = mainJs.replace(/window\.currentSandboxApp = 'algo';[\s\S]*?sandbox\.classList\.add\('active'\);[\s\S]*?document\.body\.style\.overflow = 'hidden';[\s\S]*?if \(typeof SoundFX !== 'undefined' && SoundFX\.playNavHover\) SoundFX\.playNavHover\(\);\s*\};/, newSandboxLogic.trim());

  // Update createToolCard to render pleasant "Przetestuj" and "Pobierz" buttons
  const newCreateToolCard = `
  // Create Tool Card HTML Element with distinct Przetestuj & Pobierz actions
  function createToolCard(item) {
    const card = document.createElement('div');
    card.className = 'card glowing-card';

    const isAlgo = item.id === 'app-1' || item.name.includes('Algo Analyzer');
    const isPlixy = item.id === 'plug-2' || item.name.includes('Plixy') || item.name.includes('Fast Konwerter');
    const isOfertomat = item.id === 'plug-3' || item.name.includes('Ofertomat');
    const isTheme = item.id === 'plug-4' || item.name.includes('Theme');

    let buttonHtml = '';

    if (isAlgo) {
      buttonHtml = \`
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn-test-live" onclick="event.stopPropagation(); window.openLiveAppSandbox('algo-demo')" title="Przetestuj wygląd i działanie Algo Analyzer przed zakupem">
            <span>🧪</span> Przetestuj
          </button>
          <button class="btn-download btn-card-download" data-download-id="\${item.id}" data-download-name="\${item.name}" title="Pobierz instalator Algo Analyzer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Pobierz
          </button>
        </div>
      \`;
    } else if (isPlixy) {
      buttonHtml = \`
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn-test-live" onclick="event.stopPropagation(); window.openLiveAppSandbox('plixy-sim')" title="Przetestuj symulator wtyczki i zobacz jak działa na Social Mediach">
            <span>🧪</span> Przetestuj
          </button>
          <button class="btn-download" onclick="event.stopPropagation(); window.openLiveAppSandbox('konwerter')" title="Otwórz stronę Plixy, aby pobrać materiał z linku lub pobrać instalator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Pobierz
          </button>
        </div>
      \`;
    } else {
      buttonHtml = \`
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn-test-live" onclick="event.stopPropagation(); window.openAppLaunchModal(APLIHUB_DATA.plugins.find(p => p.id === '\${item.id}') || item)" title="Przetestuj wersję demonstracyjną">
            <span>🧪</span> Przetestuj
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
    }

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

    // Sound FX on card hover
    card.addEventListener('mouseenter', () => SoundFX.playCardHover());

    const downloadBtn = card.querySelector('.btn-card-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.openAppLaunchModal(item);
      });
    }

    return card;
  }
`;

  mainJs = mainJs.replace(/function createToolCard\(item\) \{[\s\S]*?return card;\s*\}/, newCreateToolCard.trim());
  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('[4/5] Updated createToolCard in js/main.js with custom Przetestuj vs Pobierz actions');
}

// 5. UPDATE css/style.css button styling for maximum aesthetic appeal
const mainCssPath = path.resolve(apliHubDir, 'css/style.css');
if (fs.existsSync(mainCssPath)) {
  let css = fs.readFileSync(mainCssPath, 'utf8');

  const pleasantButtonStyles = `
/* ==========================================================================
   ENHANCED PLEASANT BUTTONS: PRZETESTUJ & POBIERZ
   ========================================================================== */
.btn-test-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 15px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(99, 102, 241, 0.15));
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 9px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.btn-test-live:hover {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.28), rgba(99, 102, 241, 0.28));
  color: #ffffff;
  border-color: #38bdf8;
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.35);
  transform: translateY(-1px);
}

.btn-download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 15px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000;
  border: none;
  border-radius: 9px;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.btn-download:hover {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
  transform: translateY(-1px);
}
`;

  if (css.includes('.btn-test-live {')) {
    css = css.replace(/\.btn-test-live \{[\s\S]*?\.btn-download:hover \{[\s\S]*?\}/, pleasantButtonStyles.trim());
  } else {
    css += '\n' + pleasantButtonStyles;
  }

  fs.writeFileSync(mainCssPath, css, 'utf8');
  console.log('[5/5] Enhanced pleasant button styles in css/style.css');
}

console.log('[SUCCESS] All user flow updates successfully applied!');
