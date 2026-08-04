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
    const user = getApliHubUserData();
    const nameElems = document.querySelectorAll('.profile-name, .dropdown-user-name');
    nameElems.forEach(el => el.textContent = user.name);
    const emailElem = document.querySelector('.dropdown-user-email');
    if (emailElem) emailElem.textContent = user.email;

    // Update avatar circle text/icon
    const avatarCircle = document.querySelector('.btn-profile-trigger .avatar-circle');
    if (avatarCircle) {
      avatarCircle.textContent = user.avatar || 'O';
    }
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

      if (action === 'wyloguj') {
        showToast('Zostałeś pomyślnie wylogowany!');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
        return;
      }

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

    const avatarPresets = ['O', '⚡', '📊', '🔴', '🎵', '📸', '🟪', '💎', '🔥', '👑'];

    switch (actionType) {
      case 'profil':
        title = '👤 Mój Profil';
        html = `
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
              <div id="current-modal-avatar" style="width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, #d97706, #f59e0b); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; color: #000; box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);">
                ${user.avatar}
              </div>
              <div>
                <h3 style="font-size: 1.3rem; font-weight: 800; color: #fff;">${user.name}</h3>
                <div style="display: flex; gap: 8px; align-items: center; margin-top: 6px;">
                  <span style="padding: 3px 12px; background: rgba(245, 158, 11, 0.2); color: var(--accent-primary); border-radius: 20px; font-size: 0.78rem; font-weight: 800;">
                    ${user.accountType}
                  </span>
                  ${user.isVerified ? `
                    <span style="padding: 3px 10px; background: rgba(16, 185, 129, 0.2); color: #34d399; border-radius: 20px; font-size: 0.78rem; font-weight: 800;">
                      Zweryfikowany ✓
                    </span>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Choose Avatar Section -->
            <div>
              <label style="display: block; font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 12px;">
                🎨 Wybierz Swój Avatar:
              </label>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;" id="avatar-picker-grid">
                ${avatarPresets.map(av => `
                  <button class="btn-avatar-option ${user.avatar === av ? 'selected' : ''}" data-avatar-val="${av}" style="width: 44px; height: 44px; border-radius: 12px; background: ${user.avatar === av ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(30, 41, 59, 0.8)'}; border: 1px solid ${user.avatar === av ? '#f59e0b' : 'var(--border-subtle)'}; color: ${user.avatar === av ? '#000' : '#fff'}; font-size: 1.2rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease;">
                    ${av}
                  </button>
                `).join('')}
              </div>
            </div>
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
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Zmień Hasło</label>
              <div style="display: flex; gap: 10px;">
                <input type="password" id="input-account-password" placeholder="Wpisz nowe hasło..." style="flex: 1; padding: 12px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none;">
                <button type="button" id="btnSendResetEmail" style="padding: 12px 14px; background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; font-weight: 700; border-radius: 8px; cursor: pointer; font-size: 0.85rem; whitespace: nowrap;">
                  Wyślij link e-mail
                </button>
              </div>
            </div>

            <button type="submit" class="btn-yellow-save" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; margin-top: 4px; transition: all 0.2s ease;">
              Zapisz Zmiany
            </button>

            <!-- Verification & Account Info Section -->
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                  <span style="display: block; font-weight: 700; font-size: 0.92rem; color: #fff;">Weryfikacja Konta</span>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">Zyskaj odznakę i unikalne bonusy użytkownika</span>
                </div>
                ${user.isVerified ? `
                  <span style="padding: 6px 14px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-weight: 800; border-radius: 8px; font-size: 0.85rem;">
                    Zweryfikowane ✓
                  </span>
                ` : `
                  <button type="button" id="btnVerifyAccount" style="padding: 8px 16px; background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-weight: 800; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem;">
                    Weryfikuj konto
                  </button>
                `}
              </div>

              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); background: rgba(15, 23, 42, 0.5); padding: 10px 14px; border-radius: 8px; margin-top: 10px;">
                <span>📅 Data dołączenia: <strong style="color: #fff;">${user.joinedDate || 'Sierpień 2026'}</strong></span>
                <span>🛡️ Status: <strong style="color: #34d399;">Aktywne</strong></span>
              </div>
            </div>
          </form>
        `;
        break;

      case 'ustawienia':
        title = '⚙️ Ustawienia Aplikacji';
        html = `
          <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <!-- Sound Settings Block -->
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff;">🔊 Dźwięki najechania kursorem</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Efekt dźwiękowy przy przesuwaniu kursorem po panelach i zakładkach</p>
                </div>
                <label class="switch-toggle" style="position: relative; display: inline-block; width: 44px; height: 24px;">
                  <input type="checkbox" id="setting-sound-enabled" ${user.settings.soundEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                  <span class="slider-round" style="position: absolute; cursor: pointer; inset: 0; background-color: #334155; transition: .3s; border-radius: 24px;"></span>
                </label>
              </div>

              <!-- Volume Range Slider -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
                  <span>Głośność dźwięku</span>
                  <span id="volume-val-display" style="color: #f59e0b; font-weight: 700;">${user.settings.soundVolume ?? 50}%</span>
                </div>
                <input type="range" id="setting-sound-volume" min="0" max="100" value="${user.settings.soundVolume ?? 50}" style="width: 100%; accent-color: #f59e0b; cursor: pointer;">
              </div>
            </div>

            <!-- Email News Notifications Block -->
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff;">📩 Powiadomienia e-mail o nowościach</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted);">Wysyłaj wiadomości o nowych wtyczkach i aktualizacjach na e-mail</p>
                </div>
                <label class="switch-toggle" style="position: relative; display: inline-block; width: 44px; height: 24px;">
                  <input type="checkbox" id="setting-email-notif" ${user.settings.emailNotifications ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                  <span class="slider-round" style="position: absolute; cursor: pointer; inset: 0; background-color: #334155; transition: .3s; border-radius: 24px;"></span>
                </label>
              </div>
            </div>

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

      // Attach event listeners for Profil (Avatar selector)
      if (actionType === 'profil') {
        document.querySelectorAll('.btn-avatar-option').forEach(btn => {
          btn.addEventListener('click', () => {
            const selectedVal = btn.getAttribute('data-avatar-val');
            const currentData = getApliHubUserData();
            currentData.avatar = selectedVal;
            currentData.selectedAvatar = selectedVal;
            saveApliHubUserData(currentData);

            document.querySelectorAll('.btn-avatar-option').forEach(b => {
              b.style.background = 'rgba(30, 41, 59, 0.8)';
              b.style.borderColor = 'var(--border-subtle)';
              b.style.color = '#fff';
            });

            btn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            btn.style.borderColor = '#f59e0b';
            btn.style.color = '#000';

            const modalAvatarDisplay = document.getElementById('current-modal-avatar');
            if (modalAvatarDisplay) modalAvatarDisplay.textContent = selectedVal;

            showToast(`Ustawiono nowy avatar: ${selectedVal}`);
          });
        });
      }

      // Attach event listeners for Konto
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

        const btnResetEmail = document.getElementById('btnSendResetEmail');
        if (btnResetEmail) {
          btnResetEmail.addEventListener('click', () => {
            const currentData = getApliHubUserData();
            showToast(`Wysłano link do zmiany hasła na adres ${currentData.email}`);
          });
        }

        const btnVerify = document.getElementById('btnVerifyAccount');
        if (btnVerify) {
          btnVerify.addEventListener('click', () => {
            const currentData = getApliHubUserData();
            currentData.isVerified = true;
            saveApliHubUserData(currentData);
            showToast('Gratulacje! Twoje konto zostało zweryfikowane. Przyznano status VIP!');
            closeModal();
          });
        }
      }

      // Attach event listeners for Ustawienia
      if (actionType === 'ustawienia') {
        const soundToggle = document.getElementById('setting-sound-enabled');
        const soundVolSlider = document.getElementById('setting-sound-volume');
        const volDisplay = document.getElementById('volume-val-display');
        const emailToggle = document.getElementById('setting-email-notif');

        if (soundToggle) {
          soundToggle.addEventListener('change', () => {
            const currentData = getApliHubUserData();
            currentData.settings.soundEnabled = soundToggle.checked;
            saveApliHubUserData(currentData);
            showToast(soundToggle.checked ? 'Włączono dźwięki najechania' : 'Wyłączono dźwięki najechania');
          });
        }

        if (soundVolSlider) {
          soundVolSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            if (volDisplay) volDisplay.textContent = `${val}%`;
            const currentData = getApliHubUserData();
            currentData.settings.soundVolume = val;
            saveApliHubUserData(currentData);
          });
        }

        if (emailToggle) {
          emailToggle.addEventListener('change', () => {
            const currentData = getApliHubUserData();
            currentData.settings.emailNotifications = emailToggle.checked;
            saveApliHubUserData(currentData);
            showToast(emailToggle.checked ? 'Włączono powiadomienia e-mail' : 'Wyłączono powiadomienia e-mail');
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

