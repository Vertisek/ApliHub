# ==============================================================================
# ApliHub Soclify - Native Windows Application Installer & Setup
# ==============================================================================

$ErrorActionPreference = "Stop"

$srcDir = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$srcDir\index.html")) {
    $srcDir = $PSScriptRoot
    if (-not (Test-Path "$srcDir\index.html")) {
        $srcDir = "c:\Users\oskar\Documents\Wazne\ApliHub - strona\Algo analyzer"
    }
}

Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "       ApliHub Soclify - Instalator Aplikacji Desktop       " -ForegroundColor Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor Cyan

$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (-not (Test-Path $csc)) {
    $csc = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe"
}

$installDir = "$env:LOCALAPPDATA\ApliHub\AlgoAnalyzer"
$appDir = "$installDir\app"
$profileDir = "$installDir\profile"
$tempBuildDir = "$env:TEMP\ApliHub_SoclifyBuild"

if (Test-Path $tempBuildDir) { Remove-Item $tempBuildDir -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Path $tempBuildDir -Force | Out-Null

# 1. Kill running instances
Write-Host "[1/6] Sprawdzanie aktywnych procesow Soclify / AlgoAnalyzer..." -ForegroundColor Gray
Get-Process -Name "Soclify", "AlgoAnalyzer" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Zatrzymywanie instancji ID: $($_.Id)" -ForegroundColor DarkYellow
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

# 2. Compile Binaries
Write-Host "[2/6] Kompilowanie binariow EXE (Launcher, Uninstaller, Updater)..." -ForegroundColor Gray
$iconParam = ""
$iconPath = "$srcDir\app.ico"
if (Test-Path $iconPath) {
    $iconParam = "/win32icon:`"$iconPath`""
}

# Compile AlgoAnalyzer.exe (Soclify launcher)
$launcherSrc = "$srcDir\src\AlgoAnalyzerDesktop.cs"
$launcherOut = "$tempBuildDir\AlgoAnalyzer.exe"
& $csc /target:winexe /optimize+ $iconParam /out:"$launcherOut" /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.dll "$launcherSrc"
if ($LASTEXITCODE -ne 0) { throw "Blad podczas kompilacji AlgoAnalyzer.exe" }

# Compile Uninstall.exe
$uninstallerSrc = "$srcDir\src\AlgoAnalyzerUninstaller.cs"
$uninstallerOut = "$tempBuildDir\Uninstall.exe"
& $csc /target:winexe /optimize+ $iconParam /out:"$uninstallerOut" /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.dll "$uninstallerSrc"
if ($LASTEXITCODE -ne 0) { throw "Blad podczas kompilacji Uninstall.exe" }

# Compile Updater.exe
$updaterSrc = "$srcDir\src\AlgoAnalyzerUpdater.cs"
$updaterOut = "$tempBuildDir\Updater.exe"
& $csc /target:winexe /optimize+ $iconParam /out:"$updaterOut" /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.dll "$updaterSrc"
if ($LASTEXITCODE -ne 0) { throw "Blad podczas kompilacji Updater.exe" }

# 3. Create Destination Directory Structure
Write-Host "[3/6] Przygotowywanie katalogu instalacji: $installDir..." -ForegroundColor Gray
New-Item -ItemType Directory -Path $installDir -Force | Out-Null
New-Item -ItemType Directory -Path $appDir -Force | Out-Null
New-Item -ItemType Directory -Path "$appDir\css" -Force | Out-Null
New-Item -ItemType Directory -Path "$appDir\js" -Force | Out-Null
New-Item -ItemType Directory -Path $profileDir -Force | Out-Null

# 4. Copy Binaries and Web Assets
Write-Host "[4/6] Kopiowanie plikow aplikacji..." -ForegroundColor Gray
Copy-Item "$launcherOut" "$installDir\AlgoAnalyzer.exe" -Force
Copy-Item "$uninstallerOut" "$installDir\Uninstall.exe" -Force
Copy-Item "$updaterOut" "$installDir\Updater.exe" -Force
if (Test-Path "$srcDir\app.ico") { Copy-Item "$srcDir\app.ico" "$installDir\app.ico" -Force }

# Copy web files
Copy-Item "$srcDir\index.html" "$appDir\index.html" -Force
if (Test-Path "$srcDir\onboarding.html") { Copy-Item "$srcDir\onboarding.html" "$appDir\onboarding.html" -Force }
if (Test-Path "$srcDir\app.ico") { Copy-Item "$srcDir\app.ico" "$appDir\app.ico" -Force }

Copy-Item "$srcDir\css\*" "$appDir\css\" -Recurse -Force
Copy-Item "$srcDir\js\*" "$appDir\js\" -Recurse -Force

# Create Update.bat helper
$updateBatContent = "@echo off`r`ntitle ApliHub Soclify - Aktualizacja`r`nstart `"`" `"%~dp0Updater.exe`""
Set-Content -Path "$installDir\Update.bat" -Value $updateBatContent -Encoding ASCII

# Create version.json
$currDate = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
$versionJson = "{`"name`": `"Soclify`", `"version`": `"1.0.0`", `"publisher`": `"ApliHub`", `"installDate`": `"$currDate`"}"
Set-Content -Path "$installDir\version.json" -Value $versionJson -Encoding UTF8

# 5. Create Shortcuts & Register in Windows
Write-Host "[5/6] Tworzenie skrotow i rejestracja w Dodaj/Usun Programy..." -ForegroundColor Gray

$wscript = New-Object -ComObject WScript.Shell

# Desktop Shortcut
$desktopFolder = [Environment]::GetFolderPath([Environment+SpecialFolder]::DesktopDirectory)
$oldDesktopLnk = "$desktopFolder\Algo Analyzer.lnk"
if (Test-Path $oldDesktopLnk) { Remove-Item $oldDesktopLnk -Force }

$desktopLnk = "$desktopFolder\Soclify.lnk"
$shortcut = $wscript.CreateShortcut($desktopLnk)
$shortcut.TargetPath = "$installDir\AlgoAnalyzer.exe"
$shortcut.WorkingDirectory = $installDir
$shortcut.Description = "Soclify - Zaawansowana Analityka Social Media (ApliHub)"
$shortcut.IconLocation = "$installDir\AlgoAnalyzer.exe,0"
$shortcut.Save()

# Start Menu Shortcut
$startMenuPrograms = [Environment]::GetFolderPath([Environment+SpecialFolder]::Programs)
$startMenuApliHub = "$startMenuPrograms\ApliHub"
New-Item -ItemType Directory -Path $startMenuApliHub -Force | Out-Null

$oldMenuLnk = "$startMenuApliHub\Algo Analyzer.lnk"
if (Test-Path $oldMenuLnk) { Remove-Item $oldMenuLnk -Force }
$oldUninstLnk = "$startMenuApliHub\Odinstaluj Algo Analyzer.lnk"
if (Test-Path $oldUninstLnk) { Remove-Item $oldUninstLnk -Force }

$menuLnk = "$startMenuApliHub\Soclify.lnk"
$shortcut2 = $wscript.CreateShortcut($menuLnk)
$shortcut2.TargetPath = "$installDir\AlgoAnalyzer.exe"
$shortcut2.WorkingDirectory = $installDir
$shortcut2.Description = "Soclify - Zaawansowana Analityka Social Media (ApliHub)"
$shortcut2.IconLocation = "$installDir\AlgoAnalyzer.exe,0"
$shortcut2.Save()

$uninstallLnk = "$startMenuApliHub\Odinstaluj Soclify.lnk"
$shortcut3 = $wscript.CreateShortcut($uninstallLnk)
$shortcut3.TargetPath = "$installDir\Uninstall.exe"
$shortcut3.WorkingDirectory = $installDir
$shortcut3.Description = "Odinstaluj program ApliHub Soclify"
$shortcut3.IconLocation = "$installDir\Uninstall.exe,0"
$shortcut3.Save()

# Registry Registration for Windows Add/Remove Programs (Settings -> Apps -> Installed Apps)
$regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\ApliHub_Soclify"
if (-not (Test-Path $regPath)) {
    New-Item -Path $regPath -Force | Out-Null
}

$appSizeKB = [int]((Get-ChildItem $installDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1024)

Set-ItemProperty -Path $regPath -Name "DisplayName" -Value "ApliHub Soclify"
Set-ItemProperty -Path $regPath -Name "DisplayVersion" -Value "1.0.0"
Set-ItemProperty -Path $regPath -Name "Publisher" -Value "ApliHub"
Set-ItemProperty -Path $regPath -Name "DisplayIcon" -Value "$installDir\AlgoAnalyzer.exe,0"
Set-ItemProperty -Path $regPath -Name "InstallLocation" -Value $installDir
Set-ItemProperty -Path $regPath -Name "UninstallString" -Value "`"$installDir\Uninstall.exe`""
Set-ItemProperty -Path $regPath -Name "QuietUninstallString" -Value "`"$installDir\Uninstall.exe`" /silent"
Set-ItemProperty -Path $regPath -Name "HelpLink" -Value "https://aplihub.pl"
Set-ItemProperty -Path $regPath -Name "URLInfoAbout" -Value "https://aplihub.pl"
Set-ItemProperty -Path $regPath -Name "EstimatedSize" -Value $appSizeKB -Type DWord
Set-ItemProperty -Path $regPath -Name "NoModify" -Value 1 -Type DWord
Set-ItemProperty -Path $regPath -Name "NoRepair" -Value 1 -Type DWord

# Clean old registry key if present
Remove-Item "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\ApliHub_AlgoAnalyzer" -Force -ErrorAction SilentlyContinue

# Clean temp build dir
Remove-Item $tempBuildDir -Recurse -Force -ErrorAction SilentlyContinue

# 6. Launch Application
Write-Host "[6/6] Uruchamianie zainstalowanej aplikacji Soclify..." -ForegroundColor Green
Start-Process -FilePath "$installDir\AlgoAnalyzer.exe"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "      SUKCES: Soclify zostal pomyslnie zainstalowany!       " -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host " - Lokalizacja:  $installDir"
Write-Host " - Skrot Pulpit: $desktopLnk"
Write-Host " - Menu Start:   $menuLnk"
Write-Host " - Deinstalator: Widoczny w 'Dodaj lub usun programy' Windows"
Write-Host " - Aktualizacje: Wbudowany updater (Updater.exe / Tray)"
Write-Host ""
