using System;
using System.IO;
using System.Diagnostics;
using System.Threading;
using System.Drawing;
using System.Windows.Forms;

namespace ApliHub.Soclify
{
    static class Program
    {
        private static Mutex _mutex;
        private static string _appDir;
        private static string _profileDir;
        private static string _rootDir;
        private static bool _isRunning = true;
        private static NotifyIcon _trayIcon;
        private static Process _browserProcess;

        [STAThread]
        static void Main(string[] args)
        {
            // Single Instance Mutex
            bool createdNew;
            _mutex = new Mutex(true, "ApliHub_Soclify_SingleInstance_Mutex", out createdNew);
            if (!createdNew)
            {
                // Bring existing window or launch
                try
                {
                    string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                    string indexFile = Path.Combine(localAppData, "ApliHub", "AlgoAnalyzer", "app", "index.html");
                    if (!File.Exists(indexFile))
                    {
                        indexFile = Path.Combine(localAppData, "ApliHub", "Soclify", "app", "index.html");
                    }
                    if (File.Exists(indexFile))
                    {
                        LaunchBrowserApp(indexFile, Path.Combine(localAppData, "ApliHub", "AlgoAnalyzer", "profile"));
                    }
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

                // Initialize System Tray Icon
                InitTrayIcon();

                // Launch Native Standalone App Window (Direct File Execution, No Localhost)
                string htmlPath = Path.Combine(_appDir, "index.html");
                _browserProcess = LaunchBrowserApp(htmlPath, _profileDir);

                // Run message loop for TrayIcon and background handling
                Application.Run();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Wystąpił błąd podczas uruchamiania Soclify:\n\n" + ex.Message,
                    "Soclify — Błąd", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            finally
            {
                Cleanup();
            }
        }

        private static void InitTrayIcon()
        {
            _trayIcon = new NotifyIcon();
            _trayIcon.Text = "ApliHub - Soclify";

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
            ToolStripMenuItem itemOpen = new ToolStripMenuItem("🚀 Otwórz Soclify", null, (s, e) => {
                string htmlPath = Path.Combine(_appDir, "index.html");
                LaunchBrowserApp(htmlPath, _profileDir);
            });
            itemOpen.Font = new Font(menu.Font, FontStyle.Bold);

            ToolStripMenuItem itemUpdate = new ToolStripMenuItem("🔄 Sprawdź aktualizacje", null, (s, e) => {
                RunUpdater();
            });

            ToolStripMenuItem itemFolder = new ToolStripMenuItem("📁 Folder aplikacji", null, (s, e) => {
                try { Process.Start("explorer.exe", _rootDir); } catch { }
            });

            ToolStripMenuItem itemSite = new ToolStripMenuItem("🌐 Strona ApliHub", null, (s, e) => {
                try { Process.Start("https://vertisek.github.io/ApliHub/"); } catch { }
            });

            ToolStripMenuItem itemExit = new ToolStripMenuItem("❌ Zamknij Soclify", null, (s, e) => {
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
            _trayIcon.DoubleClick += (s, e) => {
                string htmlPath = Path.Combine(_appDir, "index.html");
                LaunchBrowserApp(htmlPath, _profileDir);
            };
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
                    MessageBox.Show("Aplikacja Soclify jest w najnowszej wersji.", "Aktualizacje", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
        }

        private static Process LaunchBrowserApp(string htmlPath, string profileDir)
        {
            if (string.IsNullOrEmpty(htmlPath) || !File.Exists(htmlPath))
            {
                string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                htmlPath = Path.Combine(localAppData, "ApliHub", "AlgoAnalyzer", "app", "index.html");
            }

            string fileUrl = "file:///" + htmlPath.Replace('\\', '/');

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
                string args = string.Format("--app=\"{0}\" --window-size=1440,920 --user-data-dir=\"{1}\" --app-id=\"ApliHub.Soclify\" --app-title=\"Soclify\" --app-name=\"Soclify\" --allow-file-access-from-files --allow-file-access --disable-features=Translate,InterestFeedContentSuggestions",
                    fileUrl, profileDir);

                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = browserPath,
                    Arguments = args,
                    UseShellExecute = false
                };

                Process p = Process.Start(psi);
                if (p != null)
                {
                    ThreadPool.QueueUserWorkItem((state) =>
                    {
                        try
                        {
                            p.WaitForExit();
                        }
                        catch { }
                    });
                }
                return p;
            }
            else
            {
                // Fallback
                Process.Start(new ProcessStartInfo(fileUrl) { UseShellExecute = true });
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
            if (_mutex != null)
            {
                try { _mutex.ReleaseMutex(); } catch { }
                _mutex.Dispose();
            }
        }
    }
}
