const { execSync } = require('child_process');
const oldCss = execSync('git show ed07430:"Algo analyzer/css/style.css"').toString();
const start = oldCss.indexOf('.sidebar');
const end = oldCss.indexOf('/* Main Content Area */');
console.log('--- OLD SIDEBAR & TABS CSS ---');
console.log(oldCss.substring(start, end));
