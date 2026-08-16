const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..');

console.log('Root dir:', rootDir);

// 1. Update js/data.js
const dataJsPath = path.join(rootDir, 'js', 'data.js');
if (fs.existsSync(dataJsPath)) {
  let dataJs = fs.readFileSync(dataJsPath, 'utf8');

  // Add isApliHubAuthorizedUser helper
  const authHelperCode = `
// Helper to check if current user has authorized testing/download permissions
function isApliHubAuthorizedUser(user) {
  const u = user || (typeof getApliHubUserData === 'function' ? getApliHubUserData() : null);
  if (!u || u.isLoggedIn === false || !u.email) return false;
  return u.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com';
}
window.isApliHubAuthorizedUser = isApliHubAuthorizedUser;
`;

  if (!dataJs.includes('isApliHubAuthorizedUser')) {
    dataJs = dataJs.replace('const DEFAULT_USER_STORE = {', authHelperCode + '\nconst DEFAULT_USER_STORE = {');
  }

  // Update getApliHubRegisteredUsers to include vertis.biznes758@gmail.com default
  const newGetRegUsers = `function getApliHubRegisteredUsers() {
  const defaultAccounts = {
    'vertis.biznes758@gmail.com': {
      username: 'vertis_biznes',
      name: 'Vertis Admin',
      email: 'vertis.biznes758@gmail.com',
      password: 'password123',
      avatar: 'V',
      selectedAvatar: 'V',
      accountType: 'ADMINISTRATOR',
      isVerified: true,
      joinedDate: '01.08.2026 r.'
    }
  };

  try {
    const saved = localStorage.getItem('aplihub_registered_users');
    if (saved) {
      return { ...defaultAccounts, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading registered users:', e);
  }
  return defaultAccounts;
}`;

  dataJs = dataJs.replace(/function getApliHubRegisteredUsers\(\)\s*\{[\s\S]*?return\s*\{\};?\s*\}/, newGetRegUsers);

  fs.writeFileSync(dataJsPath, dataJs, 'utf8');
  console.log('[1/4] Successfully updated js/data.js');
}

// 2. Update js/main.js
const mainJsPath = path.join(rootDir, 'js', 'main.js');
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

  // Replace openLiveAppSandbox with strict vertis.biznes758@gmail.com gate
  const newSandboxCode = `window.showAccessBlockedModal = function(actionType) {
  const backdrop = document.getElementById('modalBackdrop');
  const title = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');
  if (!backdrop || !title || !content) return;

  const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
  const isLoggedOut = !user || user.isLoggedIn === false;
  const isWrongUser = user && user.isLoggedIn && user.email !== 'vertis.biznes758@gmail.com';

  title.innerHTML = '<span style="color: #ef4444; display: flex; align-items: center; justify-content: center; gap: 8px;">🔒 Dostęp Zablokowany</span>';
  
  content.innerHTML = \`
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; padding: 10px 0;">
      <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); border: 2px solid rgba(239, 68, 68, 0.4); display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);">
        🔒
      </div>

      <div>
        <span style="display: inline-block; font-size: 0.75rem; font-weight: 800; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 3px 10px; border-radius: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
          Faza Integracji Social Media
        </span>
        <h4 style="font-size: 1.15rem; font-weight: 800; color: #fff; line-height: 1.3;">
          \${actionType === 'download' ? 'Pobieranie plików aplikacji zablokowane' : 'Testowanie aplikacji w przeglądarce zablokowane'}
        </h4>
        <p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 8px; line-height: 1.5;">
          Możliwość testowania w przeglądarce oraz pobierania plików instalacyjnych została tymczasowo wstrzymana ze względu na trwające prace nad integracją połączenia kont społecznościowych z Algo Analyzerem.
        </p>
      </div>

      <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 12px 16px; width: 100%; text-align: left;">
        <div style="font-size: 0.78rem; color: #94a3b8; font-weight: 600; margin-bottom: 4px;">Uprawnione konto administratora:</div>
        <div style="color: #fbbf24; font-family: monospace; font-weight: 700; font-size: 0.92rem; display: flex; align-items: center; justify-content: space-between;">
          <span>vertis.biznes758@gmail.com</span>
          <span style="font-size: 0.72rem; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 2px 6px; border-radius: 6px;">Wymagane</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 6px;">
        \${isLoggedOut ? \`
          <button type="button" class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.9rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800;" onclick="window.closeApliHubModal(); if (typeof openLoginModal === 'function') openLoginModal('vertis.biznes758@gmail.com');">
            🔑 Zaloguj się na konto vertis.biznes758@gmail.com
          </button>
        \` : isWrongUser ? \`
          <button type="button" class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.9rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800;" onclick="window.closeApliHubModal(); localStorage.setItem('aplihub_logged_out', 'true'); if (typeof saveApliHubUserData === 'function') saveApliHubUserData({ ...DEFAULT_USER_STORE, isLoggedIn: false, name: 'Gość', email: '' }); if (typeof openLoginModal === 'function') openLoginModal('vertis.biznes758@gmail.com');">
            🔁 Przełącz konto na vertis.biznes758@gmail.com
          </button>
        \` : ''}
        <button type="button" class="btn-download" style="justify-content: center; padding: 10px; font-size: 0.85rem; background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.1);" onclick="window.closeApliHubModal()">
          Rozumiem, zamknij
        </button>
      </div>
    </div>
  \`;

  backdrop.classList.add('active');
};

window.openLiveAppSandbox = function(appType, initialTab) {
  const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
  const isAuthorized = user && user.isLoggedIn === true && user.email && user.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com';

  if (!isAuthorized) {
    window.showAccessBlockedModal('test');
    return;
  }

  const sandbox = document.getElementById('appTestSandbox');
  const iframe = document.getElementById('sandboxIframe');
  if (!sandbox || !iframe) return;

  if (appType === 'algo' || appType === 'algo-demo') {
    iframe.src = 'Algo analyzer/index.html?cb=' + Date.now();
  } else if (appType === 'plixy-sim' || appType === 'konwerter-sim') {
    iframe.src = 'Fast Konwerter/index.html?tab=tab-extension-sim&cb=' + Date.now() + '#tab-extension-sim';
  } else {
    const tab = initialTab || 'tab-studio';
    iframe.src = 'Fast Konwerter/index.html?tab=' + tab + '&cb=' + Date.now() + '#' + tab;
  }

  sandbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (typeof SoundFX !== 'undefined' && SoundFX.playNavHover) SoundFX.playNavHover();
};`;

  mainJs = mainJs.replace(/window\.openLiveAppSandbox\s*=\s*function\(appType,\s*initialTab\)[\s\S]*?SoundFX\.playNavHover\(\);\s*\};/, newSandboxCode);

  // Update openAppLaunchModal
  const newLaunchModalCode = `window.openAppLaunchModal = function(item) {
  const backdrop = document.getElementById('modalBackdrop');
  const title = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');

  if (!backdrop || !title || !content) return;

  const isAlgo = item.id === 'app-1' || item.name.includes('Algo Analyzer');
  const isKonwerter = item.id === 'plug-2' || item.name.includes('Plixy') || item.name.includes('Fast Konwerter');

  title.innerHTML = \`⚡ \${item.name} <span style="font-size: 0.8rem; opacity: 0.7;">(\${item.version})</span>\`;

  let downloadUrl = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
  let downloadLabel = 'Pobierz Instalator Windows (.exe)';
  let extDownloadHtml = '';

  if (isAlgo) {
    downloadUrl = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
    downloadLabel = 'Pobierz Instalator Algo Analyzer (.exe)';
  } else if (isKonwerter) {
    downloadUrl = 'assets/installer/ApliHub_FastKonwerter_Setup.exe';
    downloadLabel = 'Pobierz Instalator Plixy (.exe)';
    extDownloadHtml = \`
      <a href="assets/installer/Fast_Konwerter_Chrome_Extension.zip" download="Fast_Konwerter_Chrome_Extension.zip" class="btn-download" style="text-decoration: none; justify-content: center; background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); padding: 12px; border-radius: 8px;">
        📦 Pobierz Paczkę Chrome Web Store (.zip)
      </a>
    \`;
  }

  const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
  const isAuthorized = user && user.isLoggedIn === true && user.email && user.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com';

  let testSectionHtml = '';
  let exeSectionHtml = '';

  if (isAuthorized) {
    testSectionHtml = \`
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 0.95rem; color: #60a5fa; display: flex; align-items: center; gap: 8px;">
            <span>🚀</span> Tryb Testowy w Przeglądarce
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 8px; border-radius: 12px;">Dostęp Aktywny ✓</span>
        </div>
        <p style="font-size: 0.8rem; color: #cbd5e1;">
          Uruchom pełną wersję aplikacji ze wszystkimi funkcjami, analizami AI i integracjami bezpośrednio w przeglądarce.
        </p>
        <button class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.9rem; background: linear-gradient(135deg, #2563eb, #06b6d4); color: #fff;" onclick="window.closeApliHubModal(); window.openLiveAppSandbox('\${isAlgo ? 'algo' : 'konwerter'}');">
          🧪 Uruchom Aplikację Teraz (Test Online)
        </button>
      </div>
    \`;

    exeSectionHtml = \`
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="font-weight: 800; font-size: 0.9rem; color: #fff; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>🖥️</span> Plik Wykonywalny dla Windows
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 2px 8px; border-radius: 12px;">Dostęp Administratora ✓</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          Pobierz natywny plik wykonywalny .exe gotowy do uruchomienia na Twoim komputerze.
        </p>
        <a href="\${downloadUrl}" download class="btn-download" style="text-decoration: none; justify-content: center; padding: 12px; font-size: 0.88rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000;">
          ⬇️ \${downloadLabel}
        </a>
        \${extDownloadHtml}
      </div>
    \`;
  } else {
    testSectionHtml = \`
      <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 0.95rem; color: #f87171; display: flex; align-items: center; gap: 8px;">
            <span>🔒</span> Tryb Testowy w Przeglądarce
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 2px 8px; border-radius: 12px;">Zablokowane</span>
        </div>
        <p style="font-size: 0.8rem; color: #94a3b8;">
          Testowanie aplikacji w przeglądarce jest obecnie zablokowane ze względu na trwające prace nad integracją połączenia kont Social Media z Algo Analyzerem.
        </p>
        <button class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.88rem; background: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); cursor: pointer;" onclick="window.showAccessBlockedModal('test')">
          🔒 Test Online Zablokowany (Tylko vertis.biznes758@gmail.com)
        </button>
      </div>
    \`;

    exeSectionHtml = \`
      <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 0.9rem; color: #fbbf24; display: flex; align-items: center; gap: 8px;">
            <span>🖥️</span> Plik Wykonywalny dla Windows
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 2px 8px; border-radius: 12px;">Faza Deweloperska</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          Pobieranie plików instalacyjnych .exe oraz rozszerzeń jest zablokowane dla innych użytkowników niż konto administratora (vertis.biznes758@gmail.com).
        </p>
        <button class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.88rem; background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); cursor: pointer;" onclick="window.showAccessBlockedModal('download')">
          🔒 Pobieranie Zablokowane (Tylko vertis.biznes758@gmail.com)
        </button>
      </div>
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

      <!-- Choice 1: Run In Browser -->
      \${testSectionHtml}

      <!-- Choice 2: Download Executable -->
      \${exeSectionHtml}
    </div>
  \`;

  backdrop.classList.add('active');
};`;

  mainJs = mainJs.replace(/window\.openAppLaunchModal\s*=\s*function\(item\)[\s\S]*?backdrop\.classList\.add\('active'\);\s*\};/, newLaunchModalCode);

  // Update createToolCard Przetestuj buttons to trigger authorization check directly
  mainJs = mainJs.replace(
    /onclick="event\.stopPropagation\(\);\s*window\.openLiveAppSandbox\('algo'\)"/g,
    `onclick="event.stopPropagation(); const u = typeof getApliHubUserData === 'function' ? getApliHubUserData() : null; if (u && u.isLoggedIn && u.email && u.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com') { window.openLiveAppSandbox('algo'); } else { window.showAccessBlockedModal('test'); }"`
  );

  mainJs = mainJs.replace(
    /onclick="event\.stopPropagation\(\);\s*window\.openLiveAppSandbox\('plixy-sim'\)"/g,
    `onclick="event.stopPropagation(); const u = typeof getApliHubUserData === 'function' ? getApliHubUserData() : null; if (u && u.isLoggedIn && u.email && u.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com') { window.openLiveAppSandbox('plixy-sim'); } else { window.showAccessBlockedModal('test'); }"`
  );

  mainJs = mainJs.replace(
    /onclick="event\.stopPropagation\(\);\s*window\.openLiveAppSandbox\('konwerter'\)"/g,
    `onclick="event.stopPropagation(); const u = typeof getApliHubUserData === 'function' ? getApliHubUserData() : null; if (u && u.isLoggedIn && u.email && u.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com') { window.openLiveAppSandbox('konwerter'); } else { window.showAccessBlockedModal('download'); }"`
  );

  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('[2/4] Successfully updated js/main.js');
}

// 3. Update Algo analyzer/index.html & Algo analyzer/js/app.js
const algoIndexPath = path.join(rootDir, 'Algo analyzer', 'index.html');
if (fs.existsSync(algoIndexPath)) {
  let algoHtml = fs.readFileSync(algoIndexPath, 'utf8');

  // Ensure ApliHub Suite subtitle is removed
  algoHtml = algoHtml.replace(/<span class="logo-subtitle">ApliHub Suite<\/span>/g, '');

  // Add Access Gate Lock overlay HTML before </body> if not present
  const gateHtml = `
    <!-- Dedicated Access Gate Overlay for Unauthorized Users -->
    <div id="algo-access-gate-overlay" style="display: none; position: fixed; inset: 0; z-index: 999999; background: rgba(3, 7, 18, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); align-items: center; justify-content: center; padding: 20px;">
      <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 20px; max-width: 480px; width: 100%; padding: 32px 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.15);">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); border: 2px solid rgba(239, 68, 68, 0.4); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; box-shadow: 0 0 30px rgba(239, 68, 68, 0.3);">
          🔒
        </div>
        <div>
          <span style="display: inline-block; font-size: 0.75rem; font-weight: 800; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 3px 12px; border-radius: 12px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em;">
            Faza Integracji Social Media
          </span>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 8px;">Dostęp do Algo Analyzer Zablokowany</h3>
          <p style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5;">
            Aplikacja Algo Analyzer jest obecnie w trakcie prac nad integracją i łączeniem kont społecznościowych. Dostęp do testowania i analizy posiadają wyłącznie autoryzowane konta administratora.
          </p>
        </div>

        <div style="background: rgba(3, 7, 18, 0.7); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 12px 16px; width: 100%; text-align: left;">
          <div style="font-size: 0.78rem; color: #94a3b8; font-weight: 600; margin-bottom: 4px;">Wymagane konto z uprawnieniami:</div>
          <div style="color: #fbbf24; font-family: monospace; font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; justify-content: space-between;">
            <span>vertis.biznes758@gmail.com</span>
            <span style="font-size: 0.72rem; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 2px 6px; border-radius: 6px;">ADMIN</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 6px;">
          <button type="button" id="btn-gate-login" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: 12px; font-size: 0.92rem; cursor: pointer; transition: all 0.2s ease;">
            🔑 Zaloguj jako vertis.biznes758@gmail.com
          </button>
          <button type="button" onclick="window.handleBackToHub()" style="width: 100%; padding: 11px; background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; font-size: 0.88rem; cursor: pointer;">
            ← Wróć do ApliHub
          </button>
        </div>
      </div>
    </div>
`;

  if (!algoHtml.includes('id="algo-access-gate-overlay"')) {
    algoHtml = algoHtml.replace('</body>', gateHtml + '\n</body>');
  }

  fs.writeFileSync(algoIndexPath, algoHtml, 'utf8');
  console.log('[3/4] Successfully updated Algo analyzer/index.html');
}

// 4. Update Algo analyzer/js/app.js to check access gate
const algoAppJsPath = path.join(rootDir, 'Algo analyzer', 'js', 'app.js');
if (fs.existsSync(algoAppJsPath)) {
  let algoAppJs = fs.readFileSync(algoAppJsPath, 'utf8');

  const gateCheckCode = `
/* ==========================================================================
   ALGO ANALYZER ACCESS GATE SECURITY CHECK
   ========================================================================== */
function checkAlgoAccessGate() {
  const gateOverlay = document.getElementById('algo-access-gate-overlay');
  if (!gateOverlay) return;

  const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : null;
  const isAuthorized = user && user.isLoggedIn === true && user.email && user.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com';

  if (!isAuthorized) {
    gateOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } else {
    gateOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  const btnGateLogin = document.getElementById('btn-gate-login');
  if (btnGateLogin && !btnGateLogin._hasGateEvent) {
    btnGateLogin._hasGateEvent = true;
    btnGateLogin.addEventListener('click', () => {
      if (typeof saveApliHubUserData === 'function') {
        const registeredUsers = typeof getApliHubRegisteredUsers === 'function' ? getApliHubRegisteredUsers() : {};
        const adminUser = registeredUsers['vertis.biznes758@gmail.com'] || {
          username: 'vertis_biznes',
          name: 'Vertis Admin',
          email: 'vertis.biznes758@gmail.com',
          avatar: 'V',
          selectedAvatar: 'V',
          accountType: 'ADMINISTRATOR',
          isVerified: true
        };

        saveApliHubUserData({
          ...DEFAULT_USER_STORE,
          ...adminUser,
          isLoggedIn: true
        });

        if (typeof showToast === 'function') {
          showToast('Zalogowano pomyślnie na konto administratora vertis.biznes758@gmail.com! ✓');
        }

        checkAlgoAccessGate();
        if (typeof syncUserInfo === 'function') syncUserInfo();
      }
    });
  }
}
`;

  if (!algoAppJs.includes('checkAlgoAccessGate')) {
    algoAppJs = algoAppJs.replace(
      "document.addEventListener('DOMContentLoaded', () => {",
      gateCheckCode + "\ndocument.addEventListener('DOMContentLoaded', () => {\n    checkAlgoAccessGate();"
    );
  }

  // Also call checkAlgoAccessGate in syncUserInfo
  if (!algoAppJs.includes('checkAlgoAccessGate();') || algoAppJs.indexOf('checkAlgoAccessGate();') === algoAppJs.lastIndexOf('checkAlgoAccessGate();')) {
    algoAppJs = algoAppJs.replace('function syncUserInfo() {', 'function syncUserInfo() {\n    if (typeof checkAlgoAccessGate === "function") checkAlgoAccessGate();');
  }

  fs.writeFileSync(algoAppJsPath, algoAppJs, 'utf8');
  console.log('[4/4] Successfully updated Algo analyzer/js/app.js');
}

// 5. Update Fast Konwerter/index.html & Fast Konwerter/js/converter-app.js
const konwerterIndexPath = path.join(rootDir, 'Fast Konwerter', 'index.html');
if (fs.existsSync(konwerterIndexPath)) {
  let konwerterHtml = fs.readFileSync(konwerterIndexPath, 'utf8');

  // Intercept webstore download buttons
  konwerterHtml = konwerterHtml.replace(
    /<a href="(\.\.\/assets\/installer\/[^"]+)" download="([^"]+)" class="btn-techno-action"([^>]*)>/g,
    `<a href="$1" download="$2" class="btn-techno-action btn-check-auth-download"$3>`
  );

  fs.writeFileSync(konwerterIndexPath, konwerterHtml, 'utf8');
}

const konwerterAppJsPath = path.join(rootDir, 'Fast Konwerter', 'js', 'converter-app.js');
if (fs.existsSync(konwerterAppJsPath)) {
  let konwerterAppJs = fs.readFileSync(konwerterAppJsPath, 'utf8');

  const konwerterAuthGate = `
  // Check authorization on webstore download buttons
  document.querySelectorAll('.btn-check-auth-download').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
      var isAuthorized = user && user.isLoggedIn === true && user.email && user.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com';
      if (!isAuthorized) {
        e.preventDefault();
        alert('🔒 Pobieranie plików instalacyjnych jest zablokowane podczas integracji kont Social Media. Dostęp aktywny wyłącznie dla: vertis.biznes758@gmail.com');
      }
    });
  });
`;

  if (!konwerterAppJs.includes('btn-check-auth-download')) {
    konwerterAppJs = konwerterAppJs.replace(
      'document.addEventListener(\'DOMContentLoaded\', function() {',
      'document.addEventListener(\'DOMContentLoaded\', function() {\n' + konwerterAuthGate
    );
  }

  // Also check auth in Studio Converter
  if (!konwerterAppJs.includes('var isAuthorizedUser')) {
    konwerterAppJs = konwerterAppJs.replace(
      'btnAction.addEventListener(\'click\', function() {',
      `btnAction.addEventListener('click', function() {
    var user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
    var isAuthorizedUser = user && user.isLoggedIn === true && user.email && user.email.toLowerCase().trim() === 'vertis.biznes758@gmail.com';
    if (!isAuthorizedUser) {
      if (errorBox) {
        errorBox.textContent = '🔒 Testowanie konwertera w przeglądarce jest obecnie zablokowane (dostęp tylko dla konta vertis.biznes758@gmail.com).';
        errorBox.style.display = 'block';
      }
      alert('🔒 Testowanie konwertera jest obecnie zablokowane z powodu prac nad integracją kont Social Media. Dostęp wyłącznie dla vertis.biznes758@gmail.com.');
      return;
    }`
    );
  }

  fs.writeFileSync(konwerterAppJsPath, konwerterAppJs, 'utf8');
  console.log('[5/5] Successfully updated Fast Konwerter');
}

console.log('ALL UPDATES COMPLETE!');
