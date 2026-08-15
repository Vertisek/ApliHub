const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(rootDir, 'Fast Konwerter');

const ts = Date.now();
console.log(`Bumping cache buster timestamps to: ${ts}`);

// 1. Root index.html
const rootIndex = path.resolve(rootDir, 'index.html');
if (fs.existsSync(rootIndex)) {
  let html = fs.readFileSync(rootIndex, 'utf8');
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/css\/animations\.css(\?v=[\w\d_.-]+)?/g, `css/animations.css?v=${ts}`);
  html = html.replace(/js\/data\.js(\?v=[\w\d_.-]+)?/g, `js/data.js?v=${ts}`);
  html = html.replace(/js\/i18n\.js(\?v=[\w\d_.-]+)?/g, `js/i18n.js?v=${ts}`);
  html = html.replace(/js\/particles\.js(\?v=[\w\d_.-]+)?/g, `js/particles.js?v=${ts}`);
  html = html.replace(/js\/profile\.js(\?v=[\w\d_.-]+)?/g, `js/profile.js?v=${ts}`);
  html = html.replace(/js\/main\.js(\?v=[\w\d_.-]+)?/g, `js/main.js?v=${ts}`);
  fs.writeFileSync(rootIndex, html, 'utf8');
  console.log('Updated root index.html cache busters');
}

// 2. Algo analyzer/index.html
const algoIndex = path.resolve(algoDir, 'index.html');
if (fs.existsSync(algoIndex)) {
  let html = fs.readFileSync(algoIndex, 'utf8');
  html = html.replace(/css\/style\.css(\?v=[\w\d_.-]+)?/g, `css/style.css?v=${ts}`);
  html = html.replace(/js\/app\.js(\?v=[\w\d_.-]+)?/g, `js/app.js?v=${ts}`);
  html = html.replace(/js\/youtubeAnalytics\.js(\?v=[\w\d_.-]+)?/g, `js/youtubeAnalytics.js?v=${ts}`);
  fs.writeFileSync(algoIndex, html, 'utf8');
  console.log('Updated Algo analyzer/index.html cache busters');
}

// 3. Fast Konwerter/index.html
const konwIndex = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwIndex)) {
  let html = fs.readFileSync(konwIndex, 'utf8');
  html = html.replace(/css\/converter\.css(\?v=[\w\d_.-]+)?/g, `css/converter.css?v=${ts}`);
  html = html.replace(/js\/converter-app\.js(\?v=[\w\d_.-]+)?/g, `js/converter-app.js?v=${ts}`);
  fs.writeFileSync(konwIndex, html, 'utf8');
  console.log('Updated Fast Konwerter/index.html cache busters');
}

console.log('All cache busters refreshed!');
