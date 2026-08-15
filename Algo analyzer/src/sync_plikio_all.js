const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const algoDir = path.resolve(__dirname, '../');
const konwDir = path.resolve(rootDir, 'Fast Konwerter');

console.log('Synchronizing all Plikio updates and polishing files...');

// 1. Update index.html
const indexHtmlPath = path.resolve(rootDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  let content = fs.readFileSync(indexHtmlPath, 'utf8');
  content = content.replace(/Plixy/g, 'Plikio');
  fs.writeFileSync(indexHtmlPath, content, 'utf8');
  console.log('[1/5] Updated root index.html');
}

// 2. Update js/data.js
const dataJsPath = path.resolve(rootDir, 'js/data.js');
if (fs.existsSync(dataJsPath)) {
  let content = fs.readFileSync(dataJsPath, 'utf8');
  content = content.replace(/name:\s*"Plixy"/g, 'name: "Plikio"');
  content = content.replace(/Plixy/g, 'Plikio');
  fs.writeFileSync(dataJsPath, content, 'utf8');
  console.log('[2/5] Updated js/data.js');
}

// 3. Update js/main.js
const mainJsPath = path.resolve(rootDir, 'js/main.js');
if (fs.existsSync(mainJsPath)) {
  let content = fs.readFileSync(mainJsPath, 'utf8');
  content = content.replace(/Plixy/g, 'Plikio');
  fs.writeFileSync(mainJsPath, content, 'utf8');
  console.log('[3/5] Updated js/main.js');
}

// 4. Update Fast Konwerter/index.html
const konwIndexPath = path.resolve(konwDir, 'index.html');
if (fs.existsSync(konwIndexPath)) {
  let content = fs.readFileSync(konwIndexPath, 'utf8');
  content = content.replace(/<title>.*?<\/title>/, '<title>Plikio - Twój Szybki i Darmowy Konwerter</title>');
  content = content.replace(/<span class="brand-name">.*?<\/span>/g, '<span class="brand-name">PLIKIO</span>');
  content = content.replace(/Plixy/g, 'Plikio');
  fs.writeFileSync(konwIndexPath, content, 'utf8');
  console.log('[4/5] Updated Fast Konwerter/index.html');
}

// 5. Update Fast Konwerter/js/converter-app.js
const konwJsPath = path.resolve(konwDir, 'js/converter-app.js');
if (fs.existsSync(konwJsPath)) {
  let content = fs.readFileSync(konwJsPath, 'utf8');
  content = content.replace(/Plixy/g, 'Plikio');
  fs.writeFileSync(konwJsPath, content, 'utf8');
  console.log('[5/5] Updated Fast Konwerter/js/converter-app.js');
}

console.log('All Plikio updates successfully synchronized!');
