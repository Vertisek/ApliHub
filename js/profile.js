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
    const profileTrigger = document.getElementById('profileTrigger');

    if (!user || user.isLoggedIn === false) {
      if (profileTrigger) {
        profileTrigger.innerHTML = `
          <div class="avatar-circle" style="background: linear-gradient(135deg, #475569, #334155); color: #94a3b8; font-size: 1rem;">🔑</div>
          <span class="profile-name" style="color: #f59e0b; font-weight: 700;">Zaloguj się</span>
        `;
      }
    } else {
      if (profileTrigger) {
        const isCustomImage = user.avatar && (user.avatar.startsWith('data:image/') || user.avatar.startsWith('http') || user.avatar.startsWith('blob:'));
        const avatarHtml = isCustomImage 
          ? `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
          : (user.avatar || (user.name || 'O')[0].toUpperCase());

        profileTrigger.innerHTML = `
          <div class="avatar-circle">${avatarHtml}</div>
          <span class="profile-name">${user.name || 'Oskar'}</span>
          <svg class="caret-icon" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5H7z"></path>
          </svg>
        `;
      }
      const nameElems = document.querySelectorAll('.dropdown-user-name');
      nameElems.forEach(el => el.textContent = user.name || 'Użytkownik');
      const emailElem = document.querySelector('.dropdown-user-email');
      if (emailElem) emailElem.textContent = user.email || '';
    }
  }

  // Toggle Dropdown or Open Login Modal
  if (profileTrigger && profileContainer) {
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const user = getApliHubUserData();
      if (!user || user.isLoggedIn === false) {
        openLoginModal();
      } else {
        profileContainer.classList.toggle('open');
      }
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
        const profileTriggerBtn = document.getElementById('profileTrigger');
        const avatarCircle = profileTriggerBtn ? profileTriggerBtn.querySelector('.avatar-circle') : null;

        if (avatarCircle) {
          avatarCircle.classList.remove('avatar-glow-pop', 'avatar-logout-shrink');
          void avatarCircle.offsetWidth; // Force reflow
          avatarCircle.classList.add('avatar-logout-shrink');
        }

        setTimeout(() => {
          localStorage.setItem('aplihub_logged_out', 'true');
          localStorage.removeItem('aplihub_user');
          localStorage.removeItem('aplihub_user_store');
          localStorage.removeItem('aplihub_token');
          sessionStorage.clear();

          const loggedOutData = { ...DEFAULT_USER_STORE, isLoggedIn: false, name: 'Gość', email: '' };
          saveApliHubUserData(loggedOutData);

          showToast('👋 Zostałeś pomyślnie wylogowany. Do zobaczenia!');
          updateHeaderUserInfo();
        }, 200);
        return;
      }

      openProfileModal(action);
    });
  });

  // Close Modal Events
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  let modalMouseDownTarget = null;
  if (modalBackdrop) {
    modalBackdrop.addEventListener('mousedown', (e) => {
      modalMouseDownTarget = e.target;
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop && modalMouseDownTarget === modalBackdrop) {
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

    const isCustomImage = user.avatar && (user.avatar.startsWith('data:image/') || user.avatar.startsWith('http') || user.avatar.startsWith('blob:'));

    switch (actionType) {
      case 'profil':
        title = '👤 Mój Profil';
        html = `
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle);">
              <div id="current-modal-avatar" style="width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, #d97706, #f59e0b); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; color: #000; box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); overflow: hidden;">
                ${isCustomImage 
                  ? `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
                  : (user.avatar || (user.name || 'O')[0].toUpperCase())}
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

            <!-- Custom Avatar Upload Section -->
            <div>
              <label style="display: block; font-size: 0.9rem; font-weight: 700; color: #fff; margin-bottom: 10px;">
                🖼️ Wgraj własny avatar z komputera:
              </label>
              <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <label for="avatarFileInput" style="padding: 10px 18px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border-radius: 8px; cursor: pointer; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 8px; transition: var(--transition);">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Wybierz plik z komputera
                </label>
                <input type="file" id="avatarFileInput" accept="image/*" style="display: none;">

                ${isCustomImage ? `
                  <button type="button" id="btnRemoveAvatar" style="padding: 10px 16px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; font-weight: 700; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: var(--transition);">
                    🗑️ Usuń zdjęcie
                  </button>
                ` : ''}
              </div>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 10px;">
                Obsługiwane pliki: PNG, JPG, WEBP, GIF. Plik zostanie wgrany z Twojego komputera.
              </p>
            </div>
          </div>
        `;
        break;

      case 'konto':
        title = '💳 Ustawienia Konta i Bezpieczeństwa';
        html = `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Adres E-mail</label>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px;">
                <span style="color: #fff; font-weight: 700; font-size: 0.95rem;" id="current-account-email-display">${user.email}</span>
                <button type="button" id="btnOpenChangeEmailModal" style="padding: 6px 14px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; border: none; border-radius: 6px; cursor: pointer; font-size: 0.82rem; transition: var(--transition);">
                  Zmień
                </button>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Bezpieczeństwo Hasła</label>
              <button type="button" id="btnOpenChangePassModal" style="width: 100%; padding: 12px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; font-weight: 800; border-radius: 10px; cursor: pointer; font-size: 0.92rem; transition: all 0.2s ease;">
                🔑 Zmień hasło
              </button>
            </div>

            <!-- Verification & Account Info Section -->
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-top: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
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

              <div style="font-size: 0.85rem; color: var(--text-muted); background: rgba(15, 23, 42, 0.5); padding: 10px 14px; border-radius: 8px; text-align: center;">
                📅 Data dołączenia: <strong style="color: #fff;">${user.joinedDate || '01.08.2026 r.'}</strong>
              </div>
            </div>
          </div>
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
    }

    if (modalTitle && modalContent && modalBackdrop) {
      modalTitle.innerHTML = title;
      modalContent.innerHTML = html;
      modalBackdrop.classList.add('active');

      // Attach event listeners for Profil (Custom Avatar file upload)
      if (actionType === 'profil') {
        const fileInput = document.getElementById('avatarFileInput');
        if (fileInput) {
          fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                showToast('❌ Plik jest za duży. Maksymalny rozmiar to 5 MB.');
                return;
              }
              const reader = new FileReader();
              reader.onload = function(evt) {
                const dataUrl = evt.target.result;
                const currentData = getApliHubUserData();
                currentData.avatar = dataUrl;
                currentData.selectedAvatar = dataUrl;
                saveApliHubUserData(currentData);
                updateHeaderUserInfo();
                showToast('🎨 Avatar został pomyślnie wgrany!');
                openProfileModal('profil');
              };
              reader.readAsDataURL(file);
            }
          });
        }

        const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');
        if (btnRemoveAvatar) {
          btnRemoveAvatar.addEventListener('click', () => {
            const currentData = getApliHubUserData();
            const defaultLetter = (currentData.name || 'O')[0].toUpperCase();
            currentData.avatar = defaultLetter;
            currentData.selectedAvatar = defaultLetter;
            saveApliHubUserData(currentData);
            updateHeaderUserInfo();
            showToast('🗑️ Przywrócono domyślny avatar.');
            openProfileModal('profil');
          });
        }
      }

      // Attach event listeners for Konto
      if (actionType === 'konto') {
        const btnChangeEmail = document.getElementById('btnOpenChangeEmailModal');
        if (btnChangeEmail) {
          btnChangeEmail.addEventListener('click', () => {
            const userEmail = getApliHubUserData().email;
            modalTitle.innerHTML = '✉️ Zmiana Adresu E-mail';
            modalContent.innerHTML = `
              <form id="email-link-form" style="display: flex; flex-direction: column; gap: 14px;">
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
                  Podaj adres e-mail, na który ma zostać wysłana wiadomość z linkiem potwierdzającym zmianę adresu:
                </p>
                <div>
                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Docelowy adres e-mail</label>
                  <input type="email" id="input-new-email-target" value="${userEmail}" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none;">
                </div>
                <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; margin-top: 6px;">
                  Wyślij link do zmiany e-maila
                </button>
              </form>
            `;

            document.getElementById('email-link-form').addEventListener('submit', (e) => {
              e.preventDefault();
              const targetEmail = document.getElementById('input-new-email-target').value.trim();
              if (targetEmail) {
                const currentData = getApliHubUserData();
                currentData.email = targetEmail;
                saveApliHubUserData(currentData);
                showToast(`Wysłano link ze stroną do zmiany e-maila na adres: ${targetEmail}`);
                closeModal();
              }
            });
          });
        }

        const btnChangePass = document.getElementById('btnOpenChangePassModal');
        if (btnChangePass) {
          btnChangePass.addEventListener('click', () => {
            const userEmail = getApliHubUserData().email;
            modalTitle.innerHTML = '🔑 Zmiana Hasła';
            modalContent.innerHTML = `
              <form id="pass-link-form" style="display: flex; flex-direction: column; gap: 14px;">
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
                  Podaj adres e-mail, na który ma zostać wysłany bezpieczny link do zmiany hasła:
                </p>
                <div>
                  <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Adres e-mail konta</label>
                  <input type="email" id="input-pass-email-target" value="${userEmail}" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none;">
                </div>
                <button type="submit" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; margin-top: 6px;">
                  Wyślij link do zmiany hasła
                </button>
              </form>
            `;

            document.getElementById('pass-link-form').addEventListener('submit', (e) => {
              e.preventDefault();
              const targetEmail = document.getElementById('input-pass-email-target').value.trim();
              if (targetEmail) {
                showToast(`Wysłano link ze stroną do zmiany hasła na adres: ${targetEmail}`);
                closeModal();
              }
            });
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
    }
  }

  function openLoginModal(prefillEmail = '') {
    if (!modalTitle || !modalContent || !modalBackdrop) return;
    
    modalTitle.innerHTML = '<span style="display:block; text-align:center; width:100%; font-size: 1.35rem; font-weight: 800; color: #fff;">Zaloguj się</span>';
    modalContent.innerHTML = `
      <form id="login-modal-form" novalidate style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Adres E-mail</label>
          <input type="email" id="modalAuthEmail" value="${prefillEmail}" placeholder="użytkownik123@aplihub.pl" autocomplete="off" style="width: 100%; padding: 12px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">
          <div id="errLoginEmail" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Hasło</label>
            <button type="button" id="btnOpenForgotPassword" style="background: none; border: none; color: #f59e0b; font-size: 0.8rem; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 0;">Nie pamiętam hasła</button>
          </div>
          <input type="password" id="modalAuthPassword" value="" placeholder="••••••••" autocomplete="new-password" style="width: 100%; padding: 12px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">
          <div id="errLoginPassword" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <button type="submit" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 12px; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; margin-top: 4px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
          Zaloguj się
        </button>

        <button type="button" id="btnOpenRegister" style="width: 100%; padding: 12px; background: rgba(30, 41, 59, 0.7); border: 1px solid var(--border-subtle); color: #fff; border-radius: 12px; font-weight: 700; font-size: 0.92rem; cursor: pointer; transition: all 0.2s ease;">
          Zarejestruj się
        </button>
      </form>
    `;

    modalBackdrop.classList.add('active');

    const emailInput = document.getElementById('modalAuthEmail');
    const passInput = document.getElementById('modalAuthPassword');
    const errEmail = document.getElementById('errLoginEmail');
    const errPass = document.getElementById('errLoginPassword');

    // Fix 6: Explicitly reset inputs on opening login modal
    if (!prefillEmail && emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';

    const form = document.getElementById('login-modal-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        if (errEmail) errEmail.style.display = 'none';
        if (errPass) errPass.style.display = 'none';

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passInput ? passInput.value : '';

        // Fix 3: Custom validation text
        if (!email) {
          if (errEmail) {
            errEmail.textContent = '⚠️ Wypełnij pole: Adres E-mail';
            errEmail.style.display = 'block';
          }
          valid = false;
        }

        if (!password) {
          if (errPass) {
            errPass.textContent = '⚠️ Wypełnij pole: Hasło';
            errPass.style.display = 'block';
          }
          valid = false;
        }

        if (!valid) return;

        // Check against registered users
        const registeredUsers = typeof getApliHubRegisteredUsers === 'function' ? getApliHubRegisteredUsers() : {};
        const registered = registeredUsers[email.toLowerCase()];

        if (registered && registered.password !== password) {
          if (errPass) {
            errPass.textContent = '⚠️ Niepoprawne hasło dla podanego adresu e-mail.';
            errPass.style.display = 'block';
          }
          return;
        }

        const name = registered ? registered.name : (email.split('@')[0] || 'Użytkownik');
        const avatar = registered ? registered.avatar : (email[0] || 'O').toUpperCase();

        const userData = {
          ...DEFAULT_USER_STORE,
          isLoggedIn: true,
          email: email,
          name: name,
          avatar: avatar,
          selectedAvatar: avatar,
          isVerified: true
        };

        // Smooth login transition
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '⏳ Logowanie...';
          submitBtn.style.opacity = '0.8';
        }

        setTimeout(() => {
          modalTitle.innerHTML = '<span style="display:block; text-align:center; width:100%; font-size: 1.35rem; font-weight: 800; color: #34d399;">Zalogowano!</span>';
          modalContent.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 16px; padding: 20px 0; animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); border: 2px solid #34d399; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #fff; box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); animation: logoBouncePulse 1s ease infinite;">
                ✓
              </div>
              <div>
                <h4 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 6px;">Witaj ponownie, <span style="color: #f59e0b;">${name}</span>!</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted);">Płynne przekierowanie do serwisu ApliHub...</p>
              </div>
            </div>
          `;

          saveApliHubUserData(userData);
          if (typeof showToast === 'function') {
            showToast(`Witaj ponownie, ${name}! 🎉`, 'success');
          }

          setTimeout(() => {
            closeModal();
            updateHeaderUserInfo();

            const avatarCircle = document.querySelector('.btn-profile-trigger .avatar-circle');
            if (avatarCircle) {
              avatarCircle.classList.remove('avatar-glow-pop');
              void avatarCircle.offsetWidth; // Force reflow
              avatarCircle.classList.add('avatar-glow-pop');
            }
          }, 650);
        }, 350);
      });
    }

    const btnReg = document.getElementById('btnOpenRegister');
    if (btnReg) {
      btnReg.addEventListener('click', () => openRegisterModalStep1());
    }

    const btnForgot = document.getElementById('btnOpenForgotPassword');
    if (btnForgot) {
      btnForgot.addEventListener('click', () => openForgotPasswordStep1());
    }
  }

  // Multi-step Registration Workflow
  function openRegisterModalStep1() {
    if (!modalTitle || !modalContent || !modalBackdrop) return;

    modalTitle.innerHTML = '<span style="display:block; text-align:center; width:100%; font-size: 1.35rem; font-weight: 800; color: #fff;">Zarejestruj się</span>';
    modalContent.innerHTML = `
      <form id="register-form-step1" novalidate style="display: flex; flex-direction: column; gap: 13px;">
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Nazwa użytkownika</label>
          <input type="text" id="regUsername" placeholder="np. Użytkownik_123" autocomplete="off" style="width: 100%; padding: 11px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.92rem; outline: none;">
          <div id="errRegUsername" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Nick (wyświetlana nazwa)</label>
          <input type="text" id="regNickname" placeholder="np. Fajny nick" autocomplete="off" style="width: 100%; padding: 11px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.92rem; outline: none;">
          <div id="errRegNickname" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Email</label>
          <input type="email" id="regEmail" placeholder="Uzytkownik123@super.pl" autocomplete="off" style="width: 100%; padding: 11px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.92rem; outline: none;">
          <div id="errRegEmail" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Hasło</label>
          <input type="password" id="regPassword" placeholder="••••••••" autocomplete="new-password" style="width: 100%; padding: 11px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.92rem; outline: none;">
          <div id="errRegPassword" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 600; margin-bottom: 4px; color: var(--text-muted);">Potwierdź hasło</label>
          <input type="password" id="regConfirmPassword" placeholder="••••••••" autocomplete="new-password" style="width: 100%; padding: 11px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.92rem; outline: none;">
          <div id="errRegConfirmPassword" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <div style="margin-top: 4px;">
          <label style="display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; color: var(--text-muted); cursor: pointer; line-height: 1.4;">
            <input type="checkbox" id="regTermsCheckbox" style="margin-top: 3px; accent-color: #f59e0b; width: 16px; height: 16px; cursor: pointer;">
            <span>Zapoznałem/am się z <a href="#" id="linkOpenTerms" style="color: #f59e0b; text-decoration: underline; font-weight: 600;">Regulaminem, Prawami Autorskimi i Polityką Prywatności</a> serwisu ApliHub.</span>
          </label>
          <div id="termsErrorMsg" style="display: none; color: #ef4444; font-size: 0.82rem; font-weight: 700; background: rgba(239, 68, 68, 0.12); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3); margin-top: 8px; line-height: 1.4;">
            ⚠️ Zapoznanie się i akceptacja Regulaminu, Praw Autorskich oraz Polityki Prywatności jest wymagana, aby utworzyć konto w serwisie ApliHub.
          </div>
        </div>

        <button type="submit" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 12px; font-size: 0.98rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease; margin-top: 4px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
          Dalej ➔
        </button>

        <button type="button" id="btnBackToLogin" style="width: 100%; padding: 8px; background: transparent; border: none; color: var(--text-muted); font-size: 0.86rem; cursor: pointer; text-decoration: underline;">
          ← Wróć do logowania
        </button>
      </form>
    `;

    modalBackdrop.classList.add('active');

    const linkTerms = document.getElementById('linkOpenTerms');
    if (linkTerms) {
      linkTerms.addEventListener('click', (e) => {
        e.preventDefault();
        openTermsModal();
      });
    }

    const btnBack = document.getElementById('btnBackToLogin');
    if (btnBack) {
      btnBack.addEventListener('click', () => openLoginModal());
    }

    const form = document.getElementById('register-form-step1');
    const termsCheckbox = document.getElementById('regTermsCheckbox');
    const termsErrorMsg = document.getElementById('termsErrorMsg');

    const usernameInput = document.getElementById('regUsername');
    const nicknameInput = document.getElementById('regNickname');
    const emailInput = document.getElementById('regEmail');
    const passInput = document.getElementById('regPassword');
    const confirmPassInput = document.getElementById('regConfirmPassword');

    const errUsername = document.getElementById('errRegUsername');
    const errNickname = document.getElementById('errRegNickname');
    const errEmail = document.getElementById('errRegEmail');
    const errPass = document.getElementById('errRegPassword');
    const errConfirm = document.getElementById('errRegConfirmPassword');

    function hideAllErrors() {
      [errUsername, errNickname, errEmail, errPass, errConfirm, termsErrorMsg].forEach(el => {
        if (el) el.style.display = 'none';
      });
    }

    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', () => {
        if (termsCheckbox.checked && termsErrorMsg) {
          termsErrorMsg.style.display = 'none';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAllErrors();
        let valid = true;

        const username = usernameInput ? usernameInput.value.trim() : '';
        const nickname = nicknameInput ? nicknameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passInput ? passInput.value : '';
        const confirmPass = confirmPassInput ? confirmPassInput.value : '';

        // Fix 3 & 2: Custom validation for empty or taken username
        if (!username) {
          if (errUsername) {
            errUsername.textContent = '⚠️ Wypełnij pole: Nazwa użytkownika';
            errUsername.style.display = 'block';
          }
          valid = false;
        } else if (typeof isUsernameTaken === 'function' && isUsernameTaken(username)) {
          if (errUsername) {
            errUsername.textContent = '⚠️ Ta nazwa użytkownika jest już zajęta. Wybierz inną.';
            errUsername.style.display = 'block';
          }
          valid = false;
        }

        // Fix 3: Custom validation for Nick
        if (!nickname) {
          if (errNickname) {
            errNickname.textContent = '⚠️ Wypełnij pole: Nick (wyświetlana nazwa)';
            errNickname.style.display = 'block';
          }
          valid = false;
        }

        // Fix 3 & 1: Custom validation for Email & duplicate email check
        if (!email) {
          if (errEmail) {
            errEmail.textContent = '⚠️ Wypełnij pole: Email';
            errEmail.style.display = 'block';
          }
          valid = false;
        } else if (typeof isEmailRegistered === 'function' && isEmailRegistered(email)) {
          if (errEmail) {
            errEmail.textContent = '⚠️ Ten adres e-mail jest już zarejestrowany w serwisie ApliHub.';
            errEmail.style.display = 'block';
          }
          valid = false;
        }

        // Fix 3: Custom validation for Password
        if (!password) {
          if (errPass) {
            errPass.textContent = '⚠️ Wypełnij pole: Hasło';
            errPass.style.display = 'block';
          }
          valid = false;
        }

        if (!confirmPass) {
          if (errConfirm) {
            errConfirm.textContent = '⚠️ Wypełnij pole: Potwierdź hasło';
            errConfirm.style.display = 'block';
          }
          valid = false;
        } else if (password !== confirmPass) {
          if (errConfirm) {
            errConfirm.textContent = '⚠️ Podane hasła nie są identyczne.';
            errConfirm.style.display = 'block';
          }
          valid = false;
        }

        if (!termsCheckbox || !termsCheckbox.checked) {
          if (termsErrorMsg) termsErrorMsg.style.display = 'block';
          valid = false;
        }

        if (!valid) return;

        // Real Supabase Auth Integration
        const supabase = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
        if (supabase) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email: email,
              password: password,
              options: {
                data: {
                  username: username,
                  display_name: nickname
                }
              }
            });

            if (error) {
              if (errEmail) {
                errEmail.textContent = '⚠️ Błąd rejestracji Supabase: ' + error.message;
                errEmail.style.display = 'block';
              }
              return;
            }
          } catch (err) {
            console.warn('Supabase signUp fallback:', err);
          }
        }

        openRegisterModalStep2({ username, name: nickname, email, password });
      });
    }
  }

  function openRegisterModalStep2(userData) {
    if (!modalTitle || !modalContent || !modalBackdrop) return;

    // Send toast simulation email notification
    if (typeof showToast === 'function') {
      showToast(`Wysłano wiadomość e-mail z kodem weryfikacyjnym na adres: ${userData.email}`);
    }

    modalTitle.innerHTML = '<span style="display:block; text-align:center; width:100%; font-size: 1.35rem; font-weight: 800; color: #fff;">Weryfikacja E-mail</span>';
    modalContent.innerHTML = `
      <form id="register-form-step2" novalidate style="display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
          Na Twój adres e-mail <strong style="color: #fff;">${userData.email}</strong> został wysłany kod weryfikacyjny.
        </p>

        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Kod weryfikacyjny</label>
          <input type="text" id="regVerifyCode" placeholder="Wprowadź kod" autocomplete="off" style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 1.05rem; text-align: center; outline: none;">
          <div id="errRegCode" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <button type="submit" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 12px; font-size: 0.98rem; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
          Dalej ➔
        </button>
      </form>
    `;

    const form = document.getElementById('register-form-step2');
    const errCode = document.getElementById('errRegCode');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errCode) errCode.style.display = 'none';

        const codeInput = document.getElementById('regVerifyCode');
        const code = codeInput ? codeInput.value.trim() : '';

        // Fix 3: Custom validation message
        if (!code) {
          if (errCode) {
            errCode.textContent = '⚠️ Wypełnij pole: Kod weryfikacyjny';
            errCode.style.display = 'block';
          }
          return;
        }

        // Real Supabase OTP Verification
        const supabase = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;
        if (supabase) {
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              email: userData.email,
              token: code,
              type: 'signup'
            });

            if (error) {
              if (errCode) {
                errCode.textContent = '⚠️ Błędny kod lub kod wygasł: ' + error.message;
                errCode.style.display = 'block';
              }
              return;
            }
          } catch (err) {
            console.warn('Supabase verifyOtp fallback:', err);
          }
        }

        // Register user in store
        if (typeof registerApliHubUser === 'function') {
          registerApliHubUser(userData);
        }

        openRegisterModalStep3(userData);
      });
    }
  }

  function openRegisterModalStep3(userData) {
    if (!modalTitle || !modalContent || !modalBackdrop) return;

    modalTitle.innerHTML = '<span style="display:block; text-align:center; width:100%; font-size: 1.35rem; font-weight: 800; color: #34d399;">Konto Utworzone!</span>';
    modalContent.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; padding: 10px 0;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #34d399;">
          ✓
        </div>

        <div>
          <p style="font-size: 0.95rem; color: #fff; font-weight: 700; margin-bottom: 6px;">
            Pomyślnie utworzono konto dla <span style="color: #f59e0b;">${userData.email}</span>!
          </p>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
            Teraz zaloguj się swoimi danymi. Za chwilę nastąpi automatyczne przekierowanie do okna logowania...
          </p>
        </div>

        <div style="width: 100%; background: rgba(30, 41, 59, 0.8); height: 8px; border-radius: 4px; overflow: hidden; margin-top: 8px;">
          <div id="redirectProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #f59e0b, #34d399); transition: width 3.5s linear;"></div>
        </div>

        <span style="font-size: 0.82rem; color: var(--text-muted);">Przekierowanie za <strong id="countdownText" style="color: #f59e0b;">4</strong> sekundy...</span>
      </div>
    `;

    setTimeout(() => {
      const progressBar = document.getElementById('redirectProgressBar');
      if (progressBar) progressBar.style.width = '100%';
    }, 50);

    let secLeft = 4;
    const interval = setInterval(() => {
      secLeft--;
      const textElem = document.getElementById('countdownText');
      if (textElem) textElem.textContent = secLeft;
      if (secLeft <= 0) {
        clearInterval(interval);
        openLoginModal(userData.email);
      }
    }, 900);
  }

  // Password Reset Workflow
  function openForgotPasswordStep1() {
    if (!modalTitle || !modalContent || !modalBackdrop) return;

    modalTitle.innerHTML = '<span style="display:block; text-align:center; width:100%; font-size: 1.35rem; font-weight: 800; color: #fff;">Resetowanie Hasła</span>';
    modalContent.innerHTML = `
      <form id="forgot-form-step1" novalidate style="display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
          Wprowadź swój adres e-mail, na który wyślemy wiadomość z linkiem do zresetowania hasła.
        </p>

        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Adres E-mail</label>
          <input type="email" id="forgotEmail" placeholder="Uzytkownik123@super.pl" autocomplete="off" style="width: 100%; padding: 12px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">
          <div id="errForgotEmail" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <button type="submit" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 12px; font-size: 0.98rem; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
          Dalej ➔
        </button>

        <button type="button" id="btnBackToLoginForgot" style="width: 100%; padding: 8px; background: transparent; border: none; color: var(--text-muted); font-size: 0.86rem; cursor: pointer; text-decoration: underline;">
          ← Wróć do logowania
        </button>
      </form>
    `;

    const btnBack = document.getElementById('btnBackToLoginForgot');
    if (btnBack) {
      btnBack.addEventListener('click', () => openLoginModal());
    }

    const form = document.getElementById('forgot-form-step1');
    const errForgotEmail = document.getElementById('errForgotEmail');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (errForgotEmail) errForgotEmail.style.display = 'none';

        const emailInput = document.getElementById('forgotEmail');
        const email = emailInput ? emailInput.value.trim() : '';

        // Fix 3: Custom validation message
        if (!email) {
          if (errForgotEmail) {
            errForgotEmail.textContent = '⚠️ Wypełnij pole: Adres E-mail';
            errForgotEmail.style.display = 'block';
          }
          return;
        }

        openForgotPasswordStep2(email);
      });
    }
  }

  function openForgotPasswordStep2(email) {
    if (!modalTitle || !modalContent || !modalBackdrop) return;

    if (typeof showToast === 'function') {
      showToast(`Wysłano wiadomość e-mail z linkiem do resetu hasła na adres: ${email}`);
    }

    modalTitle.innerHTML = '<span style="display:block; text-align:center; width:100%; font-size: 1.35rem; font-weight: 800; color: #fff;">Wiadomość Wysłana</span>';
    modalContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
          Wysłano wiadomość e-mail z instrukcją resetu hasła na adres: <strong style="color: #fff;">${email}</strong>.
        </p>

        <button type="button" id="btnSimulateResetLink" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; border: none; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
          Przejdź do resetu hasła
        </button>
      </div>
    `;

    const btnSim = document.getElementById('btnSimulateResetLink');
    if (btnSim) {
      btnSim.addEventListener('click', () => openForgotPasswordStep3(email));
    }
  }

  function openForgotPasswordStep3(email) {
    if (!modalTitle || !modalContent || !modalBackdrop) return;

    modalTitle.innerHTML = '<span style="display:block; text-align:center; width:100%; font-size: 1.35rem; font-weight: 800; color: #fff;">Ustaw Nowe Hasło</span>';
    modalContent.innerHTML = `
      <form id="forgot-form-step3" novalidate style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Nowe hasło</label>
          <input type="password" id="resetNewPass" placeholder="••••••••" autocomplete="new-password" style="width: 100%; padding: 12px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">
          <div id="errResetPass" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 6px; color: var(--text-muted);">Powtórz hasło</label>
          <input type="password" id="resetConfirmPass" placeholder="••••••••" autocomplete="new-password" style="width: 100%; padding: 12px 14px; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-subtle); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">
          <div id="errResetConfirm" style="display: none; color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;"></div>
        </div>

        <button type="submit" style="width: 100%; padding: 13px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 12px; font-size: 0.98rem; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); margin-top: 4px;">
          Zatwierdź
        </button>
      </form>
    `;

    const form = document.getElementById('forgot-form-step3');
    const errResetPass = document.getElementById('errResetPass');
    const errResetConfirm = document.getElementById('errResetConfirm');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (errResetPass) errResetPass.style.display = 'none';
        if (errResetConfirm) errResetConfirm.style.display = 'none';

        const newPassInput = document.getElementById('resetNewPass');
        const confirmPassInput = document.getElementById('resetConfirmPass');

        const newPass = newPassInput ? newPassInput.value : '';
        const confirmPass = confirmPassInput ? confirmPassInput.value : '';

        let valid = true;

        if (!newPass) {
          if (errResetPass) {
            errResetPass.textContent = '⚠️ Wypełnij pole: Nowe hasło';
            errResetPass.style.display = 'block';
          }
          valid = false;
        }

        if (!confirmPass) {
          if (errResetConfirm) {
            errResetConfirm.textContent = '⚠️ Wypełnij pole: Powtórz hasło';
            errResetConfirm.style.display = 'block';
          }
          valid = false;
        } else if (newPass !== confirmPass) {
          if (errResetConfirm) {
            errResetConfirm.textContent = '⚠️ Podane hasła nie są identyczne.';
            errResetConfirm.style.display = 'block';
          }
          valid = false;
        }

        if (!valid) return;

        if (typeof updateApliHubPassword === 'function') {
          updateApliHubPassword(email, newPass);
        }

        showToast('Hasło zostało pomyślnie zmienione! Zaloguj się nowym hasłem.');
        openLoginModal(email);
      });
    }
  }

  // Terms & Privacy Modal
  function openTermsModal() {
    if (!modalTitle || !modalContent || !modalBackdrop) return;

    modalTitle.innerHTML = '📜 Regulamin & Polityka Prywatności ApliHub';
    modalContent.innerHTML = `
      <div style="max-height: 55vh; overflow-y: auto; padding-right: 8px; font-size: 0.86rem; color: var(--text-muted); line-height: 1.6; display: flex; flex-direction: column; gap: 14px;">
        <h4 style="color: #fff; font-size: 0.98rem; font-weight: 700;">1. Regulamin Korzystania z Serwisu</h4>
        <p>Serwis ApliHub udostępnia autorskie wtyczki oraz aplikacje narzędziowe. Rejestrując konto, Użytkownik zobowiązuje się do korzystania z platformy w sposób zgodny z obowiązującym prawem oraz nienaruszający praw autorskich twórców.</p>

        <h4 style="color: #fff; font-size: 0.98rem; font-weight: 700;">2. Prawa Autorskie & Licencja Oprogramowania ©</h4>
        <p>Wszystkie udostępniane wtyczki, aplikacje, pliki binarne, interfejs graficzny oraz kod źródłowy stanowią wyłączną własność intelektualną ApliHub. Pobieranie oprogramowania odbywa się na zasadach darmowej licencji osobistej (EULA) bez prawa do odsprzedaży lub inżynierii wstecznej.</p>

        <h4 style="color: #fff; font-size: 0.98rem; font-weight: 700;">3. Polityka Prywatności & Ochrona Danych (RODO)</h4>
        <p>Szanujemy Twoją prywatność. Dane podawane podczas rejestracji (adres e-mail, nazwa użytkownika) są chronione i służą wyłącznie do autoryzacji oraz lokalnej synchronizacji ustawień wtyczek. ApliHub nie sprzedaje ani nie przekazuje danych podmiotom trzecim.</p>
      </div>

      <button type="button" id="btnAcceptTermsClose" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; margin-top: 14px;">
        Zamknij i Akceptuj
      </button>
    `;

    modalBackdrop.classList.add('active');

    const btnClose = document.getElementById('btnAcceptTermsClose');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        closeModal();
        const termsCheckbox = document.getElementById('regTermsCheckbox');
        const termsErrorMsg = document.getElementById('termsErrorMsg');
        if (termsCheckbox) {
          termsCheckbox.checked = true;
          if (termsErrorMsg) termsErrorMsg.style.display = 'none';
        }
      });
    }
  }
});

