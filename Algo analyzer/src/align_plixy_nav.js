const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(rootDir, 'Fast Konwerter');

const ts = Date.now();
console.log(`Aligning Plixy Top Nav and Back Button with Algo Analyzer (timestamp: ${ts})`);

// 1. UPDATE Fast Konwerter/index.html
const konwHtmlPath = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwHtmlPath)) {
  let html = fs.readFileSync(konwHtmlPath, 'utf8');

  // Exact clean header replacement
  const newHeader = `  <!-- Top Nav Bar (Matching Algo Analyzer Layout) -->
  <header class="top-nav">
    <div class="nav-container">
      <div class="nav-left-group" style="display: flex; align-items: center; gap: 16px;">
        <button type="button" class="btn-back-hub" id="btnBackToHub" onclick="handleBackToHub()" title="Wróć do strony głównej ApliHub">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Wróć do ApliHub</span>
        </button>

        <div class="brand-wrap" onclick="location.reload()" style="cursor: pointer;">
          <img src="icon48.png" alt="Plixy Logo" class="brand-logo-img">
          <span class="brand-name">PLIXY</span>
        </div>
      </div>

      <nav class="nav-tabs">
        <button class="nav-tab-btn active" data-tab="tab-studio">Studio Konwersji</button>
        <button class="nav-tab-btn" data-tab="tab-extension-sim">Jak działa?</button>
        <button class="nav-tab-btn" data-tab="tab-webstore">Pobierz i Wgraj</button>
      </nav>
    </div>
  </header>`;

  html = html.replace(/<!-- Top Nav Bar[\s\S]*?<\/header>/, newHeader.trim());
  html = html.replace(/css\/converter\.css(\?v=[\w\d_.-]+)?/g, `css/converter.css?v=${ts}`);
  html = html.replace(/js\/converter-app\.js(\?v=[\w\d_.-]+)?/g, `js/converter-app.js?v=${ts}`);

  fs.writeFileSync(konwHtmlPath, html, 'utf8');
  console.log('[1/4] Fast Konwerter/index.html header aligned.');
}

// 2. UPDATE Fast Konwerter/css/converter.css
const konwCssPath = path.resolve(konwDir, 'css/converter.css');
if (fs.existsSync(konwCssPath)) {
  let css = fs.readFileSync(konwCssPath, 'utf8');

  // Replace .top-nav and .nav-container to match Algo Analyzer full-width edge-to-edge layout
  css = css.replace(/\.top-nav\s*\{[\s\S]*?padding:[\s\S]*?\}/, `.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  padding: 0 28px;
  height: 64px;
  display: flex;
  align-items: center;
  width: 100%;
}`);

  css = css.replace(/\.nav-container\s*\{[\s\S]*?align-items:\s*center;\s*\}/, `.nav-container {
  width: 100%;
  max-width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}`);

  fs.writeFileSync(konwCssPath, css, 'utf8');
  console.log('[2/4] Fast Konwerter/css/converter.css full-width nav layout applied.');
}

// 3. UPDATE Algo analyzer/index.html & css
const algoHtmlPath = path.resolve(algoDir, 'index.html');
if (fs.existsSync(algoHtmlPath)) {
  let html = fs.readFileSync(algoHtmlPath, 'utf8');
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/app\.js(\?v=[\w\d_.-]+)?/g, `js/app.js?v=${ts}`);
  fs.writeFileSync(algoHtmlPath, html, 'utf8');
  console.log('[3/4] Algo analyzer cache buster refreshed.');
}

// 4. UPDATE Root index.html
const rootIndexPath = path.resolve(rootDir, 'index.html');
if (fs.existsSync(rootIndexPath)) {
  let html = fs.readFileSync(rootIndexPath, 'utf8');
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/data\.js(\?v=[\w\d_.-]+)?/g, `js/data.js?v=${ts}`);
  html = html.replace(/js\/main\.js(\?v=[\w\d_.-]+)?/g, `js/main.js?v=${ts}`);
  fs.writeFileSync(rootIndexPath, html, 'utf8');
  console.log('[4/4] Root index.html cache buster refreshed.');
}

console.log('=== PLIXY TOP NAV MATCHES ALGO ANALYZER PERFECTLY ===');
