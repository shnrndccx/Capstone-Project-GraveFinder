@echo off
REM GraveFinder Development Server Launcher for Windows
REM This script starts the development server on Windows

echo.
echo 🌍 GraveFinder Development Server (Windows)
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

REM Display system info
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ Error: npm is not installed or not in PATH
    echo.
    echo npm should have been installed with Node.js
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%

echo.
echo ⏳ Starting development server on http://localhost:8000
echo 📂 Serving from: %cd%
echo.
echo 💡 Tips:
echo    • Open http://localhost:8000 in your browser
echo    • Press Ctrl+C to stop the server
echo    • Files are auto-reloaded (refresh your browser)
echo.

REM Start the development server
call npm run dev

if errorlevel 1 (
    echo.
    echo ❌ Server failed to start. Please check the error above.
    pause
    exit /b 1
)

pause
