using System;
using System.Drawing;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Diagnostics;
using System.Windows.Forms;

namespace ApliHub.FastKonwerter
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainWindow());
        }
    }

    public class MainWindow : Form
    {
        private HttpListener _listener;
        private Thread _serverThread;
        private int _port = 54322;
        private string _appDirectory;
        private Label _lblStatus;
        private Button _btnLaunch;
        private Button _btnInstallChrome;
        private Button _btnOpenFolder;

        public MainWindow()
        {
            InitializeComponent();
            StartLocalServer();
        }

        private void InitializeComponent()
        {
            this.Text = "ApliHub - Fast Konwerter Desktop";
            this.Size = new Size(520, 430);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(15, 15, 17);
            this.ForeColor = Color.White;
            this.Font = new Font("Segoe UI", 10F, FontStyle.Regular);

            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            if (Directory.Exists(Path.Combine(baseDir, "Fast Konwerter")))
            {
                _appDirectory = Path.Combine(baseDir, "Fast Konwerter");
            }
            else if (File.Exists(Path.Combine(baseDir, "manifest.json")) || File.Exists(Path.Combine(baseDir, "index.html")))
            {
                _appDirectory = baseDir;
            }
            else
            {
                string parent1 = Path.GetDirectoryName(baseDir.TrimEnd(Path.DirectorySeparatorChar));
                if (parent1 != null && Directory.Exists(Path.Combine(parent1, "Fast Konwerter")))
                    _appDirectory = Path.Combine(parent1, "Fast Konwerter");
                else
                    _appDirectory = baseDir;
            }

            // Header Banner
            Panel headerPanel = new Panel();
            headerPanel.Dock = DockStyle.Top;
            headerPanel.Height = 85;
            headerPanel.BackColor = Color.FromArgb(20, 22, 28);
            headerPanel.Paint += (s, e) => {
                using (Pen pen = new Pen(Color.FromArgb(59, 130, 246), 2))
                {
                    e.Graphics.DrawLine(pen, 0, headerPanel.Height - 1, headerPanel.Width, headerPanel.Height - 1);
                }
            };

            Label lblTitle = new Label();
            lblTitle.Text = "FAST KONWERTER (RETRAP)";
            lblTitle.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(96, 165, 250);
            lblTitle.Location = new Point(20, 15);
            lblTitle.AutoSize = true;

            Label lblSub = new Label();
            lblSub.Text = "Wtyczka i Konwerter YouTube, TikTok i Instagram (MP3/WAV/MP4)";
            lblSub.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            lblSub.ForeColor = Color.FromArgb(156, 163, 175);
            lblSub.Location = new Point(22, 45);
            lblSub.AutoSize = true;

            headerPanel.Controls.Add(lblTitle);
            headerPanel.Controls.Add(lblSub);
            this.Controls.Add(headerPanel);

            // Status Card
            Panel statusPanel = new Panel();
            statusPanel.Location = new Point(20, 105);
            statusPanel.Size = new Size(465, 80);
            statusPanel.BackColor = Color.FromArgb(24, 27, 36);
            statusPanel.Paint += (s, e) => {
                using (Pen p = new Pen(Color.FromArgb(40, 45, 60), 1))
                {
                    e.Graphics.DrawRectangle(p, 0, 0, statusPanel.Width - 1, statusPanel.Height - 1);
                }
            };

            Label lblDot = new Label();
            lblDot.Text = "[OK]";
            lblDot.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            lblDot.ForeColor = Color.FromArgb(59, 130, 246);
            lblDot.Location = new Point(15, 15);
            lblDot.AutoSize = true;

            _lblStatus = new Label();
            _lblStatus.Text = "Modul konwersji i asystent wtyczki gotowy.";
            _lblStatus.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            _lblStatus.ForeColor = Color.FromArgb(240, 240, 245);
            _lblStatus.Location = new Point(55, 15);
            _lblStatus.AutoSize = true;

            Label lblPort = new Label();
            lblPort.Text = "Kompatybilnosc: Chrome, Brave, Edge, Opera | Format V3 Web Store";
            lblPort.Font = new Font("Segoe UI", 9F, FontStyle.Regular);
            lblPort.ForeColor = Color.FromArgb(156, 163, 175);
            lblPort.Location = new Point(55, 42);
            lblPort.AutoSize = true;

            statusPanel.Controls.Add(lblDot);
            statusPanel.Controls.Add(_lblStatus);
            statusPanel.Controls.Add(lblPort);
            this.Controls.Add(statusPanel);

            // Primary Launch Button
            _btnLaunch = new Button();
            _btnLaunch.Text = "URUCHOM KONWERTER W PRZEGLADARCE";
            _btnLaunch.Location = new Point(20, 205);
            _btnLaunch.Size = new Size(465, 48);
            _btnLaunch.FlatStyle = FlatStyle.Flat;
            _btnLaunch.FlatAppearance.BorderSize = 0;
            _btnLaunch.BackColor = Color.FromArgb(37, 99, 235);
            _btnLaunch.ForeColor = Color.White;
            _btnLaunch.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            _btnLaunch.Cursor = Cursors.Hand;
            _btnLaunch.Click += (s, e) => LaunchApp();
            this.Controls.Add(_btnLaunch);

            // Secondary Action Buttons
            _btnInstallChrome = new Button();
            _btnInstallChrome.Text = "Zainstaluj Wtyczke w Chrome";
            _btnInstallChrome.Location = new Point(20, 268);
            _btnInstallChrome.Size = new Size(225, 42);
            _btnInstallChrome.FlatStyle = FlatStyle.Flat;
            _btnInstallChrome.FlatAppearance.BorderColor = Color.FromArgb(60, 65, 80);
            _btnInstallChrome.BackColor = Color.FromArgb(24, 27, 36);
            _btnInstallChrome.ForeColor = Color.White;
            _btnInstallChrome.Font = new Font("Segoe UI", 9.5F, FontStyle.Regular);
            _btnInstallChrome.Cursor = Cursors.Hand;
            _btnInstallChrome.Click += (s, e) => InstallInChrome();
            this.Controls.Add(_btnInstallChrome);

            _btnOpenFolder = new Button();
            _btnOpenFolder.Text = "Otwarz Folder Wtyczki";
            _btnOpenFolder.Location = new Point(260, 268);
            _btnOpenFolder.Size = new Size(225, 42);
            _btnOpenFolder.FlatStyle = FlatStyle.Flat;
            _btnOpenFolder.FlatAppearance.BorderColor = Color.FromArgb(60, 65, 80);
            _btnOpenFolder.BackColor = Color.FromArgb(24, 27, 36);
            _btnOpenFolder.ForeColor = Color.White;
            _btnOpenFolder.Font = new Font("Segoe UI", 9.5F, FontStyle.Regular);
            _btnOpenFolder.Cursor = Cursors.Hand;
            _btnOpenFolder.Click += (s, e) => {
                try {
                    if (Directory.Exists(_appDirectory)) Process.Start("explorer.exe", _appDirectory);
                    else Process.Start("explorer.exe", AppDomain.CurrentDomain.BaseDirectory);
                } catch { }
            };
            this.Controls.Add(_btnOpenFolder);

            // Footer
            Label lblFoot = new Label();
            lblFoot.Text = "ApliHub. Zgodne ze standardem Chrome Web Store Manifest V3.";
            lblFoot.Font = new Font("Segoe UI", 8.5F, FontStyle.Regular);
            lblFoot.ForeColor = Color.FromArgb(100, 110, 130);
            lblFoot.Location = new Point(20, 335);
            lblFoot.AutoSize = true;
            this.Controls.Add(lblFoot);
        }

        private void StartLocalServer()
        {
            try
            {
                _listener = new HttpListener();
                _listener.Prefixes.Add("http://localhost:" + _port + "/");
                _listener.Start();

                _serverThread = new Thread(() =>
                {
                    while (_listener != null && _listener.IsListening)
                    {
                        try
                        {
                            var ctx = _listener.GetContext();
                            ThreadPool.QueueUserWorkItem((c) => HandleRequest((HttpListenerContext)c), ctx);
                        }
                        catch { }
                    }
                });
                _serverThread.IsBackground = true;
                _serverThread.Start();
            }
            catch { }
        }

        private void HandleRequest(HttpListenerContext ctx)
        {
            try
            {
                string rawUrl = ctx.Request.RawUrl.Split('?')[0].TrimStart('/');
                if (string.IsNullOrEmpty(rawUrl)) rawUrl = "index.html";

                string filePath = Path.Combine(_appDirectory, rawUrl.Replace('/', Path.DirectorySeparatorChar));

                if (!File.Exists(filePath))
                {
                    string rootPath = Path.GetDirectoryName(_appDirectory);
                    if (rootPath != null)
                    {
                        string altPath = Path.Combine(rootPath, rawUrl.Replace('/', Path.DirectorySeparatorChar));
                        if (File.Exists(altPath)) filePath = altPath;
                    }
                }

                if (File.Exists(filePath))
                {
                    byte[] bytes = File.ReadAllBytes(filePath);
                    string ext = Path.GetExtension(filePath).ToLowerInvariant();
                    string mime = "text/html";
                    switch (ext)
                    {
                        case ".css": mime = "text/css"; break;
                        case ".js": mime = "application/javascript"; break;
                        case ".json": mime = "application/json"; break;
                        case ".png": mime = "image/png"; break;
                        case ".jpg": case ".jpeg": mime = "image/jpeg"; break;
                        case ".svg": mime = "image/svg+xml"; break;
                        case ".woff2": mime = "font/woff2"; break;
                    }

                    ctx.Response.ContentType = mime;
                    ctx.Response.ContentLength64 = bytes.Length;
                    ctx.Response.OutputStream.Write(bytes, 0, bytes.Length);
                }
                else
                {
                    ctx.Response.StatusCode = 404;
                    byte[] err = Encoding.UTF8.GetBytes("Plik nie istnieje");
                    ctx.Response.OutputStream.Write(err, 0, err.Length);
                }
            }
            catch { }
            finally
            {
                try { ctx.Response.OutputStream.Close(); } catch { }
            }
        }

        private void LaunchApp()
        {
            try
            {
                string indexHtml = Path.Combine(_appDirectory, "index.html");
                if (File.Exists(indexHtml))
                {
                    if (_listener != null && _listener.IsListening)
                    {
                        Process.Start("http://localhost:" + _port + "/index.html");
                    }
                    else
                    {
                        Process.Start(new ProcessStartInfo(indexHtml) { UseShellExecute = true });
                    }
                }
                else
                {
                    Process.Start("https://www.youtube.com");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Blad: " + ex.Message, "Fast Konwerter", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void InstallInChrome()
        {
            try
            {
                if (Directory.Exists(_appDirectory))
                {
                    Process.Start("explorer.exe", _appDirectory);
                }
                Process.Start("chrome.exe", "chrome://extensions/");
            }
            catch
            {
                try { Process.Start("https://chrome.google.com/webstore"); } catch { }
            }
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            try
            {
                if (_listener != null && _listener.IsListening)
                {
                    _listener.Stop();
                    _listener.Close();
                }
            }
            catch { }
            base.OnFormClosing(e);
        }
    }
}
