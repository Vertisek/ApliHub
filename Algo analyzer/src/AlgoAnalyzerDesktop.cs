using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Diagnostics;
using System.Threading;
using System.Text;
using System.Drawing;
using System.Windows.Forms;

namespace ApliHub.AlgoAnalyzer
{
    static class Program
    {
        private static Mutex _mutex;
        private static HttpListener _listener;
        private static string _appDir;
        private static string _profileDir;
        private static string _rootDir;
        private static int _port;
        private static bool _isRunning = true;
        private static NotifyIcon _trayIcon;
        private static Process _browserProcess;

        [STAThread]
        static void Main(string[] args)
        {
            // Single Instance Mutex
            bool createdNew;
            _mutex = new Mutex(true, "ApliHub_AlgoAnalyzer_SingleInstance_Mutex", out createdNew);
            if (!createdNew)
            {
                // Bring existing window or trigger URL
                try
                {
                    Process.Start("http://127.0.0.1:54321/index.html");
                }
                catch { }
                return;
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            try
            {
                string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                _rootDir = Path.Combine(localAppData, "ApliHub", "AlgoAnalyzer");
                _appDir = Path.Combine(_rootDir, "app");
                _profileDir = Path.Combine(_rootDir, "profile");

                // If running from portable folder where index.html is present, use current folder as fallback
                string currentExeDir = AppDomain.CurrentDomain.BaseDirectory;
                if (!Directory.Exists(_appDir) || !File.Exists(Path.Combine(_appDir, "index.html")))
                {
                    if (File.Exists(Path.Combine(currentExeDir, "index.html")))
                    {
                        _appDir = currentExeDir;
                    }
                    else if (Directory.Exists(Path.Combine(currentExeDir, "app")) && File.Exists(Path.Combine(currentExeDir, "app", "index.html")))
                    {
                        _appDir = Path.Combine(currentExeDir, "app");
                    }
                }

                Directory.CreateDirectory(_appDir);
                Directory.CreateDirectory(_profileDir);

                // Find a free TCP port (prefer 54321)
                _port = GetFreeTcpPort(54321);

                // Start embedded HTTP Server
                StartHttpServer();

                // Initialize System Tray Icon
                InitTrayIcon();

                // Launch Edge/Chrome App Window
                _browserProcess = LaunchBrowserApp();

                // Run message loop for TrayIcon and background handling
                Application.Run();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Wystąpił błąd podczas uruchamiania Algo Analyzer:\n\n" + ex.Message,
                    "Algo Analyzer — Błąd", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                Cleanup();
            }
        }

        private static void InitTrayIcon()
        {
            _trayIcon = new NotifyIcon();
            _trayIcon.Text = "ApliHub - Algo Analyzer";

            // Try load icon from file or assembly
            string iconPath = Path.Combine(_appDir, "app.ico");
            if (!File.Exists(iconPath)) iconPath = Path.Combine(_rootDir, "app.ico");

            if (File.Exists(iconPath))
            {
                try { _trayIcon.Icon = new Icon(iconPath); } catch { _trayIcon.Icon = SystemIcons.Application; }
            }
            else
            {
                _trayIcon.Icon = SystemIcons.Application;
            }

            ContextMenuStrip menu = new ContextMenuStrip();
            ToolStripMenuItem itemOpen = new ToolStripMenuItem("🚀 Otwórz Algo Analyzer", null, (s, e) => {
                LaunchBrowserApp();
            });
            itemOpen.Font = new Font(menu.Font, FontStyle.Bold);

            ToolStripMenuItem itemUpdate = new ToolStripMenuItem("🔄 Sprawdź aktualizacje", null, (s, e) => {
                RunUpdater();
            });

            ToolStripMenuItem itemFolder = new ToolStripMenuItem("📁 Folder aplikacji", null, (s, e) => {
                try { Process.Start("explorer.exe", _rootDir); } catch { }
            });

            ToolStripMenuItem itemSite = new ToolStripMenuItem("🌐 Strona ApliHub", null, (s, e) => {
                try { Process.Start("https://aplihub.pl"); } catch { }
            });

            ToolStripMenuItem itemExit = new ToolStripMenuItem("❌ Zamknij Algo Analyzer", null, (s, e) => {
                _isRunning = false;
                Cleanup();
                Application.Exit();
            });

            menu.Items.Add(itemOpen);
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add(itemUpdate);
            menu.Items.Add(itemFolder);
            menu.Items.Add(itemSite);
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add(itemExit);

            _trayIcon.ContextMenuStrip = menu;
            _trayIcon.Visible = true;
            _trayIcon.DoubleClick += (s, e) => LaunchBrowserApp();
        }

        private static void RunUpdater()
        {
            string updaterExe = Path.Combine(_rootDir, "Updater.exe");
            if (File.Exists(updaterExe))
            {
                Process.Start(updaterExe);
            }
            else
            {
                string updaterBat = Path.Combine(_rootDir, "Update.bat");
                if (File.Exists(updaterBat))
                {
                    Process.Start(new ProcessStartInfo(updaterBat) { UseShellExecute = true });
                }
                else
                {
                    MessageBox.Show("Aplikacja Algo Analyzer jest w najnowszej wersji.", "Aktualizacje", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
        }

        private static int GetFreeTcpPort(int defaultPort)
        {
            try
            {
                TcpListener l = new TcpListener(IPAddress.Loopback, defaultPort);
                l.Start();
                l.Stop();
                return defaultPort;
            }
            catch
            {
                TcpListener l2 = new TcpListener(IPAddress.Loopback, 0);
                l2.Start();
                int p = ((IPEndPoint)l2.LocalEndpoint).Port;
                l2.Stop();
                return p;
            }
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

                // API commands handling
                if (rawUrl.Equals("api/update", StringComparison.OrdinalIgnoreCase))
                {
                    ThreadPool.QueueUserWorkItem((w) => RunUpdater());
                    byte[] ok = Encoding.UTF8.GetBytes("{\"status\":\"updating\"}");
                    ctx.Response.ContentType = "application/json";
                    ctx.Response.OutputStream.Write(ok, 0, ok.Length);
                    return;
                }

                string filePath = Path.Combine(_appDir, rawUrl.Replace('/', Path.DirectorySeparatorChar));

                if (!File.Exists(filePath))
                {
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
                string args = string.Format("--app=\"{0}\" --window-size=1440,920 --user-data-dir=\"{1}\" --app-id=\"ApliHub.AlgoAnalyzer\" --disable-features=Translate",
                    url, _profileDir);

                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = browserPath,
                    Arguments = args,
                    UseShellExecute = false
                };

                Process p = Process.Start(psi);
                if (p != null)
                {
                    // Monitor browser process
                    ThreadPool.QueueUserWorkItem((state) =>
                    {
                        try
                        {
                            p.WaitForExit();
                            // Optional: quit tray if user closed app, or stay in tray
                        }
                        catch { }
                    });
                }
                return p;
            }
            else
            {
                // Fallback to system default browser
                Process.Start(url);
                return null;
            }
        }

        private static void Cleanup()
        {
            _isRunning = false;
            if (_trayIcon != null)
            {
                _trayIcon.Visible = false;
                _trayIcon.Dispose();
            }
            if (_listener != null)
            {
                try { _listener.Stop(); } catch { }
                try { _listener.Close(); } catch { }
            }
            if (_mutex != null)
            {
                try { _mutex.ReleaseMutex(); } catch { }
                _mutex.Dispose();
            }
        }
    }
}
