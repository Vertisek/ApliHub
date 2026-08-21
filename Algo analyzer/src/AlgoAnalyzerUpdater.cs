using System;
using System.IO;
using System.Net;
using System.Drawing;
using System.Threading;
using System.Diagnostics;
using System.Windows.Forms;

namespace ApliHub.Soclify
{
    static class UpdaterProgram
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new UpdateForm());
        }
    }

    public class UpdateForm : Form
    {
        private ProgressBar _progressBar;
        private Label _lblStatus;
        private Label _lblSub;
        private Button _btnAction;
        private string _appDir;
        private string _rootDir;

        public UpdateForm()
        {
            InitializeComponent();
            this.Shown += (s, e) => StartUpdate();
        }

        private void InitializeComponent()
        {
            this.Text = "ApliHub — Aktualizacja Soclify";
            this.Size = new Size(460, 260);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.BackColor = Color.FromArgb(15, 17, 23);
            this.ForeColor = Color.White;
            this.Font = new Font("Segoe UI", 9.5F, FontStyle.Regular);

            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            _rootDir = Path.Combine(localAppData, "ApliHub", "AlgoAnalyzer");
            _appDir = Path.Combine(_rootDir, "app");

            Label lblTitle = new Label();
            lblTitle.Text = "Centrum Aktualizacji Soclify";
            lblTitle.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(245, 158, 11);
            lblTitle.Location = new Point(24, 20);
            lblTitle.AutoSize = true;

            _lblStatus = new Label();
            _lblStatus.Text = "Nawiązywanie połączenia z serwerem ApliHub...";
            _lblStatus.Font = new Font("Segoe UI", 10F, FontStyle.Regular);
            _lblStatus.ForeColor = Color.FromArgb(240, 240, 245);
            _lblStatus.Location = new Point(24, 60);
            _lblStatus.AutoSize = true;

            _progressBar = new ProgressBar();
            _progressBar.Location = new Point(24, 95);
            _progressBar.Size = new Size(396, 22);
            _progressBar.Style = ProgressBarStyle.Continuous;
            _progressBar.Value = 10;

            _lblSub = new Label();
            _lblSub.Text = "Pobieranie najnowszych skryptów i analizatorów algorytmów...";
            _lblSub.Font = new Font("Segoe UI", 8.5F, FontStyle.Regular);
            _lblSub.ForeColor = Color.FromArgb(156, 163, 175);
            _lblSub.Location = new Point(24, 125);
            _lblSub.AutoSize = true;

            _btnAction = new Button();
            _btnAction.Text = "Anuluj";
            _btnAction.Location = new Point(290, 165);
            _btnAction.Size = new Size(130, 36);
            _btnAction.FlatStyle = FlatStyle.Flat;
            _btnAction.BackColor = Color.FromArgb(30, 35, 48);
            _btnAction.FlatAppearance.BorderColor = Color.FromArgb(60, 65, 80);
            _btnAction.ForeColor = Color.White;
            _btnAction.Cursor = Cursors.Hand;
            _btnAction.Click += (s, e) => this.Close();

            this.Controls.Add(lblTitle);
            this.Controls.Add(_lblStatus);
            this.Controls.Add(_progressBar);
            this.Controls.Add(_lblSub);
            this.Controls.Add(_btnAction);
        }

        private void StartUpdate()
        {
            Thread t = new Thread(() =>
            {
                try
                {
                    // List of critical files to update directly from repository
                    string baseUrl = "https://raw.githubusercontent.com/Vertisek/ApliHub/main/Algo%20analyzer/";
                    string[] files = new string[]
                    {
                        "index.html",
                        "onboarding.html",
                        "css/style.css",
                        "js/app.js",
                        "js/data.js",
                        "js/i18n.js",
                        "js/particles.js",
                        "js/youtubeAnalytics.js",
                        "app.ico"
                    };

                    Directory.CreateDirectory(_appDir);
                    Directory.CreateDirectory(Path.Combine(_appDir, "css"));
                    Directory.CreateDirectory(Path.Combine(_appDir, "js"));

                    using (WebClient client = new WebClient())
                    {
                        client.Headers.Add("User-Agent", "ApliHub-Soclify-Desktop");

                        int count = 0;
                        foreach (string file in files)
                        {
                            string downloadUrl = baseUrl + file;
                            string targetPath = Path.Combine(_appDir, file.Replace('/', Path.DirectorySeparatorChar));

                            this.Invoke(new Action(() => {
                                _lblStatus.Text = "Pobieranie: " + Path.GetFileName(file);
                                _lblSub.Text = "Plik " + (count + 1) + " z " + files.Length;
                                _progressBar.Value = 10 + (int)((float)count / files.Length * 80);
                            }));

                            try
                            {
                                byte[] data = client.DownloadData(downloadUrl);
                                File.WriteAllBytes(targetPath, data);
                            }
                            catch (Exception ex)
                            {
                                Debug.WriteLine("Download skip " + file + ": " + ex.Message);
                            }

                            count++;
                            Thread.Sleep(50);
                        }
                    }

                    // Write version stamp
                    string verFile = Path.Combine(_rootDir, "version.json");
                    string json = string.Format("{{\"version\": \"1.0.1\", \"lastUpdate\": \"{0:yyyy-MM-dd HH:mm:ss}\"}}", DateTime.Now);
                    File.WriteAllText(verFile, json);

                    this.Invoke(new Action(() => {
                        _progressBar.Value = 100;
                        _lblStatus.Text = "✓ Soclify jest aktualny!";
                        _lblStatus.ForeColor = Color.FromArgb(34, 197, 94);
                        _lblSub.Text = "Pomyślnie zaktualizowano wszystkie pliki aplikacji.";
                        _btnAction.Text = "Uruchom ponownie";
                        _btnAction.BackColor = Color.FromArgb(245, 158, 11);
                        _btnAction.ForeColor = Color.Black;
                        _btnAction.Font = new Font(_btnAction.Font, FontStyle.Bold);
                        _btnAction.Click -= (s, e) => this.Close();
                        _btnAction.Click += (s, e) => {
                            RestartApp();
                            this.Close();
                        };
                    }));
                }
                catch (Exception ex)
                {
                    this.Invoke(new Action(() => {
                        _lblStatus.Text = "Błąd aktualizacji: " + ex.Message;
                        _lblStatus.ForeColor = Color.FromArgb(239, 68, 68);
                        _btnAction.Text = "Zamknij";
                    }));
                }
            });
            t.IsBackground = true;
            t.Start();
        }

        private void RestartApp()
        {
            try
            {
                Process[] procs = Process.GetProcessesByName("AlgoAnalyzer");
                foreach (Process p in procs)
                {
                    try { p.Kill(); } catch { }
                }
                string exe = Path.Combine(_rootDir, "AlgoAnalyzer.exe");
                if (File.Exists(exe)) Process.Start(exe);
            }
            catch { }
        }
    }
}
