const fs = require('fs');
const path = require('path');

const apliHubDir = path.resolve(__dirname, '../../');
const konwDir = path.resolve(apliHubDir, 'Fast Konwerter');
const hubHtmlPath = path.resolve(apliHubDir, 'index.html');
const mainJsPath = path.resolve(apliHubDir, 'js/main.js');
const konwHtmlPath = path.resolve(konwDir, 'index.html');
const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');

console.log('Finalizing cache busters and 100% reliable tab switching...');

// 1. Update index.html cache busters
if (fs.existsSync(hubHtmlPath)) {
  let html = fs.readFileSync(hubHtmlPath, 'utf8');
  html = html.replace(/js\/main\.js\?v=\w+/g, 'js/main.js?v=20260815_' + Date.now());
  html = html.replace(/js\/data\.js\?v=\w+/g, 'js/data.js?v=20260815_' + Date.now());
  html = html.replace(/css\/style\.css\?v=\w+/g, 'css/style.css?v=20260815_' + Date.now());
  fs.writeFileSync(hubHtmlPath, html, 'utf8');
  console.log('[1/4] Updated cache busters in main index.html');
}

// 2. Update Fast Konwerter index.html cache buster
if (fs.existsSync(konwHtmlPath)) {
  let html = fs.readFileSync(konwHtmlPath, 'utf8');
  html = html.replace(/src="js\/converter-app\.js.*?"/g, 'src="js/converter-app.js?v=20260815_' + Date.now() + '"');
  fs.writeFileSync(konwHtmlPath, html, 'utf8');
  console.log('[2/4] Updated cache buster in Fast Konwerter/index.html');
}

// 3. Update Fast Konwerter js/converter-app.js with window.switchTab
if (fs.existsSync(konwJsPath)) {
  let js = fs.readFileSync(konwJsPath, 'utf8');
  
  const switchTabGlobal = `
/* Global Tab Switcher for parent window & direct activation */
window.switchTab = function(tabId) {
  try {
    var targetBtn = document.querySelector('.nav-tab-btn[data-tab="' + tabId + '"]');
    if (targetBtn) {
      targetBtn.click();
    }
  } catch (e) {
    console.error('Error in switchTab:', e);
  }
};

function checkDirectTabActivation() {
  function activate() {
    try {
      var hash = window.location.hash;
      var params = new URLSearchParams(window.location.search);
      var targetTabId = params.get('tab') || (hash ? hash.replace('#', '') : '');

      if (targetTabId && window.switchTab) {
        window.switchTab(targetTabId);
      }
    } catch (e) {}
  }

  activate();
  window.addEventListener('hashchange', activate);
  setTimeout(activate, 50);
  setTimeout(activate, 150);
  setTimeout(activate, 400);
}
`;

  if (js.includes('window.switchTab')) {
    js = js.replace(/\/\* Global Tab Switcher[\s\S]*?setTimeout\(activate, 400\);\s*\}/, switchTabGlobal.trim());
  } else {
    js = js.replace(/\/\* Direct Tab Activation via Hash or URL Param \*\/[\s\S]*?\}\s*\}/, switchTabGlobal.trim());
  }
  
  fs.writeFileSync(konwJsPath, js, 'utf8');
  console.log('[3/4] Updated window.switchTab in Fast Konwerter/js/converter-app.js');
}

// 4. Update js/main.js to wire iframe.onload and direct sandbox triggers
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

  const solidSandboxCode = `
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
    // Plixy Extension Simulator Mode (Jak działa?)
    iframe.src = 'Fast Konwerter/index.html?tab=tab-extension-sim&cb=' + Date.now() + '#tab-extension-sim';
    iframe.onload = function() {
      try {
        if (iframe.contentWindow && typeof iframe.contentWindow.switchTab === 'function') {
          iframe.contentWindow.switchTab('tab-extension-sim');
        }
      } catch (e) {}
    };
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
    // Plixy Full Hub / Converter Studio & Download Page
    const targetTab = initialTab || 'tab-studio';
    iframe.src = 'Fast Konwerter/index.html?tab=' + targetTab + '&cb=' + Date.now() + '#' + targetTab;
    iframe.onload = function() {
      try {
        if (iframe.contentWindow && typeof iframe.contentWindow.switchTab === 'function') {
          iframe.contentWindow.switchTab(targetTab);
        }
      } catch (e) {}
    };
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

  mainJs = mainJs.replace(/window\.currentSandboxApp = 'algo';[\s\S]*?sandbox\.classList\.add\('active'\);[\s\S]*?document\.body\.style\.overflow = 'hidden';[\s\S]*?if \(typeof SoundFX !== 'undefined' && SoundFX\.playNavHover\) SoundFX\.playNavHover\(\);\s*\};/, solidSandboxCode.trim());

  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('[4/4] Updated openLiveAppSandbox in js/main.js with onload hook');
}

console.log('[SUCCESS] All cache busters and tab synchronization routines ready.');
