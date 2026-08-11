@echo off
title ReTrap YouTube Converter Backend
echo Uruchamianie backendu ReTrap YouTube Converter...
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;C:\Users\oskar\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin;%PATH%
node server.js
pause
