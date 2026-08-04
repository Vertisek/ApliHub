/* ApliHub Core Logic, Tab Switching, Sound Effects & Sub-Views */

// Web Audio Sound FX Manager
const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playHover() {
    const user = getApliHubUserData();
    if (!user.settings || !user.settings.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const vol = (user.settings.soundVolume ?? 50) / 100 * 0.03;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(760, this.ctx.currentTime + 0.035);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {
      // Audio context standby
    }
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

  // Attach hover sounds to static nav & profile elements
  navItems.forEach(nav => {
    nav.addEventListener('mouseenter', () => SoundFX.playHover());
  });

  const profileTrigger = document.getElementById('profileTrigger');
  if (profileTrigger) {
    profileTrigger.addEventListener('mouseenter', () => SoundFX.playHover());
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

    // Update section title text according to design specs
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

  // Create Tool Card HTML Element with Glowing Border & Hover Sound
  function createToolCard(item) {
    const card = document.createElement('div');
    card.className = 'card glowing-card';

    const systemInfo = item.system ? `💻 ${item.system}` : `🌐 ${item.browser}`;

    card.innerHTML = `
      <div>
        <div class="card-top">
          <div class="card-icon">${item.icon}</div>
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
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="btn-download" data-download-id="${item.id}" data-download-name="${item.name}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Pobierz
          </button>
        </div>
      </div>
    `;

    // Sound FX on card hover
    card.addEventListener('mouseenter', () => SoundFX.playHover());

    // Download button event listener
    const downloadBtn = card.querySelector('.btn-download');
    downloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleDownload(item);
    });

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
      card.addEventListener('mouseenter', () => SoundFX.playHover());
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
        buttonHtml = `<button class="btn-important-action btn-enter-bugs" style="margin-top: 14px; padding: 8px 18px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">Wejdź →</button>`;
      } else if (item.action === 'contact-admins') {
        buttonHtml = `<button class="btn-important-action btn-enter-contact" style="margin-top: 14px; padding: 8px 18px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);">Kontakt →</button>`;
      } else if (item.action === 'copyright') {
        buttonHtml = `<div style="margin-top: 12px; padding: 10px 14px; background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; border-radius: 6px; font-size: 0.82rem; color: #cbd5e1;">© 2026 ApliHub. Wszelkie prawa zastrzeżone. Wszelkie materiały stanowią własność intelektualną autorów.</div>`;
      }

      card.innerHTML = `
        <div class="important-icon">${item.icon}</div>
        <div style="flex: 1;">
          <h4 class="important-title">${item.title}</h4>
          <p class="important-text">${item.desc}</p>
          ${buttonHtml}
        </div>
      `;

      card.addEventListener('mouseenter', () => SoundFX.playHover());

      // Action Handlers
      if (item.action === 'bugs-proposals') {
        const btn = card.querySelector('.btn-enter-bugs');
        if (btn) btn.addEventListener('click', renderBugsAndProposalsPage);
      } else if (item.action === 'contact-admins') {
        const btn = card.querySelector('.btn-enter-contact');
        if (btn) btn.addEventListener('click', renderContactAdminsPage);
      }

      grid.appendChild(card);
    });

    catalogContainer.appendChild(grid);
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
        <div class="card glowing-card" style="padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 2.5rem; margin-bottom: 12px;">🐛</div>
            <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; color: #fff;">Zgłoś błąd</h3>
            <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Jeśli zauważyłeś błąd na stronie zgłoś go nam, a my się nim zajmiemy.
            </p>
          </div>
          <button id="btnOpenBugForm" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: #fff; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; transition: var(--transition);">
            Zgłoś błąd
          </button>
        </div>

        <!-- Panel 2: Dodaj propozycje -->
        <div class="card glowing-card" style="padding: 28px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 2.5rem; margin-bottom: 12px;">💡</div>
            <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; color: #fff;">Dodaj propozycję</h3>
            <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px;">
              Jeśli masz propozycje odnośnie czegoś związanego z naszą stroną, aplikacjami lub wtyczkami to napisz tutaj. Jeżeli uznamy ten pomysł za fajny i dodamy go to podpiszemy ciebie jako pomysłodawcę!
            </p>
          </div>
          <button id="btnOpenProposalForm" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; transition: var(--transition);">
            Dodaj propozycję
          </button>
        </div>

      </div>
    `;

    catalogContainer.appendChild(wrapper);

    // Event Back button
    document.getElementById('btnBackToImportant').addEventListener('click', renderView);
    
    // Attach SoundFX on subpage cards hover
    wrapper.querySelectorAll('.glowing-card').forEach(c => {
      c.addEventListener('mouseenter', () => SoundFX.playHover());
    });

    // Form Event Handlers
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
      modalBackdrop.classList.remove('active');
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
      modalBackdrop.classList.remove('active');
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

      <div style="max-width: 780px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 36px;" class="glowing-card">
        
        <h2 style="font-size: 1.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; margin-bottom: 30px; background: linear-gradient(90deg, #ffffff, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          SKONTAKTUJ SIĘ Z ADMINISTRATORAMI
        </h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 30px;">
          
          <!-- Vertis CEO Card -->
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000; font-size: 1.2rem;">
                V
              </div>
              <div>
                <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff;">Vertis</h3>
                <span style="padding: 2px 8px; background: rgba(245, 158, 11, 0.2); color: #f59e0b; border-radius: 12px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">CEO</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(255, 255, 255, 0.03); border-radius: 8px;">
                <span style="color: var(--text-muted);">Email:</span>
                <a href="mailto:aplihubvertis@gmail.com" style="color: #f59e0b; font-weight: 700; font-size: 0.85rem;">aplihubvertis@gmail.com</a>
              </div>

              <a href="https://www.instagram.com/vert1ss/" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; font-weight: 700; border-radius: 8px; text-decoration: none; transition: var(--transition);">
                📸 Instagram (@vert1ss)
              </a>

              <button id="btnCopyDiscordVertis" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: #5865F2; color: #fff; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: var(--transition);">
                💬 Discord: the_vertis
              </button>
            </div>
          </div>

          <!-- Vezy Vice CEO Card -->
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 24px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4, #3b82f6); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff; font-size: 1.2rem;">
                V
              </div>
              <div>
                <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff;">Vezy</h3>
                <span style="padding: 2px 8px; background: rgba(6, 182, 212, 0.2); color: #06b6d4; border-radius: 12px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Vice CEO</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
              <a href="https://www.instagram.com/vezy_ofc/" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; font-weight: 700; border-radius: 8px; text-decoration: none; transition: var(--transition);">
                📸 Instagram (@vezy_ofc)
              </a>
            </div>
          </div>

        </div>

        <div style="text-align: center; border-top: 1px solid var(--border-subtle); padding-top: 18px; color: var(--text-muted); font-size: 0.9rem; font-weight: 600;">
          ⏳ Na kontakt proszę czekać do 48 godzin.
        </div>

      </div>
    `;

    catalogContainer.appendChild(wrapper);

    // Event Back button
    document.getElementById('btnBackToImportantContact').addEventListener('click', renderView);

    // Copy Discord helper
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

