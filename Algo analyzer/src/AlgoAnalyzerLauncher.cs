using System;
using System.Drawing;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Diagnostics;
using System.Windows.Forms;

namespace ApliHub.AlgoAnalyzer
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
        private int _port = 54321;
        private string _appDirectory;
        private Label _lblStatus;
        private Button _btnLaunch;
        private Button _btnWeb;
        private Button _btnOpenFolder;

        public MainWindow()
        {
            InitializeComponent();
            StartLocalServer();
        }

        private void InitializeComponent()
        {
            this.Text = "ApliHub - Algo Analyzer Desktop";
            this.Size = new Size(520, 420);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.BackColor = Color.FromArgb(13, 14, 18);
            this.ForeColor = Color.White;
            this.Font = new Font("Segoe UI", 10F, FontStyle.Regular);

            // Locate app files
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            if (Directory.Exists(Path.Combine(baseDir, "Algo analyzer")))
            {
                _appDirectory = Path.Combine(baseDir, "Algo analyzer");
            }
            else if (File.Exists(Path.Combine(baseDir, "index.html")))
            {
                _appDirectory = baseDir;
            }
            else
            {
                string parent1 = Path.GetDirectoryName(baseDir.TrimEnd(Path.DirectorySeparatorChar));
                if (parent1 != null && Directory.Exists(Path.Combine(parent1, "Algo analyzer")))
                    _appDirectory = Path.Combine(parent1, "Algo analyzer");
                else
                    _appDirectory = baseDir;
            }

            // Header Banner Panel
            Panel headerPanel = new Panel();
            headerPanel.Dock = DockStyle.Top;
            headerPanel.Height = 85;
            headerPanel.BackColor = Color.FromArgb(19, 21, 28);
            headerPanel.Paint += (s, e) => {
                using (Pen pen = new Pen(Color.FromArgb(245, 158, 11), 2))
                {
                    e.Graphics.DrawLine(pen, 0, headerPanel.Height - 1, headerPanel.Width, headerPanel.Height - 1);
                }
            };

            Label lblTitle = new Label();
            lblTitle.Text = "ALGO ANALYZER DESKTOP";
            lblTitle.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(245, 158, 11);
            lblTitle.Location = new Point(20, 15);
            lblTitle.AutoSize = true;

            Label lblSub = new Label();
            lblSub.Text = "Autorskie narzedzie analityczne ApliHub dla Social Mediow";
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
            lblDot.ForeColor = Color.FromArgb(34, 197, 94);
            lblDot.Location = new Point(15, 15);
            lblDot.AutoSize = true;

            _lblStatus = new Label();
            _lblStatus.Text = "Silnik aplikacji aktywny. Gotowy do pracy.";
            _lblStatus.Font = new Font("Segoe UI", 10F, FontStyle.Bold);
            _lblStatus.ForeColor = Color.FromArgb(240, 240, 245);
            _lblStatus.Location = new Point(55, 15);
            _lblStatus.AutoSize = true;

            Label lblPort = new Label();
            lblPort.Text = "Lokalny port: " + _port + " | Status: Gotowy";
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
            _btnLaunch.Text = "URUCHOM ALGO ANALYZER";
            _btnLaunch.Location = new Point(20, 205);
            _btnLaunch.Size = new Size(465, 48);
            _btnLaunch.FlatStyle = FlatStyle.Flat;
            _btnLaunch.FlatAppearance.BorderSize = 0;
            _btnLaunch.BackColor = Color.FromArgb(245, 158, 11);
            _btnLaunch.ForeColor = Color.Black;
            _btnLaunch.Font = new Font("Segoe UI", 11F, FontStyle.Bold);
            _btnLaunch.Cursor = Cursors.Hand;
            _btnLaunch.Click += (s, e) => LaunchBrowser();
            this.Controls.Add(_btnLaunch);

            // Secondary Buttons
            _btnWeb = new Button();
            _btnWeb.Text = "Strona Glowna ApliHub";
            _btnWeb.Location = new Point(20, 268);
            _btnWeb.Size = new Size(225, 42);
            _btnWeb.FlatStyle = FlatStyle.Flat;
            _btnWeb.FlatAppearance.BorderColor = Color.FromArgb(60, 65, 80);
            _btnWeb.BackColor = Color.FromArgb(24, 27, 36);
            _btnWeb.ForeColor = Color.White;
            _btnWeb.Font = new Font("Segoe UI", 9.5F, FontStyle.Regular);
            _btnWeb.Cursor = Cursors.Hand;
            _btnWeb.Click += (s, e) => {
                try { Process.Start("https://aplihub.pl"); } catch { }
            };
            this.Controls.Add(_btnWeb);

            _btnOpenFolder = new Button();
            _btnOpenFolder.Text = "Katalog Aplikacji";
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
            lblFoot.Text = "ApliHub. Wszelkie prawa zastrzezone.";
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
            catch
            {
                if (_lblStatus != null) _lblStatus.Text = "Tryb bezposredni plikowy";
            }
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

        private void LaunchBrowser()
        {
            try
            {
                if (_listener != null && _listener.IsListening)
                {
                    Process.Start("http://localhost:" + _port + "/index.html");
                }
                else
                {
                    string htmlPath = Path.Combine(_appDirectory, "index.html");
                    if (File.Exists(htmlPath))
                    {
                        Process.Start(new ProcessStartInfo(htmlPath) { UseShellExecute = true });
                    }
                    else
                    {
                        MessageBox.Show("Nie znaleziono pliku index.html w: " + _appDirectory, "Algo Analyzer", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Blad podczas uruchamiania: " + ex.Message, "Blad", MessageBoxButtons.OK, MessageBoxIcon.Error);
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
