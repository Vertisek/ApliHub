// content.js - ReTrap konwerter wtyczka YouTube

let shadowRootRef = null;
let currentVideoId = "";

// Inicjalizacja DOM wtyczki (w Shadow DOM)
function initReTrapDOM() {
  if (document.getElementById('retrap-converter-root')) return;

  const rootEl = document.createElement('div');
  rootEl.id = 'retrap-converter-root';
  document.body.appendChild(rootEl);

  const shadow = rootEl.attachShadow({ mode: 'open' });
  shadowRootRef = shadow;

  // Wstrzykiwanie stylów dopasowanych do zrzutu ekranu użytkownika
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .retrap-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .retrap-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .retrap-modal {
      background: #0f0f11;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8);
      border-radius: 16px;
      width: 90%;
      max-width: 440px;
      padding: 24px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      transform: scale(0.92);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }

    .retrap-overlay.active .retrap-modal {
      transform: scale(1);
    }

    .retrap-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .retrap-logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .retrap-logo-text {
      font-weight: 700;
      font-size: 18px;
      color: #ffffff;
      letter-spacing: -0.2px;
    }

    .retrap-close-btn {
      background: transparent;
      border: none;
      color: #606067;
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
      transition: color 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .retrap-close-btn:hover {
      color: #ffffff;
    }

    .retrap-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .retrap-option-card {
      display: flex;
      align-items: center;
      background: #1c1c1f;
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      padding: 14px 18px;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }

    .retrap-option-card:hover {
      background: #242429;
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
    }

    .retrap-option-icon {
      color: #6b6b72;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 18px;
      flex-shrink: 0;
    }

    .retrap-option-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      margin-right: 12px;
      min-width: 0; /* do ucinania tekstu */
    }

    .retrap-option-title {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
    }

    .retrap-option-desc {
      font-size: 12px;
      color: #83838c;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .retrap-option-btn {
      background: transparent;
      border: 1px solid rgba(0, 162, 255, 0.25);
      color: #00a2ff;
      border-radius: 20px;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .retrap-option-card:hover .retrap-option-btn {
      border-color: #00a2ff;
      box-shadow: 0 0 8px rgba(0, 162, 255, 0.2);
    }

    .retrap-option-btn:hover {
      background: #00a2ff !important;
      color: #0f0f11 !important;
      box-shadow: 0 0 12px rgba(0, 162, 255, 0.5) !important;
      border-color: #00a2ff !important;
    }

    /* Sekcja postępu i błędu */
    .retrap-progress-container {
      margin-top: 16px;
      padding: 14px;
      background: rgba(0, 162, 255, 0.04);
      border: 1px solid rgba(0, 162, 255, 0.15);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      transition: all 0.2s ease;
    }

    .retrap-progress-container.hidden {
      display: none;
    }

    .retrap-progress-container.error {
      background: rgba(255, 59, 59, 0.05) !important;
      border: 1px solid rgba(255, 59, 59, 0.2) !important;
      align-items: flex-start !important;
    }

    .retrap-progress-spinner {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(0, 162, 255, 0.1);
      border-top-color: #00a2ff;
      border-radius: 50%;
      animation: retrap-spin 0.8s linear infinite;
    }

    .retrap-progress-container.error .retrap-progress-spinner {
      display: none !important;
    }

    .retrap-progress-text {
      font-size: 12px;
      font-weight: 600;
      color: #00a2ff;
      text-align: center;
      line-height: 1.4;
      white-space: pre-wrap;
    }

    .retrap-progress-container.error .retrap-progress-text {
      color: #ff8585 !important;
      text-align: left !important;
      font-size: 13px !important;
      display: flex !important;
      align-items: flex-start !important;
      gap: 8px !important;
    }

    .retrap-progress-bar-wrap {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
      overflow: hidden;
    }

    .retrap-progress-container.error .retrap-progress-bar-wrap {
      display: none !important;
    }

    .retrap-progress-bar {
      height: 100%;
      width: 0%;
      background: #00a2ff;
      border-radius: 2px;
      box-shadow: 0 0 8px #00a2ff;
      transition: width 0.25s linear;
    }

    /* Przyciski błędów w kontenerze błędu */
    .retrap-error-actions {
      display: none;
      width: 100%;
      gap: 10px;
      margin-top: 4px;
      justify-content: flex-start;
    }

    .retrap-progress-container.error .retrap-error-actions {
      display: flex !important;
    }

    .retrap-emergency-btn {
      background: #db4455 !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 16px !important;
      padding: 6px 14px !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      transition: background 0.15s !important;
    }

    .retrap-emergency-btn:hover {
      background: #ff5266 !important;
    }

    .retrap-retry-btn {
      background: transparent !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      color: #a0a0a5 !important;
      border-radius: 16px !important;
      padding: 6px 14px !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      transition: all 0.15s !important;
    }

    .retrap-retry-btn:hover {
      border-color: rgba(255, 255, 255, 0.3) !important;
      color: #ffffff !important;
      background: rgba(255, 255, 255, 0.03) !important;
    }

    /* Czerwona krawędź dla błędu na karcie opcji */
    .retrap-option-card.error-card {
      border-color: rgba(255, 59, 59, 0.4) !important;
      background: rgba(255, 59, 59, 0.03) !important;
    }

    /* Ustawienia API (Rozwijane dyskretnie) */
    .retrap-settings-container {
      margin-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 10px;
    }

    .retrap-settings-toggle {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.3);
      font-size: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      border-radius: 4px;
      margin-left: auto;
      transition: all 0.15s;
    }

    .retrap-settings-toggle:hover {
      color: #00a2ff;
      background: rgba(255, 255, 255, 0.03);
    }

    .retrap-settings-body {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    .retrap-settings-body.hidden {
      display: none;
    }

    .retrap-input-group {
      display: flex;
      gap: 6px;
    }

    .retrap-input-group input {
      flex: 1;
      background: #18181c;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      color: #ffffff;
      padding: 6px 10px;
      font-size: 12px;
      outline: none;
    }

    .retrap-input-group input:focus {
      border-color: #00a2ff;
    }

    .retrap-input-group button {
      background: rgba(0, 162, 255, 0.12);
      border: 1px solid rgba(0, 162, 255, 0.25);
      border-radius: 6px;
      color: #00a2ff;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.15s;
    }

    .retrap-input-group button:hover {
      background: #00a2ff;
      color: #0c0c0e;
    }

    .retrap-status-msg {
      font-size: 11px;
    }
    .retrap-status-msg.success { color: #2ec4b6; }
    .retrap-status-msg.error { color: #ff3b3b; }

    .retrap-info-small {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.3);
      line-height: 1.4;
    }



    @keyframes retrap-spin {
      to { transform: rotate(360deg); }
    }

    @keyframes retrap-pulse-bar {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `;
  shadow.appendChild(styleEl);

  // Struktura HTML modalu - zgodna ze zrzutem ekranu
  const overlay = document.createElement('div');
  overlay.className = 'retrap-overlay';
  overlay.id = 'retrap-overlay';

  overlay.innerHTML = `
    <div class="retrap-modal">
      <div class="retrap-header">
        <div class="retrap-logo-container">
          <!-- Ikona pobierania z grubością linii (stroke-width: 3) z obrazka -->
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#00a2ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span class="retrap-logo-text">ReTrap Konwerter</span>
        </div>
        <button class="retrap-close-btn" id="retrap-close">
          <!-- Ikona X -->
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="retrap-options">
        <!-- Opcja MP3 -->
        <div class="retrap-option-card" data-format="mp3">
          <div class="retrap-option-icon">
            <!-- Ikona nuty -->
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div class="retrap-option-details">
            <div class="retrap-option-title">MP3 — 320kbps</div>
            <div class="retrap-option-desc">Konwertuj do świetnej jakości audio MP3</div>
          </div>
          <button class="retrap-option-btn">Pobierz</button>
        </div>
        
        <!-- Opcja WAV -->
        <div class="retrap-option-card" data-format="wav">
          <div class="retrap-option-icon">
            <!-- Ikona głośnika (volume) -->
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          </div>
          <div class="retrap-option-details">
            <div class="retrap-option-title">WAV — Bezstratny</div>
            <div class="retrap-option-desc">Konwertuj do świetnej jakości audio WAV</div>
          </div>
          <button class="retrap-option-btn">Pobierz</button>
        </div>

        <!-- Opcja MP4 1080p -->
        <div class="retrap-option-card" data-format="1080">
          <div class="retrap-option-icon">
            <!-- Ikona kamery wideo -->
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </div>
          <div class="retrap-option-details">
            <div class="retrap-option-title">MP4 — 1080p Full HD</div>
            <div class="retrap-option-desc">Pobierz film w wysokiej rozdzielczości 1080p</div>
          </div>
          <button class="retrap-option-btn">Pobierz</button>
        </div>

        <!-- Opcja MP4 720p -->
        <div class="retrap-option-card" data-format="720">
          <div class="retrap-option-icon">
            <!-- Ikona kamery wideo -->
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </div>
          <div class="retrap-option-details">
            <div class="retrap-option-title">MP4 — 720p HD</div>
            <div class="retrap-option-desc">Pobierz film w standardowej jakości HD 720p</div>
          </div>
          <button class="retrap-option-btn">Pobierz</button>
        </div>
      </div>
      
      <div class="retrap-progress-container hidden" id="retrap-progress-container">
        <div class="retrap-progress-spinner"></div>
        <div class="retrap-progress-text" id="retrap-progress-text">Przygotowywanie konwersji...</div>
        <div class="retrap-progress-bar-wrap">
          <div class="retrap-progress-bar"></div>
        </div>
        <div class="retrap-error-actions" id="retrap-error-actions">
          <button class="retrap-emergency-btn" id="retrap-emergency-btn">Użyj konwertera awaryjnego &rarr;</button>
          <button class="retrap-retry-btn" id="retrap-retry-btn">Spróbuj ponownie</button>
        </div>
      </div>
    </div>
  `;
  shadow.appendChild(overlay);

  // Obsługa kliknięć i zamykania
  shadow.getElementById('retrap-close').addEventListener('click', closeReTrapModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeReTrapModal();
  });

  // Kliknięcie w karty rozpoczyna pobieranie
  const cards = shadow.querySelectorAll('.retrap-option-card');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const format = card.getAttribute('data-format');
      startDownloadFlow(format);
    });
  });
}

// Globalne zmienne paska postępu
let currentProgressPercent = 0;
let progressSimTimer = null;

function setProgressBarWidth(percent) {
  currentProgressPercent = percent;
  if (shadowRootRef) {
    const bar = shadowRootRef.querySelector('.retrap-progress-bar');
    if (bar) {
      bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
    }
  }
}

// Nasłuchiwanie komunikatów z background.js o postępie pobierania pliku
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "downloadProgressUpdate" && shadowRootRef) {
    const progressText = shadowRootRef.getElementById('retrap-progress-text');
    
    if (progressSimTimer) {
      clearInterval(progressSimTimer);
      progressSimTimer = null;
    }

    const realPercent = Math.max(currentProgressPercent, msg.percent);
    setProgressBarWidth(realPercent);

    if (progressText && msg.state !== "complete") {
      if (msg.totalBytes > 0) {
        const mbReceived = (msg.bytesReceived / (1024 * 1024)).toFixed(1);
        const mbTotal = (msg.totalBytes / (1024 * 1024)).toFixed(1);
        progressText.textContent = `Pobieranie pliku: ${realPercent}% (${mbReceived} MB / ${mbTotal} MB)...`;
      } else {
        progressText.textContent = `Pobieranie pliku: ${realPercent}%...`;
      }
    }
  }
});

// Otwieranie okienka
function openReTrapModal() {
  initReTrapDOM();
  
  const shadow = shadowRootRef;
  const overlay = shadow.getElementById('retrap-overlay');
  const progressContainer = shadow.getElementById('retrap-progress-container');

  // Resetujemy widoczność statusu pobierania przy otwarciu
  progressContainer.classList.add('hidden');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // wyłączenie scrollowania YT w tle
}

// Zamykanie okienka
function closeReTrapModal() {
  if (!shadowRootRef) return;
  const overlay = shadowRootRef.getElementById('retrap-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Rozpoczęcie konwersji i wysłanie do background.js
function startDownloadFlow(format) {
  const shadow = shadowRootRef;
  const progressContainer = shadow.getElementById('retrap-progress-container');
  const progressText = shadow.getElementById('retrap-progress-text');

  // Reset poprzednich błędów z kart opcji
  const allCards = shadow.querySelectorAll('.retrap-option-card');
  allCards.forEach(c => {
    c.classList.remove('error-card');
    const b = c.querySelector('.retrap-option-btn');
    b.style.borderColor = "";
    b.style.color = "";
    b.innerHTML = "Pobierz";
  });

  // Reset kontenera błędu i paska postępu
  progressContainer.classList.remove('error');
  progressContainer.classList.remove('hidden');
  progressText.style.color = "#00a2ff";
  progressText.innerHTML = "Nawiązywanie połączenia z serwerem...";

  if (progressSimTimer) clearInterval(progressSimTimer);
  setProgressBarWidth(5);

  // Smooth symulacja postępu przy zapytaniu do serwera
  let simStep = 5;
  progressSimTimer = setInterval(() => {
    if (simStep < 35) {
      simStep += Math.floor(Math.random() * 4) + 2;
      setProgressBarWidth(simStep);
    }
  }, 300);

  const match = window.location.href.match(/[?&]v=([^&#]+)/);
  const videoUrl = match && match[1] ? `https://www.youtube.com/watch?v=${match[1]}` : window.location.href;
  
  let payload = {
    url: videoUrl
  };

  if (format === "mp3") {
    payload.downloadMode = "audio";
    payload.audioFormat = "mp3";
    payload.audioBitrate = "320";
  } else if (format === "wav") {
    payload.downloadMode = "audio";
    payload.audioFormat = "wav";
  } else if (format === "1080") {
    payload.downloadMode = "auto";
    payload.videoQuality = "1080";
  } else if (format === "720") {
    payload.downloadMode = "auto";
    payload.videoQuality = "720";
  }

  chrome.storage.local.get(["customApiUrl"], (result) => {
    const apiUrl = result.customApiUrl || "auto";

    if (apiUrl === "auto") {
      progressText.textContent = "Trwa konwertowanie wideo (może to potrwać chwilę)...";
    } else {
      progressText.textContent = `Wysyłanie do: ${apiUrl}...`;
    }

    chrome.runtime.sendMessage({
      action: "download",
      apiUrl: apiUrl,
      payload: payload
    }, (response) => {
      if (progressSimTimer) {
        clearInterval(progressSimTimer);
        progressSimTimer = null;
      }

      if (response && response.success) {
        setProgressBarWidth(100);
        progressText.style.color = "#2ec4b6";
        progressText.textContent = "Gotowe! Pobieranie rozpoczęte pomyślnie.";
        
        // Zamykamy po 2.5 sekundy od sukcesu
        setTimeout(() => {
          progressContainer.classList.add('hidden');
          closeReTrapModal();
        }, 2500);
      } else {
        setProgressBarWidth(0);
        let errorMsg = (response && response.error) || "Nie udało się skomunikować z API";
        
        // Specyficzne tłumaczenie/obsługa błędu deszyfrowania z YouTube
        if (errorMsg.includes("decrypt") || errorMsg.includes("cipher") || errorMsg.includes("odszyfrować") || errorMsg.includes("403") || errorMsg.includes("forbidden")) {
          errorMsg = "Nie udało się odszyfrować strumienia wideo. Użyj konwertera awaryjnego.";
        }

        // Dodanie klasy błędu do kontenera postępu
        progressContainer.classList.add('error');
        progressText.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="#ff3b3b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:2px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <span>${errorMsg}</span>
        `;

        // Dodanie czerwonej ramki do karty opcji i zamiana przycisku "Pobierz" na czerwony iks (X)
        const activeCard = shadow.querySelector(`.retrap-option-card[data-format="${format}"]`);
        if (activeCard) {
          activeCard.classList.add('error-card');
          const btn = activeCard.querySelector('.retrap-option-btn');
          btn.style.color = '#ff3b3b';
          btn.style.borderColor = 'rgba(255, 59, 59, 0.3)';
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          `;
        }

        // Konfiguracja akcji dla przycisku konwertera awaryjnego
        const emergencyBtn = shadow.getElementById('retrap-emergency-btn');
        emergencyBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const backupUrl = `https://y2mate.is/en90/?url=${encodeURIComponent(videoUrl)}`;
          window.open(backupUrl, '_blank');
        };

        // Konfiguracja akcji dla przycisku spróbuj ponownie
        const retryBtn = shadow.getElementById('retrap-retry-btn');
        retryBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          startDownloadFlow(format);
        };
      }
    });
  });
}

// Przechwytywanie natywnego przycisku pobierania YouTube i przycisków w menu rozwijanym
function hookAllPossibleDownloadButtons() {
  if (!window.location.href.includes("watch?v=")) return;

  // 1. Przechwytywanie standardowych tagów przycisku pobierania
  const nativeBtn = document.querySelector('ytd-download-button-renderer') ||
                    document.querySelector('ytd-button-renderer[service-name="DOWNLOAD"]') ||
                    document.querySelector('#actions-inner #menu ytd-download-button-renderer');
  
  if (nativeBtn && !nativeBtn.hasAttribute('data-retrap-hooked')) {
    nativeBtn.setAttribute('data-retrap-hooked', 'true');
    console.log("ReTrap: Przechwycono natywny przycisk YouTube (renderer).");
    nativeBtn.addEventListener('click', handleDownloadClick, true);
  }

  // 2. Szukanie każdego przycisku lub elementu menu z tekstem "Pobierz" lub "Download" (np. w menu rozwijanym "...")
  const elements = document.querySelectorAll('ytd-menu-service-item-renderer, ytd-button-renderer, button, yt-button-shape, tp-yt-paper-item');
  elements.forEach(el => {
    if (el.hasAttribute('data-retrap-hooked')) return;

    const text = el.textContent.trim().toLowerCase();
    if (text === 'pobierz' || text === 'download') {
      el.setAttribute('data-retrap-hooked', 'true');
      el.addEventListener('click', handleDownloadClick, true);
      console.log("ReTrap: Przechwycono przycisk tekstowy:", text);
    }
  });
}

function handleDownloadClick(e) {
  e.preventDefault();
  e.stopPropagation();
  console.log("ReTrap: Przechwycono kliknięcie przycisku Pobierz.");
  openReTrapModal();
}

// Cykliczne sprawdzanie zmian w URL i podpinanie zdarzeń
function runUpdateLoop() {
  const url = window.location.href;
  const match = url.match(/[?&]v=([^&#]+)/);
  const videoId = match ? match[1] : "";

  if (videoId) {
    if (videoId !== currentVideoId) {
      currentVideoId = videoId;
    }
    // Przechwytujemy natywne przyciski
    hookAllPossibleDownloadButtons();
  } else {
    currentVideoId = "";
  }
}

// Nasłuchiwanie na zdarzenia nawigacji SPA w YouTube
function setupYouTubeNavigationListeners() {
  const handleYTNavigation = () => {
    runUpdateLoop();
    // Ponowne próby po opóźnieniu (dla dynamicznie renderowanych elementów Polymer w YT)
    setTimeout(runUpdateLoop, 300);
    setTimeout(runUpdateLoop, 800);
    setTimeout(runUpdateLoop, 1500);
  };

  window.addEventListener('yt-navigate-finish', handleYTNavigation);
  window.addEventListener('yt-page-data-updated', handleYTNavigation);
  window.addEventListener('popstate', handleYTNavigation);
}

// Inicjalizacja nasłuchiwaczy nawigacji oraz pętli sprawdzania
setupYouTubeNavigationListeners();
setInterval(runUpdateLoop, 1000);
runUpdateLoop();
console.log("ReTrap: Skrypt content.js zainicjalizowany z obsługą nawigacji SPA YouTube.");
