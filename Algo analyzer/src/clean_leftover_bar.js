const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const rootIndexPath = path.resolve(rootDir, 'index.html');
const rootCssPath = path.resolve(rootDir, 'css/style.css');

const ts = Date.now();
console.log(`Completely removing leftover sandbox switcher bar... (timestamp: ${ts})`);

// 1. UPDATE index.html
if (fs.existsSync(rootIndexPath)) {
  let html = fs.readFileSync(rootIndexPath, 'utf8');

  // Match from <!-- Fullscreen Live Interactive App Sandbox to before <!-- Toast Notification Container
  const sandboxBlockRegex = /<!-- Fullscreen Live Interactive App Sandbox[\s\S]*?<!-- Toast Notification Container/;
  const cleanSandboxHtml = `<!-- Fullscreen Live Interactive App Sandbox -->
  <div class="app-test-sandbox" id="appTestSandbox">
    <iframe id="sandboxIframe" src="about:blank" title="Symulator ApliHub" frameborder="0"></iframe>
  </div>

  <!-- Toast Notification Container`;

  html = html.replace(sandboxBlockRegex, cleanSandboxHtml);

  // Cache buster bump
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/main\.js(\?v=[\w\d_.-]+)?/g, `js/main.js?v=${ts}`);
  html = html.replace(/js\/data\.js(\?v=[\w\d_.-]+)?/g, `js/data.js?v=${ts}`);
  html = html.replace(/js\/profile\.js(\?v=[\w\d_.-]+)?/g, `js/profile.js?v=${ts}`);

  fs.writeFileSync(rootIndexPath, html, 'utf8');
  console.log('[1/2] index.html completely cleaned.');
}

// 2. CLEAN css/style.css
if (fs.existsSync(rootCssPath)) {
  let css = fs.readFileSync(rootCssPath, 'utf8');

  // Remove sandbox-header, sandbox-center and all leftover bar styles
  const barStylesRegex = /\.sandbox-header\s*\{[\s\S]*?\.sandbox-frame-wrapper\s*\{[\s\S]*?\}/;
  if (barStylesRegex.test(css)) {
    css = css.replace(barStylesRegex, '');
  }

  // Ensure clean app-test-sandbox style
  const appSandboxRegex = /\.app-test-sandbox\s*\{[\s\S]*?\.app-test-sandbox\s+iframe\s*\{[\s\S]*?\}/;
  const cleanAppSandboxCss = `.app-test-sandbox {
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

  if (appSandboxRegex.test(css)) {
    css = css.replace(appSandboxRegex, cleanAppSandboxCss);
  }

  fs.writeFileSync(rootCssPath, css, 'utf8');
  console.log('[2/2] css/style.css cleaned.');
}

console.log('=== LEFTOVER BAR PERMANENTLY REMOVED ===');
