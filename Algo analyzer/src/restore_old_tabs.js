const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../css/style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const originalSidebarTabsCss = `
/* Sidebar Navigation Tabs */
.sidebar-tabs {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 10px;
    color: var(--color-text-muted);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    width: 100%;
    text-align: left;
    position: relative;
}

.tab-btn svg {
    width: 20px;
    height: 20px;
    stroke: var(--color-text-dim);
    transition: var(--transition);
    flex-shrink: 0;
}

.tab-btn:hover {
    color: var(--color-text-primary);
    background: rgba(250, 204, 21, 0.05);
    border-color: rgba(250, 204, 21, 0.1);
}

.tab-btn:hover svg {
    stroke: var(--color-yellow-main);
}

.tab-btn.active {
    background: rgba(250, 204, 21, 0.12);
    border-color: rgba(250, 204, 21, 0.3);
    color: var(--color-yellow-main);
    font-weight: 600;
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.1);
}

.tab-btn.active svg {
    stroke: var(--color-yellow-main);
    filter: drop-shadow(0 0 5px var(--color-yellow-main));
}

.tab-btn.active::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: var(--color-yellow-main);
    border-radius: 0 4px 4px 0;
    box-shadow: 0 0 10px var(--color-yellow-main);
}
`;

// Replace whatever tab styling is between sidebar and main-content
const regex = /\/\* ==========================================================================\s*VIBRANT & DISTINCT SOCIAL MEDIA TABS[\s\S]*?\/\* Main Content Area \*\//;
if (regex.test(css)) {
  css = css.replace(regex, originalSidebarTabsCss.trim() + '\n\n/* Main Content Area */');
} else {
  const fallbackRegex = /\.sidebar-tabs[\s\S]*?\/\* Main Content Area \*\//;
  css = css.replace(fallbackRegex, originalSidebarTabsCss.trim() + '\n\n/* Main Content Area */');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('[SUCCESS] Restored original clean sidebar tabs in Algo analyzer css/style.css');
