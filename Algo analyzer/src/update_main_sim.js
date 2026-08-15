const fs = require('fs');
const path = require('path');

const apliHubDir = path.resolve(__dirname, '../../');
const mainJsPath = path.resolve(apliHubDir, 'js/main.js');

if (fs.existsSync(mainJsPath)) {
  let js = fs.readFileSync(mainJsPath, 'utf8');
  js = js.replace(/window\.openLiveAppSandbox\('plixy-sim'\)/g, "window.openLiveAppSandbox('plikio-sim')");
  js = js.replace(/appType === 'plixy-sim'/g, "(appType === 'plikio-sim' || appType === 'plixy-sim')");
  fs.writeFileSync(mainJsPath, js, 'utf8');
  console.log('Successfully updated js/main.js for plikio-sim');
}
