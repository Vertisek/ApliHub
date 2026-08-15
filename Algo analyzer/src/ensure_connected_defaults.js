const fs = require('fs');
const path = require('path');

const dataJsPath = path.resolve(__dirname, '../../js/data.js');
let dataJs = fs.readFileSync(dataJsPath, 'utf8');

if (!dataJs.includes('connectedAccounts:')) {
  dataJs = dataJs.replace(
    /joinedDate:\s*"01\.08\.2026 r\.",/,
    `joinedDate: "01.08.2026 r.",
  connectedAccounts: {
    youtube: false,
    tiktok: false,
    instagram: false,
    facebook: false,
    twitch: false
  },`
  );
  fs.writeFileSync(dataJsPath, dataJs, 'utf8');
  console.log('[SUCCESS] Updated DEFAULT_USER_STORE connectedAccounts in data.js');
} else {
  console.log('connectedAccounts already exists in data.js');
}
