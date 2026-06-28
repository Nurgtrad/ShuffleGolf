@echo off
REM ============================================================
REM   Shuffle Golf - Compilar APK de debug (doble clic)
REM ============================================================
setlocal

REM --- Configuracion del entorno ---
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%"

cd /d "%~dp0"

echo.
echo ============================================================
echo   1/2  Copiando archivos del juego a www\
echo ============================================================
robocopy "..\ShuffleGolf-main" "www" /MIR /XD ".git" "node_modules" ".claude" "platforms" "plugins" /XF "*.bat" /NFL /NDL /NJH /NJS
echo Archivos sincronizados.

echo.
echo ============================================================
echo   2/2  Compilando APK (esto puede tardar 1-2 min)
echo ============================================================
call cordova build android
if errorlevel 1 (
    echo.
    echo *** ERROR: La compilacion fallo. Revisa el mensaje de arriba. ***
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo   LISTO! APK generado en:
echo   platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo ============================================================
echo.

REM Abrir la carpeta del APK en el Explorador
explorer "platforms\android\app\build\outputs\apk\debug"

pause
endlocal
