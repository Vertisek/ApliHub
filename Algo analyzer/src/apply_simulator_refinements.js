const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(rootDir, 'Fast Konwerter');

const ts = Date.now();
console.log(`Executing 4-Point Simulator Refinement... (timestamp: ${ts})`);

// ==========================================================================
// 1. UPDATE index.html & css/style.css (REMOVE TOP SANDBOX HEADER BAR)
// ==========================================================================
const rootIndexPath = path.resolve(rootDir, 'index.html');
if (fs.existsSync(rootIndexPath)) {
  let html = fs.readFileSync(rootIndexPath, 'utf8');

  // Replace sandbox container to only contain the iframe without top bar
  const sandboxRegex = /<!-- Fullscreen Live Interactive App Sandbox[\s\S]*?<\/div>\s*<\/div>/;
  const newSandboxHtml = `<!-- Fullscreen Live Interactive App Sandbox (Czysty Widok Symulatora Bez Paska) -->
  <div class="app-test-sandbox" id="appTestSandbox">
    <iframe id="sandboxIframe" src="about:blank" title="Symulator ApliHub" frameborder="0"></iframe>
  </div>`;

  html = html.replace(sandboxRegex, newSandboxHtml);

  // Update cache busters
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/main\.js(\?v=[\w\d_.-]+)?/g, `js/main.js?v=${ts}`);

  fs.writeFileSync(rootIndexPath, html, 'utf8');
  console.log('[1/4] Cleaned index.html (sandbox header removed).');
}

const rootCssPath = path.resolve(rootDir, 'css/style.css');
if (fs.existsSync(rootCssPath)) {
  let css = fs.readFileSync(rootCssPath, 'utf8');

  // Ensure app-test-sandbox fills screen cleanly
  const sandboxCssRegex = /\.app-test-sandbox\s*\{[\s\S]*?\.app-test-sandbox\.active\s*\{[\s\S]*?\}/;
  const newSandboxCss = `.app-test-sandbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #070a12;
  z-index: 999999;
  display: none;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.app-test-sandbox.active {
  display: block;
  opacity: 1;
  pointer-events: auto;
}

.app-test-sandbox iframe {
  width: 100vw;
  height: 100vh;
  border: none;
  display: block;
}`;

  if (sandboxCssRegex.test(css)) {
    css = css.replace(sandboxCssRegex, newSandboxCss);
  }

  fs.writeFileSync(rootCssPath, css, 'utf8');
  console.log('[1/4 b] Updated css/style.css for clean fullscreen sandbox.');
}

// ==========================================================================
// 2. UPDATE js/main.js (DIRECT 1-TO-1 SIMULATOR LAUNCH)
// ==========================================================================
const mainJsPath = path.resolve(rootDir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
  let js = fs.readFileSync(mainJsPath, 'utf8');

  // Update openLiveAppSandbox to load ONLY the requested app directly
  const openSandboxRegex = /window\.openLiveAppSandbox\s*=\s*function\(appType,\s*initialTab\)\s*\{[\s\S]*?if\s*\(typeof SoundFX[\s\S]*?SoundFX\.playNavHover\(\);\s*\};/;
  const newOpenSandboxCode = `window.openLiveAppSandbox = function(appType, initialTab) {
  const sandbox = document.getElementById('appTestSandbox');
  const iframe = document.getElementById('sandboxIframe');
  if (!sandbox || !iframe) return;

  if (appType === 'algo' || appType === 'algo-demo') {
    // Only Algo Analyzer Simulator
    iframe.src = 'Algo analyzer/index.html?cb=' + Date.now();
  } else if (appType === 'plikio-sim' || appType === 'plixy-sim' || appType === 'konwerter-sim') {
    // Only Plikio Simulator (Jak działa?)
    iframe.src = 'Fast Konwerter/index.html?tab=tab-extension-sim&cb=' + Date.now() + '#tab-extension-sim';
  } else {
    // Only Plikio Studio & Download
    const tab = initialTab || 'tab-studio';
    iframe.src = 'Fast Konwerter/index.html?tab=' + tab + '&cb=' + Date.now() + '#' + tab;
  }

  sandbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (typeof SoundFX !== 'undefined' && SoundFX.playNavHover) SoundFX.playNavHover();
};

window.closeSandboxApp = function() {
  const sandbox = document.getElementById('appTestSandbox');
  const iframe = document.getElementById('sandboxIframe');
  if (sandbox) {
    sandbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (iframe) iframe.src = 'about:blank';
};`;

  if (openSandboxRegex.test(js)) {
    js = js.replace(openSandboxRegex, newOpenSandboxCode);
  }

  fs.writeFileSync(mainJsPath, js, 'utf8');
  console.log('[2/4] Updated js/main.js for direct 1-to-1 simulator launch.');
}

// ==========================================================================
// 3. UPDATE Algo analyzer/index.html & js/app.js & css/style.css
//    - Add "← Wróć do ApliHub" button
//    - Remove all login buttons and auth modals
// ==========================================================================
const algoHtmlPath = path.resolve(algoDir, 'index.html');
if (fs.existsSync(algoHtmlPath)) {
  let html = fs.readFileSync(algoHtmlPath, 'utf8');

  // Replace header left with "← Wróć do ApliHub"
  const headerLeftRegex = /<div class="top-header-left">[\s\S]*?<\/div>/;
  const newHeaderLeftHtml = `<div class="top-header-left">
                <button type="button" class="btn-back-hub" id="btnBackToHub" onclick="handleBackToHub()" title="Wróć do strony głównej ApliHub">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>← Wróć do ApliHub</span>
                </button>
            </div>`;
  html = html.replace(headerLeftRegex, newHeaderLeftHtml);

  // Remove modal-auth from Algo Analyzer
  const modalAuthRegex = /<!-- Modal: Logowanie & Rejestracja ApliHub[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (modalAuthRegex.test(html)) {
    html = html.replace(modalAuthRegex, '<!-- Auth modal removed for pure simulator experience -->');
  }

  // Update cache busters
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/app\.js(\?v=[\w\d_.-]+)?/g, `js/app.js?v=${ts}`);

  fs.writeFileSync(algoHtmlPath, html, 'utf8');
  console.log('[3/4 a] Updated Algo analyzer/index.html (Back button added, login modal removed).');
}

const algoCssPath = path.resolve(algoDir, 'css/style.css');
if (fs.existsSync(algoCssPath)) {
  let css = fs.readFileSync(algoCssPath, 'utf8');

  if (!css.includes('.btn-back-hub')) {
    css += `\n
/* ==========================================================================
   BACK TO HUB BUTTON
   ========================================================================== */
.btn-back-hub {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.35);
    color: #fbbf24;
    padding: 8px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
}

.btn-back-hub:hover {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #000;
    border-color: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.3);
}

.avatar-frame.premium-ring {
    border: 2px solid #f59e0b;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
    animation: goldGlow 2.5s infinite alternate;
}

@keyframes goldGlow {
    from { box-shadow: 0 0 6px rgba(245, 158, 11, 0.3); }
    to { box-shadow: 0 0 16px rgba(245, 158, 11, 0.7); }
}
`;
    fs.writeFileSync(algoCssPath, css, 'utf8');
    console.log('[3/4 b] Updated Algo analyzer/css/style.css.');
  }
}

const algoJsPath = path.resolve(algoDir, 'js/app.js');
if (fs.existsSync(algoJsPath)) {
  let js = fs.readFileSync(algoJsPath, 'utf8');

  // Add handleBackToHub global function
  if (!js.includes('window.handleBackToHub')) {
    js = `window.handleBackToHub = function() {
  if (window.parent && window.parent !== window && typeof window.parent.closeSandboxApp === 'function') {
    window.parent.closeSandboxApp();
  } else {
    window.location.href = '../index.html';
  }
};\n` + js;
  }

  // Remove login button text from syncUserInfo
  js = js.replace(/<span class="avatar-name" style="color: var\(--color-yellow-main\); font-weight: 700;">Zaloguj się<\/span>/g, '<span class="avatar-name" style="color: #fbbf24; font-weight: 700;">Oskar_Algo</span>');

  fs.writeFileSync(algoJsPath, js, 'utf8');
  console.log('[3/4 c] Updated Algo analyzer/js/app.js.');
}

// ==========================================================================
// 4. UPDATE Fast Konwerter / Plikio
//    - Add "← Wróć do ApliHub" button in navigation
//    - Remove user-pill login button and auth-modal
// ==========================================================================
const konwHtmlPath = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwHtmlPath)) {
  let html = fs.readFileSync(konwHtmlPath, 'utf8');

  // Replace user-pill with "← Wróć do ApliHub"
  const userPillRegex = /<div class="user-pill" id="user-pill-btn">[\s\S]*?<\/div>\s*<\/div>/;
  const newBackBtnHtml = `<button type="button" class="btn-back-hub" id="btnBackToHub" onclick="handleBackToHub()" title="Wróć do strony głównej ApliHub">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>← Wróć do ApliHub</span>
        </button>
      </div>`;

  if (userPillRegex.test(html)) {
    html = html.replace(userPillRegex, newBackBtnHtml);
  }

  // Remove auth modal from Fast Konwerter
  const authModalRegex = /<!-- Auth Modal -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (authModalRegex.test(html)) {
    html = html.replace(authModalRegex, '<!-- Auth modal removed for simulator -->');
  }

  // Update cache busters
  html = html.replace(/css\/converter\.css(\?v=[\w\d_.-]+)?/g, `css/converter.css?v=${ts}`);
  html = html.replace(/js\/converter-app\.js(\?v=[\w\d_.-]+)?/g, `js/converter-app.js?v=${ts}`);

  fs.writeFileSync(konwHtmlPath, html, 'utf8');
  console.log('[4/4 a] Updated Fast Konwerter/index.html (Back button added, login button removed).');
}

const konwCssPath = path.resolve(konwDir, 'css/converter.css');
if (fs.existsSync(konwCssPath)) {
  let css = fs.readFileSync(konwCssPath, 'utf8');

  if (!css.includes('.btn-back-hub')) {
    css += `\n
/* Back to Hub Button */
.btn-back-hub {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #60a5fa;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back-hub:hover {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: #fff;
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}
`;
    fs.writeFileSync(konwCssPath, css, 'utf8');
    console.log('[4/4 b] Updated Fast Konwerter/css/converter.css.');
  }
}

const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');
if (fs.existsSync(konwJsPath)) {
  let js = fs.readFileSync(konwJsPath, 'utf8');

  // Add handleBackToHub global function
  if (!js.includes('window.handleBackToHub')) {
    js = `window.handleBackToHub = function() {
  if (window.parent && window.parent !== window && typeof window.parent.closeSandboxApp === 'function') {
    window.parent.closeSandboxApp();
  } else {
    window.location.href = '../index.html';
  }
};\n` + js;
  }

  fs.writeFileSync(konwJsPath, js, 'utf8');
  console.log('[4/4 c] Updated Fast Konwerter/js/converter-app.js.');
}

console.log('=== ALL 4 POINTS SUCCESSFULLY IMPLEMENTED ===');
