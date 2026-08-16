using System;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Diagnostics;
using System.Threading;
using System.Text;
using System.Windows.Forms;
using System.Runtime.InteropServices;

namespace AlgoAnalyzer
{
    static class Program
    {
        private static HttpListener _listener;
        private static string _appDir;
        private static string _profileDir;
        private static int _port;
        private static bool _isRunning = true;

        [STAThread]
        static void Main(string[] args)
        {
            try
            {
                // Set working folders in LocalAppData
                string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string baseDir = Path.Combine(localAppData, "ApliHub", "AlgoAnalyzer");
                _appDir = Path.Combine(baseDir, "app");
                _profileDir = Path.Combine(baseDir, "profile");

                Directory.CreateDirectory(_appDir);
                Directory.CreateDirectory(_profileDir);

                // Extract embedded bundle if needed
                ExtractEmbeddedBundle();

                // Create Desktop Shortcut if not exists
                CreateDesktopShortcut();

                // Find a free TCP port
                _port = GetFreeTcpPort();

                // Start embedded HTTP Server
                StartHttpServer();

                // Launch Edge/Chrome App Window
                Process browserProc = LaunchBrowserApp();

                if (browserProc != null)
                {
                    // Wait for the app window to close
                    browserProc.WaitForExit();
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Wystąpił błąd podczas uruchamiania Algo Analyzer:\n\n" + ex.Message,
                    "Algo Analyzer — Błąd", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                _isRunning = false;
                if (_listener != null)
                {
                    try { _listener.Stop(); } catch { }
                    try { _listener.Close(); } catch { }
                }
            }
        }

        private static void ExtractEmbeddedBundle()
        {
            try
            {
                Assembly asm = Assembly.GetExecutingAssembly();
                using (Stream stream = asm.GetManifestResourceStream("app_bundle.zip"))
                {
                    if (stream != null)
                    {
                        string tempZip = Path.Combine(Path.GetTempPath(), "algo_bundle_" + Guid.NewGuid().ToString("N") + ".zip");
                        using (FileStream fs = new FileStream(tempZip, FileMode.Create, FileAccess.Write))
                        {
                            stream.CopyTo(fs);
                        }

                        // Extract files overwriting existing
                        using (ZipArchive archive = ZipFile.OpenRead(tempZip))
                        {
                            foreach (ZipArchiveEntry entry in archive.Entries)
                            {
                                if (string.IsNullOrEmpty(entry.Name)) continue; // directory entry

                                string destinationPath = Path.GetFullPath(Path.Combine(_appDir, entry.FullName));
                                if (!destinationPath.StartsWith(_appDir, StringComparison.OrdinalIgnoreCase))
                                {
                                    continue; // security check
                                }

                                Directory.CreateDirectory(Path.GetDirectoryName(destinationPath));
                                entry.ExtractToFile(destinationPath, true);
                            }
                        }

                        try { File.Delete(tempZip); } catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Extract error: " + ex.Message);
            }
        }

        private static int GetFreeTcpPort()
        {
            TcpListener l = new TcpListener(IPAddress.Loopback, 0);
            l.Start();
            int port = ((IPEndPoint)l.LocalEndpoint).Port;
            l.Stop();
            return port;
        }

        private static void StartHttpServer()
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add("http://127.0.0.1:" + _port + "/");
            _listener.Prefixes.Add("http://localhost:" + _port + "/");
            _listener.Start();

            Thread serverThread = new Thread(() =>
            {
                while (_isRunning && _listener.IsListening)
                {
                    try
                    {
                        HttpListenerContext ctx = _listener.GetContext();
                        ThreadPool.QueueUserWorkItem((state) => HandleRequest((HttpListenerContext)state), ctx);
                    }
                    catch
                    {
                        if (!_isRunning) break;
                    }
                }
            })
            {
                IsBackground = true
            };
            serverThread.Start();
        }

        private static void HandleRequest(HttpListenerContext ctx)
        {
            try
            {
                string rawUrl = ctx.Request.Url.AbsolutePath.TrimStart('/');
                if (string.IsNullOrEmpty(rawUrl) || rawUrl == "/") rawUrl = "index.html";

                rawUrl = Uri.UnescapeDataString(rawUrl);
                string filePath = Path.Combine(_appDir, rawUrl.Replace('/', Path.DirectorySeparatorChar));

                if (!File.Exists(filePath))
                {
                    // Check if requested with Algo analyzer prefix
                    if (rawUrl.StartsWith("Algo analyzer/", StringComparison.OrdinalIgnoreCase))
                    {
                        string sub = rawUrl.Substring("Algo analyzer/".Length);
                        filePath = Path.Combine(_appDir, sub.Replace('/', Path.DirectorySeparatorChar));
                    }
                }

                if (File.Exists(filePath))
                {
                    byte[] bytes = File.ReadAllBytes(filePath);
                    string ext = Path.GetExtension(filePath).ToLowerInvariant();
                    string mime = GetMimeType(ext);

                    ctx.Response.ContentType = mime;
                    ctx.Response.ContentLength64 = bytes.Length;
                    ctx.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                    ctx.Response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate");
                    ctx.Response.StatusCode = (int)HttpStatusCode.OK;

                    ctx.Response.OutputStream.Write(bytes, 0, bytes.Length);
                }
                else
                {
                    ctx.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    byte[] notFound = Encoding.UTF8.GetBytes("404 - Plik nie został odnaleziony: " + rawUrl);
                    ctx.Response.OutputStream.Write(notFound, 0, notFound.Length);
                }
            }
            catch
            {
                try { ctx.Response.StatusCode = (int)HttpStatusCode.InternalServerError; } catch { }
            }
            finally
            {
                try { ctx.Response.OutputStream.Close(); } catch { }
            }
        }

        private static string GetMimeType(string ext)
        {
            switch (ext)
            {
                case ".html": case ".htm": return "text/html; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".json": return "application/json; charset=utf-8";
                case ".png": return "image/png";
                case ".jpg": case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                case ".svg": return "image/svg+xml";
                case ".ico": return "image/x-icon";
                case ".woff": return "font/woff";
                case ".woff2": return "font/woff2";
                case ".ttf": return "font/ttf";
                case ".mp3": return "audio/mpeg";
                case ".wav": return "audio/wav";
                case ".ogg": return "audio/ogg";
                default: return "application/octet-stream";
            }
        }

        private static Process LaunchBrowserApp()
        {
            string url = "http://127.0.0.1:" + _port + "/index.html";

            string[] candidateBrowsers = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft", "Edge", "Application", "msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft", "Edge", "Application", "msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Google", "Chrome", "Application", "chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Google", "Chrome", "Application", "chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Google", "Chrome", "Application", "chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "BraveSoftware", "Brave-Browser", "Application", "brave.exe")
            };

            string browserPath = null;
            foreach (string path in candidateBrowsers)
            {
                if (File.Exists(path))
                {
                    browserPath = path;
                    break;
                }
            }

            if (browserPath != null)
            {
                string args = string.Format("--app=\"{0}\" --window-size=1420,900 --user-data-dir=\"{1}\" --app-id=\"AlgoAnalyzer_ApliHub\" --disable-features=Translate",
                    url, _profileDir);

                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = browserPath,
                    Arguments = args,
                    UseShellExecute = false
                };

                return Process.Start(psi);
            }
            else
            {
                // Fallback to system default browser
                Process.Start(url);
                return null;
            }
        }

        private static void CreateDesktopShortcut()
        {
            try
            {
                string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string shortcutPath = Path.Combine(desktopPath, "Algo Analyzer.lnk");
                string currentExe = Assembly.GetExecutingAssembly().Location;

                // Don't overwrite if shortcut already points to this exe
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    dynamic shortcut = shell.CreateShortcut(shortcutPath);
                    shortcut.TargetPath = currentExe;
                    shortcut.WorkingDirectory = Path.GetDirectoryName(currentExe);
                    shortcut.Description = "Algo Analyzer — Zaawansowana Analityka Social Media (ApliHub)";
                    shortcut.IconLocation = currentExe + ",0";
                    shortcut.Save();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Shortcut creation error: " + ex.Message);
            }
        }
    }
}
