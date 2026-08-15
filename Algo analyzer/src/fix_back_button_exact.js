const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(rootDir, 'Fast Konwerter');

const ts = Date.now();
console.log(`Fixing Back button in Plixy and Algo Analyzer (timestamp: ${ts})`);

// 1. UPDATE Fast Konwerter/index.html
const konwHtmlPath = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwHtmlPath)) {
  let html = fs.readFileSync(konwHtmlPath, 'utf8');

  // Exact header replacement
  const oldHeader = `  <!-- Top Nav Bar -->
  <header class="top-nav">
    <div class="nav-container">
      <div class="brand-wrap" onclick="location.reload()">
        <img src="icon48.png" alt="ReTrap Logo" class="brand-logo-img">
        <span class="brand-name">PLIKIO</span>
      </div>

      <nav class="nav-tabs">
        <button class="nav-tab-btn active" data-tab="tab-studio">Studio Konwersji</button>
        <button class="nav-tab-btn" data-tab="tab-extension-sim">Jak działa?</button>
        <button class="nav-tab-btn" data-tab="tab-webstore">Pobierz i Wgraj</button>
      </nav>

      <button type="button" class="btn-back-hub" id="btnBackToHub" onclick="handleBackToHub()" title="Wróć do strony głównej ApliHub">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>← Wróć do ApliHub</span>
        </button>
      </div>
  </header>`;

  const newHeader = `  <!-- Top Nav Bar -->
  <header class="top-nav">
    <div class="nav-container">
      <div style="display: flex; align-items: center; gap: 14px;">
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

  if (html.includes(oldHeader)) {
    html = html.replace(oldHeader, newHeader);
  } else {
    // Regex fallback
    html = html.replace(/<header class="top-nav">[\s\S]*?<\/header>/, newHeader.trim());
  }

  // Ensure title & all Plikio strings are Plixy
  html = html.replace(/<title>.*?<\/title>/, '<title>Plixy - Twój Szybki i Darmowy Konwerter</title>');
  html = html.replace(/Plikio/g, 'Plixy');
  html = html.replace(/<span>← Wróć do ApliHub<\/span>/g, '<span>Wróć do ApliHub</span>');
  html = html.replace(/css\/converter\.css(\?v=[\w\d_.-]+)?/g, `css/converter.css?v=${ts}`);
  html = html.replace(/js\/converter-app\.js(\?v=[\w\d_.-]+)?/g, `js/converter-app.js?v=${ts}`);

  fs.writeFileSync(konwHtmlPath, html, 'utf8');
  console.log('[1/3] Fixed Fast Konwerter/index.html header.');
}

// 2. VERIFY Algo analyzer/index.html
const algoHtmlPath = path.resolve(algoDir, 'index.html');
if (fs.existsSync(algoHtmlPath)) {
  let html = fs.readFileSync(algoHtmlPath, 'utf8');
  html = html.replace(/<span>← Wróć do ApliHub<\/span>/g, '<span>Wróć do ApliHub</span>');
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/app\.js(\?v=[\w\d_.-]+)?/g, `js/app.js?v=${ts}`);
  fs.writeFileSync(algoHtmlPath, html, 'utf8');
  console.log('[2/3] Verified Algo analyzer/index.html.');
}

// 3. UPDATE Root index.html cache busters
const rootIndexPath = path.resolve(rootDir, 'index.html');
if (fs.existsSync(rootIndexPath)) {
  let html = fs.readFileSync(rootIndexPath, 'utf8');
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/main\.js(\?v=[\w\d_.-]+)?/g, `js/main.js?v=${ts}`);
  html = html.replace(/js\/data\.js(\?v=[\w\d_.-]+)?/g, `js/data.js?v=${ts}`);
  fs.writeFileSync(rootIndexPath, html, 'utf8');
  console.log('[3/3] Updated root index.html cache busters.');
}

console.log('--- FIXED SUCCESSFULLY ---');
