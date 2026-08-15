const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(rootDir, 'Fast Konwerter');

const ts = Date.now();
console.log(`Executing Comprehensive Full Alignment Update... (timestamp: ${ts})`);

// ==========================================================================
// 1. UPDATE js/data.js
// ==========================================================================
const dataJsPath = path.resolve(rootDir, 'js/data.js');
if (fs.existsSync(dataJsPath)) {
  let js = fs.readFileSync(dataJsPath, 'utf8');
  
  // Ensure default user has vertis email or admin access
  js = js.replace(/name:\s*"Plixy"/g, 'name: "Plikio"');
  js = js.replace(/name:\s*"Fast Konwerter"/g, 'name: "Plikio"');
  js = js.replace(/Pobierz film lub piosenkę z YouTube, TikToka albo Instagrama/g, 'Pobierz film lub piosenkę z YouTube, TikToka, Facebooka albo Instagrama');
  js = js.replace(/Wklej link z YouTube, TikToka lub Instagrama/g, 'Wklej link z YouTube, TikToka, Facebooka lub Instagrama');
  
  fs.writeFileSync(dataJsPath, js, 'utf8');
  console.log('[1/6] data.js synchronized.');
}

// ==========================================================================
// 2. UPDATE js/main.js
// ==========================================================================
const mainJsPath = path.resolve(rootDir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
  let js = fs.readFileSync(mainJsPath, 'utf8');

  // Enforce Plikio brand
  js = js.replace(/Plixy/g, 'Plikio');

  // Ensure openAppLaunchModal checks authorization for vertis.biznes758@gmail.com
  const launchModalRegex = /window\.openAppLaunchModal\s*=\s*function\(item\)\s*\{[\s\S]*?backdrop\.classList\.add\('active'\);\s*\};/;
  const newLaunchModalCode = `window.openAppLaunchModal = function(item) {
  const backdrop = document.getElementById('modalBackdrop');
  const title = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');

  if (!backdrop || !title || !content) return;

  const isAlgo = item.id === 'app-1' || item.name.includes('Algo Analyzer');
  const isKonwerter = item.id === 'plug-2' || item.name.includes('Plikio') || item.name.includes('Fast Konwerter');

  title.innerHTML = \`⚡ \${item.name} <span style="font-size: 0.8rem; opacity: 0.7;">(\${item.version})</span>\`;

  let downloadUrl = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
  let downloadLabel = 'Pobierz Instalator Windows (.exe)';
  let extDownloadHtml = '';

  if (isAlgo) {
    downloadUrl = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
    downloadLabel = 'Pobierz Instalator Algo Analyzer (.exe)';
  } else if (isKonwerter) {
    downloadUrl = 'assets/installer/ApliHub_FastKonwerter_Setup.exe';
    downloadLabel = 'Pobierz Instalator Plikio (.exe)';
    extDownloadHtml = \`
      <a href="assets/installer/Fast_Konwerter_Chrome_Extension.zip" download="Fast_Konwerter_Chrome_Extension.zip" class="btn-download" style="text-decoration: none; justify-content: center; background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); padding: 12px; border-radius: 8px;">
        📦 Pobierz Paczkę Chrome Web Store (.zip)
      </a>
    \`;
  }

  const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
  const isAuthorized = user && user.isLoggedIn && (
    user.email === 'vertis.biznes758@gmail.com' || 
    user.email === 'oskar@aplihub.pl' || 
    user.email === 'vertis@aplihub.pl'
  );

  let exeSectionHtml = '';
  if (isAuthorized) {
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
    exeSectionHtml = \`
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="font-weight: 800; font-size: 0.9rem; color: #fff; display: flex; align-items: center; gap: 8px;">
          <span>🖥️</span> Plik Wykonywalny dla Windows
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          Pobieranie plików instalacyjnych .exe jest obecnie w fazie deweloperskiej i aktywne dla konta administratora (vertis.biznes758@gmail.com).
        </p>
        <button class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.88rem; background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); cursor: not-allowed;" onclick="showToast('🔒 Opcja pobierania .exe aktywna tylko dla konta vertis.biznes758@gmail.com. Użyj opcji Tryb Testowy w Przeglądarce!')">
          🔒 Pobierz .EXE (Faza Deweloperska)
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

      <!-- Choice 1: Run In Browser (Recommended) -->
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 800; font-size: 0.95rem; color: #60a5fa; display: flex; align-items: center; gap: 8px;">
            <span>🚀</span> Tryb Testowy w Przeglądarce
          </div>
          <span style="font-size: 0.72rem; font-weight: 800; background: #2563eb; color: #fff; padding: 2px 8px; border-radius: 12px;">Bez Instalacji</span>
        </div>
        <p style="font-size: 0.8rem; color: #cbd5e1;">
          Uruchom pełną wersję aplikacji ze wszystkimi funkcjami, logowaniem, rejestracją i analizami AI bezpośrednio w oknie przeglądarki.
        </p>
        <button class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.9rem; background: linear-gradient(135deg, #2563eb, #06b6d4); color: #fff;" onclick="window.closeApliHubModal(); window.openLiveAppSandbox('\${isAlgo ? 'algo' : 'konwerter'}');">
          🧪 Uruchom Aplikację Teraz (Test Online)
        </button>
      </div>

      <!-- Choice 2: Download Executable -->
      \${exeSectionHtml}
    </div>
  \`;

  backdrop.classList.add('active');
};`;

  if (launchModalRegex.test(js)) {
    js = js.replace(launchModalRegex, newLaunchModalCode);
  }

  fs.writeFileSync(mainJsPath, js, 'utf8');
  console.log('[2/6] main.js synchronized.');
}

// ==========================================================================
// 3. UPDATE Algo analyzer/js/app.js (Auth registration redirect & tabs)
// ==========================================================================
const algoJsPath = path.resolve(algoDir, 'js/app.js');
if (fs.existsSync(algoJsPath)) {
  let js = fs.readFileSync(algoJsPath, 'utf8');

  // Enforce Registration redirects to ApliHub main registration
  const authModuleRegex = /function\s+initAuthModule\(\)\s*\{[\s\S]*?\n\}/;
  const newAuthModuleCode = `function initAuthModule() {
    const tabLogin = document.getElementById('tab-algo-login');
    const tabRegister = document.getElementById('tab-algo-register');
    const formLogin = document.getElementById('form-algo-login');
    const formRegister = document.getElementById('form-algo-register');
    const otpContainer = document.getElementById('algo-otp-container');

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabLogin.style.background = 'var(--color-yellow-main)';
            tabLogin.style.color = '#000';

            tabRegister.classList.remove('active');
            tabRegister.style.background = 'transparent';
            tabRegister.style.color = '#94a3b8';

            if (formLogin) formLogin.style.display = 'flex';
            if (formRegister) formRegister.style.display = 'none';
            if (otpContainer) otpContainer.style.display = 'none';
        });

        tabRegister.addEventListener('click', () => {
            // Requirement: Registration redirects to ApliHub main website registration flow
            if (window.parent && window.parent !== window && typeof window.parent.openApliHubRegisterModal === 'function') {
                closeModal();
                window.parent.openApliHubRegisterModal();
            } else {
                tabRegister.classList.add('active');
                tabRegister.style.background = 'var(--color-yellow-main)';
                tabRegister.style.color = '#000';

                tabLogin.classList.remove('active');
                tabLogin.style.background = 'transparent';
                tabLogin.style.color = '#94a3b8';

                if (formLogin) formLogin.style.display = 'none';
                if (formRegister) formRegister.style.display = 'flex';
                if (otpContainer) otpContainer.style.display = 'none';
            }
        });
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('algo-login-email')?.value.trim();
            const password = document.getElementById('algo-login-password')?.value;
            const errBox = document.getElementById('algo-login-error');

            if (!email || !password) {
                if (errBox) {
                    errBox.textContent = 'Wypełnij wszystkie pola!';
                    errBox.style.display = 'block';
                }
                return;
            }

            const currentUser = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
            currentUser.isLoggedIn = true;
            currentUser.email = email;
            currentUser.name = email.split('@')[0] || 'Użytkownik';
            if (!currentUser.connectedAccounts) {
                currentUser.connectedAccounts = { youtube: true, tiktok: true, instagram: false, facebook: false, twitch: false };
            }

            if (typeof saveApliHubUserData === 'function') {
                saveApliHubUserData(currentUser);
            }

            AlgoSoundFX.playConnectSuccess();
            closeModal();
            syncUserInfo();
            renderAnalysisPanels();
            renderConnectedSocialAccounts();
            showToast(\`Zalogowano pomyślnie jako: \${currentUser.name}\`);
        });
    }
}`;

  if (authModuleRegex.test(js)) {
    js = js.replace(authModuleRegex, newAuthModuleCode);
  }

  fs.writeFileSync(algoJsPath, js, 'utf8');
  console.log('[3/6] Algo analyzer/js/app.js synchronized.');
}

// ==========================================================================
// 4. UPDATE Fast Konwerter / Plikio HTML & JS
// ==========================================================================
const konwHtmlPath = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwHtmlPath)) {
  let html = fs.readFileSync(konwHtmlPath, 'utf8');
  html = html.replace(/<title>.*?<\/title>/, '<title>Plikio - Twój Szybki i Darmowy Konwerter</title>');
  html = html.replace(/<span class="brand-name">.*?<\/span>/g, '<span class="brand-name">PLIKIO</span>');
  html = html.replace(/Plixy/g, 'Plikio');
  html = html.replace(/Fast Konwerter/g, 'Plikio');
  html = html.replace(/<button class="nav-tab-btn" data-tab="tab-extension-sim">.*?<\/button>/g, '<button class="nav-tab-btn" data-tab="tab-extension-sim">Jak działa?</button>');
  html = html.replace(/<p>Wklej link z YouTube, TikToka lub Instagrama.*?<\/p>/g, '<p>Wklej link z YouTube, TikToka, Facebooka lub Instagrama, wybierz format i pobierz gotowy plik.</p>');
  html = html.replace(/css\/converter\.css(\?v=[\w\d_.-]+)?/g, `css/converter.css?v=${ts}`);
  html = html.replace(/js\/converter-app\.js(\?v=[\w\d_.-]+)?/g, `js/converter-app.js?v=${ts}`);
  fs.writeFileSync(konwHtmlPath, html, 'utf8');
  console.log('[4/6] Fast Konwerter/index.html synchronized.');
}

const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');
if (fs.existsSync(konwJsPath)) {
  let js = fs.readFileSync(konwJsPath, 'utf8');
  js = js.replace(/Plixy/g, 'Plikio');
  js = js.replace(/Fast Konwerter/g, 'Plikio');
  fs.writeFileSync(konwJsPath, js, 'utf8');
  console.log('[5/6] Fast Konwerter/js/converter-app.js synchronized.');
}

// ==========================================================================
// 5. UPDATE Root index.html & Algo Analyzer index.html cache busters
// ==========================================================================
const rootIndexPath = path.resolve(rootDir, 'index.html');
if (fs.existsSync(rootIndexPath)) {
  let html = fs.readFileSync(rootIndexPath, 'utf8');
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/css\/animations\.css(\?v=[\w\d_.-]+)?/g, `css/animations.css?v=${ts}`);
  html = html.replace(/js\/data\.js(\?v=[\w\d_.-]+)?/g, `js/data.js?v=${ts}`);
  html = html.replace(/js\/i18n\.js(\?v=[\w\d_.-]+)?/g, `js/i18n.js?v=${ts}`);
  html = html.replace(/js\/particles\.js(\?v=[\w\d_.-]+)?/g, `js/particles.js?v=${ts}`);
  html = html.replace(/js\/profile\.js(\?v=[\w\d_.-]+)?/g, `js/profile.js?v=${ts}`);
  html = html.replace(/js\/main\.js(\?v=[\w\d_.-]+)?/g, `js/main.js?v=${ts}`);
  fs.writeFileSync(rootIndexPath, html, 'utf8');
  console.log('[6/6] Root index.html synchronized.');
}

console.log('--- ALL FILES CLEANLY SYNCHRONIZED ---');
