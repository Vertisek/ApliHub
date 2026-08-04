/* ==========================================================================
   ApliHub Central Data & Persistent State Store (localStorage Sync)
   ========================================================================== */

const DEFAULT_USER_STORE = {
  name: "Oskar_Algo",
  email: "oskar@aplihub.pl",
  password: "password123",
  avatar: "O",
  selectedAvatar: "default", // 'default' | 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'twitch'
  accountType: "PRO VIP",
  connectedAccounts: {
    youtube: true,
    tiktok: false,
    instagram: true,
    facebook: false,
    twitch: false
  },
  settings: {
    autoUpdate: true,
    darkMode: true,
    notifications: true,
    downloadPath: "C:\\Users\\oskar\\Downloads\\ApliHub"
  }
};

// Helper to get persistent user data
function getApliHubUserData() {
  try {
    const saved = localStorage.getItem('aplihub_user_store');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_USER_STORE, ...parsed };
    }
  } catch (e) {
    console.error('Error loading user store:', e);
  }
  return { ...DEFAULT_USER_STORE };
}

// Helper to save persistent user data
function saveApliHubUserData(updatedData) {
  try {
    localStorage.setItem('aplihub_user_store', JSON.stringify(updatedData));
    APLIHUB_DATA.user = updatedData;
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new CustomEvent('aplihub_user_updated', { detail: updatedData }));
  } catch (e) {
    console.error('Error saving user store:', e);
  }
}

const APLIHUB_DATA = {
  user: getApliHubUserData(),
  
  apps: [],

  plugins: [
    {
      id: "plug-1",
      name: "Algo Analyzer",
      category: "Social Media",
      badge: "Nowość",
      icon: "📊",
      desc: "Zaawansowany analizer algorytmu YouTube oraz innych social mediów. Przeanalizuj zachowanie algorytmu i określ jak mniej więcej z nim pracować.",
      version: "v1.0.0",
      size: "2.8 MB",
      downloads: "14,200",
      rating: "5.0★",
      type: "plugin",
      browser: "Chrome / Edge / Brave"
    },
    {
      id: "plug-2",
      name: "Fast Konwerter",
      category: "Multimedia",
      badge: "Popularne",
      icon: "⚡",
      desc: "Prosty w obsłudze konwerter do social mediów. Pobierz film lub piosenkę z YouTube, TikToka albo Instagrama do pliku WAV, MP4 LUB MP3 jednym kliknięciem.",
      version: "v1.2.0",
      size: "3.5 MB",
      downloads: "32,500",
      rating: "4.9★",
      type: "plugin",
      browser: "Wszystkie przeglądarki"
    },
    {
      id: "plug-3",
      name: "Ofertomat",
      category: "Wyszukiwarka",
      badge: "Niezbędnik",
      icon: "🏷️",
      desc: "Najprostsze wyszukiwanie najlepszych ofert tego, czego potrzebujesz. Wpisz nazwę przedmiotu, a my zajmiemy się resztą.",
      version: "v1.1.0",
      size: "1.9 MB",
      downloads: "18,900",
      rating: "4.8★",
      type: "plugin",
      browser: "Chrome / Firefox / Edge"
    },
    {
      id: "plug-4",
      name: "Theme Injector",
      category: "Personalizacja",
      badge: "Personalizacja",
      icon: "🎨",
      desc: "Dopasuj motyw każdej strony z osobna pod siebie tak, aby przyjemniej przeglądało ci się internet.",
      version: "v2.0.1",
      size: "1.4 MB",
      downloads: "21,300",
      rating: "4.9★",
      type: "plugin",
      browser: "Chrome / Firefox / Edge"
    }
  ],

  news: [
    {
      id: "news-1",
      date: "29 Lipca 2026",
      title: "Oficjalny Start Platformy ApliHub v1.0",
      content: "Z radością prezentujemy oficjalne wydanie ApliHub! Oddajemy w Wasze ręce zbiór autorskich wtyczek i aplikacji stworzonych z myślą o maksymalnej wydajności i komforcie pracy."
    },
    {
      id: "news-2",
      date: "25 Lipca 2026",
      title: "Aktualizacja WebCleaner Turbo do wersji 4.0",
      content: "Nowy silnik filtrujący zmniejsza zużycie pamięci RAM o 35% oraz wprowadza natychmiastowe blokowanie skryptów śledzących nowej generacji."
    },
    {
      id: "news-3",
      date: "18 Lipca 2026",
      title: "Nadchodzi SmartReader AI – Asystent przeglądania",
      content: "Przeprowadzamy zamknięte testy nowej wtyczki wykorzystującej modele AI do błyskawicznej analizy artykułów i tworzenia notatek."
    }
  ],

  important: [
    {
      title: "Instrukcja instalacji wtyczek w Chrome / Edge",
      desc: "Jak ręcznie załadować rozszerzenie w trybie deweloperskim krok po kroku.",
      icon: "📘"
    },
    {
      title: "Wymagania systemowe aplikacji",
      desc: "Sprawdź kompatybilność swoich systemów Windows 10/11 oraz macOS.",
      icon: "🖥️"
    },
    {
      title: "Polityka prywatności i bezpieczeństwo",
      desc: "Wszystkie nasze narzędzia działają lokalnie i nie zbierają danych osobowych.",
      icon: "🔒"
    },
    {
      title: "Zgłaszanie błędów i propozycji",
      desc: "Masz pomysł na nową wtyczkę? Skontaktuj się z nami przez formularz zgłoszeniowy.",
      icon: "💬"
    }
  ]
};
