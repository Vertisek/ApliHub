window.handleBackToHub = function () {
    if (window.parent && window.parent !== window && typeof window.parent.closeSandboxApp === 'function') {
        window.parent.closeSandboxApp();
    } else {
        window.location.href = '../index.html';
    }
};
/* ==========================================================================
   Soclify - Application Core & Social Algorithm Trends Intelligence
   ========================================================================== */

/* ==========================================================================
   WEB AUDIO SOUND FX ENGINE FOR SOCLIFY
   ========================================================================== */
const AlgoSoundFX = {
    ctx: null,
    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    getSettings() {
        const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
        return {
            enabled: user.settings?.soundEnabled ?? true,
            volume: (user.settings?.soundVolume ?? 50) / 100
        };
    },
    playTabSwitch() {
        const { enabled, volume } = this.getSettings();
        if (!enabled || volume <= 0) return;
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);

            gain.gain.setValueAtTime(volume * 0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.04);
        } catch (e) { }
    },
    playClick() {
        const { enabled, volume } = this.getSettings();
        if (!enabled || volume <= 0) return;
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(160, now + 0.03);

            gain.gain.setValueAtTime(volume * 0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.03);
        } catch (e) { }
    },
    playModalOpen() {
        const { enabled, volume } = this.getSettings();
        if (!enabled || volume <= 0) return;
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const now = this.ctx.currentTime;
            [440, 554.37, 659.25].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.03);

                gain.gain.setValueAtTime(volume * 0.04, now + idx * 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 0.08);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.03);
                osc.stop(now + idx * 0.03 + 0.08);
            });
        } catch (e) { }
    },
    playConnectSuccess() {
        const { enabled, volume } = this.getSettings();
        if (!enabled || volume <= 0) return;
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const now = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.04);

                gain.gain.setValueAtTime(volume * 0.05, now + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.12);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now + idx * 0.04);
                osc.stop(now + idx * 0.04 + 0.12);
            });
        } catch (e) { }
    }
};


document.addEventListener('DOMContentLoaded', () => {
    // Initialize Core Modules
    initSidebarNavigation();
    initUserAvatarDropdown();
    initPlatformCards();
    initModals();
    initViewModeSwitcher();
    initAccountCredentialsForm();
    initLanguageSelector();
    initYouTubeAIAnalyzer();
    initSettingsForm();
    initAuthModule();

    // Sync header user info and avatar
    syncUserInfo();
    if (typeof renderAnalysisPanels === "function") renderAnalysisPanels();
    window.addEventListener('aplihub_user_updated', syncUserInfo);
    window.addEventListener('language_changed', updateUILanguage);

    // Render trend hubs for all 5 social tabs (YouTube, TikTok, Instagram, Facebook, Twitch)
    renderSocialTrendHubs();
    renderAnalysisPanels();
    renderAnalysisPanels();

    // Initial UI translation update
    updateUILanguage();
});

let currentViewMode = localStorage.getItem('aplihub_view_mode') || 'simplified'; // 'simplified' | 'advanced'

/* ==========================================================================
   SYNC USER INFO & AVATAR DEDUPLICATION
   ========================================================================== */
function syncUserInfo() {
    if (typeof getApliHubUserData !== 'function') return;
    const user = getApliHubUserData();
    const userWrapper = document.getElementById('user-profile-wrapper');
    const userAvatarBtn = document.getElementById('user-avatar-btn');

    if (!user || user.isLoggedIn === false) {
        if (userAvatarBtn) {
            userAvatarBtn.innerHTML = `
                <div class="avatar-frame" style="background: linear-gradient(135deg, #475569, #334155); color: #94a3b8; font-size: 13px;">
                    <span>🔑</span>
                </div>
                <div class="avatar-info">
                    <span class="avatar-name" style="color: #fbbf24; font-weight: 700;">Oskar_Algo</span>
                </div>
            `;
        }
    } else {
        if (userAvatarBtn) {
            const avatarIcon = getAvatarVisual(user.selectedAvatar || 'default');
            userAvatarBtn.innerHTML = `
                <div class="avatar-frame" id="top-user-avatar-frame">
                    <span>${avatarIcon}</span>
                </div>
                <div class="avatar-info">
                    <span class="avatar-name" id="top-user-avatar-name">${user.name || 'Oskar_Algo'}</span>
                </div>
                <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            `;
        }

        // Clean username display without "Nick: "
        const nameElems = document.querySelectorAll('#top-user-avatar-name, #dropdown-user-name, #profile-modal-username');
        nameElems.forEach(el => {
            if (el.tagName === 'INPUT') el.value = user.name || 'Użytkownik';
            else el.textContent = user.name || 'Użytkownik';
        });

        const modalEmailInput = document.getElementById('algo-input-email');
        if (modalEmailInput) modalEmailInput.value = user.email || '';
    }
}

function initLanguageSelector() {
    const langSelect = document.getElementById('algo-language-select');
    if (langSelect) {
        langSelect.value = localStorage.getItem('aplihub_lang') || 'pl';
        langSelect.addEventListener('change', (e) => {
            if (typeof setAppLanguage === 'function') {
                setAppLanguage(e.target.value);
                showToast(`Zmieniono język na: ${e.target.value.toUpperCase()}`);
            }
        });
    }
}

function updateUILanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (typeof t === 'function' && key) {
            el.textContent = t(key);
        }
    });
}

function getAvatarVisual(avatarKey) {
    switch (avatarKey) {
        case 'youtube': return '🔴';
        case 'tiktok': return '🎵';
        case 'instagram': return '📸';
        case 'facebook': return '📘';
        case 'twitch': return '🟪';
        default: return 'O';
    }
}

/* ==========================================================================
   REALISTIC INDIVIDUAL PLATFORM ANALYTICS DATA (For Analiza Tab)
   ========================================================================== */
const PLATFORM_DATA = {
    youtube: {
        id: 'youtube',
        name: 'YouTube',
        description: 'Przeanalizuj zasięgi twoich materiałów na YouTube',
        metrics: {
            views: { value: '1,482,900', trend: '+24.8%', subtext: 'vs. poprzednie 30 dni' },
            subscribers: { value: '+14,250', trend: '+18.3%', subtext: 'Nowi subskrybenci' },
            returningViewers: { value: '348,100', trend: '+12.5%', subtext: '23.4% wszystkich widzów' },
            likes: { value: '129,400', trend: '+31.2%', subtext: 'Wskaźnik polubień: 8.7%' }
        },
        algorithmScore: 94,
        scoreStatus: 'Wybitne Dopasowanie',
        tips: [
            'Wysoki CTR miniatur (11.2%) w pierwszych 4 godzinach od opublikowania.',
            'Średni czas oglądania wynosi 68.4% — algorytm Shorts wypycha filmy do karty Głównej.',
            'Najlepszy czas na publikację: Wtorek i Czwartek o godzinie 17:30.'
        ],
        chartData: {
            labels: ['1 Maj', '5 Maj', '10 Maj', '15 Maj', '20 Maj', '25 Maj', '30 Maj'],
            views: [120000, 185000, 240000, 190000, 310000, 280000, 357900],
            engagement: [12000, 19000, 23000, 18500, 29000, 26000, 34000]
        }
    },
    tiktok: {
        id: 'tiktok',
        name: 'TikTok',
        description: 'Przeanalizuj zasięgi twoich materiałów na TikTok',
        metrics: {
            views: { value: '4,920,500', trend: '+41.2%', subtext: 'Organiczne wyświetlenia FYP' },
            subscribers: { value: '+38,900', trend: '+32.5%', subtext: 'Nowi obserwujący' },
            returningViewers: { value: '612,400', trend: '+19.8%', subtext: '12.4% powracających' },
            likes: { value: '584,200', trend: '+45.0%', subtext: 'Ratio udostępnień 1:8' }
        },
        algorithmScore: 91,
        scoreStatus: 'Wysoka Wirusowość',
        tips: [
            'Retencja pierwszych 3 sekund (Hook Rate) wynosi aż 76.5%.',
            'Materiał z użyciem trending audio "CyberPulse" uzyskał 3x wyższe zasięgi.',
            'Algorytm nagradza opisy zawierające 3-4 niszowe hashtagi.'
        ],
        chartData: {
            labels: ['1 Maj', '5 Maj', '10 Maj', '15 Maj', '20 Maj', '25 Maj', '30 Maj'],
            views: [450000, 620000, 510000, 890000, 780000, 1100000, 1270500],
            engagement: [48000, 69000, 58000, 95000, 84000, 125000, 142000]
        }
    },
    instagram: {
        id: 'instagram',
        name: 'Instagram',
        description: 'Przeanalizuj zasięgi twoich materiałów na Instagramie',
        metrics: {
            views: { value: '895,400', trend: '+12.6%', subtext: 'Zasięg Reels i Postów' },
            subscribers: { value: '+6,840', trend: '+9.1%', subtext: 'Nowi obserwujący' },
            returningViewers: { value: '284,500', trend: '+14.2%', subtext: '31.8% zaangażowanej społeczności' },
            likes: { value: '88,300', trend: '+15.8%', subtext: '64% z karty Eksploruj' }
        },
        algorithmScore: 83,
        scoreStatus: 'Dobra Stabilność',
        tips: [
            'Wysoki wskaźnik zapisów materiałów (Saves Rate) wpływa na eksponowanie Reels.',
            'Karuzele (Carousels) przynoszą o 42% więcej powracających obserwujących.',
            'Optymalna częstotliwość Relacji (Stories): 4-6 dziennie.'
        ],
        chartData: {
            labels: ['1 Maj', '5 Maj', '10 Maj', '15 Maj', '20 Maj', '25 Maj', '30 Maj'],
            views: [95000, 110000, 140000, 125000, 160000, 185000, 202400],
            engagement: [9800, 12400, 15100, 13200, 17800, 19200, 21500]
        }
    },
    facebook: {
        id: 'facebook',
        name: 'Facebook',
        description: 'Przeanalizuj zasięgi twoich materiałów na Facebooku',
        metrics: {
            views: { value: '412,800', trend: '+6.4%', subtext: 'Zasięg strony i FB Reels' },
            subscribers: { value: '+2,150', trend: '+4.8%', subtext: 'Nowi polubienia/obserwujący' },
            returningViewers: { value: '198,300', trend: '+8.1%', subtext: '48.0% lojalnych widzów' },
            likes: { value: '34,900', trend: '+10.2%', subtext: '4,820 aktywnych komentarzy' }
        },
        algorithmScore: 78,
        scoreStatus: 'Optymalne Zaangażowanie',
        tips: [
            'Posty dyskusyjne z pytaniem otwartym generują najwięcej punktów algorytmu FB.',
            'Udostępnienia w tematycznych grupach przynoszą 55% ruchu wirusowego.',
            'FB Reels mają rosnący priorytet w strumieniu wiadomości użytkowników.'
        ],
        chartData: {
            labels: ['1 Maj', '5 Maj', '10 Maj', '15 Maj', '20 Maj', '25 Maj', '30 Maj'],
            views: [48000, 52000, 61000, 58000, 72000, 80000, 87800],
            engagement: [4200, 4800, 5900, 5100, 6800, 7400, 8200]
        }
    },
    twitch: {
        id: 'twitch',
        name: 'Twitch',
        description: 'Przeanalizuj zasięgi transmisji i transmisję na Twitchu',
        metrics: {
            views: { value: '278,500', trend: '+19.4%', subtext: 'Wyświetlenia transmisji na żywo' },
            subscribers: { value: '+1,840', trend: '+11.2%', subtext: 'Subskrybenci kanału (Subs)' },
            returningViewers: { value: '142,300', trend: '+15.8%', subtext: '51.1% stałej widowni' },
            likes: { value: '94,200', trend: '+22.5%', subtext: 'Cheers & Interakcje chat' }
        },
        algorithmScore: 88,
        scoreStatus: 'Wysoka Aktywność',
        tips: [
            'Regularne godziny transmisji na żywo podbijają pozycję w katalogu gier.',
            'Wskaźnik wiadomości na chacie (Chat Velocity) decyduje o polecaniu transmisji.',
            'Rób klipy (Clips) z najlepszych momentów i publikuj je w zakładkach Shorts/TikTok.'
        ],
        chartData: {
            labels: ['1 Maj', '5 Maj', '10 Maj', '15 Maj', '20 Maj', '25 Maj', '30 Maj'],
            views: [32000, 39000, 45000, 42000, 56000, 61000, 64500],
            engagement: [3100, 3800, 4400, 4100, 5400, 5900, 6200]
        }
    }
};

/* ==========================================================================
   SIMPLIFIED & CLEAR SOCIAL PLAYBOOKS WITH CHEAT SHEET INCLUDED
   ========================================================================== */
const SOCIAL_TREND_HUB_DATA = {
    youtube: {
        title: 'YouTube — Poradnik Zasięgów & Trendy',
        subtitle: 'Proste i przejrzyste wskazówki, jak wybić swoje filmy na YouTube.',
        trends: [
            { title: 'Shorts 15-30 sekund z prostym wstępem', tag: 'Wirusowość 98%', desc: 'Krótkie filmy z wyraźnymi dużymi napisami i dynamicznym wstępem przyciągają najwięcej widzów.' },
            { title: 'Filmy Długie (10-15 minut)', tag: 'Utrzymanie Uwagi', desc: 'Przejrzyste materiały, które ciekawie tłumaczą jeden konkretny temat.' },
            { title: 'Miniatury z 2-3 słowami', tag: 'Klikalność (CTR)', desc: 'Czytelna miniatura z jasnym obiektem i maksymalnie 3 słowami działa najlepiej.' }
        ],
        algoTriggers: [
            { label: 'Miniatura i Tytuł (CTR)', target: 'Krok 1: Zadbaj o prosty nagłówek', advice: 'Stwórz miniaturę z 2-3 słowami, która budzi ciekawość.' },
            { label: 'Pierwsze 30 sekund', target: 'Krok 2: Od razu przejdź do rzeczy', advice: 'Unikaj długich wstępów. Powiedz widzom wprost, co zyskają.' },
            { label: 'Komentarze i Opinie', target: 'Krok 3: Zadaj jedno pytanie', advice: 'Poproś w filmie o odpowiedź w komentarzu – to podbija pozycję.' }
        ],
        postingTimes: {
            days: 'Wtorek, Czwartek, Sobota, Niedziela',
            peakHours: '16:00 - 18:30 oraz 20:00 (szczyt oglądalności)',
            frequency: 'Shorts: 1x dziennie | Filmy Długie: 2-3x w tygodniu'
        }
    },
    tiktok: {
        title: 'TikTok — Jak Wybić się na Stronie Dla Ciebie (FYP)',
        subtitle: 'Sprawdzone sposoby na zdobywanie wyświetleń bez zbędnego utrudniania sobie życia.',
        trends: [
            { title: 'Format POV & Tekst na Ekranie', tag: 'Szybka Pętla', desc: 'Krótkie nagranie z wciągającym napisem i muzyką w tle.' },
            { title: 'Popularne Dźwięki (Trending Audio)', tag: 'Podkład Dźwiękowy', desc: 'Używaj dźwięków z rosnącą strzałką, aby algorytm częściej wyświetlał film.' },
            { title: 'Format: Problem → Proste Rozwiązanie', tag: 'Wciągająca Treść', desc: 'Pokaż na samym początku ciekawy efekt lub odpowiedź.' }
        ],
        algoTriggers: [
            { label: 'Zaczepka w 3 sekundy', target: 'Krok 1: Zaskocz na początku', advice: 'Pokaż efekt końcowy lub zadaj intrygujące pytanie.' },
            { label: 'Długość Wideo (7-15s)', target: 'Krok 2: Rób krótkie wideo', advice: 'Wycinaj ciszę i niepotrzebne pauzy, aby utrzymać tempo.' },
            { label: 'Przesyłanie Znajomym', target: 'Krok 3: Treści życiowe', advice: 'Twórz materiały w stylu "Wyślij to znajomemu".' }
        ],
        postingTimes: {
            days: 'Poniedziałek - Niedziela (Codziennie)',
            peakHours: '15:00, 19:00, 21:30 oraz okno 22:30 - 00:00',
            frequency: '2 do 3 TikToki dziennie dla najlepszych efektów'
        }
    },
    instagram: {
        title: 'Instagram — Zasięgi Rolki (Reels) i Postów',
        subtitle: 'Jak budować estetyczny profil i docierać do nowych obserwujących.',
        trends: [
            { title: 'Reels 7-15 sekund', tag: 'Karta Eksploruj', desc: 'Estetyczne krótkie rolki z płynnym montażem i wskazówką.' },
            { title: 'Karuzele (Kilka slajdów)', tag: 'Wysokie Zaangażowanie', desc: 'Slajdy z krokami i wiedzą – widzowie chętnie je przewijają i zapisują.' },
            { title: 'Interakcje na Relacjach (Stories)', tag: 'Stała Społeczność', desc: 'Stosuj ankiety i naklejki z pytaniami, by utrzymać bliski kontakt.' }
        ],
        algoTriggers: [
            { label: 'Zapisywanie Postów', target: 'Krok 1: Daj przydatną ściągę', advice: 'Daj wiedzę, którą warto zachować na później.' },
            { label: 'Przesyłanie na Chat (DM)', target: 'Krok 2: Rób zabawne Reels', advice: 'Przesłanie rolki w wiadomości prywatnej to najsilniejszy sygnał.' },
            { label: 'Relacje (Stories)', target: 'Krok 3: Dodawaj ankiety', advice: 'Każda nakładka z pytaniem zwiększa liczbę wyświetleń.' }
        ],
        postingTimes: {
            days: 'Środa, Piątek, Niedziela',
            peakHours: '07:30 - 09:00, 12:30, 18:30, 20:30',
            frequency: 'Reels: 1x dziennie | Stories: 4-5x / dzień'
        }
    },
    facebook: {
        title: 'Facebook — Budowanie Społeczności & Zasięgi',
        subtitle: 'Prosty przewodnik jak tworzyć treści angażujące odbiorców.',
        trends: [
            { title: 'Posty z Pytaniem Otwartym', tag: 'Dyskusja w Komentarzach', desc: 'Pytania zachęcające do wyrażenia opinii błyskawicznie podnoszą zasięg.' },
            { title: 'FB Reels z autentycznym nagraniem', tag: 'Zasięg Organiczny', desc: 'Krótkie rolki bez sztucznych efektów docierają do szerokiego grona.' },
            { title: 'Prawdziwe Zdjęcia (Autentyczność)', tag: 'Zaufanie Widzów', desc: 'Zdjęcia z życia codziennego mają znacznie wyższą widoczność.' }
        ],
        algoTriggers: [
            { label: 'Komentarze', target: 'Krok 1: Zadaj proste pytanie', advice: 'Zapytaj społeczność o zdanie – komentarze napędzają widoczność.' },
            { label: 'Grupy Tematyczne', target: 'Krok 2: Dziel się w grupach', advice: 'Dotrzyj do pasjonatów tematu bez wydawania budżetu.' },
            { label: 'Odnośniki i Linki', target: 'Krok 3: Link w 1. komentarzu', advice: 'Wklejaj linki pod postem, by nie ucinać zasięgów w treści głównej.' }
        ],
        postingTimes: {
            days: 'Poniedziałek, Środa, Sobota',
            peakHours: '08:30, 13:00, 19:30',
            frequency: '1-2 posty dziennie | FB Reels: 1 dziennie'
        }
    },
    twitch: {
        title: 'Twitch — Transmisje na Żywo & Społeczność',
        subtitle: 'Najważniejsze wytyczne budowania stałej widowni na żywo i rajdy (Raids).',
        trends: [
            { title: 'Transmisje w Stałych Godzinach', tag: 'Lojalność Widzów', desc: 'Przewidywalne godziny rozpoczęcia live budują przyzwyczajenie u stałych widzów.' },
            { title: 'Klipy (Twitch Clips) z Akcji', tag: 'Wirusowy Zasięg', desc: 'Wycinanie 30-sekundowych śmiesznych momentów z transmisji daje darmową promocję.' },
            { title: 'Gry z Małą/Średnią Konkurencją', tag: 'Wyższa Pozycja', desc: 'Streamowanie gier z 1-3k widzów pozwala szybciej trafić na pierwszą stronę kategorii.' }
        ],
        algoTriggers: [
            { label: 'Częstotliwość Chatu', target: 'Krok 1: Odpowiadaj na wiadomości', advice: 'Angażuj widzów pytaniami – szybki chat wywołuje wyższą pozycję.' },
            { label: 'Czas Trwania Live (2-4h)', target: 'Krok 2: Utrzymuj długi stream', advice: 'Transmisje trwające min. 2 godziny dają czas widzom na dołączenie.' },
            { label: 'Rajdy i Współpraca', target: 'Krok 3: Rób Raidy po live', advice: 'Wysyłaj widzów do innych streamerów – zbudujesz sieć kontaktów.' }
        ],
        postingTimes: {
            days: 'Wtorek, Czwartek, Piątek, Niedziela',
            peakHours: '18:00 - 23:00 (wieczorne transmisje)',
            frequency: 'Live: 3-4 razy w tygodniu (po 2-4 godziny)'
        }
    }
};

/* ==========================================================================
   RENDER SOCIAL TAB DASHBOARDS (WITH METRICS, CHARTS, GUIDES & CHEAT SHEET)
   ========================================================================== */
function renderSocialTrendHubs() {
    ['youtube', 'tiktok', 'instagram', 'facebook', 'twitch'].forEach(platformKey => {
        const container = document.getElementById(`tab-${platformKey}`);
        const hubData = SOCIAL_TREND_HUB_DATA[platformKey];
        const platformData = PLATFORM_DATA[platformKey];
        if (!container || !hubData || !platformData) return;

        let aiCardHtml = '';
        if (platformKey === 'youtube') {
            aiCardHtml = `
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
            `;
        }

        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">
                    <span class="page-title-accent">${hubData.title}</span>
                </h1>
                <p class="page-description">${hubData.subtitle}</p>
            </div>

            <!-- CO SIĘ TERAZ WYBIJA -->
            <div style="margin-bottom: 30px;">
                <h3 style="font-family: var(--font-tech); color: var(--color-yellow-main); font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>🔥</span> Co się teraz wybija i ma najsilniejsze zasięgi
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    ${hubData.trends.map(t => `
                        <div class="glass-card" style="padding: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <h4 style="font-size: 15px; font-weight: 700; color: var(--color-text-primary); line-height: 1.3;">${t.title}</h4>
                                <span style="font-size: 10px; font-family: var(--font-mono); background: rgba(245,158,11,0.15); color: var(--color-yellow-main); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(245,158,11,0.3); white-space: nowrap;">${t.tag}</span>
                            </div>
                            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.5;">${t.desc}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- JAK PROSTO WBIĆ SIĘ W ALGORYTM -->
            <div style="margin-bottom: 30px;">
                <h3 style="font-family: var(--font-tech); color: var(--color-yellow-main); font-size: 18px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>⚡</span> Jak prosto wbić się w algorytm — 3 Szybkie Kroki
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    ${hubData.algoTriggers.map(trig => `
                        <div class="glass-card" style="padding: 20px;">
                            <div style="font-size: 13px; color: var(--color-text-muted); font-weight: 600; margin-bottom: 6px;">${trig.label}</div>
                            <div style="font-family: var(--font-mono); font-size: 15px; font-weight: 700; color: var(--color-yellow-main); margin-bottom: 8px;">${trig.target}</div>
                            <div style="font-size: 12px; color: var(--color-text-dim); line-height: 1.4;">${trig.advice}</div>
                        </div>
                    `).join('')}
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
                        <div style="font-size: 14px; font-weight: 600; color: var(--color-text-primary);">${hubData.postingTimes.days}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">GODZINY SZCZYTU (PL)</div>
                        <div style="font-size: 14px; font-weight: 600; color: var(--color-yellow-main); font-family: var(--font-mono);">${hubData.postingTimes.peakHours}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 11px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">CZĘSTOTLIWOŚĆ</div>
                        <div style="font-size: 14px; font-weight: 600; color: var(--color-text-primary);">${hubData.postingTimes.frequency}</div>
                    </div>
                </div>
            </div>

            ${aiCardHtml}
        `;
    });

    if (typeof initYouTubeAIAnalyzer === 'function') {
        initYouTubeAIAnalyzer();
    }
}

/* ==========================================================================
   VIEW MODE SWITCHER IN DETAILED ANALYSIS VIEW
   ========================================================================== */
function initViewModeSwitcher() {
    const btnSimplified = document.getElementById('btn-mode-simplified');
    const btnAdvanced = document.getElementById('btn-mode-advanced');

    if (!btnSimplified || !btnAdvanced) return;

    applyViewModeUI(currentViewMode);

    btnSimplified.addEventListener('click', () => {
        currentViewMode = 'simplified';
        localStorage.setItem('aplihub_view_mode', 'simplified');
        applyViewModeUI('simplified');
        showToast('Wygląd: Uproszczony ⚡');
    });

    btnAdvanced.addEventListener('click', () => {
        currentViewMode = 'advanced';
        localStorage.setItem('aplihub_view_mode', 'advanced');
        applyViewModeUI('advanced');
        showToast('Wygląd: Zaawansowany 📊');
    });
}

function applyViewModeUI(mode) {
    const btnSimplified = document.getElementById('btn-mode-simplified');
    const btnAdvanced = document.getElementById('btn-mode-advanced');
    const detailedContainer = document.getElementById('detailed-analysis-view');
    const advancedSuite = document.getElementById('advanced-suite-container');

    if (btnSimplified && btnAdvanced) {
        if (mode === 'simplified') {
            btnSimplified.classList.add('active');
            btnSimplified.style.background = 'var(--color-yellow-main)';
            btnSimplified.style.color = '#000';

            btnAdvanced.classList.remove('active');
            btnAdvanced.style.background = 'transparent';
            btnAdvanced.style.color = 'var(--color-text-muted)';
        } else {
            btnAdvanced.classList.add('active');
            btnAdvanced.style.background = 'var(--color-yellow-main)';
            btnAdvanced.style.color = '#000';

            btnSimplified.classList.remove('active');
            btnSimplified.style.background = 'transparent';
            btnSimplified.style.color = 'var(--color-text-muted)';
        }
    }

    if (document.body) {
        if (mode === 'simplified') {
            document.body.classList.add('mode-simplified');
            document.body.classList.remove('mode-advanced');
        } else {
            document.body.classList.add('mode-advanced');
            document.body.classList.remove('mode-simplified');
        }
    }

    if (advancedSuite) {
        if (mode === 'advanced') {
            advancedSuite.style.display = 'grid';
            setTimeout(() => {
                renderRetentionChart('analytics-retention-chart');
                renderFormatChart('analytics-format-chart');
            }, 50);
        } else {
            advancedSuite.style.display = 'none';
        }
    }

    if (detailedContainer && detailedContainer.classList.contains('active')) {
        const currentPlatform = document.getElementById('detailed-platform-title')?.getAttribute('data-current-platform') || 'youtube';
        renderPlatformDetail(currentPlatform);
    }
}

/* ==========================================================================
   NAVIGATION & TAB SWITCHING WITH SMOOTH TRANSITIONS
   ========================================================================== */
function initSidebarNavigation() {
    const tabButtons = document.querySelectorAll('.sidebar-tabs .tab-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const detailedContainer = document.getElementById('detailed-analysis-view');
    const overviewContainer = document.getElementById('overview-analysis-view');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            AlgoSoundFX.playTabSwitch();
            const targetTab = btn.getAttribute('data-target');

            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (targetTab !== 'tab-analiza') {
                if (detailedContainer) detailedContainer.classList.remove('active');
                if (overviewContainer) overviewContainer.style.display = 'block';
            }

            viewSections.forEach(section => {
                if (section.id === targetTab) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
}

/* ==========================================================================
   USER AVATAR DROPDOWN & MENU OPTIONS
   ========================================================================== */
function initUserAvatarDropdown() {
    const avatarBtn = document.getElementById('user-avatar-btn');
    const dropdownMenu = document.getElementById('user-dropdown-menu');
    const userWrapper = document.getElementById('user-profile-wrapper');
    if (!avatarBtn || !dropdownMenu || !userWrapper) return;

    avatarBtn.addEventListener('click', () => {
        userWrapper.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!userWrapper.contains(e.target)) {
            userWrapper.classList.remove('active');
        }
    });

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            if (userWrapper) userWrapper.classList.remove('active');
            handleDropdownAction(action);
        });
    });
}

function handleDropdownAction(action) {
    AlgoSoundFX.playClick();
    switch (action) {
        case 'profil':
            renderSocialAvatarsPicker();
            openModal('modal-profile');
            break;
        case 'konto':
            openModal('modal-account');
            break;
        case 'ustawienia':
            openModal('modal-settings');
            break;
        case 'polaczone':
            renderConnectedSocialAccounts();
            openModal('modal-connected');
            break;
        case 'wyloguj':
            localStorage.setItem('aplihub_logged_out', 'true');
            if (typeof saveApliHubUserData === 'function') {
                saveApliHubUserData({ ...DEFAULT_USER_STORE, isLoggedIn: false, name: 'Gość', email: '' });
            }
            syncUserInfo();
            if (typeof renderAnalysisPanels === "function") renderAnalysisPanels();
            showToast('👋 Wylogowano pomyślnie z panelu Soclify.');
            break;
    }
}

/* ==========================================================================
   AVATAR PICKER WITH DEDUPLICATION IN PROFILE MODAL
   ========================================================================== */
function renderSocialAvatarsPicker() {
    const picker = document.getElementById('social-avatars-picker');
    if (!picker || typeof getApliHubUserData !== 'function') return;

    const user = getApliHubUserData();

    // Collect connected social avatars + default avatar
    const available = [
        { key: 'default', label: 'Domyślny Avatar', icon: 'O' }
    ];

    const socialMeta = [
        { key: 'youtube', label: 'YouTube Avatar', icon: '🔴' },
        { key: 'tiktok', label: 'TikTok Avatar', icon: '🎵' },
        { key: 'instagram', label: 'Instagram Avatar', icon: '📸' },
        { key: 'facebook', label: 'Facebook Avatar', icon: '📘' },
        { key: 'twitch', label: 'Twitch Avatar', icon: '🟪' }
    ];

    socialMeta.forEach(s => {
        if (user.connectedAccounts && user.connectedAccounts[s.key]) {
            available.push(s);
        }
    });

    // Deduplicate avatars so identical avatars don't repeat
    const uniqueAvatars = [];
    const seenIcons = new Set();

    available.forEach(item => {
        if (!seenIcons.has(item.icon)) {
            seenIcons.add(item.icon);
            uniqueAvatars.push(item);
        }
    });

    const activeKey = user.selectedAvatar || 'default';

    picker.innerHTML = uniqueAvatars.map(item => `
        <div class="social-avatar-option ${item.key === activeKey ? 'active' : ''}" data-avatar-key="${item.key}" title="${item.label}">
            <span>${item.icon}</span>
        </div>
    `).join('');

    picker.querySelectorAll('.social-avatar-option').forEach(el => {
        el.addEventListener('click', () => {
            const key = el.getAttribute('data-avatar-key');
            const currentUser = getApliHubUserData();
            currentUser.selectedAvatar = key;
            saveApliHubUserData(currentUser);

            renderSocialAvatarsPicker();
            showToast(`Ustawiono nowy avatar z: ${key.toUpperCase()}`);
        });
    });
}

/* ==========================================================================
   ACCOUNT CREDENTIALS FORM & CONNECTED SOCIALS
   ========================================================================== */
function initAccountCredentialsForm() {
    const form = document.getElementById('form-algo-account-credentials');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newEmail = document.getElementById('algo-input-email').value.trim();
            const newPassword = document.getElementById('algo-input-password').value.trim();

            if (typeof getApliHubUserData === 'function' && typeof saveApliHubUserData === 'function') {
                const user = getApliHubUserData();
                if (newEmail) user.email = newEmail;
                if (newPassword) user.password = newPassword;
                saveApliHubUserData(user);
                showToast('Zapisano e-mail / hasło!');
            }
            closeModal();
        });
    }
}

/* ==========================================================================
   SETTINGS MODAL & APP SOUND FX CONTROLS
   ========================================================================== */
function initSettingsForm() {
    const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};

    // Sound enabled toggle
    const soundToggle = document.getElementById('setting-sound-enabled');
    if (soundToggle) {
        soundToggle.checked = user.settings?.soundEnabled ?? true;
        soundToggle.addEventListener('change', (e) => {
            const currentUser = getApliHubUserData();
            if (!currentUser.settings) currentUser.settings = {};
            currentUser.settings.soundEnabled = e.target.checked;
            saveApliHubUserData(currentUser);
            if (e.target.checked) AlgoSoundFX.playClick();
        });
    }

    // Volume slider
    const volumeSlider = document.getElementById('setting-sound-volume');
    const volumeVal = document.getElementById('setting-volume-val');
    if (volumeSlider) {
        const initialVol = user.settings?.soundVolume ?? 50;
        volumeSlider.value = initialVol;
        if (volumeVal) volumeVal.textContent = `${initialVol}%`;

        volumeSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            if (volumeVal) volumeVal.textContent = `${val}%`;
            const currentUser = getApliHubUserData();
            if (!currentUser.settings) currentUser.settings = {};
            currentUser.settings.soundVolume = val;
            saveApliHubUserData(currentUser);
        });
        volumeSlider.addEventListener('change', () => {
            AlgoSoundFX.playClick();
        });
    }

    // Plan A vs Plan B radio choice
    const planMode = localStorage.getItem('aplihub_plan_mode') || 'plan_a';
    const radioPlanA = document.getElementById('radio-plan-a');
    const radioPlanB = document.getElementById('radio-plan-b');
    if (radioPlanA && radioPlanB) {
        if (planMode === 'plan_b') radioPlanB.checked = true;
        else radioPlanA.checked = true;

        [radioPlanA, radioPlanB].forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    const chosen = e.target.value;
                    localStorage.setItem('aplihub_plan_mode', chosen);
                    AlgoSoundFX.playClick();
                    renderSocialTrendHubs();
                    renderAnalysisPanels();
                    showToast(`Przełączono tryb na: ${chosen === 'plan_a' ? 'Plan A (Jedna Zakładka Startowa)' : 'Plan B (Karty wewnątrz zakładek)'}`);
                }
            });
        });
    }

    // Apli Pro button removed as requested
}

function isDesktopApp() {
    if (typeof window === 'undefined') return false;
    const isFile = window.location.protocol === 'file:';
    const isPort54321 = window.location.port === '54321';
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isExplicitDesktop = window.location.search.includes('env=desktop') || window.location.search.includes('mode=desktop') || localStorage.getItem('soclify_env') === 'desktop';
    return isFile || isPort54321 || isLocalhost || isExplicitDesktop;
}

function isWebSimulation() {
    if (window.parent && window.parent !== window) return true;
    if (window.location.hostname.includes('github.io') || window.location.hostname.includes('aplihub')) {
        return !window.location.search.includes('env=desktop');
    }
    return !isDesktopApp();
}
window.isDesktopApp = isDesktopApp;
window.isWebSimulation = isWebSimulation;

function renderConnectedSocialAccounts() {
    const container = document.getElementById('algo-social-accounts-list');
    if (!container || typeof getApliHubUserData !== 'function') return;

    if (isWebSimulation()) {
        container.innerHTML = `
            <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 18px; text-align: center;">
                <div style="font-size: 1.6rem; margin-bottom: 8px;">📊</div>
                <div style="font-weight: 700; color: #f59e0b; font-size: 1.05rem; margin-bottom: 6px;">Tryb Podglądu Symulacji</div>
                <div style="color: #94a3b8; font-size: 0.88rem; line-height: 1.5; margin-bottom: 14px;">
                    W symulatorze na stronie wszystkie platformy (YouTube, TikTok, Instagram, Facebook, Twitch) są w pełni odblokowane do interaktywnego testowania.<br>
                    Rzeczywiste łączenie i synchronizacja Twoich kont przez oficjalne API jest wymagana w <strong>Aplikacji Desktopowej Soclify</strong>.
                </div>
                <a href="assets/installer/ApliHub_AlgoAnalyzer_Setup.exe" style="display: inline-block; padding: 9px 18px; background: #f59e0b; color: #000; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 0.85rem;">
                    📥 Pobierz Aplikację Desktopową (.EXE)
                </a>
            </div>
        `;
        return;
    }

    const user = getApliHubUserData();
    const socialPlatforms = [
        { key: 'youtube', name: 'YouTube', icon: '🔴' },
        { key: 'tiktok', name: 'TikTok', icon: '🎵' },
        { key: 'instagram', name: 'Instagram', icon: '📸' },
        { key: 'facebook', name: 'Facebook', icon: '📘' },
        { key: 'twitch', name: 'Twitch', icon: '🟪' }
    ];

    container.innerHTML = socialPlatforms.map(p => {
        const isConnected = !!user.connectedAccounts[p.key];
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.3rem;">${p.icon}</span>
                    <div>
                        <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">${p.name}</div>
                        <div style="font-size: 0.78rem; color: ${isConnected ? '#34d399' : '#f87171'}; font-weight: 600;">
                            ${isConnected ? '● Połączono' : '● Nie połączono'}
                        </div>
                    </div>
                </div>
                <button class="btn-toggle-algo-social" data-key="${p.key}" style="padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; ${isConnected ? 'background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171;' : 'background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #f59e0b;'}">
                    ${isConnected ? 'Odłącz' : 'Połącz'}
                </button>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.btn-toggle-algo-social').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-key');
            const currentUser = getApliHubUserData();
            const isCurrentlyConnected = !!(currentUser.connectedAccounts && currentUser.connectedAccounts[key]);

            if (!isCurrentlyConnected) {
                openSocialConnectModal(key);
            } else {
                currentUser.connectedAccounts[key] = false;
                if (key === 'twitch') {
                    localStorage.removeItem('twitch_token');
                    localStorage.removeItem('twitch_access_token');
                }
                saveApliHubUserData(currentUser);
                renderConnectedSocialAccounts();
                renderSocialTrendHubs();
                renderAnalysisPanels();
                AlgoSoundFX.playClick();
                showToast(`Odłączono konto ${key.toUpperCase()}`);
            }
        });
    });
}

/* ==========================================================================
   PLATFORM PANELS & "SPRAWDŹ" BUTTON SMOOTH TRANSITIONS
   ========================================================================== */

/* ==========================================================================
   DYNAMIC ANALYSIS PANELS WITH CONNECTED/LOCKED STATE MANAGEMENT
   ========================================================================== */
function renderAnalysisPanels() {
    const grid = document.querySelector('#tab-analiza .analysis-grid');
    if (!grid) return;

    const isSim = isWebSimulation();
    const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : { connectedAccounts: {} };
    const connected = (user && user.connectedAccounts) ? user.connectedAccounts : {};

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
        const isConnected = isSim ? true : !!connected[p.id];

        return `
            <div class="glass-card analysis-platform-card ${isConnected ? 'connected-card' : 'locked-card'}" data-platform="${p.id}" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                <div>
                    <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 10px;">
                        <div class="platform-info" style="display: flex; align-items: center; gap: 10px;">
                            <div class="platform-icon-wrapper" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: rgba(0,0,0,0.3); border: 1px solid ${p.color}40;">
                                ${p.svg}
                            </div>
                            <div class="platform-title" style="font-weight: 700; font-size: 1.05rem; color: #fff;">${p.name}</div>
                        </div>
                        <span class="platform-status-badge ${isConnected ? 'connected' : 'locked'}" style="padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; display: inline-flex; align-items: center; gap: 5px; ${isConnected ? 'background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3);' : 'background: rgba(239,68,68,0.15); color: #f87171; border: 1px solid rgba(239,68,68,0.3);'}">
                            <span>●</span> ${isSim ? 'Podgląd (Demo)' : (isConnected ? 'Połączono' : 'Nie połączono')}
                        </span>
                    </div>

                    <div class="card-description" style="font-size: 13px; color: var(--color-text-muted); line-height: 1.4; margin-bottom: 16px;">
                        ${p.desc}
                    </div>

                    <div class="card-metrics-preview" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04);">
                        <div class="preview-stat">
                            <span class="preview-label" style="display: block; font-size: 11px; color: var(--color-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Zasięg</span>
                            <span class="preview-value" style="font-size: 16px; font-weight: 800; color: ${isConnected ? '#fff' : 'var(--color-text-dim)'};">${isConnected ? p.reach : 'Brak danych'}</span>
                        </div>
                        <div class="preview-stat">
                            <span class="preview-label" style="display: block; font-size: 11px; color: var(--color-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">Score</span>
                            <span class="preview-value" style="font-size: 16px; font-weight: 800; color: ${isConnected ? 'var(--color-yellow-main)' : 'var(--color-text-dim)'};">${isConnected ? p.score : '--'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    ${isConnected ? `
                        <button class="btn-yellow btn-check-platform" data-platform="${p.id}" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 16px; font-weight: 700; border-radius: 8px; cursor: pointer;">
                            <span>${isSim ? 'Sprawdź podgląd' : 'Sprawdź analitykę'}</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    ` : `
                        <button class="btn-connect-platform" data-platform="${p.id}" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 16px; font-weight: 700; border-radius: 8px; cursor: pointer; background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.08)); border: 1px solid rgba(245,158,11,0.4); color: #f59e0b; transition: all 0.2s ease;">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            <span>Połącz konto</span>
                        </button>
                    `}
                </div>
            </div>
        `;
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
            openSocialConnectModal(platformKey);
        });
    });

    grid.querySelectorAll('.analysis-platform-card').forEach(card => {
        card.addEventListener('click', () => {
            const platformKey = card.getAttribute('data-platform');
            const isConn = isSim ? true : !!connected[platformKey];
            if (isConn) {
                openPlatformDetail(platformKey);
            } else {
                openSocialConnectModal(platformKey);
            }
        });
    });
}

function initPlatformCards() {
    const checkButtons = document.querySelectorAll('.btn-check-platform');

    checkButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const platformKey = btn.getAttribute('data-platform');
            openPlatformDetail(platformKey);
        });
    });

    const glassCards = document.querySelectorAll('.glass-card[data-platform]');
    glassCards.forEach(card => {
        card.addEventListener('click', () => {
            const platformKey = card.getAttribute('data-platform');
            openPlatformDetail(platformKey);
        });
    });

    const backBtn = document.getElementById('btn-back-to-overview');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            closePlatformDetail();
        });
    }

    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const detailedContainer = document.getElementById('detailed-analysis-view');
            if (detailedContainer) {
                detailedContainer.classList.add('updating-fade');
                setTimeout(() => detailedContainer.classList.remove('updating-fade'), 300);
            }

            const currentPlatform = document.getElementById('detailed-platform-title')?.getAttribute('data-current-platform') || 'youtube';
            showToast(`Zaktualizowano dane dla okresu: ${btn.textContent}`);
            renderPlatformDetail(currentPlatform);
        });
    });
}

function openPlatformDetail(platformKey) {
    const overviewContainer = document.getElementById('overview-analysis-view');
    const detailedContainer = document.getElementById('detailed-analysis-view');

    if (overviewContainer && detailedContainer) {
        overviewContainer.style.display = 'none';
        detailedContainer.classList.add('active');
        detailedContainer.classList.add('updating-fade');
        setTimeout(() => detailedContainer.classList.remove('updating-fade'), 300);

        renderPlatformDetail(platformKey);

        requestAnimationFrame(() => {
            setTimeout(() => {
                renderPlatformDetail(platformKey);
            }, 50);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function closePlatformDetail() {
    const overviewContainer = document.getElementById('overview-analysis-view');
    const detailedContainer = document.getElementById('detailed-analysis-view');

    if (overviewContainer && detailedContainer) {
        detailedContainer.classList.remove('active');
        overviewContainer.style.display = 'block';
        overviewContainer.classList.add('updating-fade');
        setTimeout(() => overviewContainer.classList.remove('updating-fade'), 300);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/* ==========================================================================
   RENDER DETAILED PLATFORM ANALYTICS DASHBOARD
   ========================================================================== */
function renderPlatformDetail(platformKey) {
    const data = PLATFORM_DATA[platformKey] || PLATFORM_DATA.youtube;

    const titleElem = document.getElementById('detailed-platform-title');
    const iconElem = document.getElementById('detailed-platform-icon');

    if (titleElem) {
        titleElem.textContent = `${data.name} — Analiza Algorytmu i Zasięgów`;
        titleElem.setAttribute('data-current-platform', platformKey);
    }

    if (iconElem) {
        iconElem.innerHTML = getPlatformSvgIcon(platformKey);
        iconElem.style.borderColor = data.iconColor;
    }

    // Get active period multiplier
    const activePeriodBtn = document.querySelector('.period-btn.active');
    const periodText = activePeriodBtn ? activePeriodBtn.textContent.trim() : '30 dni';
    let multiplier = 1.0;
    if (periodText === '7 dni') multiplier = 0.28;
    else if (periodText === '90 dni') multiplier = 2.85;

    // Helper to format numbers based on period
    const formatPeriodStat = (rawValStr, mult) => {
        const num = parseFloat(rawValStr.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return rawValStr;
        const calc = Math.round(num * mult);
        if (calc > 1000000) return (calc / 1000000).toFixed(2) + 'M';
        if (calc > 1000) return (calc / 1000).toFixed(1) + 'K';
        return calc.toString();
    };

    setElemText('kpi-views-value', formatPeriodStat(data.metrics.views.value, multiplier));
    setElemText('kpi-views-trend', data.metrics.views.trend);
    setElemText('kpi-views-subtext', data.metrics.views.subtext);

    setElemText('kpi-subs-value', formatPeriodStat(data.metrics.subscribers.value, multiplier));
    setElemText('kpi-subs-trend', data.metrics.subscribers.trend);
    setElemText('kpi-subs-subtext', data.metrics.subscribers.subtext);

    setElemText('kpi-returning-value', formatPeriodStat(data.metrics.returningViewers.value, multiplier));
    setElemText('kpi-returning-trend', data.metrics.returningViewers.trend);
    setElemText('kpi-returning-subtext', data.metrics.returningViewers.subtext);

    setElemText('kpi-likes-value', formatPeriodStat(data.metrics.likes.value, multiplier));
    setElemText('kpi-likes-trend', data.metrics.likes.trend);
    setElemText('kpi-likes-subtext', data.metrics.likes.subtext);

    setElemText('algo-score-num', `${data.algorithmScore}%`);
    setElemText('algo-score-status', data.scoreStatus);

    renderGaugeChart('algo-gauge-canvas', data.algorithmScore);

    const tipsList = document.getElementById('algo-tips-container');
    if (tipsList) {
        tipsList.innerHTML = data.tips.map(tip => `
            <div class="algo-tip-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${tip}</span>
            </div>
        `).join('');
    }

    renderLineChart('analytics-main-chart', data.chartData, currentViewMode);
}

/* ==========================================================================
   CANVAS NEON CHARTS RENDERING ENGINE (SIMPLIFIED VS ADVANCED)
   ========================================================================== */
function renderLineChart(canvasId, chartData, viewMode = 'simplified') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;

    const width = (parent && parent.clientWidth > 100) ? parent.clientWidth : 600;
    const height = (parent && parent.clientHeight > 100) ? parent.clientHeight : 280;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);

    const padding = 45;

    ctx.clearRect(0, 0, width, height);

    const isAdvanced = viewMode === 'advanced';

    // Advanced mode: Render grid lines
    if (isAdvanced) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 4; i++) {
            const y = padding + ((height - padding * 2) / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
    }

    const dataPoints = chartData.views;
    const engagementPoints = chartData.engagement;
    const maxVal = Math.max(...dataPoints) * 1.15;
    const minVal = 0;

    const getX = (idx) => padding + ((width - padding * 2) / (dataPoints.length - 1)) * idx;
    const getY = (val) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);

    // Primary Views Fill Gradient
    const fillGradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    fillGradient.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
    fillGradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(dataPoints[0]));

    for (let i = 0; i < dataPoints.length - 1; i++) {
        const x1 = getX(i);
        const y1 = getY(dataPoints[i]);
        const x2 = getX(i + 1);
        const y2 = getY(dataPoints[i + 1]);
        const cx = (x1 + x2) / 2;
        ctx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
    }

    ctx.lineTo(getX(dataPoints.length - 1), height - padding);
    ctx.lineTo(getX(0), height - padding);
    ctx.closePath();
    ctx.fillStyle = fillGradient;
    ctx.fill();

    // Main Line Stroke
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(dataPoints[0]));

    for (let i = 0; i < dataPoints.length - 1; i++) {
        const x1 = getX(i);
        const y1 = getY(dataPoints[i]);
        const x2 = getX(i + 1);
        const y2 = getY(dataPoints[i + 1]);
        const cx = (x1 + x2) / 2;
        ctx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
    }

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = isAdvanced ? 3.5 : 4;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = isAdvanced ? 12 : 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Advanced mode: Render 2nd curve (Engagement) & Data point dots
    if (isAdvanced && engagementPoints) {
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(engagementPoints[0] * 5));

        for (let i = 0; i < engagementPoints.length - 1; i++) {
            const x1 = getX(i);
            const y1 = getY(engagementPoints[i] * 5);
            const x2 = getX(i + 1);
            const y2 = getY(engagementPoints[i + 1] * 5);
            const cx = (x1 + x2) / 2;
            ctx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
        }

        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Data point circles
        dataPoints.forEach((val, i) => {
            const x = getX(i);
            const y = getY(val);

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
        });
    }

    // X-Axis Labels
    dataPoints.forEach((val, i) => {
        const x = getX(i);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(chartData.labels[i], x, height - 12);
    });
}

function renderGaugeChart(canvasId, score) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 180 * dpr;
    canvas.height = 180 * dpr;
    ctx.scale(dpr, dpr);

    const centerX = 90;
    const centerY = 90;
    const radius = 70;
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;

    ctx.clearRect(0, 0, 180, 180);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    const currentAngle = startAngle + (score / 100) * (endAngle - startAngle);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

/* ==========================================================================
   ADVANCED PRO SUITE CANVAS CHARTS (RETENTION & FORMAT COMPARISON)
   ========================================================================== */
function renderRetentionChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;

    const width = (parent && parent.clientWidth > 100) ? parent.clientWidth : 500;
    const height = (parent && parent.clientHeight > 100) ? parent.clientHeight : 220;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const padding = 35;
    ctx.clearRect(0, 0, width, height);

    const points = [100, 84, 72, 65, 58, 52];
    const labels = ['0:00', '0:03s', '1:00', '3:00', '5:00', '10:00'];

    const getX = (i) => padding + ((width - padding * 2) / (points.length - 1)) * i;
    const getY = (val) => height - padding - (val / 100) * (height - padding * 2);

    const grad = ctx.createLinearGradient(0, padding, 0, height - padding);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(points[0]));
    for (let i = 0; i < points.length - 1; i++) {
        const x1 = getX(i), y1 = getY(points[i]);
        const x2 = getX(i + 1), y2 = getY(points[i + 1]);
        const cx = (x1 + x2) / 2;
        ctx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
    }
    ctx.lineTo(getX(points.length - 1), height - padding);
    ctx.lineTo(getX(0), height - padding);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(points[0]));
    for (let i = 0; i < points.length - 1; i++) {
        const x1 = getX(i), y1 = getY(points[i]);
        const x2 = getX(i + 1), y2 = getY(points[i + 1]);
        const cx = (x1 + x2) / 2;
        ctx.bezierCurveTo(cx, y1, cx, y2, x2, y2);
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const hookX = getX(1);
    const hookY = getY(points[1]);
    ctx.beginPath();
    ctx.arc(hookX, hookY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '700 11px sans-serif';
    ctx.fillText('Hook: 84%', hookX - 24, hookY - 12);
}

function renderFormatChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;

    const width = (parent && parent.clientWidth > 100) ? parent.clientWidth : 500;
    const height = (parent && parent.clientHeight > 100) ? parent.clientHeight : 220;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const padding = 35;
    ctx.clearRect(0, 0, width, height);

    const barData = [
        { label: 'Shorts (Krótkie)', val: 88, color: '#f59e0b' },
        { label: 'Filmy Długie', val: 62, color: '#00f2fe' },
        { label: 'Live / Streams', val: 45, color: '#a855f7' }
    ];

    const barWidth = 45;
    const gap = (width - padding * 2 - (barWidth * barData.length)) / (barData.length + 1);

    barData.forEach((b, i) => {
        const x = padding + gap * (i + 1) + barWidth * i;
        const bHeight = (b.val / 100) * (height - padding * 2);
        const y = height - padding - bHeight;

        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(x, y, barWidth, bHeight);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = '700 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${b.val}%`, x + barWidth / 2, y - 8);
        ctx.fillText(b.label.split(' ')[0], x + barWidth / 2, height - 12);
    });
}

/* ==========================================================================
   AUTH MODULE (LOGIN & REGISTRATION & OTP)
   ========================================================================== */
function initAuthModule() {
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
            showToast(`Zalogowano pomyślnie jako: ${currentUser.name}`);
        });
    }
}

/* ==========================================================================
   MODALS AND TOAST UTILITIES
   ========================================================================== */
function initModals() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close-btn');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }
}

function openModal(modalId) {
    const overlay = document.getElementById('modal-overlay');
    const modals = document.querySelectorAll('.modal-card');

    modals.forEach(m => m.style.display = 'none');

    const targetModal = document.getElementById(modalId);
    if (targetModal && overlay) {
        targetModal.style.display = 'block';
        overlay.classList.add('active');
    }
}

window.closeModal = function () {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
};

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/* ==========================================================================
   HELPERS & SVG ICONS
   ========================================================================== */
function setElemText(id, text) {
    const elem = document.getElementById(id);
    if (elem) elem.textContent = text;
}

function getPlatformSvgIcon(platformKey) {
    switch (platformKey) {
        case 'youtube':
            return `<svg viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
        case 'tiktok':
            return `<svg viewBox="0 0 24 24" fill="#00f2fe"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.33 6.33 0 0 0-1-.08 6.34 6.34 0 1 0 6.34 6.34V9.05a8.3 8.3 0 0 0 5-1.63V6.69z"/></svg>`;
        case 'instagram':
            return `<svg viewBox="0 0 24 24" fill="#e1306c"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
        case 'facebook':
            return `<svg viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
        case 'twitch':
            return `<svg viewBox="0 0 24 24" fill="#9146ff"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"/></svg>`;
        default:
            return `<svg viewBox="0 0 24 24" fill="#f59e0b"><circle cx="12" cy="12" r="10"/></svg>`;
    }
}

/* ==========================================================================
   YOUTUBE AI TRANSCRIPT & ALGORITHM ANALYZER INTEGRATION
   ========================================================================== */
function initYouTubeAIAnalyzer() {
    const btnRun = document.getElementById('btn-run-yt-analysis');
    if (!btnRun) return;

    btnRun.addEventListener('click', async () => {
        const youtubeKeyOrChannel = document.getElementById('yt-api-key-input')?.value?.trim();
        const openAiKey = document.getElementById('openai-api-key-input')?.value?.trim();

        const loader = document.getElementById('yt-ai-loading');
        const resultsContainer = document.getElementById('yt-ai-results-container');
        const btnText = document.getElementById('btn-run-yt-text');

        if (loader) loader.style.display = 'block';
        if (resultsContainer) resultsContainer.style.display = 'none';
        if (btnText) btnText.textContent = 'Analizowanie (TypeScript & OpenAI)...';
        btnRun.disabled = true;

        try {
            if (typeof YouTubeAnalytics === 'undefined' || typeof YouTubeAnalytics.processYouTubeStatsAndAnalyze !== 'function') {
                throw new Error('Moduł YouTubeAnalytics nie został wczytany.');
            }

            const output = await YouTubeAnalytics.processYouTubeStatsAndAnalyze({
                youtubeApiKey: youtubeKeyOrChannel,
                channelId: youtubeKeyOrChannel,
                openAiApiKey: openAiKey
            });

            renderYouTubeAIResults(output);

            if (resultsContainer) resultsContainer.style.display = 'block';
            showToast('✅ Przeanalizowano statystyki i transkrypcje Top 5 z OpenAI!', 'success');
        } catch (error) {
            console.error('Błąd podczas analizy YouTube AI:', error);
            showToast('❌ Wystąpił błąd: ' + error.message, 'error');
        } finally {
            if (loader) loader.style.display = 'none';
            if (btnText) btnText.textContent = 'Analizuj Top 5 i Transkrypcje (TypeScript)';
            btnRun.disabled = false;
        }
    });
}

function renderYouTubeAIResults(output) {
    if (!output) return;

    const { metrics, aiAnalysis } = output;

    // 1. CTR & AVD & Fit Score
    const avgCtrElem = document.getElementById('yt-res-avg-ctr');
    if (avgCtrElem) avgCtrElem.textContent = `${metrics.averageCTR}%`;

    const avgAvdElem = document.getElementById('yt-res-avg-avd');
    if (avgAvdElem) avgAvdElem.textContent = metrics.averageAVDFormatted;

    const fitScoreElem = document.getElementById('yt-res-fit-score');
    if (fitScoreElem) fitScoreElem.textContent = `${aiAnalysis.algorithm_fit_score}%`;

    // 2. Best Publish Time Badge
    const publishBadge = document.getElementById('yt-res-publish-time-badge');
    if (publishBadge) publishBadge.textContent = aiAnalysis.best_publish_time;

    // 3. Render Top 5 Videos List
    const top5Container = document.getElementById('yt-top5-list-container');
    if (top5Container && metrics.top5Videos) {
        top5Container.innerHTML = metrics.top5Videos.map((vid, idx) => `
            <div style="background: rgba(0,0,0,0.4); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 240px;">
                    <span style="font-family: var(--font-mono); font-weight: 800; color: var(--color-yellow-main); font-size: 13px;">#${idx + 1}</span>
                    <span style="font-size: 13px; font-weight: 600; color: var(--color-text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 420px;">${vid.title}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 14px; font-size: 12px; font-family: var(--font-mono);">
                    <span style="color: var(--color-text-muted);">👁 ${vid.viewCount.toLocaleString('pl-PL')} wyświetleń</span>
                    <span style="color: var(--color-yellow-main); font-weight: 700;">CTR: ${vid.ctr}%</span>
                    <span style="color: #00f2fe; font-weight: 700;">AVD: ${vid.avdFormatted}</span>
                </div>
            </div>
        `).join('');
    }

    // 4. Render Hooks (JSON: hooks)
    const hooksContainer = document.getElementById('yt-res-hooks-list');
    if (hooksContainer && aiAnalysis.hooks) {
        hooksContainer.innerHTML = aiAnalysis.hooks.map(hook => `
            <div style="background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--color-yellow-main); font-size: 13px; color: var(--color-text-primary); line-height: 1.4;">
                ${hook}
            </div>
        `).join('');
    }

    // 5. Render Dynamic Recommendations (JSON: dynamic_recommendations)
    const recsContainer = document.getElementById('yt-res-recs-list');
    if (recsContainer && aiAnalysis.dynamic_recommendations) {
        recsContainer.innerHTML = aiAnalysis.dynamic_recommendations.map(rec => `
            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); font-size: 12px; color: var(--color-text-primary); line-height: 1.4; display: flex; align-items: flex-start; gap: 8px;">
                <span style="color: #10b981; font-weight: 800;">✓</span>
                <span>${rec}</span>
            </div>
        `).join('');
    }
}

/* ==========================================================================
   TWITCH OAUTH 2.0 (IMPLICIT GRANT FLOW) & HELIX API INTEGRATION
   Hosted for GitHub Pages: https://vertisek.github.io/ApliHub/
   ========================================================================== */

const TWITCH_CONFIG = {
    // Default Twitch Client ID (configurable via localStorage or prompt)
    CLIENT_ID: localStorage.getItem('twitch_client_id') || 'gp762nuuoqcoxypju8c569th9wz7q5',
    // Redirect URI matching GitHub Pages hosting and local development
    REDIRECT_URI: (function () {
        if (typeof window !== 'undefined') {
            if (window.location.hostname.includes('github.io')) {
                return 'https://vertisek.github.io/ApliHub/Algo%20analyzer/index.html';
            }
            return window.location.origin + window.location.pathname;
        }
        return 'https://vertisek.github.io/ApliHub/Algo%20analyzer/index.html';
    })(),
    SCOPES: [
        'user:read:email',
        'user:read:broadcast',
        'channel:read:subscriptions',
        'channel:read:stream_key'
    ].join(' ')
};

/**
 * Initiates Twitch OAuth Implicit Flow login redirect
 */
function loginWithTwitch(customClientId) {
    const clientId = customClientId || localStorage.getItem('twitch_client_id') || TWITCH_CONFIG.CLIENT_ID;
    if (!clientId) {
        promptTwitchClientId();
        return;
    }

    localStorage.setItem('twitch_client_id', clientId);

    const redirectUri = TWITCH_CONFIG.REDIRECT_URI;
    const authUrl = 'https://id.twitch.tv/oauth2/authorize' +
        '?client_id=' + encodeURIComponent(clientId) +
        '&redirect_uri=' + encodeURIComponent(redirectUri) +
        '&response_type=token' +
        '&scope=' + encodeURIComponent(TWITCH_CONFIG.SCOPES) +
        '&force_verify=true';

    window.location.href = authUrl;
}
window.loginWithTwitch = loginWithTwitch;

/**
 * Parses access_token from URL hash after Twitch OAuth redirect, saves it to localStorage,
 * and loads Twitch stats automatically
 */
function handleTwitchOAuthCallback() {
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) return;

    const cleanHash = hash.replace(/^#/, '');
    const params = new URLSearchParams(cleanHash.startsWith('?') ? cleanHash : '?' + cleanHash);
    const token = params.get('access_token');

    if (token) {
        localStorage.setItem('twitch_token', token);
        localStorage.setItem('twitch_access_token', token);

        // Mark Twitch as connected in user store
        const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
        if (!user.connectedAccounts) user.connectedAccounts = {};
        user.connectedAccounts.twitch = true;
        if (typeof saveApliHubUserData === 'function') saveApliHubUserData(user);

        // Clean up hash from browser address bar without reloading
        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, window.location.pathname + window.location.search);
        }

        if (typeof showToast === 'function') {
            showToast('🎉 Pomyślnie połączono konto Twitch! Pobieranie statystyk Helix API...');
        }

        // Fetch Helix statistics
        fetchTwitchChannelStats();
        if (typeof renderAnalysisPanels === 'function') renderAnalysisPanels();
        if (typeof renderConnectedSocialAccounts === 'function') renderConnectedSocialAccounts();
    }
}

/**
 * Fetches comprehensive channel stats from Twitch Helix API
 * (User info, channel metadata, followers count, live stream status, recent videos)
 */
async function fetchTwitchChannelStats() {
    const token = localStorage.getItem('twitch_token') || localStorage.getItem('twitch_access_token');
    const clientId = localStorage.getItem('twitch_client_id') || TWITCH_CONFIG.CLIENT_ID;

    if (!token) {
        console.warn('Brak aktywnego tokenu Twitch w localStorage.');
        renderTwitchLiveDashboard(null);
        return null;
    }

    try {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Client-Id': clientId
        };

        // 1. Get Authenticated User Info
        const userRes = await fetch('https://api.twitch.tv/helix/users', { headers });
        if (!userRes.ok) {
            if (userRes.status === 401) {
                console.warn('Twitch token wygasł lub jest nieprawidłowy.');
                localStorage.removeItem('twitch_token');
                localStorage.removeItem('twitch_access_token');
            }
            throw new Error('Twitch API user info error: ' + userRes.statusText);
        }
        const userDataJson = await userRes.json();
        const user = userDataJson.data && userDataJson.data[0];
        if (!user) throw new Error('Nie znaleziono danych użytkownika Twitch.');

        const userId = user.id;

        // 2. Get Channel Info (title, game category, language)
        let channelInfo = {};
        try {
            const channelRes = await fetch('https://api.twitch.tv/helix/channels?broadcaster_id=' + encodeURIComponent(userId), { headers });
            if (channelRes.ok) {
                const channelData = await channelRes.json();
                channelInfo = (channelData.data && channelData.data[0]) || {};
            }
        } catch (e) {
            console.warn('Błąd pobierania danych kanału Twitch:', e);
        }

        // 3. Get Followers Count
        let followersCount = user.view_count || 0;
        try {
            const followersRes = await fetch('https://api.twitch.tv/helix/channels/followers?broadcaster_id=' + encodeURIComponent(userId), { headers });
            if (followersRes.ok) {
                const followersData = await followersRes.json();
                followersCount = followersData.total ?? followersCount;
            }
        } catch (e) {
            console.warn('Błąd pobierania liczby obserwujących Twitch:', e);
        }

        // 4. Get Current Live Stream Status
        let streamInfo = null;
        try {
            const streamRes = await fetch('https://api.twitch.tv/helix/streams?user_id=' + encodeURIComponent(userId), { headers });
            if (streamRes.ok) {
                const streamData = await streamRes.json();
                streamInfo = (streamData.data && streamData.data[0]) || null;
            }
        } catch (e) {
            console.warn('Błąd pobierania statusu transmisji Twitch:', e);
        }

        // 5. Get Recent Videos / VODs
        let recentVideos = [];
        try {
            const videosRes = await fetch('https://api.twitch.tv/helix/videos?user_id=' + encodeURIComponent(userId) + '&first=5', { headers });
            if (videosRes.ok) {
                const videosData = await videosRes.json();
                recentVideos = videosData.data || [];
            }
        } catch (e) {
            console.warn('Błąd pobierania wideo Twitch:', e);
        }

        const statsResult = {
            success: true,
            user: {
                id: user.id,
                login: user.login,
                displayName: user.display_name,
                avatar: user.profile_image_url,
                description: user.description,
                broadcasterType: user.broadcaster_type || 'Affiliate / Partner',
                viewCount: user.view_count
            },
            channel: {
                title: channelInfo.title || 'Brak tytułu',
                gameName: channelInfo.game_name || 'Just Chatting',
                language: channelInfo.broadcaster_language || 'pl'
            },
            followers: followersCount,
            isLive: !!streamInfo,
            liveViewers: streamInfo ? streamInfo.viewer_count : 0,
            videos: recentVideos,
            updatedAt: new Date().toISOString()
        };

        // Save stats to localStorage
        localStorage.setItem('twitch_stats_data', JSON.stringify(statsResult));

        // Update Twitch tab UI with real live stats
        renderTwitchLiveDashboard(statsResult);

        return statsResult;
    } catch (err) {
        console.error('Błąd pobierania statystyk Twitch Helix API:', err);
        return null;
    }
}
window.fetchTwitchChannelStats = fetchTwitchChannelStats;

/**
 * Renders Twitch channel stats dashboard inside #tab-twitch
 */
function renderTwitchLiveDashboard(stats) {
    const twitchTab = document.getElementById('tab-twitch');
    if (!twitchTab) return;

    let card = document.getElementById('twitch-live-stats-card');
    if (!card) {
        const wrapper = document.createElement('div');
        wrapper.id = 'twitch-live-stats-card';
        wrapper.className = 'glass-card';
        wrapper.style.cssText = 'margin-bottom: 30px; padding: 24px; border: 1px solid rgba(145, 70, 255, 0.4); background: linear-gradient(135deg, rgba(145, 70, 255, 0.08), rgba(0, 0, 0, 0.4));';
        const pageHeader = twitchTab.querySelector('.page-header');
        if (pageHeader && pageHeader.nextSibling) {
            twitchTab.insertBefore(wrapper, pageHeader.nextSibling);
        } else {
            twitchTab.insertAdjacentElement('afterbegin', wrapper);
        }
        card = wrapper;
    }

    if (!stats || !stats.user) {
        if (isWebSimulation()) {
            stats = {
                user: { displayName: 'Twitch_Creator (Demo)', login: 'creator_stream', avatar: 'app.ico' },
                channel: { gameName: 'Just Chatting / Gaming' },
                isLive: true,
                liveViewers: 1420,
                followers: 48500,
                views: 278500
            };
        } else {
            const savedStatsStr = localStorage.getItem('twitch_stats_data');
            if (savedStatsStr) {
                try {
                    const parsed = JSON.parse(savedStatsStr);
                    if (parsed && parsed.user) {
                        renderTwitchLiveDashboard(parsed);
                        return;
                    }
                } catch (e) { }
            }

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(145, 70, 255, 0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; border: 1px solid rgba(145, 70, 255, 0.4);">
                            🟪
                        </div>
                        <div>
                            <h3 style="font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px;">Integracja Twitch Helix API</h3>
                            <p style="font-size: 13px; color: var(--color-text-muted);">Połącz swoje konto Twitch przez OAuth 2.0 (Implicit Flow), aby pobierać statystyki na żywo.</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button class="btn-yellow" style="background: linear-gradient(135deg, #9146ff, #772ce8); color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;" onclick="window.loginWithTwitch()">
                            <span>🟪</span> Zaloguj przez Twitch OAuth
                        </button>
                        <button class="btn-back" onclick="window.promptTwitchClientId()" style="padding: 10px 14px; font-size: 12px;">
                            ⚙️ Client ID
                        </button>
                    </div>
                </div>
            `;
            return;
        }
    }

    const u = stats.user;
    const c = stats.channel;

    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div style="display: flex; align-items: center; gap: 16px;">
                <img src="${u.avatar || 'icon48.png'}" alt="${u.displayName}" style="width: 54px; height: 54px; border-radius: 50%; border: 2px solid #9146ff; object-fit: cover; box-shadow: 0 0 16px rgba(145, 70, 255, 0.5);">
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <h3 style="font-size: 18px; font-weight: 800; color: #fff;">${u.displayName}</h3>
                        ${stats.isLive ? `
                            <span style="background: #ef4444; color: #fff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 999px; display: inline-flex; align-items: center; gap: 4px;">
                                🔴 LIVE (${Number(stats.liveViewers).toLocaleString()} widzów)
                            </span>
                        ` : `
                            <span style="background: rgba(145, 70, 255, 0.2); color: #c084fc; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; border: 1px solid rgba(145, 70, 255, 0.35);">
                                OFFLINE
                            </span>
                        `}
                    </div>
                    <p style="font-size: 12px; color: var(--color-text-muted); font-family: var(--font-mono); margin-top: 2px;">twitch.tv/${u.login} • ${c.gameName || 'Twitch Streamer'}</p>
                </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <button class="btn-yellow" style="background: rgba(145, 70, 255, 0.2); color: #c084fc; border: 1px solid rgba(145, 70, 255, 0.4); padding: 8px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 12px;" onclick="window.fetchTwitchChannelStats()">
                    🔄 Odśwież Helix API
                </button>
                <button class="btn-back" style="padding: 8px 12px; font-size: 12px; color: #f87171; border-color: rgba(239,68,68,0.3);" onclick="window.disconnectTwitchAccount()">
                    Rozłącz
                </button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px;">
                <div style="font-size: 11px; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Obserwujący (Followers)</div>
                <div style="font-size: 20px; font-weight: 800; color: #fff; font-family: var(--font-mono); margin-top: 4px;">${Number(stats.followers).toLocaleString()}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px;">
                <div style="font-size: 11px; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Kategoria / Gra</div>
                <div style="font-size: 15px; font-weight: 700; color: #c084fc; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.gameName}">${c.gameName}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px;">
                <div style="font-size: 11px; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Status Transmisji</div>
                <div style="font-size: 15px; font-weight: 700; color: ${stats.isLive ? '#34d399' : '#94a3b8'}; margin-top: 6px;">${stats.isLive ? `Na Żywo (${stats.liveViewers})` : 'Offline'}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px;">
                <div style="font-size: 11px; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase;">Typ Konta</div>
                <div style="font-size: 15px; font-weight: 700; color: #fbbf24; margin-top: 6px; text-transform: capitalize;">${u.broadcasterType || 'Standard'}</div>
            </div>
        </div>
    `;
}
window.renderTwitchLiveDashboard = renderTwitchLiveDashboard;

function promptTwitchClientId() {
    const current = localStorage.getItem('twitch_client_id') || TWITCH_CONFIG.CLIENT_ID;
    const input = prompt('Podaj Twitch Client ID (z Twitch Developer Console):', current);
    if (input && input.trim()) {
        localStorage.setItem('twitch_client_id', input.trim());
        if (typeof showToast === 'function') {
            showToast('✓ Zapisano Twitch Client ID: ' + input.trim());
        }
        loginWithTwitch(input.trim());
    }
}
window.promptTwitchClientId = promptTwitchClientId;

function disconnectTwitchAccount() {
    localStorage.removeItem('twitch_token');
    localStorage.removeItem('twitch_access_token');
    localStorage.removeItem('twitch_stats_data');

    const user = typeof getApliHubUserData === 'function' ? getApliHubUserData() : {};
    if (user.connectedAccounts) {
        user.connectedAccounts.twitch = false;
        if (typeof saveApliHubUserData === 'function') saveApliHubUserData(user);
    }

    renderTwitchLiveDashboard(null);
    if (typeof renderAnalysisPanels === 'function') renderAnalysisPanels();
    if (typeof renderConnectedSocialAccounts === 'function') renderConnectedSocialAccounts();
    if (typeof showToast === 'function') {
        showToast('🔌 Rozłączono konto Twitch.');
    }
}
window.disconnectTwitchAccount = disconnectTwitchAccount;

/* ==========================================================================
   UNIVERSAL SOCIAL OAUTH ENGINE & PKCE CONTROLLER (TIKTOK, TWITCH, YOUTUBE, INSTAGRAM, FACEBOOK)
   ========================================================================== */

function generateRandomString(length = 64) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint8Array(length);
    if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(values);
        for (let i = 0; i < length; i++) {
            result += charset[values[i] % charset.length];
        }
    } else {
        for (let i = 0; i < length; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }
    }
    return result;
}

async function generateCodeChallenge(codeVerifier) {
    if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }
    return btoa(codeVerifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function getAppRedirectUri() {
    if (typeof window !== 'undefined') {
        if (window.location.hostname.includes('github.io')) {
            return 'https://vertisek.github.io/ApliHub/Algo%20analyzer/index.html';
        }
        return window.location.origin + window.location.pathname;
    }
    return 'http://localhost:54321/index.html';
}

const SOCIAL_OAUTH_CONFIGS = {
    tiktok: {
        id: 'tiktok',
        name: 'TikTok',
        color: '#00f2fe',
        iconSvg: `<svg width="42" height="42" viewBox="0 0 24 24" fill="#00f2fe">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.83.12V9.3a6.33 6.33 0 0 0-1-.08 6.34 6.34 0 1 0 6.34 6.34V9.05a8.3 8.3 0 0 0 5-1.63V6.69z"/>
        </svg>`,
        title: 'Połącz z kontem TikTok',
        desc: 'Połącz swoje konto na TikToku z aplikacją, aby korzystać z niej bez limitu!'
    },
    twitch: {
        id: 'twitch',
        name: 'Twitch',
        color: '#9146ff',
        iconSvg: `<svg width="42" height="42" viewBox="0 0 24 24" fill="#9146FF">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>`,
        title: 'Połącz z kontem Twitch',
        desc: 'Połącz swoje konto na Twitchu z aplikacją, aby korzystać z niej bez limitu!'
    },
    youtube: {
        id: 'youtube',
        name: 'YouTube',
        color: '#ff0000',
        iconSvg: `<svg width="42" height="42" viewBox="0 0 24 24" fill="#ff0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>`,
        title: 'Połącz z kontem YouTube',
        desc: 'Połącz swoje konto na YouTube z aplikacją, aby korzystać z niej bez limitu!'
    },
    instagram: {
        id: 'instagram',
        name: 'Instagram',
        color: '#e1306c',
        iconSvg: `<svg width="42" height="42" viewBox="0 0 24 24" fill="#e1306c">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>`,
        title: 'Połącz z kontem Instagram',
        desc: 'Połącz swoje konto na Instagramie z aplikacją, aby korzystać z niej bez limitu!'
    },
    facebook: {
        id: 'facebook',
        name: 'Facebook',
        color: '#1877f2',
        iconSvg: `<svg width="42" height="42" viewBox="0 0 24 24" fill="#1877f2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>`,
        title: 'Połącz z kontem Facebook',
        desc: 'Połącz swoje konto na Facebooku z aplikacją, aby korzystać z niej bez limitu!'
    }
};

let currentModalPlatformKey = 'tiktok';

async function openSocialConnectModal(platformKey) {
    if (isWebSimulation()) {
        if (typeof showToast === 'function') {
            showToast('💡 W symulatorze na stronie wszystkie platformy są już w pełni odblokowane do testowania!');
        }
        return;
    }

    const pKey = platformKey ? platformKey.toLowerCase() : 'tiktok';
    const config = SOCIAL_OAUTH_CONFIGS[pKey] || SOCIAL_OAUTH_CONFIGS.tiktok;
    currentModalPlatformKey = config.id;

    const modal = document.getElementById('social-connect-modal');
    if (!modal) return;

    const titleEl = document.getElementById('modal-platform-title');
    const descEl = document.getElementById('modal-platform-desc');
    const iconEl = document.getElementById('modal-platform-icon');
    const btnTextEl = document.getElementById('modal-btn-text');

    if (titleEl) titleEl.textContent = config.title;
    if (descEl) descEl.textContent = config.desc;
    if (iconEl) iconEl.innerHTML = config.iconSvg;
    if (btnTextEl) btnTextEl.textContent = 'Kontynuuj';

    modal.style.display = 'flex';
}

function closeSocialConnectModal() {
    const modal = document.getElementById('social-connect-modal');
    if (modal) modal.style.display = 'none';
}

function handleSocialConnectConfirm() {
    const pKey = currentModalPlatformKey || 'tiktok';
    const config = SOCIAL_OAUTH_CONFIGS[pKey] || { name: pKey.toUpperCase() };

    const currentUser = getApliHubUserData();
    if (!currentUser.connectedAccounts) currentUser.connectedAccounts = {};
    currentUser.connectedAccounts[pKey] = true;
    saveApliHubUserData(currentUser);

    if (typeof AlgoSoundFX !== 'undefined' && AlgoSoundFX.playConnectSuccess) {
        AlgoSoundFX.playConnectSuccess();
    }

    if (pKey === 'twitch') {
        localStorage.setItem('twitch_token', 'desktop_auth_token_' + Date.now());
        if (typeof fetchTwitchChannelStats === 'function') fetchTwitchChannelStats();
    }

    renderAnalysisPanels();
    renderConnectedSocialAccounts();
    renderSocialTrendHubs();
    closeSocialConnectModal();

    if (typeof showToast === 'function') {
        showToast(`🎉 Pomyślnie połączono konto ${config.name}! Panel analizy został odblokowany.`);
    }
}

// Global click outside modal to close
window.addEventListener('click', (e) => {
    const modal = document.getElementById('social-connect-modal') || document.getElementById('twitch-modal');
    if (e.target === modal) {
        closeSocialConnectModal();
    }
});

// Automatic OAuth Callback parser across all platforms
function handleGlobalOAuthCallbacks() {
    // 1. Check token hash (#access_token=...)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
        const cleanHash = hash.replace(/^#/, '');
        const params = new URLSearchParams(cleanHash.startsWith('?') ? cleanHash : '?' + cleanHash);
        const token = params.get('access_token');
        const state = params.get('state') || '';

        if (token) {
            let platformKey = 'twitch';
            if (state.includes('youtube') || hash.includes('youtube')) platformKey = 'youtube';

            localStorage.setItem(`${platformKey}_token`, token);
            localStorage.setItem(`${platformKey}_access_token`, token);

            const user = getApliHubUserData();
            if (!user.connectedAccounts) user.connectedAccounts = {};
            user.connectedAccounts[platformKey] = true;
            saveApliHubUserData(user);

            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, null, window.location.pathname + window.location.search);
            }

            if (typeof showToast === 'function') {
                showToast(`🎉 Pomyślnie autoryzowano konto ${platformKey.toUpperCase()}!`);
            }

            if (platformKey === 'twitch' && typeof fetchTwitchChannelStats === 'function') {
                fetchTwitchChannelStats();
            }

            renderAnalysisPanels();
            renderConnectedSocialAccounts();
        }
    }

    // 2. Check query params code (?code=... or ?connected=...)
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const connectedPlatform = searchParams.get('connected');

    if (code) {
        // Find which platform was in state
        let detectedPlatform = 'tiktok';
        if (state && state === sessionStorage.getItem('tiktok_oauth_state')) detectedPlatform = 'tiktok';
        else if (window.location.href.includes('instagram')) detectedPlatform = 'instagram';

        const user = getApliHubUserData();
        if (!user.connectedAccounts) user.connectedAccounts = {};
        user.connectedAccounts[detectedPlatform] = true;
        saveApliHubUserData(user);

        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, window.location.pathname);
        }

        if (typeof showToast === 'function') {
            showToast(`🎉 Pomyślnie powiązano konto ${detectedPlatform.toUpperCase()}! Kod autoryzacji odebrany.`);
        }

        renderAnalysisPanels();
        renderConnectedSocialAccounts();
    } else if (connectedPlatform && SOCIAL_OAUTH_CONFIGS[connectedPlatform.toLowerCase()]) {
        const user = getApliHubUserData();
        if (!user.connectedAccounts) user.connectedAccounts = {};
        user.connectedAccounts[connectedPlatform.toLowerCase()] = true;
        saveApliHubUserData(user);

        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, window.location.pathname);
        }

        renderAnalysisPanels();
        renderConnectedSocialAccounts();
    }
}

// Global initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        handleGlobalOAuthCallbacks();
        renderAnalysisPanels();
        renderConnectedSocialAccounts();
    });
} else {
    handleGlobalOAuthCallbacks();
    renderAnalysisPanels();
    renderConnectedSocialAccounts();
}

// Backwards compatibility and window exports
window.openSocialConnectModal = openSocialConnectModal;
window.closeSocialConnectModal = closeSocialConnectModal;
window.toggleModalDevConfig = toggleModalDevConfig;
window.handleClientIdInput = handleClientIdInput;
window.copyRedirectUri = copyRedirectUri;
window.handleManualSimulatedConnect = handleManualSimulatedConnect;
window.openTwitchModal = () => openSocialConnectModal('twitch');
window.closeTwitchModal = closeSocialConnectModal;
window.SOCIAL_OAUTH_CONFIGS = SOCIAL_OAUTH_CONFIGS;



