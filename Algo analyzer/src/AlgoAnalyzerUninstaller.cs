using System;
using System.IO;
using System.Diagnostics;
using System.Windows.Forms;
using Microsoft.Win32;

namespace ApliHub.AlgoAnalyzer
{
    static class UninstallerProgram
    {
        [STAThread]
        static void Main(string[] args)
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            bool isSilent = false;
            foreach (string a in args)
            {
                if (a.Equals("/silent", StringComparison.OrdinalIgnoreCase) ||
                    a.Equals("/quiet", StringComparison.OrdinalIgnoreCase) ||
                    a.Equals("-s", StringComparison.OrdinalIgnoreCase))
                {
                    isSilent = true;
                }
            }

            if (!isSilent)
            {
                DialogResult res = MessageBox.Show(
                    "Czy na pewno chcesz odinstalować program ApliHub Algo Analyzer ze swojego komputera?",
                    "Deinstalacja — ApliHub Algo Analyzer",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Question);

                if (res != DialogResult.Yes)
                {
                    return;
                }
            }

            try
            {
                // 1. Terminate any running AlgoAnalyzer processes
                Process[] procs = Process.GetProcessesByName("AlgoAnalyzer");
                foreach (Process p in procs)
                {
                    try
                    {
                        if (p.Id != Process.GetCurrentProcess().Id)
                        {
                            p.Kill();
                            p.WaitForExit(2000);
                        }
                    }
                    catch { }
                }

                // 2. Remove Registry entries (Add/Remove Programs)
                try
                {
                    using (RegistryKey parent = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Uninstall", true))
                    {
                        if (parent != null)
                        {
                            parent.DeleteSubKeyTree("ApliHub_AlgoAnalyzer", false);
                        }
                    }
                }
                catch { }

                // 3. Remove Desktop shortcut
                try
                {
                    string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                    string deskLink = Path.Combine(desktop, "Algo Analyzer.lnk");
                    if (File.Exists(deskLink)) File.Delete(deskLink);
                }
                catch { }

                // 4. Remove Start Menu shortcuts
                try
                {
                    string programs = Environment.GetFolderPath(Environment.SpecialFolder.Programs);
                    string apliHubMenu = Path.Combine(programs, "ApliHub");
                    string menuLink = Path.Combine(apliHubMenu, "Algo Analyzer.lnk");
                    if (File.Exists(menuLink)) File.Delete(menuLink);

                    // Delete folder if empty
                    if (Directory.Exists(apliHubMenu) && Directory.GetFiles(apliHubMenu).Length == 0 && Directory.GetDirectories(apliHubMenu).Length == 0)
                    {
                        Directory.Delete(apliHubMenu, false);
                    }
                }
                catch { }

                // 5. Delete installation directory and self
                string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string installDir = Path.Combine(localAppData, "ApliHub", "AlgoAnalyzer");

                // Self delete via background command
                if (Directory.Exists(installDir))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = string.Format("/c timeout /t 1 /nobreak > nul & rd /s /q \"{0}\"", installDir),
                        CreateNoWindow = true,
                        UseShellExecute = false,
                        WindowStyle = ProcessWindowStyle.Hidden
                    };
                    Process.Start(psi);
                }

                if (!isSilent)
                {
                    MessageBox.Show(
                        "Program ApliHub Algo Analyzer został pomyślnie odinstalowany z Twojego komputera.",
                        "Deinstalacja zakończona",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Information);
                }
            }
            catch (Exception ex)
            {
                if (!isSilent)
                {
                    MessageBox.Show("Wystąpił błąd podczas deinstalacji:\n\n" + ex.Message, "Błąd deinstalacji", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }
    }
}
