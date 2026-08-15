const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../../Fast Konwerter/css/converter.css');
let css = fs.readFileSync(cssPath, 'utf8');

const enhancedSimNav = `/* Simulator Platform Tabs */
.sim-platform-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  justify-content: center;
}

.sim-nav-btn {
  padding: 8px 22px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.sim-nav-btn[data-platform="yt"] {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}
.sim-nav-btn[data-platform="yt"]:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fff;
  transform: translateY(-1px);
}
.sim-nav-btn[data-platform="yt"].active {
  background: #ef4444;
  color: #fff;
  border-color: #f87171;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
}

.sim-nav-btn[data-platform="tt"] {
  background: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.3);
  color: #67e8f9;
}
.sim-nav-btn[data-platform="tt"]:hover {
  background: rgba(6, 182, 212, 0.2);
  color: #fff;
  transform: translateY(-1px);
}
.sim-nav-btn[data-platform="tt"].active {
  background: #06b6d4;
  color: #fff;
  border-color: #22d3ee;
  box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4);
}

.sim-nav-btn[data-platform="ig"] {
  background: rgba(236, 72, 153, 0.1);
  border-color: rgba(236, 72, 153, 0.3);
  color: #f472b6;
}
.sim-nav-btn[data-platform="ig"]:hover {
  background: rgba(236, 72, 153, 0.2);
  color: #fff;
  transform: translateY(-1px);
}
.sim-nav-btn[data-platform="ig"].active {
  background: #ec4899;
  color: #fff;
  border-color: #f472b6;
  box-shadow: 0 4px 14px rgba(236, 72, 153, 0.4);
}`;

css = css.replace(/\/\* Simulator Platform Tabs \*\/[\s\S]*?\.sim-nav-btn\.active \{[\s\S]*?\}/, enhancedSimNav);
fs.writeFileSync(cssPath, css, 'utf8');
console.log('[SUCCESS] Updated Fast Konwerter/css/converter.css with distinct platform tab colors.');
