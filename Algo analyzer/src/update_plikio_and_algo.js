const fs = require('fs');
const path = require('path');

const apliHubDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(apliHubDir, 'Fast Konwerter');

console.log('ApliHub dir:', apliHubDir);
console.log('Algo dir:', algoDir);
console.log('Konw dir:', konwDir);

// 1. UPDATE index.html (Main Hub)
const hubIndexPath = path.resolve(apliHubDir, 'index.html');
if (fs.existsSync(hubIndexPath)) {
  let content = fs.readFileSync(hubIndexPath, 'utf8');
  content = content.replace(/⚡ Fast\s+Konwerter/g, '⚡ Plikio');
  content = content.replace(/Fast Konwerter/g, 'Plikio');
  fs.writeFileSync(hubIndexPath, content, 'utf8');
  console.log('[1/5] Updated Main Hub index.html');
}

// 2. UPDATE js/data.js
const dataJsPath = path.resolve(apliHubDir, 'js/data.js');
if (fs.existsSync(dataJsPath)) {
  let content = fs.readFileSync(dataJsPath, 'utf8');
  content = content.replace(/name:\s*"Fast Konwerter"/g, 'name: "Plikio"');
  content = content.replace(/Pobierz film lub piosenkę z YouTube, TikToka albo Instagrama/g, 'Pobierz film lub piosenkę z YouTube, TikToka, Facebooka albo Instagrama');
  fs.writeFileSync(dataJsPath, content, 'utf8');
  console.log('[2/5] Updated js/data.js');
}

// 3. UPDATE js/main.js
const mainJsPath = path.resolve(apliHubDir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
  let content = fs.readFileSync(mainJsPath, 'utf8');
  content = content.replace(/Fast Konwerter v1\.2\.0 \(ReTrap YouTube Studio & Extension\)/g, 'Plikio v1.2.0 (Studio Konwersji & Wtyczka)');
  content = content.replace(/Pobierz \.EXE \(Fast Konwerter\)/g, 'Pobierz .EXE (Plikio)');
  content = content.replace(/Pobierz Instalator Fast Konwerter \(\.exe\)/g, 'Pobierz Instalator Plikio (.exe)');
  content = content.replace(/item\.name\.includes\('Fast Konwerter'\)/g, "(item.name.includes('Plikio') || item.name.includes('Fast Konwerter'))");
  content = content.replace(/m\.in\. Algo Analyzer, Fast Konwerter,/g, 'm.in. Algo Analyzer, Plikio,');
  fs.writeFileSync(mainJsPath, content, 'utf8');
  console.log('[3/5] Updated js/main.js');
}

// 4. UPDATE Fast Konwerter / Plikio index.html
const konwIndexPath = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwIndexPath)) {
  let content = fs.readFileSync(konwIndexPath, 'utf8');
  
  // Title & Brand
  content = content.replace(/<title>.*?<\/title>/, '<title>Plikio - Twój Szybki i Darmowy Konwerter</title>');
  content = content.replace(/<span class="brand-name">FAST KONWERTER<\/span>/g, '<span class="brand-name">PLIKIO</span>');
  
  // Navigation tab "Jak działa?"
  content = content.replace(/<button class="nav-tab-btn" data-tab="tab-extension-sim">Symulator Wtyczki<\/button>/g, '<button class="nav-tab-btn" data-tab="tab-extension-sim">Jak działa?</button>');
  
  // Description with Facebook
  content = content.replace(/<p>Wklej link z YouTube, TikToka lub Instagrama, wybierz format i pobierz gotowy plik\.<\/p>/g, '<p>Wklej link z YouTube, TikToka, Facebooka lub Instagrama, wybierz format i pobierz gotowy plik.</p>');
  
  // Simulator title
  content = content.replace(/<h1>Symulator Wtyczki na Social Mediach<\/h1>/g, '<h1>Jak działa Plikio na Social Mediach</h1>');
  content = content.replace(/<p>Wybierz platformę i zobacz jak przyjemny przycisk techno integruje się bezpośrednio pod postami i filmami\.<\/p>/g, '<p>Wybierz platformę i zobacz jak przyjemny przycisk integruje się bezpośrednio pod postami i filmami.</p>');
  
  // Modal title
  content = content.replace(/ReTrap konwerter/g, 'Plikio konwerter');
  content = content.replace(/Fast Konwerter/g, 'Plikio');
  
  // Webstore title & Guide
  content = content.replace(/Pobierz i wgraj darmowy konwerter do swojej przeglądarki!/g, 'Pobierz i wgraj darmowy konwerter Plikio do swojej przeglądarki!');
  content = content.replace(/Instrukcja wgrania konwertera do przeglądarki/g, 'Instrukcja wgrania Plikio do przeglądarki');
  
  fs.writeFileSync(konwIndexPath, content, 'utf8');
  console.log('[4/5] Updated Fast Konwerter/index.html (Plikio)');
}

// 5. UPDATE Fast Konwerter / Plikio converter-app.js
const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');
if (fs.existsSync(konwJsPath)) {
  let content = fs.readFileSync(konwJsPath, 'utf8');
  content = content.replace(/Fast Konwerter/g, 'Plikio');
  content = content.replace(/ReTrap_/g, 'Plikio_');
  fs.writeFileSync(konwJsPath, content, 'utf8');
  console.log('[5/5] Updated Fast Konwerter/js/converter-app.js');
}

console.log('[SUCCESS] Core Plikio updates successfully executed.');
