
/* ==========================================================================
   APP TEST SANDBOX CONTROLLER (URUCHAMIANIE W PRZEGLĄDARCE BEZ POBIERANIA)
   ========================================================================== */
window.currentSandboxApp = 'algo';

window.openLiveAppSandbox = function(appType) {
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

  if (appType === 'algo' || appType === 'app-1') {
    iframe.src = 'Algo analyzer/index.html';
    if (title) title.textContent = 'Algo Analyzer v1.0.0 (ApliHub Social Intelligence)';
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
  } else {
    iframe.src = 'Fast Konwerter/index.html';
    if (title) title.textContent = 'Fast Konwerter v1.2.0 (ReTrap YouTube Studio & Extension)';
    if (icon) {
      icon.textContent = '⚡';
      icon.style.background = 'linear-gradient(135deg, #2563eb, #06b6d4)';
    }
    if (btnAlgo) btnAlgo.classList.remove('active');
    if (btnKonw) btnKonw.classList.add('active');
    if (dlText) dlText.textContent = 'Pobierz .EXE (Fast Konwerter)';
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

window.switchSandboxApp = function(type) {
  window.openLiveAppSandbox(type);
};

window.reloadSandboxFrame = function() {
  const iframe = document.getElementById('sandboxIframe');
  if (iframe) {
    iframe.contentWindow.location.reload();
  }
};

window.closeSandboxApp = function() {
  const sandbox = document.getElementById('appTestSandbox');
  const iframe = document.getElementById('sandboxIframe');
  if (sandbox) {
    sandbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (iframe) iframe.src = 'about:blank';
};

// Modal for download choices
window.openAppLaunchModal = function(item) {
  const backdrop = document.getElementById('modalBackdrop');
  const title = document.getElementById('modalTitle');
  const content = document.getElementById('modalContent');

  if (!backdrop || !title || !content) return;

  const isAlgo = item.id === 'app-1' || item.name.includes('Algo Analyzer');
  const isKonwerter = item.id === 'plug-2' || item.name.includes('Fast Konwerter');

  title.innerHTML = `⚡ ${item.name} <span style="font-size: 0.8rem; opacity: 0.7;">(${item.version})</span>`;

  let downloadUrl = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
  let downloadLabel = 'Pobierz Instalator Windows (.exe)';
  let extDownloadHtml = '';

  if (isAlgo) {
    downloadUrl = 'assets/installer/ApliHub_AlgoAnalyzer_Setup.exe';
    downloadLabel = 'Pobierz Instalator Algo Analyzer (.exe)';
  } else if (isKonwerter) {
    downloadUrl = 'assets/installer/ApliHub_FastKonwerter_Setup.exe';
    downloadLabel = 'Pobierz Instalator Fast Konwerter (.exe)';
    extDownloadHtml = `
      <a href="assets/installer/Fast_Konwerter_Chrome_Extension.zip" download="Fast_Konwerter_Chrome_Extension.zip" class="btn-download" style="text-decoration: none; justify-content: center; background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); padding: 12px; border-radius: 8px;">
        📦 Pobierz Paczkę Chrome Web Store (.zip)
      </a>
    `;
  }

  content.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div style="display: flex; align-items: center; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
        <div style="font-size: 2.2rem;">${item.icon || '⚡'}</div>
        <div>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: #fff;">${item.name}</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">${item.desc}</p>
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
        <button class="btn-download" style="justify-content: center; padding: 12px; font-size: 0.9rem; background: linear-gradient(135deg, #2563eb, #06b6d4); color: #fff;" onclick="window.closeApliHubModal(); window.openLiveAppSandbox('${isAlgo ? 'algo' : 'konwerter'}');">
          🧪 Uruchom Aplikację Teraz (Test Online)
        </button>
      </div>

      <!-- Choice 2: Download Executable -->
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
        <div style="font-weight: 800; font-size: 0.9rem; color: #fff; display: flex; align-items: center; gap: 8px;">
          <span>🖥️</span> Plik Wykonywalny dla Windows
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          Pobierz natywny plik wykonywalny .exe gotowy do uruchomienia na Twoim komputerze.
        </p>
        <a href="${downloadUrl}" download class="btn-download" style="text-decoration: none; justify-content: center; padding: 12px; font-size: 0.88rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000;">
          ⬇️ ${downloadLabel}
        </a>
        ${extDownloadHtml}
      </div>
    </div>
  `;

  backdrop.classList.add('active');
};

/* ApliHub Core Logic, Tab Switching, Sound Effects & Sub-Views */

// Web Audio Sound FX Manager with Distinct Nav vs Card Sounds
const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  // Distinct Sound 1: Nav Tabs Hover (Crisp light click/pop tone)
  playNavHover() {
    const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
    if (!user.settings || !user.settings.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const vol = (user.settings.soundVolume ?? 50) / 100 * 0.025;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1050, this.ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch (e) { }
  },
  // Distinct Sound 2: Panel & Card Hover (Warm glowing soft resonant tone)
  playCardHover() {
    const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
    if (!user.settings || !user.settings.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const vol = (user.settings.soundVolume ?? 50) / 100 * 0.035;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.045);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) { }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  let activeTab = 'aktualnosci'; // Default active tab
  let searchQuery = '';

  const searchInput = document.getElementById('searchInput');
  const navItems = document.querySelectorAll('.nav-item');
  const sectionTitle = document.getElementById('sectionTitle');
  const catalogContainer = document.getElementById('catalogContainer');
  const toastContainer = document.getElementById('toastContainer');
  const heroSection = document.querySelector('.hero-section');

  // Attach nav hover sound (Sound 1)
  navItems.forEach(nav => {
    nav.addEventListener('mouseenter', () => SoundFX.playNavHover());
  });

  const profileTrigger = document.getElementById('profileTrigger');
  if (profileTrigger) {
    profileTrigger.addEventListener('mouseenter', () => SoundFX.playNavHover());
  }

  const btnApliPro = document.getElementById('btnApliPro');
  if (btnApliPro) {
    btnApliPro.addEventListener('click', () => {
      showToast('👑 Apli Pro: Subskrypcja premium do odblokowywania płatnych aplikacji będzie dostępna wkrótce!');
    });
  }

  // Initialize view
  renderView();

  // Handle Main Nav Tab Switching
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      activeTab = item.getAttribute('data-tab');
      renderView();
    });
  });

  // Handle Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderView();
    });
  }

  // Filter & Render Main Content
  function renderView() {
    if (!catalogContainer) return;

    catalogContainer.innerHTML = '';

    // Requirement 10: Hide Hero Section & Search Bar on 'wazne' tab
    if (heroSection) {
      if (activeTab === 'wazne') {
        heroSection.style.display = 'none';
      } else {
        heroSection.style.display = 'block';
      }
    }

    // Update section title text
    if (sectionTitle) {
      switch (activeTab) {
        case 'aktualnosci':
          sectionTitle.innerHTML = '📰 <span>Aktualności</span>';
          renderNews();
          return;
        case 'aplikacje':
          sectionTitle.innerHTML = '🖥️ <span>Aplikacje</span>';
          renderTools(APLIHUB_DATA.apps);
          return;
        case 'wtyczki':
          sectionTitle.innerHTML = '🧩 <span>Wtyczki</span>';
          renderTools(APLIHUB_DATA.plugins);
          return;
        case 'wazne':
          sectionTitle.innerHTML = '📌 <span>Ważne</span>';
          renderImportant();
          return;
        default:
          sectionTitle.innerHTML = '📰 <span>Aktualności</span>';
          renderNews();
          return;
      }
    }
  }

  // Render Tools Grid (Apps or Plugins)
  function renderTools(items) {
    let filtered = items;
    if (searchQuery) {
      filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery)
      );
    }

    if (filtered.length === 0) {
      renderEmptyState();
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'tools-grid animate-fade-in';

    filtered.forEach(item => {
      grid.appendChild(createToolCard(item));
    });

    catalogContainer.appendChild(grid);
  }

  // Create Tool Card HTML Element
  function createToolCard(item) {
    const card = document.createElement('div');
    card.className = 'card glowing-card';

    const isAlgo = item.id === 'app-1' || item.name.includes('Algo Analyzer');
    const isKonwerter = item.id === 'plug-2' || item.name.includes('Fast Konwerter');
    const appTypeKey = isAlgo ? 'algo' : (isKonwerter ? 'konwerter' : 'app');

    let buttonHtml = `
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <button class="btn-test-live" onclick="event.stopPropagation(); window.openLiveAppSandbox('${appTypeKey}')" title="Uruchom aplikację w przeglądarce bez instalacji">
          <span>🧪</span> Testuj
        </button>
        <button class="btn-download btn-card-download" data-download-id="${item.id}" data-download-name="${item.name}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Pobierz
        </button>
      </div>
    `;

    card.innerHTML = `
      <div>
        <div class="card-top">
          <div class="card-icon" style="position: relative;">
            ${item.id === 'app-1' ? `<img src="assets/images/algo_app_icon.png" alt="Algo Icon" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover;">` : item.icon}
          </div>
          <div class="card-info">
            <h3 class="card-title">${item.name}</h3>
            <span class="card-badge">${item.badge}</span>
          </div>
        </div>
        <p class="card-desc">${item.desc}</p>
      </div>

      <div class="card-meta">
        <div class="card-stats">
          <span>${item.rating}</span>
          <span>•</span>
          <span>${item.downloads} pobrań</span>
        </div>
        ${buttonHtml}
      </div>
    `;

    // Sound FX 2 on card hover
    card.addEventListener('mouseenter', () => SoundFX.playCardHover());

    const downloadBtn = card.querySelector('.btn-card-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.openAppLaunchModal(item);
      });
    }

    return card;
  }

  // Render News Section
  function renderNews() {
    const grid = document.createElement('div');
    grid.className = 'news-grid animate-fade-in';

    APLIHUB_DATA.news.forEach(item => {
      const card = document.createElement('div');
      card.className = 'news-card glowing-card';
      card.innerHTML = `
        <div class="news-date">${item.date}</div>
        <h3 class="news-title">${item.title}</h3>
        <p class="news-content">${item.content}</p>
      `;
      card.addEventListener('mouseenter', () => SoundFX.playCardHover());
      grid.appendChild(card);
    });

    catalogContainer.appendChild(grid);
  }

  // Render Important Section
  function renderImportant() {
    const grid = document.createElement('div');
    grid.className = 'important-grid animate-fade-in';

    APLIHUB_DATA.important.forEach(item => {
      const card = document.createElement('div');
      card.className = 'important-card glowing-card';

      let buttonHtml = '';
      if (item.action === 'bugs-proposals') {
        buttonHtml = `<button class="btn-important-action btn-enter-bugs" style="margin-top: 10px; padding: 6px 14px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.82rem; transition: var(--transition);">Wejdź →</button>`;
      } else if (item.action === 'contact-admins') {
        buttonHtml = `<button class="btn-important-action btn-enter-contact" style="margin-top: 10px; padding: 6px 14px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.82rem; transition: var(--transition);">Kontakt →</button>`;
      } else if (item.action === 'copyright') {
        buttonHtml = `<button class="btn-important-action btn-enter-copyright" style="margin-top: 10px; padding: 6px 14px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.82rem; transition: var(--transition);">Więcej →</button>`;
      } else if (item.action === 'privacy') {
        buttonHtml = `<button class="btn-important-action btn-enter-privacy" style="margin-top: 10px; padding: 6px 14px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.82rem; transition: var(--transition);">Więcej →</button>`;
      }

      card.innerHTML = `
        <div class="important-icon">${item.icon}</div>
        <div style="flex: 1;">
          <h4 class="important-title">${item.title}</h4>
          <p class="important-text">${item.desc}</p>
          ${buttonHtml}
        </div>
      `;

      // Sound FX 2 on card hover
      card.addEventListener('mouseenter', () => SoundFX.playCardHover());

      // Action Handlers
      if (item.action === 'bugs-proposals') {
        const btn = card.querySelector('.btn-enter-bugs');
        if (btn) btn.addEventListener('click', renderBugsAndProposalsPage);
      } else if (item.action === 'contact-admins') {
        const btn = card.querySelector('.btn-enter-contact');
        if (btn) btn.addEventListener('click', renderContactAdminsPage);
      } else if (item.action === 'copyright') {
        const btn = card.querySelector('.btn-enter-copyright');
        if (btn) btn.addEventListener('click', renderCopyrightSubpage);
      } else if (item.action === 'privacy') {
        const btn = card.querySelector('.btn-enter-privacy');
        if (btn) btn.addEventListener('click', renderPrivacySubpage);
      }

      grid.appendChild(card);
    });

    catalogContainer.appendChild(grid);
  }

  // Sub-Page 1: Copyright & Legal Notice Subpage
  function renderCopyrightSubpage() {
    catalogContainer.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'subpage-wrapper animate-fade-in';
    wrapper.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
        <button id="btnBackToImportantCopyright" style="padding: 8px 16px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-subtle); color: #fff; border-radius: 8px; font-weight: 700; cursor: pointer; transition: var(--transition);">
          ← Powrót do Ważne
        </button>
        <span style="font-size: 0.9rem; color: var(--text-muted);">ApliHub Regulamin & Prawa Autorskie</span>
      </div>

      <div style="max-width: 820px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 36px;" class="glowing-card">
        
        <h2 style="font-size: 1.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; margin-bottom: 24px; background: linear-gradient(90deg, #ffffff, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          📜 PRAWA AUTORSKIE I LICENCJA APLIHUB
        </h2>

        <div style="display: flex; flex-direction: column; gap: 20px; font-size: 0.95rem; color: var(--text-muted); line-height: 1.7;">
          
          <div style="padding: 16px; background: rgba(15, 23, 42, 0.7); border-left: 4px solid #f59e0b; border-radius: 8px;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 6px;">© 2026 ApliHub. Wszelkie Prawa Zastrzeżone.</h3>
            <p>Wszystkie udostępniane na stronie oprogramowanie, aplikacje mobilne i desktopowe, wtyczki przeglądarkowe, skrypty, grafiki oraz znaki towarowe stanowią wyłączną własność intelektualną autorów portalu ApliHub (Vertis & Vezy).</p>
          </div>

          <div>
            <h4 style="font-weight: 800; color: #fff; font-size: 1rem; margin-bottom: 6px;">1. Autorskie Oprogramowanie i Narzędzia</h4>
            <p>Zarówno serwis ApliHub, jak i dedykowane narzędzia (m.in. Algo Analyzer, Fast Konwerter, Ofertomat, Theme Injector) są chronione prawem autorskim oraz międzynarodowymi konwencjami o ochronie własności intelektualnej.</p>
          </div>

          <div>
            <h4 style="font-weight: 800; color: #fff; font-size: 1rem; margin-bottom: 6px;">2. Warunki Korzystania i Licencja Użytkownika</h4>
            <p>Użytkownik otrzymuje bezpłatną, darmową i niewyłączną licencję na osobisty użytek udostępnionych aplikacji i wtyczek. Licencja nie zezwala na odsprzedaż, pobieranie opłat ani komercyjne rozpowszechnianie oprogramowania ApliHub bez pisemnej zgody autorów.</p>
          </div>

          <div>
            <h4 style="font-weight: 800; color: #fff; font-size: 1rem; margin-bottom: 6px;">3. Zakaz Dekompilacji i Inżynierii Wstecznej</h4>
            <p>Kategorycznie zabrania się dekompilacji, inżynierii wstecznej (reverse engineering), modyfikowania kodu źródłowego oraz usuwania oznaczeń praw autorskich lub znaków handlowych zawartych w oprogramowaniu.</p>
          </div>

        </div>

      </div>
    `;

    catalogContainer.appendChild(wrapper);

    document.getElementById('btnBackToImportantCopyright').addEventListener('click', renderView);
    wrapper.querySelector('.glowing-card').addEventListener('mouseenter', () => SoundFX.playCardHover());
  }

  // Sub-Page 2: Privacy Policy & Security Subpage
  function renderPrivacySubpage() {
    catalogContainer.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'subpage-wrapper animate-fade-in';
    wrapper.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
        <button id="btnBackToImportantPrivacy" style="padding: 8px 16px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-subtle); color: #fff; border-radius: 8px; font-weight: 700; cursor: pointer; transition: var(--transition);">
          ← Powrót do Ważne
        </button>
        <span style="font-size: 0.9rem; color: var(--text-muted);">ApliHub Polityka Prywatności & Ochrona Danych</span>
      </div>

      <div style="max-width: 820px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 36px;" class="glowing-card">
        
        <h2 style="font-size: 1.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; margin-bottom: 24px; background: linear-gradient(90deg, #ffffff, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          🔒 POLITYKA PRYWATNOŚCI I BEZPIECZEŃSTWO
        </h2>

        <div style="display: flex; flex-direction: column; gap: 20px; font-size: 0.95rem; color: var(--text-muted); line-height: 1.7;">
          
          <div style="padding: 16px; background: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; border-radius: 8px;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 6px;">Gwarancja Pełnej Ochrony i Poufności</h3>
            <p>W ApliHub stawiamy na najwyższe standardy bezpieczeństwa cyfrowego. Naszą misją jest dostarczanie wydajnych narzędzi przy jednoczesnym poszanowaniu Twojej prywatności.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); padding: 18px; border-radius: 10px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 1rem; margin-bottom: 6px;">💻 Lokalne Przetwarzanie Danych</h4>
              <p style="font-size: 0.88rem;">Wszystkie wtyczki oraz aplikacje działają w 100% lokalnie na Twoim urządzeniu. Twoje dane, pliki czy historia nie są wysyłane na żądne zewnętrzne serwery.</p>
            </div>

            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); padding: 18px; border-radius: 10px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 1rem; margin-bottom: 6px;">🛡️ Brak Skryptów Śledzących</h4>
              <p style="font-size: 0.88rem;">Nie stosujemy ciasteczek śledzących ani skryptów analitycznych stron trzecich. Przeglądasz i pobierasz zasoby w pełni anonimowo.</p>
            </div>

            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); padding: 18px; border-radius: 10px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 1rem; margin-bottom: 6px;">🔐 Weryfikacja Antywirusowa</h4>
              <p style="font-size: 0.88rem;">Każdy plik instalacyjny jest skanowany przed publikacją za pomocą zaawansowanych silników antywirusowych pod kątem braku malware i zagrożeń.</p>
            </div>

            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); padding: 18px; border-radius: 10px;">
              <h4 style="font-weight: 800; color: #fff; font-size: 1rem; margin-bottom: 6px;">⚙️ Kontrola Nad Kontem</h4>
              <p style="font-size: 0.88rem;">Wszystkie Twoje preferencje zapisane w serwisie możesz w dowolnym momencie modyfikować lub usunąć jednym kliknięciem z poziomu ustawień profilu.</p>
            </div>
          </div>

        </div>

      </div>
    `;

    catalogContainer.appendChild(wrapper);

    document.getElementById('btnBackToImportantPrivacy').addEventListener('click', renderView);
    wrapper.querySelector('.glowing-card').addEventListener('mouseenter', () => SoundFX.playCardHover());
  }

  // Smooth Transition Sub-Page: Bugs & Proposals Page
  function renderBugsAndProposalsPage() {
    catalogContainer.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'subpage-wrapper animate-fade-in';
    wrapper.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
        <button id="btnBackToImportant" style="padding: 8px 16px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-subtle); color: #fff; border-radius: 8px; font-weight: 700; cursor: pointer; transition: var(--transition);">
          ← Powrót do Ważne
        </button>
        <span style="font-size: 0.9rem; color: var(--text-muted);">ApliHub Centrum Zgłoszeń</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
        
        <!-- Panel 1: Zgłoś błąd -->
        <div class="card glowing-card" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 2.2rem; margin-bottom: 10px;">🐛</div>
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 8px; color: #fff;">Zgłoś błąd</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
              Jeśli zauważyłeś błąd na stronie zgłoś go nam, a my się nim zajmiemy.
            </p>
          </div>
          <button id="btnOpenBugForm" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; transition: var(--transition);">
            Zgłoś błąd
          </button>
        </div>

        <!-- Panel 2: Dodaj propozycje -->
        <div class="card glowing-card" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 2.2rem; margin-bottom: 10px;">💡</div>
            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 8px; color: #fff;">Dodaj propozycję</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">
              Jeśli masz propozycje odnośnie czegoś związanego z naszą stroną, aplikacjami lub wtyczkami to napisz tutaj. Jeżeli uznamy ten pomysł za fajny i dodamy go to podpiszemy ciebie jako pomysłodawcę!
            </p>
          </div>
          <button id="btnOpenProposalForm" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 8px; font-weight: 800; cursor: pointer; transition: var(--transition);">
            Dodaj propozycję
          </button>
        </div>

      </div>
    `;

    catalogContainer.appendChild(wrapper);

    document.getElementById('btnBackToImportant').addEventListener('click', renderView);
    wrapper.querySelectorAll('.glowing-card').forEach(c => {
      c.addEventListener('mouseenter', () => SoundFX.playCardHover());
    });

    document.getElementById('btnOpenBugForm').addEventListener('click', openBugModalForm);
    document.getElementById('btnOpenProposalForm').addEventListener('click', openProposalModalForm);
  }

  // Bug Report Modal Form
  function openBugModalForm() {
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const user = getApliHubUserData();

    if (!modalBackdrop || !modalTitle || !modalContent) return;

    modalTitle.innerHTML = '🐛 Formularz Zgłaszania Błędu';
    modalContent.innerHTML = `
      <form id="bug-report-form" style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Nick</label>
          <input type="text" id="bug-nick" value="${user.name}" required style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Email</label>
          <input type="email" id="bug-email" value="${user.email}" required style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Typ błędu</label>
          <select id="bug-type" style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.9); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none;">
            <option value="Nieprawidłowe działanie funkcji">Nieprawidłowe działanie funkcji</option>
            <option value="Problem z interfejsem">Problem z interfejsem</option>
            <option value="Błąd pobierania/instalacji">Błąd pobierania/instalacji</option>
            <option value="Problem z kontem">Problem z kontem</option>
          </select>
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Opis problemu</label>
          <textarea id="bug-desc" rows="3" placeholder="Opisz dokładnie gdzie występuje błąd..." required style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none; resize: vertical;"></textarea>
        </div>
        <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; margin-top: 6px;">
          Zgłoś błąd
        </button>
      </form>
    `;

    modalBackdrop.classList.add('active');

    document.getElementById('bug-report-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof window.closeApliHubModal === 'function') {
        window.closeApliHubModal();
      } else {
        modalBackdrop.classList.remove('active');
      }
      showToast('Dziękujemy! Zgłoszenie błędu zostało wysłane.');
    });
  }

  // Proposal Modal Form
  function openProposalModalForm() {
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const user = getApliHubUserData();

    if (!modalBackdrop || !modalTitle || !modalContent) return;

    modalTitle.innerHTML = '💡 Dodaj Nową Propozycję';
    modalContent.innerHTML = `
      <form id="proposal-report-form" style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Nick</label>
          <input type="text" id="prop-nick" value="${user.name}" required style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Email</label>
          <input type="email" id="prop-email" value="${user.email}" required style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Tytuł pomysłu</label>
          <input type="text" id="prop-title" placeholder="Krótki tytuł propozycji..." required style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none;">
        </div>
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Opis propozycji</label>
          <textarea id="prop-desc" rows="3" placeholder="Opisz swój pomysł szczegółowo..." required style="width: 100%; padding: 10px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.9rem; outline: none; resize: vertical;"></textarea>
        </div>
        <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; margin-top: 6px;">
          Wyślij propozycję
        </button>
      </form>
    `;

    modalBackdrop.classList.add('active');

    document.getElementById('proposal-report-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof window.closeApliHubModal === 'function') {
        window.closeApliHubModal();
      } else {
        modalBackdrop.classList.remove('active');
      }
      showToast('Super! Twoja propozycja została przesłana do zespołu.');
    });
  }

  // Smooth Transition Sub-Page: Contact Admins Page
  function renderContactAdminsPage() {
    catalogContainer.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'subpage-wrapper animate-fade-in';
    wrapper.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
        <button id="btnBackToImportantContact" style="padding: 8px 16px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-subtle); color: #fff; border-radius: 8px; font-weight: 700; cursor: pointer; transition: var(--transition);">
          ← Powrót do Ważne
        </button>
        <span style="font-size: 0.9rem; color: var(--text-muted);">ApliHub Administracja</span>
      </div>

      <div style="max-width: 780px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 32px;" class="glowing-card">
        
        <h2 style="font-size: 1.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; margin-bottom: 28px; background: linear-gradient(90deg, #ffffff, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          SKONTAKTUJ SIĘ Z ADMINISTRATORAMI
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 20px; margin-bottom: 24px;">
          
          <!-- Vertis CEO Card -->
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000; font-size: 1.1rem;">
                V
              </div>
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff;">Vertis</h3>
                <span style="padding: 2px 8px; background: rgba(245, 158, 11, 0.2); color: #f59e0b; border-radius: 12px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">CEO</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px;">
                <span style="color: var(--text-muted);">Email:</span>
                <a href="mailto:aplihubvertis@gmail.com" style="color: #f59e0b; font-weight: 700; font-size: 0.82rem;">aplihubvertis@gmail.com</a>
              </div>

              <a href="https://www.instagram.com/vert1ss/" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 9px; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; font-weight: 700; border-radius: 8px; text-decoration: none; transition: var(--transition);">
                📸 Instagram (@vert1ss)
              </a>

              <button id="btnCopyDiscordVertis" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 9px; background: #5865F2; color: #fff; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: var(--transition);">
                💬 Discord: the_vertis
              </button>
            </div>
          </div>

          <!-- Vezy Vice CEO Card -->
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4, #3b82f6); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; font-size: 1.1rem;">
                V
              </div>
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff;">Vezy</h3>
                <span style="padding: 2px 8px; background: rgba(6, 182, 212, 0.2); color: #06b6d4; border-radius: 12px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">Vice CEO</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
              <a href="https://www.instagram.com/vezy_ofc/" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 9px; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; font-weight: 700; border-radius: 8px; text-decoration: none; transition: var(--transition);">
                📸 Instagram (@vezy_ofc)
              </a>
            </div>
          </div>

        </div>

        <div style="text-align: center; border-top: 1px solid var(--border-subtle); padding-top: 16px; color: var(--text-muted); font-size: 0.88rem; font-weight: 600;">
          ⏳ Na kontakt proszę czekać do 48 godzin.
        </div>

      </div>
    `;

    catalogContainer.appendChild(wrapper);

    document.getElementById('btnBackToImportantContact').addEventListener('click', renderView);

    const btnDiscord = document.getElementById('btnCopyDiscordVertis');
    if (btnDiscord) {
      btnDiscord.addEventListener('click', () => {
        navigator.clipboard.writeText('the_vertis');
        showToast('Skopiowano nazwę użytkownika Discord: the_vertis');
      });
    }
  }

  // Empty Search State
  function renderEmptyState() {
    catalogContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
        <h3>Brak wyników dla "${searchQuery}"</h3>
        <p style="font-size: 0.9rem; margin-top: 6px;">Spróbuj wpisać inną frazę lub przejrzyj inną zakładkę.</p>
      </div>
    `;
  }

  // Download Trigger Handler
  function handleDownload(item) {
    showToast(`Rozpoczęto pobieranie: ${item.name} (${item.version})`);

    const element = document.createElement('a');
    const blob = new Blob([`ApliHub Package: ${item.name}\nVersion: ${item.version}\nType: ${item.type}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = `${item.name.toLowerCase().replace(/\s+/g, '-')}-${item.version}.zip`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // Toast Notification helper
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>⚡</span>
      <div>${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
console.log('Auth & Sound modules loaded safely.');
