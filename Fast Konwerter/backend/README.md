# ReTrap YouTube Converter Backend (Node.js + Express)

Backend dla konwertera YouTube napisany w Node.js (Express.js) wykorzystujący `yt-dlp-exec` oraz `fluent-ffmpeg`.

## 🚀 Uruchomienie

### Opcja 1: Skrypt `.bat`
Kliknij dwukrotnie plik `run.bat` w folderze `backend`.

### Opcja 2: Terminal / Konsola
```bash
cd backend
npm start
```

Domyślnie serwer uruchamia się pod adresem: `http://localhost:3000`

---

## 📡 Endpoint API

### `POST /api/download`

Przymuje URL filmu z YouTube oraz wybrany format.

#### Przykłady zapytania HTTP:

**1. Pobieranie MP3 (Audio 320kbps):**
```json
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp3"
}
```

**2. Pobieranie WAV (Jakość bezstratna audio):**
```json
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "wav"
}
```

**3. Pobieranie MP4 1080p Full HD:**
```json
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp4-1080p"
}
```

**4. Pobieranie MP4 720p HD:**
```json
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp4-720p"
}
```

#### Odpowiedź:
- **Plik do pobrania (Attachment):** Przeglądarka / Klient otrzymuje bezpośredni plik do pobrania z nagłówkiem `Content-Disposition: attachment; filename="..."`.
- **Tryb JSON dla wtyczki Chrome:** W przypadku wysłania nagłówka `Accept: application/json`, backend zwraca strukturę `{ status: "stream", url: "http://localhost:3000/api/stream/...", filename: "..." }`.
