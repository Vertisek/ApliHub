// background.js - ReTrap konwerter

// Lista domyślnych, publicznych instancji Cobalt API do automatycznego przełączania (fallback)
const DEFAULT_INSTANCES = [
  "https://api.cobalt.tools",
  "https://cobalt.meowing.de",
  "https://cobalt.canine.tools",
  "https://cobalt.squair.xyz",
  "https://cobalt.xenon.zone",
  "https://cobalt.kittycat.boo",
  "https://cobalt.clxxped.lol",
  "https://cobalt.cjs.nz",
  "https://cobalt.blackcat.sweeux.org",
  "http://localhost:3000/api/download"
];

// Nasłuchiwanie na wiadomości z content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download") {
    const tabId = sender && sender.tab ? sender.tab.id : null;
    handleDownload(request.apiUrl, request.payload, tabId)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Wskazuje, że odpowiedź będzie wysłana asynchronicznie
  }

  if (request.action === "pingInstance") {
    pingInstance(request.apiUrl)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

// Śledzenie rzeczywistego postępu pobierania z chrome.downloads
function trackDownloadProgress(downloadId, tabId) {
  if (!tabId) return;
  const interval = setInterval(() => {
    chrome.downloads.search({ id: downloadId }, (results) => {
      if (!results || results.length === 0) {
        clearInterval(interval);
        return;
      }
      const item = results[0];
      let percent = 0;
      if (item.totalBytes > 0) {
        percent = Math.min(100, Math.round((item.bytesReceived / item.totalBytes) * 100));
      }

      chrome.tabs.sendMessage(tabId, {
        action: "downloadProgressUpdate",
        percent: percent,
        bytesReceived: item.bytesReceived || 0,
        totalBytes: item.totalBytes || 0,
        state: item.state
      }).catch(() => {});

      if (item.state === "complete" || item.state === "interrupted") {
        clearInterval(interval);
      }
    });
  }, 200);
}

// Obsługa zapytania do API Cobalt i pobrania pliku z automatycznym przełączaniem instancji
async function handleDownload(apiUrl, payload, tabId) {
  try {
    let urlsToTry = [];
    if (apiUrl === "auto" || !apiUrl) {
      urlsToTry = [...DEFAULT_INSTANCES];
    } else {
      urlsToTry = [apiUrl];
    }

    let lastError = null;

    for (let baseUrl of urlsToTry) {
      try {
        console.log("ReTrap: Próba konwersji przy użyciu serwera:", baseUrl);
        
        baseUrl = baseUrl.trim();
        if (baseUrl.endsWith("/")) {
          baseUrl = baseUrl.slice(0, -1);
        }

        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errText = await response.text();
          let errMsg = `Serwer zwrócił status ${response.status}`;
          try {
            const errJson = JSON.parse(errText);
            if (errJson.text) errMsg = errJson.text;
            else if (errJson.error && errJson.error.text) errMsg = errJson.error.text;
          } catch (e) {}
          throw new Error(errMsg);
        }

        const data = await response.json();
        console.log("ReTrap: Odpowiedź z serwera:", data);

        if (data.status === "error") {
          throw new Error(data.text || (data.error && data.error.text) || "Błąd serwera");
        }

        if (data.status === "picker") {
          throw new Error("Wykryto playlistę lub galerię. Podaj link do pojedynczego filmu.");
        }

        if ((data.status === "redirect" || data.status === "stream" || data.status === "tunnel") && data.url) {
          // Pobieranie pliku za pomocą chrome.downloads API
          return new Promise((resolve, reject) => {
            chrome.downloads.download({
              url: data.url,
              filename: data.filename || undefined,
              saveAs: false // Pobierz bezpośrednio
            }, (downloadId) => {
              if (chrome.runtime.lastError) {
                console.warn("ReTrap: chrome.downloads nie powiodło się, otwieram w nowej karcie:", chrome.runtime.lastError.message);
                chrome.tabs.create({ url: data.url });
                resolve({ success: true, method: "tab", url: data.url });
              } else {
                console.log("ReTrap: Pobieranie rozpoczęte pomyślnie. ID:", downloadId);
                if (tabId && downloadId) {
                  trackDownloadProgress(downloadId, tabId);
                }
                resolve({ success: true, method: "downloads", downloadId: downloadId });
              }
            });
          });
        }

        throw new Error("Brak linku pobierania w odpowiedzi");

      } catch (err) {
        console.warn(`ReTrap: Próba dla serwera ${baseUrl} nie powiodła się: ${err.message}`);
        lastError = err;
        // Kontynuacja pętli (fallback do kolejnego serwera)
      }
    }

    // Jeśli wszystkie serwery zawiodły, rzucamy ostatni błąd z czytelnym wyjaśnieniem
    let finalErrorMsg = lastError ? lastError.message : "Wszystkie serwery konwersji są obecnie przeciążone";
    throw new Error(`${finalErrorMsg}. Spróbuj ponownie za chwilę lub ustaw własny serwer w ustawieniach wtyczki.`);

  } catch (error) {
    console.error("ReTrap: Błąd w handleDownload:", error);
    return { success: false, error: error.message };
  }
}

// Sprawdzanie czy instancja działa (Ping)
async function pingInstance(apiUrl) {
  try {
    let baseUrl = apiUrl.trim();
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(baseUrl, {
      method: "GET",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: `Kod statusu: ${response.status}` };
    }
  } catch (error) {
    return { success: false, error: error.message === "The user aborted a request." ? "Limit czasu (Timeout 5s)" : error.message };
  }
}
