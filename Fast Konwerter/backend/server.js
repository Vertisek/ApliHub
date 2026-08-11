const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ytDlp = require('yt-dlp-exec');
const ffmpeg = require('fluent-ffmpeg');

// Konfiguracja ścieżki FFmpeg z zmiennej środowiskowej lub domyślnej w systemie
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
}

const app = express();
const PORT = process.env.PORT || 3000;
const TEMP_DIR = path.join(__dirname, 'temp');

// Tworzenie katalogu tymczasowego, jeśli nie istnieje
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Magazyn plików dla endpointu strumieniowania (pobieranie przez ID)
const activeFiles = new Map();

// Pomocnicza funkcja czyszczenia niepotrzebnych znaków z nazwy pliku
function sanitizeFilename(name) {
  return name
    .replace(/[\\/:*?"<>|]/g, '') // Usuń znaki niedozwolone w nazwach plików Windows
    .replace(/\s+/g, ' ')
    .trim() || 'video';
}

// Pomocnicza funkcja do bezpiecznego usuwania plików tymczasowych
function cleanupFiles(filePaths) {
  for (const filePath of filePaths) {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Błąd przy usuwaniu pliku ${filePath}:`, err.message);
      });
    }
  }
}

// Normalizacja formatu z zapytania
function parseRequestedFormat(body) {
  let format = body.format;
  
  if (!format) {
    if (body.downloadMode === 'audio') {
      format = body.audioFormat === 'wav' ? 'wav' : 'mp3';
    } else if (body.videoQuality === '1080' || body.videoQuality === '1080p') {
      format = 'mp4-1080p';
    } else if (body.videoQuality === '720' || body.videoQuality === '720p') {
      format = 'mp4-720p';
    } else if (body.format === '1080' || body.format === '720') {
      format = `mp4-${body.format}p`;
    } else {
      format = 'mp3';
    }
  }

  format = format.toLowerCase();
  if (['mp3', 'wav', 'mp4-1080p', 'mp4-720p', '1080p', '720p'].includes(format)) {
    if (format === '1080p') return 'mp4-1080p';
    if (format === '720p') return 'mp4-720p';
    return format;
  }

  return 'mp3';
}

// Endpoint statusu serwera
app.get('/', (req, res) => {
  res.json({
    name: 'ReTrap YouTube Converter API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      download: 'POST /api/download'
    }
  });
});

// Główny endpoint pobierania i konwersji
app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ status: 'error', text: 'Brak prawidlowego adresu URL filmu YouTube' });
  }

  const requestedFormat = parseRequestedFormat(req.body);
  console.log(`[DOWNLOAD REQUEST] URL: ${url} | Format: ${requestedFormat}`);

  const requestId = crypto.randomUUID();
  const tempFilesToClean = [];

  try {
    // 1. Pobieranie metadanych filmu (tytuł)
    console.log(`[yt-dlp] Pobieranie metadanych...`);
    const metadata = await ytDlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true
    });

    const rawTitle = metadata.title || 'youtube_download';
    const safeTitle = sanitizeFilename(rawTitle);
    console.log(`[yt-dlp] Tytuł filmu: "${rawTitle}" -> Nazwa pliku: "${safeTitle}"`);

    // 2. Obsługa pobierania i konwersji w zależności od formatu
    if (requestedFormat === 'mp3' || requestedFormat === 'wav') {
      const extension = requestedFormat;
      const rawAudioPath = path.join(TEMP_DIR, `${requestId}_raw.webm`);
      const finalAudioPath = path.join(TEMP_DIR, `${requestId}_final.${extension}`);
      const downloadFilename = `${safeTitle}.${extension}`;

      tempFilesToClean.push(rawAudioPath, finalAudioPath);

      // Pobieramy najlepszy strumień audio za pomocą yt-dlp
      console.log(`[yt-dlp] Pobieranie strumienia audio...`);
      await ytDlp(url, {
        format: 'bestaudio/best',
        output: rawAudioPath,
        noWarnings: true
      });

      // Konwersja za pomocą fluent-ffmpeg
      console.log(`[fluent-ffmpeg] Konwersja do formatu ${extension.toUpperCase()}...`);
      await new Promise((resolve, reject) => {
        let command = ffmpeg(rawAudioPath);

        if (requestedFormat === 'mp3') {
          command = command
            .audioCodec('libmp3lame')
            .audioBitrate('320k')
            .toFormat('mp3');
        } else if (requestedFormat === 'wav') {
          command = command
            .audioCodec('pcm_s16le')
            .toFormat('wav');
        }

        command
          .on('start', (cmdline) => console.log(`[ffmpeg] Uruchomiono: ${cmdline}`))
          .on('end', () => {
            console.log(`[ffmpeg] Konwersja zakończona sukcesem.`);
            resolve();
          })
          .on('error', (err) => {
            console.error(`[ffmpeg] Błąd konwersji:`, err.message);
            reject(err);
          })
          .save(finalAudioPath);
      });

      return sendOrStreamFile(req, res, finalAudioPath, downloadFilename, requestedFormat === 'mp3' ? 'audio/mpeg' : 'audio/wav', tempFilesToClean, requestId);

    } else if (requestedFormat === 'mp4-1080p' || requestedFormat === 'mp4-720p') {
      const maxRes = requestedFormat === 'mp4-1080p' ? '1080' : '720';
      const finalVideoPath = path.join(TEMP_DIR, `${requestId}_final.mp4`);
      const downloadFilename = `${safeTitle}_${maxRes}p.mp4`;

      tempFilesToClean.push(finalVideoPath);

      console.log(`[yt-dlp] Pobieranie i scalanie wideo MP4 (${maxRes}p)...`);
      await ytDlp(url, {
        format: `bestvideo[height<=${maxRes}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${maxRes}]+bestaudio/best[height<=${maxRes}]/best`,
        mergeOutputFormat: 'mp4',
        output: finalVideoPath,
        noWarnings: true
      });

      return sendOrStreamFile(req, res, finalVideoPath, downloadFilename, 'video/mp4', tempFilesToClean, requestId);
    } else {
      throw new Error(`Nieobsługiwany format: ${requestedFormat}`);
    }

  } catch (error) {
    console.error(`[ERROR] Błąd w obsłudze zapytania:`, error.message);
    cleanupFiles(tempFilesToClean);
    return res.status(500).json({
      status: 'error',
      text: `Błąd konwersji: ${error.message}`
    });
  }
});

// Pomocnicza funkcja obsługująca zarówno bezpośredni Attachment download, jak i JSON stream dla wtyczki Chrome
function sendOrStreamFile(req, res, filePath, downloadFilename, mimeType, tempFilesToClean, requestId) {
  // Jeśli Klient prosi o JSON (np. wtyczka Chrome z Cobalt API client)
  if (req.headers.accept && req.headers.accept.includes('application/json') && !req.headers['x-direct-download']) {
    activeFiles.set(requestId, {
      filePath,
      downloadFilename,
      mimeType,
      tempFilesToClean
    });

    // Ustaw automatyczne czyszczenie po 10 minutach jeśli plik nie zostanie pobrany
    setTimeout(() => {
      if (activeFiles.has(requestId)) {
        const item = activeFiles.get(requestId);
        cleanupFiles(item.tempFilesToClean);
        activeFiles.delete(requestId);
      }
    }, 10 * 60 * 1000);

    const streamUrl = `${req.protocol}://${req.get('host')}/api/stream/${requestId}`;
    console.log(`[RESPONSE JSON] Zwracanie linku pobierania: ${streamUrl}`);
    return res.json({
      status: 'stream',
      url: streamUrl,
      filename: downloadFilename
    });
  }

  // W innym wypadku przesyłaj plik bezpośrednio jako załącznik (Attachment)
  console.log(`[RESPONSE ATTACHMENT] Wysłanie pliku bezpośrednio w nagłówkach: ${downloadFilename}`);
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadFilename)}"; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`);

  return res.download(filePath, downloadFilename, (err) => {
    if (err) console.error(`[DOWNLOAD ERROR] Błąd podczas przesyłania strumienia:`, err.message);
    cleanupFiles(tempFilesToClean);
  });
}

// Endpoint strumieniowy dla wtyczek i bezpośredniego pobierania przez URL ID
app.get('/api/stream/:id', (req, res) => {
  const fileId = req.params.id;
  const item = activeFiles.get(fileId);

  if (!item || !fs.existsSync(item.filePath)) {
    return res.status(404).json({ status: 'error', text: 'Plik nie istnieje lub wygasł' });
  }

  console.log(`[STREAM GET] Rozpoczęto pobieranie pliku: ${item.downloadFilename}`);
  res.setHeader('Content-Type', item.mimeType);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(item.downloadFilename)}"; filename*=UTF-8''${encodeURIComponent(item.downloadFilename)}`);

  res.download(item.filePath, item.downloadFilename, (err) => {
    if (err) console.error(`[STREAM ERROR] Błąd podczas pobierania:`, err.message);
    cleanupFiles(item.tempFilesToClean);
    activeFiles.delete(fileId);
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  ReTrap YouTube Converter Backend uruchomiony!`);
  console.log(`  Działam na porcie: http://localhost:${PORT}`);
  console.log(`  Endpoint POST: http://localhost:${PORT}/api/download`);
  console.log(`====================================================`);
});
