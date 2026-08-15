const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../Fast Konwerter/js/converter-app.js');
let code = fs.readFileSync(filePath, 'utf8');

const validEnding = `
/* Global Tab Switcher for parent window & direct activation */
window.switchTab = function(tabId) {
  try {
    var targetBtn = document.querySelector('.nav-tab-btn[data-tab="' + tabId + '"]');
    if (targetBtn) {
      targetBtn.click();
    }
  } catch (e) {
    console.error('Error in switchTab:', e);
  }
};

function checkDirectTabActivation() {
  function activate() {
    try {
      var hash = window.location.hash;
      var params = new URLSearchParams(window.location.search);
      var targetTabId = params.get('tab') || (hash ? hash.replace('#', '') : '');

      if (targetTabId && window.switchTab) {
        window.switchTab(targetTabId);
      }
    } catch (e) {}
  }

  activate();
  window.addEventListener('hashchange', activate);
  setTimeout(activate, 50);
  setTimeout(activate, 150);
  setTimeout(activate, 350);
}
`;

// Locate end of showToast function
const toastSearch = 'setTimeout(function() { toast.remove(); }, 300);\n  }, 3500);\n}';
const toastIdx = code.indexOf(toastSearch);

if (toastIdx !== -1) {
  code = code.substring(0, toastIdx + toastSearch.length) + '\n' + validEnding.trim() + '\n';
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('[SUCCESS] converter-app.js cleaned up and properly closed.');
} else {
  console.error('Could not locate toastSearch in file');
}
