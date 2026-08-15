const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(rootDir, 'Fast Konwerter');

const ts = Date.now();
console.log(`Executing Final Plixy & Button Polish... (timestamp: ${ts})`);

// ==========================================================================
// 1. UPDATE js/data.js (PLIXY RENAME)
// ==========================================================================
const dataJsPath = path.resolve(rootDir, 'js/data.js');
if (fs.existsSync(dataJsPath)) {
  let js = fs.readFileSync(dataJsPath, 'utf8');
  js = js.replace(/name:\s*"Plikio"/g, 'name: "Plixy"');
  js = js.replace(/Plikio/g, 'Plixy');
  fs.writeFileSync(dataJsPath, js, 'utf8');
  console.log('[1/5] Updated js/data.js with Plixy name.');
}

// ==========================================================================
// 2. UPDATE js/main.js (PLIXY RENAME, REMOVE TEST BUTTON FROM OTHERS, REMOVE EMOJI)
// ==========================================================================
const mainJsPath = path.resolve(rootDir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
  let js = fs.readFileSync(mainJsPath, 'utf8');

  // Replace Plikio with Plixy
  js = js.replace(/Plikio/g, 'Plixy');

  // Replace createToolCard logic
  const cardToolRegex = /function\s+createToolCard\(item\)\s*\{[\s\S]*?return card;\s*\}/;
  const newCardToolCode = `function createToolCard(item) {
    const card = document.createElement('div');
    card.className = 'card glowing-card';

    const isAlgo = item.id === 'app-1' || item.name.includes('Algo Analyzer');
    const isPlixy = item.id === 'plug-2' || item.name.includes('Plixy') || item.name.includes('Fast Konwerter');

    let buttonHtml = '';

    if (isAlgo) {
      // Algo Analyzer: Przetestuj next to Pobierz (No emoji)
      buttonHtml = \`
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn-test-live" onclick="event.stopPropagation(); window.openLiveAppSandbox('algo')" title="Przetestuj wygląd i działanie Algo Analyzer">
            Przetestuj
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
      // Plixy: Przetestuj next to Pobierz (No emoji)
      buttonHtml = \`
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <button class="btn-test-live" onclick="event.stopPropagation(); window.openLiveAppSandbox('plixy-sim')" title="Przetestuj symulator wtyczki i zobacz jak działa na Social Mediach">
            Przetestuj
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
      // All other apps/plugins: ONLY Pobierz button (NO Przetestuj button)
      buttonHtml = \`
        <button class="btn-download btn-card-download" data-download-id="\${item.id}" data-download-name="\${item.name}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Pobierz
        </button>
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
  }`;

  if (cardToolRegex.test(js)) {
    js = js.replace(cardToolRegex, newCardToolCode);
  }

  // Update openLiveAppSandbox routing
  js = js.replace(/appType === 'plikio-sim'/g, "appType === 'plixy-sim'");

  fs.writeFileSync(mainJsPath, js, 'utf8');
  console.log('[2/5] Updated js/main.js (Cards updated, emoji removed, only Pobierz for other tools).');
}

// ==========================================================================
// 3. UPDATE Algo analyzer/index.html (SINGLE ARROW BACK BUTTON)
// ==========================================================================
const algoHtmlPath = path.resolve(algoDir, 'index.html');
if (fs.existsSync(algoHtmlPath)) {
  let html = fs.readFileSync(algoHtmlPath, 'utf8');

  // Single arrow in Back button
  const headerLeftRegex = /<div class="top-header-left">[\s\S]*?<\/div>/;
  const newHeaderLeftHtml = `<div class="top-header-left">
                <button type="button" class="btn-back-hub" id="btnBackToHub" onclick="handleBackToHub()" title="Wróć do strony głównej ApliHub">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Wróć do ApliHub</span>
                </button>
            </div>`;
  html = html.replace(headerLeftRegex, newHeaderLeftHtml);

  // Update cache busters
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/app\.js(\?v=[\w\d_.-]+)?/g, `js/app.js?v=${ts}`);

  fs.writeFileSync(algoHtmlPath, html, 'utf8');
  console.log('[3/5] Updated Algo analyzer/index.html (Single arrow back button).');
}

// ==========================================================================
// 4. UPDATE Fast Konwerter / Plixy (PLIXY RENAME, BACK BUTTON NEXT TO BRAND)
// ==========================================================================
const konwHtmlPath = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwHtmlPath)) {
  let html = fs.readFileSync(konwHtmlPath, 'utf8');

  // Replace Plikio with Plixy
  html = html.replace(/<title>.*?<\/title>/, '<title>Plixy - Twój Szybki i Darmowy Konwerter</title>');
  html = html.replace(/<span class="brand-name">.*?<\/span>/g, '<span class="brand-name">PLIXY</span>');
  html = html.replace(/Plikio/g, 'Plixy');

  // Place Back button next to Plixy name on the left inside nav-container
  const navContainerRegex = /<div class="nav-container">[\s\S]*?<\/nav>\s*<\/div>/;
  const newNavContainerHtml = `<div class="nav-container">
      <div class="nav-left-group" style="display: flex; align-items: center; gap: 14px;">
        <div class="brand-wrap" onclick="location.reload()" style="cursor: pointer;">
          <img src="icon48.png" alt="Plixy Logo" class="brand-logo-img">
          <span class="brand-name">PLIXY</span>
        </div>

        <button type="button" class="btn-back-hub" id="btnBackToHub" onclick="handleBackToHub()" title="Wróć do strony głównej ApliHub">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Wróć do ApliHub</span>
        </button>
      </div>

      <nav class="nav-tabs">
        <button class="nav-tab-btn active" data-tab="tab-studio">Studio Konwersji</button>
        <button class="nav-tab-btn" data-tab="tab-extension-sim">Jak działa?</button>
        <button class="nav-tab-btn" data-tab="tab-webstore">Pobierz i Wgraj</button>
      </nav>
    </div>`;

  if (navContainerRegex.test(html)) {
    html = html.replace(navContainerRegex, newNavContainerHtml);
  }

  // Update cache busters
  html = html.replace(/css\/converter\.css(\?v=[\w\d_.-]+)?/g, `css/converter.css?v=${ts}`);
  html = html.replace(/js\/converter-app\.js(\?v=[\w\d_.-]+)?/g, `js/converter-app.js?v=${ts}`);

  fs.writeFileSync(konwHtmlPath, html, 'utf8');
  console.log('[4/5] Updated Fast Konwerter/index.html (Plixy name & back button next to Plixy brand).');
}

const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');
if (fs.existsSync(konwJsPath)) {
  let js = fs.readFileSync(konwJsPath, 'utf8');
  js = js.replace(/Plikio/g, 'Plixy');
  fs.writeFileSync(konwJsPath, js, 'utf8');
  console.log('[4/5 b] Updated Fast Konwerter/js/converter-app.js with Plixy name.');
}

// ==========================================================================
// 5. UPDATE Root index.html (CACHE BUSTERS & PLIXY RENAME)
// ==========================================================================
const rootIndex = path.resolve(rootDir, 'index.html');
if (fs.existsSync(rootIndex)) {
  let html = fs.readFileSync(rootIndex, 'utf8');
  html = html.replace(/Plikio/g, 'Plixy');
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/data\.js(\?v=[\w\d_.-]+)?/g, `js/data.js?v=${ts}`);
  html = html.replace(/js\/main\.js(\?v=[\w\d_.-]+)?/g, `js/main.js?v=${ts}`);
  fs.writeFileSync(rootIndex, html, 'utf8');
  console.log('[5/5] Updated root index.html.');
}

console.log('=== ALL USER ADJUSTMENTS COMPLETED SUCCESSFULLY ===');
