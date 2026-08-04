/* ApliHub Profile Menu & Modals Manager */

document.addEventListener('DOMContentLoaded', () => {
  const profileContainer = document.getElementById('profileContainer');
  const profileTrigger = document.getElementById('profileTrigger');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  const modalTitle = document.getElementById('modalTitle');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Sync user info in header
  updateHeaderUserInfo();

  window.addEventListener('aplihub_user_updated', () => {
    updateHeaderUserInfo();
  });

  function updateHeaderUserInfo() {
    const user = APLIHUB_DATA.user;
    const nameElems = document.querySelectorAll('.profile-name, .dropdown-user-name');
    nameElems.forEach(el => el.textContent = user.name);
    const emailElem = document.querySelector('.dropdown-user-email');
    if (emailElem) emailElem.textContent = user.email;
  }

  // Toggle Dropdown
  if (profileTrigger && profileContainer) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileContainer.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!profileContainer.contains(e.target)) {
        profileContainer.classList.remove('open');
      }
    });
  }

  // Handle Profile Dropdown Items Click
  document.querySelectorAll('[data-profile-action]').forEach(button => {
    button.addEventListener('click', (e) => {
      const action = button.getAttribute('data-profile-action');
      if (profileContainer) profileContainer.classList.remove('open');
      openProfileModal(action);
    });
  });

  // Close Modal Events
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  }

  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span><div>${message}</div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function openProfileModal(actionType) {
    const user = getApliHubUserData();
    let html = '';
    let title = '';

    switch (actionType) {
      case 'profil':
        title = '👤 Mój Profil';
        html = `
          <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #d97706, #f59e0b); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; color: #000;">
              ${user.avatar}
            </div>
            <div>
              <h3 style="font-size: 1.2rem; font-weight: 700;">${user.name}</h3>
              <span style="display: inline-block; margin-top: 6px; padding: 3px 12px; background: rgba(245, 158, 11, 0.2); color: var(--accent-primary); border-radius: 20px; font-size: 0.75rem; font-weight: 700;">
                ${user.accountType}
              </span>
            </div>
          </div>
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px;">
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 8px;">Adres E-mail: <strong style="color: #fff;">${user.email}</strong></p>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 8px;">Status konta: <strong style="color: #fff;">Aktywne & Weryfikowane</strong></p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Data dołączenia: <strong style="color: #fff;">Sierpień 2026</strong></p>
          </div>
        `;
        break;

      case 'konto':
        title = '💳 Ustawienia Konta i Bezpieczeństwa';
        html = `
          <form id="account-credentials-form" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Adres E-mail</label>
              <input type="email" id="input-account-email" value="${user.email}" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none;">
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Nowe Hasło</label>
              <input type="password" id="input-account-password" placeholder="Wpisz nowe hasło..." style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none;">
            </div>
            <button type="submit" class="btn-yellow-save" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: all 0.2s ease;">
              Zapisz Zmiany
            </button>
          </form>
        `;
        break;

      case 'ustawienia':
        title = '⚙️ Ustawienia Aplikacji';
        html = `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
              <span>Automatyczne aktualizacje wtyczek</span>
              <input type="checkbox" ${user.settings.autoUpdate ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--accent-primary);">
            </label>
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
              <span>Powiadomienia o nowych wersjach</span>
              <input type="checkbox" ${user.settings.notifications ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--accent-primary);">
            </label>
          </div>
        `;
        break;

      case 'polaczone':
        title = '🔗 Połączone Konta Social Media';
        const socialPlatforms = [
          { key: 'youtube', name: 'YouTube', icon: '🔴' },
          { key: 'tiktok', name: 'TikTok', icon: '🎵' },
          { key: 'instagram', name: 'Instagram', icon: '📸' },
          { key: 'facebook', name: 'Facebook', icon: '📘' },
          { key: 'twitch', name: 'Twitch', icon: '🟪' }
        ];

        html = `
          <div style="display: flex; flex-direction: column; gap: 12px;" id="connected-accounts-list">
            ${socialPlatforms.map(p => {
              const isConnected = !!user.connectedAccounts[p.key];
              return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-subtle); border-radius: 12px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.3rem;">${p.icon}</span>
                    <span style="font-weight: 700; font-size: 0.95rem; color: #fff;">${p.name}</span>
                  </div>
                  <button class="btn-toggle-social ${isConnected ? 'connected' : ''}" data-social-key="${p.key}" style="padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; ${isConnected ? 'background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171;' : 'background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #f59e0b;'}">
                    ${isConnected ? 'Odłącz' : 'Połącz'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `;
        break;
    }

    if (modalTitle && modalContent && modalBackdrop) {
      modalTitle.innerHTML = title;
      modalContent.innerHTML = html;
      modalBackdrop.classList.add('active');

      // Attach event listeners for account credential forms
      if (actionType === 'konto') {
        const form = document.getElementById('account-credentials-form');
        if (form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newEmail = document.getElementById('input-account-email').value.trim();
            const newPassword = document.getElementById('input-account-password').value.trim();
            
            const currentData = getApliHubUserData();
            if (newEmail) currentData.email = newEmail;
            if (newPassword) currentData.password = newPassword;

            saveApliHubUserData(currentData);
            showToast('Zaktualizowano dane konta (E-mail / Hasło)!');
            closeModal();
          });
        }
      }

      // Attach event listeners for connected accounts buttons
      if (actionType === 'polaczone') {
        document.querySelectorAll('.btn-toggle-social').forEach(btn => {
          btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-social-key');
            const currentData = getApliHubUserData();
            const currentState = !!currentData.connectedAccounts[key];
            const newState = !currentState;

            currentData.connectedAccounts[key] = newState;
            saveApliHubUserData(currentData);

            if (newState) {
              btn.textContent = 'Odłącz';
              btn.style.background = 'rgba(239, 68, 68, 0.15)';
              btn.style.borderColor = 'rgba(239, 68, 68, 0.4)';
              btn.style.color = '#f87171';
              showToast(`Połączono konto ${key.toUpperCase()}`);
            } else {
              btn.textContent = 'Połącz';
              btn.style.background = 'rgba(245, 158, 11, 0.15)';
              btn.style.borderColor = 'rgba(245, 158, 11, 0.4)';
              btn.style.color = '#f59e0b';
              showToast(`Odłączono konto ${key.toUpperCase()}`);
            }
          });
        });
      }
    }
  }
});
