/* ApliHub Core Logic & Tab Switching */

document.addEventListener('DOMContentLoaded', () => {
  let activeTab = 'all'; // 'all', 'aktualnosci', 'aplikacje', 'wtyczki', 'wazne'
  let searchQuery = '';

  const searchInput = document.getElementById('searchInput');
  const navItems = document.querySelectorAll('.nav-item');
  const sectionTitle = document.getElementById('sectionTitle');
  const catalogContainer = document.getElementById('catalogContainer');
  const toastContainer = document.getElementById('toastContainer');

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

  // Filter & Render Content
  function renderView() {
    if (!catalogContainer) return;

    catalogContainer.innerHTML = '';

    // Update section title text
    if (sectionTitle) {
      switch (activeTab) {
        case 'aktualnosci':
          sectionTitle.innerHTML = '📰 <span>Aktualności</span> & Ogłoszenia';
          renderNews();
          return;
        case 'aplikacje':
          sectionTitle.innerHTML = '🖥️ Autorskie <span>Aplikacje & Wtyczki</span>';
          renderTools(APLIHUB_DATA.apps.length > 0 ? APLIHUB_DATA.apps : APLIHUB_DATA.plugins);
          return;
        case 'wtyczki':
          sectionTitle.innerHTML = '🧩 Wtyczki <span>Przeglądarkowe</span>';
          renderTools(APLIHUB_DATA.plugins);
          return;
        case 'wazne':
          sectionTitle.innerHTML = '📌 <span>Ważne</span> Informacje & Poradniki';
          renderImportant();
          return;
        default:
          sectionTitle.innerHTML = '⚡ Wybrane <span>Narzędzia & Wtyczki</span>';
          renderAllCombined();
          return;
      }
    }
  }

  // Render Combined Apps & Plugins
  function renderAllCombined() {
    let combined = [...APLIHUB_DATA.apps, ...APLIHUB_DATA.plugins];

    if (searchQuery) {
      combined = combined.filter(item => 
        item.name.toLowerCase().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery) ||
        item.category.toLowerCase().includes(searchQuery)
      );
    }

    if (combined.length === 0) {
      renderEmptyState();
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'tools-grid animate-fade-in';

    combined.forEach(item => {
      grid.appendChild(createToolCard(item));
    });

    catalogContainer.appendChild(grid);
  }

  // Render Tools Grid (Filtered by query if any)
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
    card.className = 'card';
    card.style.cursor = 'pointer';

    const systemInfo = item.system ? `💻 ${item.system}` : `🌐 ${item.browser}`;
    const isOpenable = item.id === 'plug-1';

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
          ${isOpenable ? `
            <a href="./Algo analyzer/index.html" class="btn-open-app" style="padding: 8px 14px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border-radius: var(--radius-sm); text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; transition: var(--transition);">
              ⚡ Otwórz
            </a>
          ` : ''}
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

    if (isOpenable) {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
          window.location.href = './Algo analyzer/index.html';
        }
      });
    }

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
      card.className = 'news-card';
      card.innerHTML = `
        <div class="news-date">${item.date}</div>
        <h3 class="news-title">${item.title}</h3>
        <p class="news-content">${item.content}</p>
      `;
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
      card.className = 'important-card';
      card.innerHTML = `
        <div class="important-icon">${item.icon}</div>
        <div>
          <h4 class="important-title">${item.title}</h4>
          <p class="important-text">${item.desc}</p>
        </div>
      `;
      grid.appendChild(card);
    });

    catalogContainer.appendChild(grid);
  }

  // Empty Search State
  function renderEmptyState() {
    catalogContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
        <h3>Brak wyników dla "${searchQuery}"</h3>
        <p style="font-size: 0.9rem; margin-top: 6px;">Spróbuj wpisać inną frazę lub przejrzyj pełny katalog.</p>
      </div>
    `;
  }

  // Download Trigger Handler
  function handleDownload(item) {
    showToast(`Rozpoczęto pobieranie: ${item.name} (${item.version})`);

    // Create dynamic download link for user
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
