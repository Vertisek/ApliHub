const fs = require('fs');
const path = require('path');

const fastKonwDir = path.resolve(__dirname, '../../Fast Konwerter');
const indexPath = path.join(fastKonwDir, 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

const oldModalOptions = `          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP3 rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">Pobierz jako MP3 (320 kbps)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Konwertuj do wysokiej jakości audio mp3</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie WAV rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">Pobierz jako WAV (Studyjny Master)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Konwertuj do świetnej bezstratnej jakości audio wav</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP4 1080p rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">Pobierz MP4 1080p (Full HD)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Pobierz wideo w wysokiej rozdzielczości 1080p</div>
            </div>

            <div style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer;" onclick="alert('Pobieranie MP4 720p rozpoczęte!')">
              <div style="font-weight: 700; color: #fff;">Pobierz MP4 720p (HD)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Szybkie pobieranie wideo w rozdzielczości 720p</div>
            </div>
          </div>`;

const newModalOptions = `          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div class="sim-modal-option" data-format="mp3" style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
              <div style="font-weight: 700; color: #fff;">Pobierz jako MP3 (320 kbps)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Konwertuj do wysokiej jakości audio mp3</div>
            </div>

            <div class="sim-modal-option" data-format="wav" style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
              <div style="font-weight: 700; color: #fff;">Pobierz jako WAV (Studyjny Master)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Konwertuj do świetnej bezstratnej jakości audio wav</div>
            </div>

            <div class="sim-modal-option" data-format="1080p" style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
              <div style="font-weight: 700; color: #fff;">Pobierz MP4 1080p (Full HD)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Pobierz wideo w wysokiej rozdzielczości 1080p</div>
            </div>

            <div class="sim-modal-option" data-format="720p" style="background: #181920; border: 1px solid rgba(255,255,255,0.06); padding: 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s;">
              <div style="font-weight: 700; color: #fff;">Pobierz MP4 720p (HD)</div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Szybkie pobieranie wideo w rozdzielczości 720p</div>
            </div>
          </div>`;

html = html.replace(oldModalOptions, newModalOptions);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('[SUCCESS] Updated Fast Konwerter index.html modal options.');
