const fs = require('fs');
const path = require('path');

const apliHubDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');

const algoHtmlPath = path.resolve(algoDir, 'index.html');
const algoCssPath = path.resolve(algoDir, 'css/style.css');
const mainHtmlPath = path.resolve(apliHubDir, 'index.html');
const mainJsPath = path.resolve(apliHubDir, 'js/main.js');

const timestamp = Date.now();

console.log('Force cache reset & ensuring pristine classic sidebar tabs...');

// 1. Update Algo Analyzer index.html with cache buster
if (fs.existsSync(algoHtmlPath)) {
  let html = fs.readFileSync(algoHtmlPath, 'utf8');
  html = html.replace(/href="css\/style\.css.*?"/g, `href="css/style.css?v=${timestamp}"`);
  html = html.replace(/src="js\/app\.js.*?"/g, `src="js/app.js?v=${timestamp}"`);
  html = html.replace(/src="js\/youtubeAnalytics\.js.*?"/g, `src="js/youtubeAnalytics.js?v=${timestamp}"`);
  fs.writeFileSync(algoHtmlPath, html, 'utf8');
  console.log('[1/4] Added cache busters to Algo analyzer/index.html');
}

// 2. Refine Algo Analyzer css/style.css
if (fs.existsSync(algoCssPath)) {
  let css = fs.readFileSync(algoCssPath, 'utf8');

  const pristineTabsCss = `
/* ==========================================================================
   CLASSIC SLEEK SIDEBAR TABS (YOUTUBE, TIKTOK, INSTAGRAM, ETC.)
   ========================================================================== */
.sidebar-tabs {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
}

.tab-btn {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 14px !important;
    padding: 12px 16px !important;
    background: transparent !important;
    border: 1px solid transparent !important;
    border-radius: 10px !important;
    color: var(--color-text-muted) !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    transition: var(--transition) !important;
    width: 100% !important;
    text-align: left !important;
    position: relative !important;
    height: auto !important;
    min-height: unset !important;
    box-shadow: none !important;
}

.tab-btn svg {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    min-height: 20px !important;
    max-width: 20px !important;
    max-height: 20px !important;
    stroke: var(--color-text-dim) !important;
    fill: none !important;
    transition: var(--transition) !important;
    flex-shrink: 0 !important;
    display: block !important;
}

.tab-btn span {
    font-size: 14px !important;
    color: inherit !important;
    font-weight: inherit !important;
}

.tab-btn:hover {
    color: var(--color-text-primary) !important;
    background: rgba(250, 204, 21, 0.05) !important;
    border-color: rgba(250, 204, 21, 0.1) !important;
    transform: none !important;
    box-shadow: none !important;
}

.tab-btn:hover svg {
    stroke: var(--color-yellow-main) !important;
}

.tab-btn.active {
    background: rgba(250, 204, 21, 0.12) !important;
    border-color: rgba(250, 204, 21, 0.3) !important;
    color: var(--color-yellow-main) !important;
    font-weight: 600 !important;
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.1) !important;
}

.tab-btn.active svg {
    stroke: var(--color-yellow-main) !important;
    filter: drop-shadow(0 0 5px var(--color-yellow-main)) !important;
    fill: none !important;
}

.tab-btn.active::before {
    content: '' !important;
    position: absolute !important;
    left: -14px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    width: 4px !important;
    height: 24px !important;
    background: var(--color-yellow-main) !important;
    border-radius: 0 4px 4px 0 !important;
    box-shadow: 0 0 10px var(--color-yellow-main) !important;
}
`;

  // Clean out any custom per-tab rules if any remain and replace the tabs section
  const tabsRegex = /\/\* Sidebar Navigation Tabs \*\/[\s\S]*?\.tab-btn\.active::before\s*\{[\s\S]*?\}\s*/;
  if (tabsRegex.test(css)) {
    css = css.replace(tabsRegex, pristineTabsCss.trim() + '\n\n');
  } else {
    const classicRegex = /\/\* ==========================================================================\s*CLASSIC SLEEK SIDEBAR TABS[\s\S]*?\.tab-btn\.active::before\s*\{[\s\S]*?\}\s*/;
    if (classicRegex.test(css)) {
      css = css.replace(classicRegex, pristineTabsCss.trim() + '\n\n');
    }
  }

  fs.writeFileSync(algoCssPath, css, 'utf8');
  console.log('[2/4] Enforced classic tab CSS in Algo analyzer/css/style.css');
}

// 3. Update main index.html with new timestamp
if (fs.existsSync(mainHtmlPath)) {
  let html = fs.readFileSync(mainHtmlPath, 'utf8');
  html = html.replace(/js\/main\.js\?v=[\w\d_]+/g, `js/main.js?v=${timestamp}`);
  html = html.replace(/css\/style\.css\?v=[\w\d_]+/g, `css/style.css?v=${timestamp}`);
  fs.writeFileSync(mainHtmlPath, html, 'utf8');
  console.log('[3/4] Updated cache busters in main index.html');
}

// 4. Update main js/main.js to include timestamp when launching iframe
if (fs.existsSync(mainJsPath)) {
  let js = fs.readFileSync(mainJsPath, 'utf8');
  js = js.replace(/iframe\.src = 'Algo analyzer\/index\.html.*?';/g, `iframe.src = 'Algo analyzer/index.html?v=' + Date.now();`);
  fs.writeFileSync(mainJsPath, js, 'utf8');
  console.log('[4/4] Updated iframe src in js/main.js to force cache-busting');
}

console.log('[SUCCESS] Force cache reset complete.');
