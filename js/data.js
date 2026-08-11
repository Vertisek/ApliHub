/* ==========================================================================
   ApliHub Central Data & Persistent State Store (localStorage Sync)
   ========================================================================== */

const SUPABASE_URL = 'https://ztpwvskfanhikbifjlzf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cHd2c2tmYW5oaWtiaWZqbHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDg2MDksImV4cCI6MjEwMTQ4NDYwOX0.6XwXzP9DbUFliwRgr8HA2hBexYIJns6J6-9fxRyMSfM';

function getSupabaseClient() {
  if (!window.supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.error('Error initializing Supabase:', e);
    }
  }
  return window.supabaseClient || null;
}

const DEFAULT_USER_STORE = {
  isLoggedIn: true,
  name: "Oskar_Algo",
  email: "oskar@aplihub.pl",
  password: "password123",
  avatar: "O",
  selectedAvatar: "O",
  accountType: "PRO VIP",
  isVerified: false,
  joinedDate: "01.08.2026 r.",
  settings: {
    darkMode: true,
    soundEnabled: true,
    soundVolume: 50,
    emailNotifications: true,
    downloadPath: "C:\\Users\\oskar\\Downloads\\ApliHub"
  }
};

// Helper to get persistent user data
function getApliHubUserData() {
  try {
    const isLoggedOut = localStorage.getItem('aplihub_logged_out') === 'true';
    if (isLoggedOut) {
      return { ...DEFAULT_USER_STORE, isLoggedIn: false, name: 'Gość', email: '' };
    }
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
    if (updatedData && updatedData.isLoggedIn === false) {
      localStorage.setItem('aplihub_logged_out', 'true');
    } else {
      localStorage.removeItem('aplihub_logged_out');
    }
    localStorage.setItem('aplihub_user_store', JSON.stringify(updatedData));
    APLIHUB_DATA.user = updatedData;
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new CustomEvent('aplihub_user_updated', { detail: updatedData }));
  } catch (e) {
    console.error('Error saving user store:', e);
  }
}

// Registered users management helpers
function getApliHubRegisteredUsers() {
  try {
    const saved = localStorage.getItem('aplihub_registered_users');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading registered users:', e);
  }
  return {};
}

function registerApliHubUser(user) {
  try {
    const users = getApliHubRegisteredUsers();
    const key = user.email.toLowerCase().trim();
    users[key] = {
      username: user.username,
      name: user.name || user.username,
      email: user.email,
      password: user.password,
      avatar: (user.name || user.username || 'U')[0].toUpperCase(),
      selectedAvatar: (user.name || user.username || 'U')[0].toUpperCase(),
      accountType: 'Użytkownik',
      isVerified: true,
      joinedDate: new Date().toLocaleDateString('pl-PL')
    };
    localStorage.setItem('aplihub_registered_users', JSON.stringify(users));
    return users[key];
  } catch (e) {
    console.error('Error registering user:', e);
  }
  return null;
}

function updateApliHubPassword(email, newPassword) {
  try {
    const users = getApliHubRegisteredUsers();
    const key = email.toLowerCase().trim();
    if (users[key]) {
      users[key].password = newPassword;
      localStorage.setItem('aplihub_registered_users', JSON.stringify(users));
      return true;
    }
  } catch (e) {
    console.error('Error updating password:', e);
  }
  return false;
}

function isEmailRegistered(email) {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  if (DEFAULT_USER_STORE.email && DEFAULT_USER_STORE.email.toLowerCase() === cleanEmail) {
    return true;
  }
  const users = getApliHubRegisteredUsers();
  return !!users[cleanEmail];
}

function isUsernameTaken(username) {
  if (!username) return false;
  const cleanUser = username.toLowerCase().trim();
  if (DEFAULT_USER_STORE.name && DEFAULT_USER_STORE.name.toLowerCase() === cleanUser) {
    return true;
  }
  const users = getApliHubRegisteredUsers();
  return Object.values(users).some(u =>
    (u.username && u.username.toLowerCase().trim() === cleanUser) ||
    (u.name && u.name.toLowerCase().trim() === cleanUser)
  );
}

const APLIHUB_DATA = {
  user: getApliHubUserData(),

  apps: [
    {
      id: "app-1",
      name: "Algo Analyzer",
      category: "Social Media",
      badge: "Aplikacja",
      icon: "📊",
      desc: "Zaawansowany analizer algorytmu YouTube oraz innych social mediów. Przeanalizuj zachowanie algorytmu i określ jak mniej więcej z nim pracować.",
      version: "v1.0.0",
      size: "2.8 MB",
      downloads: "14,200",
      rating: "5.0★",
      type: "app",
      system: "Windows / macOS"
    }
  ],

  plugins: [
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
      id: "imp-copyright",
      title: "Prawa Autorskie & Licencja © ApliHub",
      desc: "Dowiedz się więcej o prawach autorskich strony, aplikacji oraz wtyczek.",
      icon: "📜",
      action: "copyright"
    },
    {
      id: "imp-bugs",
      title: "Zgłaszanie błędów i propozycji",
      desc: "Zauważyłeś błąd lub masz pomysł na nową funkcję? Daj nam znać przez specjalny formularz.",
      icon: "💬",
      action: "bugs-proposals"
    },
    {
      id: "imp-contact",
      title: "Skontaktuj się z nami",
      desc: "Jeżeli potrzebujesz większej pomocy lub chcesz nawiązać współpracę napisz do nas.",
      icon: "📬",
      action: "contact-admins"
    },
    {
      id: "imp-privacy",
      title: "Polityka prywatności i bezpieczeństwo",
      desc: "Dowiedz się więcej o prywatności i bezpieczeństwie na stronie.",
      icon: "🔒",
      action: "privacy"
    }
  ]
};
// --- KOD NA SAMYM KOŃCU PLIKU ---

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnRegister = document.getElementById('btn-register');
const authContainer = document.getElementById('auth-container');
const otpContainer = document.getElementById('otp-container');
const otpCodeInput = document.getElementById('otp-code');
const btnVerify = document.getElementById('btn-verify');
const authMessage = document.getElementById('auth-message'); // Element na komunikaty (jeśli go używasz)

let pendingEmail = '';

// 1. Rejestracja
if (btnRegister) {
  btnRegister.addEventListener('click', async () => {
    const email = emailInput ? emailInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
      alert('Wpisz e-mail i hasło!');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      // Wyświetlanie czytelnego błędu w alercie lub na stronie
      const msg = 'Błąd rejestracji Supabase: ' + error.message;
      if (authMessage) authMessage.textContent = msg;
      else alert(msg);
    } else {
      pendingEmail = email;
      if (authContainer) authContainer.style.display = 'none';
      if (otpContainer) otpContainer.style.display = 'block';
      alert('Wysłano kod weryfikacyjny na Twój e-mail!');
    }
  });
}

// 2. Weryfikacja kodu OTP
if (btnVerify) {
  btnVerify.addEventListener('click', async () => {
    const token = otpCodeInput ? otpCodeInput.value : '';

    if (!token) {
      alert('Wpisz kod z e-maila!');
      return;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token: token,
      type: 'signup'
    });

    if (error) {
      alert('Błędny kod lub kod wygasł: ' + error.message);
    } else {
      alert('Konto aktywowane! Jesteś zalogowany.');
      if (otpContainer) otpContainer.style.display = 'none';
    }
  });
}

