$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$installerDir = Resolve-Path "..\assets\installer" -ErrorAction SilentlyContinue
if (-not $installerDir) {
    $installerDir = New-Item -ItemType Directory -Path "..\assets\installer" -Force
}

Write-Host "Compiling Algo Analyzer EXE..."
& $csc /target:winexe /out:"..\assets\installer\ApliHub_AlgoAnalyzer_Setup.exe" /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.dll "src\AlgoAnalyzerLauncher.cs"

Write-Host "Compiling Fast Konwerter EXE..."
& $csc /target:winexe /out:"..\assets\installer\ApliHub_FastKonwerter_Setup.exe" /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.dll "src\FastKonwerterLauncher.cs"

Write-Host "Packaging Chrome Extension ZIPs..."
$chromeZip = "..\assets\installer\Fast_Konwerter_Chrome_Extension.zip"
$setupZip = "..\assets\installer\ApliHub_FastKonwerter_Setup.zip"

if (Test-Path $chromeZip) { Remove-Item $chromeZip -Force }
if (Test-Path $setupZip) { Remove-Item $setupZip -Force }

$tempDir = "..\assets\installer\temp_ext"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$extFiles = "manifest.json", "background.js", "content.js", "icon16.png", "icon48.png", "icon128.png"
foreach ($f in $extFiles) {
    $srcPath = "..\Fast Konwerter\$f"
    if (Test-Path $srcPath) {
        Copy-Item $srcPath "$tempDir\$f" -Force
    }
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $chromeZip -Force
Compress-Archive -Path "$tempDir\*" -DestinationPath $setupZip -Force
Remove-Item $tempDir -Recurse -Force

Write-Host "Build complete! Directory contents:"
Get-ChildItem "..\assets\installer"
