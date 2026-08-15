const fs = require('fs');
const path = require('path');

const apliHubDir = path.resolve(__dirname, '../../');
const konwDir = path.resolve(apliHubDir, 'Fast Konwerter');
const mainJsPath = path.resolve(apliHubDir, 'js/main.js');
const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');

console.log('Refining Plixy tab activation and sandbox switcher...');

// 1. Update Fast Konwerter/js/converter-app.js
if (fs.existsSync(konwJsPath)) {
  let js = fs.readFileSync(konwJsPath, 'utf8');

  // Replace checkDirectTabActivation with a robust version that handles DOMContentLoaded, hashchange, and timeout
  const robustTabActivation = `
/* Direct Tab Activation via Hash or URL Param */
function checkDirectTabActivation() {
  function activate() {
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

  activate();
  window.addEventListener('hashchange', activate);
  setTimeout(activate, 50);
  setTimeout(activate, 200);
}
`;

  js = js.replace(/\/\* Direct Tab Activation via Hash or URL Param \*\/[\s\S]*?\}\s*\}/, robustTabActivation.trim());
  fs.writeFileSync(konwJsPath, js, 'utf8');
  console.log('[1/2] Updated checkDirectTabActivation in converter-app.js');
}

// 2. Update js/main.js sandbox iframe URLs
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

  // Update switchSandboxApp and openLiveAppSandbox
  const updatedSandboxLogic = `
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
    iframe.src = 'Algo analyzer/index.html?cb=' + Date.now();
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
    // Plixy Simulation (Jak działa?)
    iframe.src = 'Fast Konwerter/index.html?tab=tab-extension-sim&cb=' + Date.now() + '#tab-extension-sim';
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
    const tabTarget = initialTab || 'tab-studio';
    iframe.src = 'Fast Konwerter/index.html?tab=' + tabTarget + '&cb=' + Date.now() + '#' + tabTarget;
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

  mainJs = mainJs.replace(/window\.currentSandboxApp = 'algo';[\s\S]*?sandbox\.classList\.add\('active'\);[\s\S]*?document\.body\.style\.overflow = 'hidden';[\s\S]*?if \(typeof SoundFX !== 'undefined' && SoundFX\.playNavHover\) SoundFX\.playNavHover\(\);\s*\};/, updatedSandboxLogic.trim());
  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('[2/2] Updated openLiveAppSandbox in js/main.js');
}

console.log('[SUCCESS] All tab routing fixes applied successfully.');
