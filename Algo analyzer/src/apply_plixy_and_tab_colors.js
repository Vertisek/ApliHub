const fs = require('fs');
const path = require('path');

const apliHubDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(apliHubDir, 'Fast Konwerter');

console.log('Applying Plixy rename and colorful social tab enhancements...');

// 1. UPDATE index.html (Main Hub)
const hubIndexPath = path.resolve(apliHubDir, 'index.html');
if (fs.existsSync(hubIndexPath)) {
  let content = fs.readFileSync(hubIndexPath, 'utf8');
  content = content.replace(/⚡ Plikio/g, '⚡ Plixy');
  content = content.replace(/Plikio/g, 'Plixy');
  fs.writeFileSync(hubIndexPath, content, 'utf8');
  console.log('[1/5] Updated Main Hub index.html (Plixy)');
}

// 2. UPDATE js/data.js
const dataJsPath = path.resolve(apliHubDir, 'js/data.js');
if (fs.existsSync(dataJsPath)) {
  let content = fs.readFileSync(dataJsPath, 'utf8');
  content = content.replace(/name:\s*"Plikio"/g, 'name: "Plixy"');
  content = content.replace(/name:\s*"Fast Konwerter"/g, 'name: "Plixy"');
  content = content.replace(/Pobierz film lub piosenkę z YouTube, TikToka albo Instagrama/g, 'Pobierz film lub piosenkę z YouTube, TikToka, Facebooka albo Instagrama');
  content = content.replace(/Pobierz film lub piosenkę z YouTube, TikToka, Facebooka albo Instagrama/g, 'Pobierz film lub piosenkę z YouTube, TikToka, Facebooka albo Instagrama');
  fs.writeFileSync(dataJsPath, content, 'utf8');
  console.log('[2/5] Updated js/data.js (Plixy)');
}

// 3. UPDATE js/main.js
const mainJsPath = path.resolve(apliHubDir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
  let content = fs.readFileSync(mainJsPath, 'utf8');
  content = content.replace(/Plikio v1\.2\.0/g, 'Plixy v1.2.0');
  content = content.replace(/Pobierz \.EXE \(Plikio\)/g, 'Pobierz .EXE (Plixy)');
  content = content.replace(/Pobierz Instalator Plikio \(\.exe\)/g, 'Pobierz Instalator Plixy (.exe)');
  content = content.replace(/item\.name\.includes\('Plikio'\)/g, "(item.name.includes('Plixy') || item.name.includes('Plikio') || item.name.includes('Fast Konwerter'))");
  content = content.replace(/m\.in\. Algo Analyzer, Plikio,/g, 'm.in. Algo Analyzer, Plixy,');
  fs.writeFileSync(mainJsPath, content, 'utf8');
  console.log('[3/5] Updated js/main.js (Plixy)');
}

// 4. UPDATE Fast Konwerter / Plixy index.html
const konwIndexPath = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwIndexPath)) {
  let content = fs.readFileSync(konwIndexPath, 'utf8');
  
  // Title & Brand
  content = content.replace(/<title>.*?<\/title>/, '<title>Plixy - Twój Szybki i Darmowy Konwerter</title>');
  content = content.replace(/<span class="brand-name">PLIKIO<\/span>/g, '<span class="brand-name">PLIXY</span>');
  content = content.replace(/<span class="brand-name">FAST KONWERTER<\/span>/g, '<span class="brand-name">PLIXY</span>');
  
  // Navigation tab "Jak działa?"
  content = content.replace(/<button class="nav-tab-btn" data-tab="tab-extension-sim">.*?<\/button>/, '<button class="nav-tab-btn" data-tab="tab-extension-sim">Jak działa?</button>');
  
  // Description with Facebook
  content = content.replace(/<p>Wklej link z YouTube, TikToka lub Instagrama, wybierz format i pobierz gotowy plik\.<\/p>/g, '<p>Wklej link z YouTube, TikToka, Facebooka lub Instagrama, wybierz format i pobierz gotowy plik.</p>');
  content = content.replace(/<p>Wklej link z YouTube, TikToka, Facebooka lub Instagrama, wybierz format i pobierz gotowy plik\.<\/p>/g, '<p>Wklej link z YouTube, TikToka, Facebooka lub Instagrama, wybierz format i pobierz gotowy plik.</p>');
  
  // Simulator title
  content = content.replace(/<h1>Jak działa Plikio na Social Mediach<\/h1>/g, '<h1>Jak działa Plixy na Social Mediach</h1>');
  content = content.replace(/<h1>Symulator Wtyczki na Social Mediach<\/h1>/g, '<h1>Jak działa Plixy na Social Mediach</h1>');
  
  // Modal title
  content = content.replace(/Plikio konwerter/g, 'Plixy konwerter');
  content = content.replace(/ReTrap konwerter/g, 'Plixy konwerter');
  
  // Webstore title & Guide
  content = content.replace(/Pobierz i wgraj darmowy konwerter Plikio do swojej przeglądarki!/g, 'Pobierz i wgraj darmowy konwerter Plixy do swojej przeglądarki!');
  content = content.replace(/Instrukcja wgrania Plikio do przeglądarki/g, 'Instrukcja wgrania Plixy do przeglądarki');
  
  fs.writeFileSync(konwIndexPath, content, 'utf8');
  console.log('[4/5] Updated Fast Konwerter/index.html (Plixy)');
}

// 5. UPDATE Fast Konwerter / Plixy converter-app.js
const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');
if (fs.existsSync(konwJsPath)) {
  let content = fs.readFileSync(konwJsPath, 'utf8');
  content = content.replace(/Plikio/g, 'Plixy');
  content = content.replace(/Plikio_/g, 'Plixy_');
  fs.writeFileSync(konwJsPath, content, 'utf8');
  console.log('[5/5] Updated Fast Konwerter/js/converter-app.js (Plixy)');
}

// 6. ENHANCE SIDEBAR TABS IN Algo Analyzer css/style.css WITH DISTINCT PLEASANT COLORS
const algoCssPath = path.resolve(algoDir, 'css/style.css');
if (fs.existsSync(algoCssPath)) {
  let css = fs.readFileSync(algoCssPath, 'utf8');
  
  // Add vibrant and pleasant styling for individual tabs
  const tabSpecificStyles = `
/* ==========================================================================
   VIBRANT & DISTINCT SOCIAL MEDIA TABS (YOUTUBE, TIKTOK, INSTAGRAM, ETC.)
   ========================================================================== */
.tab-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    text-align: left;
    width: 100%;
    margin-bottom: 3px;
    border: 1px solid transparent;
}

/* Tab 1: YouTube - Warm Radiant Red */
.tab-btn[data-target="tab-youtube"] {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.22);
    color: #fca5a5;
}
.tab-btn[data-target="tab-youtube"] svg {
    stroke: #ef4444;
    filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.4));
}
.tab-btn[data-target="tab-youtube"]:hover {
    background: rgba(239, 68, 68, 0.16);
    border-color: rgba(239, 68, 68, 0.5);
    color: #ffffff;
    transform: translateX(4px);
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.2);
}
.tab-btn[data-target="tab-youtube"].active {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.28), rgba(185, 28, 28, 0.35));
    border-color: #ef4444;
    color: #ffffff;
    box-shadow: 0 4px 18px rgba(239, 68, 68, 0.35);
}
.tab-btn[data-target="tab-youtube"].active svg {
    stroke: #ff4d4d;
    fill: rgba(239, 68, 68, 0.2);
}

/* Tab 2: TikTok - Vibrant Electric Cyan */
.tab-btn[data-target="tab-tiktok"] {
    background: rgba(6, 182, 212, 0.08);
    border-color: rgba(6, 182, 212, 0.22);
    color: #67e8f9;
}
.tab-btn[data-target="tab-tiktok"] svg {
    stroke: #06b6d4;
    filter: drop-shadow(0 0 4px rgba(6, 182, 212, 0.4));
}
.tab-btn[data-target="tab-tiktok"]:hover {
    background: rgba(6, 182, 212, 0.16);
    border-color: rgba(6, 182, 212, 0.5);
    color: #ffffff;
    transform: translateX(4px);
    box-shadow: 0 4px 14px rgba(6, 182, 212, 0.2);
}
.tab-btn[data-target="tab-tiktok"].active {
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.28), rgba(14, 116, 144, 0.35));
    border-color: #06b6d4;
    color: #ffffff;
    box-shadow: 0 4px 18px rgba(6, 182, 212, 0.35);
}
.tab-btn[data-target="tab-tiktok"].active svg {
    stroke: #22d3ee;
    fill: rgba(6, 182, 212, 0.2);
}

/* Tab 3: Instagram - Rich Radiant Magenta / Pink */
.tab-btn[data-target="tab-instagram"] {
    background: rgba(236, 72, 153, 0.08);
    border-color: rgba(236, 72, 153, 0.22);
    color: #f472b6;
}
.tab-btn[data-target="tab-instagram"] svg {
    stroke: #ec4899;
    filter: drop-shadow(0 0 4px rgba(236, 72, 153, 0.4));
}
.tab-btn[data-target="tab-instagram"]:hover {
    background: rgba(236, 72, 153, 0.16);
    border-color: rgba(236, 72, 153, 0.5);
    color: #ffffff;
    transform: translateX(4px);
    box-shadow: 0 4px 14px rgba(236, 72, 153, 0.2);
}
.tab-btn[data-target="tab-instagram"].active {
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.28), rgba(190, 24, 93, 0.35));
    border-color: #ec4899;
    color: #ffffff;
    box-shadow: 0 4px 18px rgba(236, 72, 153, 0.35);
}
.tab-btn[data-target="tab-instagram"].active svg {
    stroke: #f472b6;
    fill: rgba(236, 72, 153, 0.2);
}

/* Tab 4: Facebook - Royal Blue */
.tab-btn[data-target="tab-facebook"] {
    background: rgba(59, 130, 246, 0.08);
    border-color: rgba(59, 130, 246, 0.22);
    color: #93c5fd;
}
.tab-btn[data-target="tab-facebook"] svg {
    stroke: #3b82f6;
    filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));
}
.tab-btn[data-target="tab-facebook"]:hover {
    background: rgba(59, 130, 246, 0.16);
    border-color: rgba(59, 130, 246, 0.5);
    color: #ffffff;
    transform: translateX(4px);
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.2);
}
.tab-btn[data-target="tab-facebook"].active {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.28), rgba(29, 78, 216, 0.35));
    border-color: #3b82f6;
    color: #ffffff;
    box-shadow: 0 4px 18px rgba(59, 130, 246, 0.35);
}
.tab-btn[data-target="tab-facebook"].active svg {
    stroke: #60a5fa;
    fill: rgba(59, 130, 246, 0.2);
}

/* Tab 5: Twitch - Vibrant Purple */
.tab-btn[data-target="tab-twitch"] {
    background: rgba(168, 85, 247, 0.08);
    border-color: rgba(168, 85, 247, 0.22);
    color: #d8b4fe;
}
.tab-btn[data-target="tab-twitch"] svg {
    stroke: #a855f7;
    filter: drop-shadow(0 0 4px rgba(168, 85, 247, 0.4));
}
.tab-btn[data-target="tab-twitch"]:hover {
    background: rgba(168, 85, 247, 0.16);
    border-color: rgba(168, 85, 247, 0.5);
    color: #ffffff;
    transform: translateX(4px);
    box-shadow: 0 4px 14px rgba(168, 85, 247, 0.2);
}
.tab-btn[data-target="tab-twitch"].active {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.28), rgba(126, 34, 206, 0.35));
    border-color: #a855f7;
    color: #ffffff;
    box-shadow: 0 4px 18px rgba(168, 85, 247, 0.35);
}
.tab-btn[data-target="tab-twitch"].active svg {
    stroke: #c084fc;
    fill: rgba(168, 85, 247, 0.2);
}

/* Tab 6: Analiza - Warm Amber / Gold */
.tab-btn[data-target="tab-analiza"] {
    background: rgba(245, 158, 11, 0.08);
    border-color: rgba(245, 158, 11, 0.22);
    color: #fcd34d;
    margin-top: 8px;
}
.tab-btn[data-target="tab-analiza"] svg {
    stroke: #f59e0b;
    filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.4));
}
.tab-btn[data-target="tab-analiza"]:hover {
    background: rgba(245, 158, 11, 0.16);
    border-color: rgba(245, 158, 11, 0.5);
    color: #ffffff;
    transform: translateX(4px);
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.2);
}
.tab-btn[data-target="tab-analiza"].active {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.28), rgba(180, 83, 9, 0.35));
    border-color: #f59e0b;
    color: #ffffff;
    box-shadow: 0 4px 18px rgba(245, 158, 11, 0.35);
}
.tab-btn[data-target="tab-analiza"].active svg {
    stroke: #fbbf24;
}
`;

  // Replace default tab-btn styles with the rich vibrant ones
  if (css.includes('/* Sidebar Navigation Buttons */')) {
    css = css.replace(/\/\* Sidebar Navigation Buttons \*\/[\s\S]*?\/\* Main Content Area \*\//, tabSpecificStyles + '\n/* Main Content Area */');
  } else {
    css += tabSpecificStyles;
  }
  
  fs.writeFileSync(algoCssPath, css, 'utf8');
  console.log('[6/6] Enhanced Algo Analyzer css/style.css with colorful vibrant social tabs');
}

console.log('[SUCCESS] All updates applied successfully.');
