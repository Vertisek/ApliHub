const fs = require('fs');
const path = require('path');

const fastKonwDir = path.resolve(__dirname, '../../Fast Konwerter');
const cssDir = path.join(fastKonwDir, 'css');
const jsDir = path.join(fastKonwDir, 'js');

if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });

// 1. CSS
const cssContent = `/* Fast Konwerter (ReTrap) - Dark Techno Cyberpunk Theme */
:root {
  --bg-primary: #0a0a0c;
  --bg-secondary: #121318;
  --bg-card: #181a22;
  --bg-card-hover: #1f2330;
  --accent-blue: #3b82f6;
  --accent-cyan: #06b6d4;
  --accent-blue-glow: rgba(59, 130, 246, 0.35);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border: rgba(255, 255, 255, 0.08);
  --border-focus: rgba(59, 130, 246, 0.5);
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --font-main: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-main);
  font-family: var(--font-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* Background Atmosphere */
.glow-spot-1 {
  position: fixed;
  top: -100px;
  left: 20%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.glow-spot-2 {
  position: fixed;
  bottom: -150px;
  right: 10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Header */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 14px 24px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;
}

.brand-logo {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px var(--accent-blue-glow);
  font-size: 18px;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #fff;
}

.brand-tag {
  font-size: 11px;
  font-weight: 700;
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.nav-tabs {
  display: flex;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
}

.nav-tab-btn {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.nav-tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-tab-btn.active {
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.4);
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  padding: 6px 14px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-pill:hover {
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
  color: #fff;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

/* Main Container */
.main-content {
  max-width: 1000px;
  width: 100%;
  margin: 30px auto;
  padding: 0 20px 60px;
  position: relative;
  z-index: 1;
  flex: 1;
}

/* Tab Views */
.tab-view {
  display: none;
  animation: fadeIn 0.3s ease;
}

.tab-view.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Studio Converter View */
.hero-box {
  text-align: center;
  margin-bottom: 28px;
}

.hero-box h1 {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 40%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.hero-box p {
  color: var(--text-muted);
  font-size: 15px;
}

/* Input Area */
.url-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.url-input-group {
  display: flex;
  gap: 12px;
  background: #0f1015;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 6px 6px 6px 16px;
  align-items: center;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.url-input-group:focus-within {
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.url-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 15px;
  outline: none;
  font-family: inherit;
}

.url-input::placeholder {
  color: #64748b;
}

.btn-fetch {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-fetch:hover {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

/* Quick Select Demo Chips */
.quick-demos {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
}

.chip-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  color: #cbd5e1;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.chip-btn:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  color: #93c5fd;
}

/* Video Preview Card */
.video-preview-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.video-thumb-wrap {
  position: relative;
  width: 200px;
  height: 112px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #000;
  flex-shrink: 0;
}

.video-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-duration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.video-details {
  flex: 1;
}

.video-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
  line-height: 1.3;
}

.video-meta {
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Format Option Cards Grid */
.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.format-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.format-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
}

.format-card.selected {
  background: rgba(37, 99, 235, 0.12);
  border-color: var(--accent-blue);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.25);
}

.format-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.format-name {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
}

.format-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

.format-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
  flex: 1;
}

.format-radio {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #60a5fa;
}

/* Action Area */
.action-box {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  text-align: center;
}

.btn-convert-main {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: #fff;
  border: none;
  padding: 16px 40px;
  border-radius: var(--radius-md);
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.btn-convert-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.6);
}

.btn-convert-main:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Progress Box */
.progress-box {
  display: none;
  margin-top: 20px;
  text-align: left;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.progress-bar-bg {
  width: 100%;
  height: 10px;
  background: #0f1015;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.progress-bar-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #2563eb, #06b6d4);
  border-radius: 10px;
  transition: width 0.2s ease;
}

.progress-stage {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}

/* Result Box */
.result-box {
  display: none;
  margin-top: 20px;
  padding: 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-md);
  text-align: center;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.modal-box {
  background: #12131a;
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  border-radius: var(--radius-lg);
  padding: 24px;
  width: 90%;
  max-width: 440px;
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 24px;
  cursor: pointer;
}

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10000;
}

.toast {
  background: #181a22;
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #fff;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
`;

fs.writeFileSync(path.join(cssDir, 'converter.css'), cssContent);
console.log('Created Fast Konwerter css/converter.css');
