const fs = require('fs');
const path = require('path');

const appJsPath = path.resolve(__dirname, '../js/app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

console.log('Updating Algo Analyzer js/app.js...');

// 1. Update renderSocialTrendHubs to always render without locking normal tabs
const newRenderSocialTrendHubs = `function renderSocialTrendHubs() {
    ['youtube', 'tiktok', 'instagram', 'facebook', 'twitch'].forEach(platformKey => {
        const container = document.getElementById(\`tab-\${platformKey}\`);
        const hubData = SOCIAL_TREND_HUB_DATA[platformKey];
        const platformData = PLATFORM_DATA[platformKey];
        if (!container || !hubData || !platformData) return;

        let aiCardHtml = '';
        if (platformKey === 'youtube') {
            aiCardHtml = \`
                <!-- AI YouTube Transcript & Algorithm Analyzer Card -->
                <div class="glass-card" style="margin-bottom: 30px; padding: 25px; border: 1px solid rgba(245, 158, 11, 0.35); background: var(--color-card-bg);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 15px;">
                        <div>
                            <h3 style="font-family: var(--font-tech); color: var(--color-yellow-main); font-size: 18px; display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                                <span>🤖</span> AI YouTube Transcript & Algorytm Analyzer
                            </h3>
                            <p style="font-size: 13px; color: var(--color-text-muted); margin: 0;">
                                Wyliczaj średni CTR oraz AVD z YouTube API i przesyłaj transkrypcje Top 5 filmów do OpenAI API dla bezpośredniej analizy w UI.
                            </p>
                        </div>
                        <span style="font-family: var(--font-mono); font-size: 11px; background: rgba(245, 158, 11, 0.15); color: var(--color-yellow-main); border: 1px solid rgba(245, 158, 11, 0.35); padding: 5px 12px; border-radius: 9999px; font-weight: 700;">
                            TypeScript + OpenAI API
                        </span>
                    </div>

                    <!-- API Keys & Inputs Controls -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 6px;">YouTube Channel ID / API Key (Opcjonalne)</label>
                            <input type="text" id="yt-api-key-input" class="form-input" placeholder="Channel ID lub Klucz YouTube API..." style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #fff; width: 100%;">
                        </div>
                        <div>
                            <label style="display: block; font-size: 11px; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 6px;">OpenAI API Key (sk-... Opcjonalne)</label>
                            <input type="password" id="openai-api-key-input" class="form-input" placeholder="Wklej swój OpenAI API Key..." style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #fff; width: 100%;">
                        </div>
                        <div style="display: flex; align-items: flex-end;">
                            <button id="btn-run-yt-analysis" class="btn-yellow" style="width: 100%; height: 42px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer;">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                </svg>
                                <span id="btn-run-yt-text">Analizuj Top 5 i Transkrypcje</span>
                            </button>
                        </div>
                    </div>

                    <!-- Status Loader Indicator -->
                    <div id="yt-ai-loading" style="display: none; text-align: center; padding: 25px; background: rgba(0,0,0,0.3); border-radius: 12px; margin-bottom: 20px; border: 1px dashed var(--color-yellow-main);">
                        <div style="font-family: var(--font-mono); color: var(--color-yellow-main); font-size: 14px; font-weight: 700; margin-bottom: 6px;" id="yt-ai-loading-text">
                            ⏳ Pobieranie statystyk YouTube API oraz analiza transkrypcji Top 5 w OpenAI...
                        </div>
                        <div style="font-size: 12px; color: var(--color-text-muted);">Przetwarzanie średnich CTR, AVD i pobieranie ustrukturyzowanego JSON-a...</div>
                    </div>

                    <!-- Results Container -->
                    <div id="yt-ai-results" style="display: none;"></div>
                </div>
            \`;
        }

        container.innerHTML = \`
            <div class="page-header">
                <h1 class="page-title">
                    <span class="page-title-accent">\${hubData.title}</span>
                </h1>
                <p class="page-description">\${hubData.subtitle}</p>
            </div>

            <!-- CO SIĘ TERAZ WYBIJA -->
            <div style="margin-bottom: 30px;">
                <h3 style="font-family: var(--font-tech); color: var(--color-yellow-main); font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>🔥</span> Co się teraz wybija i ma najsilniejsze zasięgi
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    \${hubData.trends.map(t => \`
                        <div class="glass-card" style="padding: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <h4 style="font-size: 15px; font-weight: 700; color: var(--color-text-primary); line-height: 1.3;">\${t.title}</h4>
                                <span style="font-size: 10px; font-family: var(--font-mono); background: rgba(245,158,11,0.15); color: var(--color-yellow-main); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(245,158,11,0.3); white-space: nowrap;">\${t.tag}</span>
                            </div>
                            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.5;">\${t.desc}</p>
                        </div>
                    \`).join('')}
                </div>
            </div>

            <!-- JAK PROSTO WBIĆ SIĘ W ALGORYTM -->
            <div style="margin-bottom: 30px;">
                <h3 style="font-family: var(--font-tech); color: var(--color-yellow-main); font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>⚡</span> Jak prosto wbić się w algorytm — 3 Szybkie Kroki
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    \${hubData.algoTriggers.map(trig => \`
                        <div class="glass-card" style="padding: 20px;">
                            <div style="font-size: 13px; color: var(--color-text-muted); font-weight: 600; margin-bottom: 6px;">\${trig.label}</div>
                            <div style="font-family: var(--font-mono); font-size: 15px; font-weight: 700; color: var(--color-yellow-main); margin-bottom: 8px;">\${trig.target}</div>
                            <div style="font-size: 12px; color: var(--color-text-dim); line-height: 1.4;">\${trig.advice}</div>
                        </div>
                    \`).join('')}
                </div>
            </div>

            <!-- HARMONOGRAM PUBLIKACJI -->
            <div class="glass-card" style="margin-bottom: 30px; padding: 25px;">
                <h3 style="font-family: var(--font-tech); color: var(--color-yellow-main); font-size: 18px; margin-bottom: 18px; display: flex; align-items: center; gap: 10px;">
                    <span>⏰</span> Najlepszy Czas i Częstotliwość Publikacji
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">NAJLEPSZE DNI TYGODNIA</div>
                        <div style="font-size: 14px; font-weight: 600; color: var(--color-text-primary);">\${hubData.postingTimes.days}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">GODZINY SZCZYTU (PL)</div>
                        <div style="font-size: 14px; font-weight: 600; color: var(--color-yellow-main); font-family: var(--font-mono);">\${hubData.postingTimes.peakHours}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">CZĘSTOTLIWOŚĆ</div>
                        <div style="font-size: 14px; font-weight: 600; color: var(--color-text-primary);">\${hubData.postingTimes.frequency}</div>
                    </div>
                </div>
            </div>

            \${aiCardHtml}
        \`;
    });

    if (typeof initYouTubeAIAnalyzer === 'function') {
        initYouTubeAIAnalyzer();
    }
}`;

// Replace renderSocialTrendHubs in content
const oldFuncRegex = /function renderSocialTrendHubs\(\) \{[\s\S]*?if \(typeof initYouTubeAIAnalyzer === 'function'\) \{\s*initYouTubeAIAnalyzer\(\);\s*\}\s*\}/;
if (oldFuncRegex.test(content)) {
    content = content.replace(oldFuncRegex, newRenderSocialTrendHubs);
    console.log('[1/3] Replaced renderSocialTrendHubs');
} else {
    console.warn('Could not find old renderSocialTrendHubs, checking alternate regex...');
    const altRegex = /function renderSocialTrendHubs\(\) \{[\s\S]*?\}\n\n\/\* ==========================================================================/;
    content = content.replace(altRegex, newRenderSocialTrendHubs + '\n\n/* ==========================================================================');
}

// 2. Add renderAnalysisPanels function and attach it to tab-analiza
const renderAnalysisPanelsCode = `
/* ==========================================================================
   DYNAMIC ANALYSIS PANELS WITH CONNECTED/LOCKED STATE MANAGEMENT
   ========================================================================== */
function renderAnalysisPanels() {
    const grid = document.querySelector('#tab-analiza .analysis-grid');
    if (!grid) return;

    const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : { connectedAccounts: {} };
    const connected = user.connectedAccounts || {};

    const platforms = [
        {
            id: 'youtube',
            name: 'YouTube',
            color: '#ff0000',
            desc: 'Przeanalizuj zasięgi twoich materiałów na YouTube',
            reach: '1.48M',
            score: '94%',
            svg: '<svg viewBox="0 0 24 24" fill="#ff0000" width="24" height="24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
        },
        {
            id: 'tiktok',
            name: 'TikTok',
            color: '#00f2fe',
            desc: 'Przeanalizuj zasięgi twoich materiałów na TikTok',
            reach: '4.92M',
            score: '91%',
            svg: '<svg viewBox="0 0 24 24" fill="#00f2fe" width="24" height="24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.33 6.33 0 0 0-1-.08 6.34 6.34 0 1 0 6.34 6.34V9.05a8.3 8.3 0 0 0 5-1.63V6.69z"/></svg>'
        },
        {
            id: 'instagram',
            name: 'Instagram',
            color: '#e1306c',
            desc: 'Przeanalizuj zasięgi twoich materiałów na Instagramie',
            reach: '895.4K',
            score: '83%',
            svg: '<svg viewBox="0 0 24 24" fill="#e1306c" width="24" height="24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>'
        },
        {
            id: 'facebook',
            name: 'Facebook',
            color: '#1877f2',
            desc: 'Przeanalizuj zasięgi twoich materiałów na Facebooku',
            reach: '412.8K',
            score: '78%',
            svg: '<svg viewBox="0 0 24 24" fill="#1877f2" width="24" height="24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
        },
        {
            id: 'twitch',
            name: 'Twitch',
            color: '#9146ff',
            desc: 'Przeanalizuj zasięgi transmisji i transmisję na Twitchu',
            reach: '278.5K',
            score: '88%',
            svg: '<svg viewBox="0 0 24 24" fill="#9146ff" width="24" height="24"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>'
        }
    ];

    grid.innerHTML = platforms.map(p => {
        const isConnected = !!connected[p.id];
        
        return \`
            <div class="analysis-platform-card \${isConnected ? 'connected-card' : 'locked-card'}" data-platform="\${p.id}">
                <div>
                    <div class="card-header">
                        <div class="platform-info">
                            <div class="platform-icon-wrapper" style="border-color: \${p.color}40;">
                                \${p.svg}
                            </div>
                            <div>
                                <div class="platform-title">\${p.name}</div>
                            </div>
                        </div>
                        \${isConnected ? \`
                            <span class="platform-status-badge connected">
                                <span>●</span> Połączono
                            </span>
                        \` : \`
                            <span class="platform-status-badge locked">
                                <span>🔒</span> Niepołączone
                            </span>
                        \`}
                    </div>

                    <div class="card-description">
                        \${p.desc}
                    </div>

                    \${isConnected ? \`
                        <div class="card-metrics-preview">
                            <div class="preview-stat">
                                <span class="preview-label">Zasięg</span>
                                <span class="preview-value">\${p.reach}</span>
                            </div>
                            <div class="preview-stat">
                                <span class="preview-label">Score</span>
                                <span class="preview-value">\${p.score}</span>
                            </div>
                        </div>
                    \` : \`
                        <div class="card-metrics-preview locked-preview">
                            <span>🔒 Połącz konto, aby odblokować panel analizy</span>
                        </div>
                    \`}
                </div>

                <div>
                    \${isConnected ? \`
                        <button class="btn-check-platform" data-platform="\${p.id}">
                            <span>Sprawdź</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    \` : \`
                        <button class="btn-connect-platform" data-platform="\${p.id}">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            <span>Połącz konto</span>
                        </button>
                    \`}
                </div>
            </div>
        \`;
    }).join('');

    // Attach listeners
    grid.querySelectorAll('.btn-check-platform').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const platformKey = btn.getAttribute('data-platform');
            openPlatformDetail(platformKey);
        });
    });

    grid.querySelectorAll('.btn-connect-platform').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const platformKey = btn.getAttribute('data-platform');
            const currentUser = getApliHubUserData();
            if (!currentUser.connectedAccounts) currentUser.connectedAccounts = {};
            currentUser.connectedAccounts[platformKey] = true;
            saveApliHubUserData(currentUser);

            AlgoSoundFX.playConnectSuccess();
            renderAnalysisPanels();
            renderConnectedSocialAccounts();
            showToast(\`🎉 Połączono konto \${platformKey.toUpperCase()}! Panel analizy został odblokowany.\`);
        });
    });

    grid.querySelectorAll('.analysis-platform-card.connected-card').forEach(card => {
        card.addEventListener('click', () => {
            const platformKey = card.getAttribute('data-platform');
            openPlatformDetail(platformKey);
        });
    });
}
`;

// Insert renderAnalysisPanels before initPlatformCards
content = content.replace(/function initPlatformCards\(\) \{/, renderAnalysisPanelsCode + '\nfunction initPlatformCards() {');

// In DOMContentLoaded, call renderAnalysisPanels()
content = content.replace(/renderSocialTrendHubs\(\);/, 'renderSocialTrendHubs();\n    renderAnalysisPanels();');

// In renderConnectedSocialAccounts, call renderAnalysisPanels() as well
content = content.replace(/renderSocialTrendHubs\(\);/g, 'renderSocialTrendHubs();\n            renderAnalysisPanels();');

// In syncUserInfo, also trigger renderAnalysisPanels()
content = content.replace(/syncUserInfo\(\);/g, 'syncUserInfo();\n    if (typeof renderAnalysisPanels === "function") renderAnalysisPanels();');

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('[SUCCESS] Algo Analyzer js/app.js updated successfully.');
