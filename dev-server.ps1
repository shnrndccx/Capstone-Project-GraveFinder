#!/usr/bin/env powershell
# GraveFinder Development Server Launcher for PowerShell
# This script starts the development server with nice formatting

Write-Host ""
Write-Host "🌍 GraveFinder Development Server (PowerShell)" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Node.js is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$npmVersion = npm --version 2>$null

Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
Write-Host ""

Write-Host "⏳ Starting development server on http://localhost:8000" -ForegroundColor Yellow
Write-Host "📂 Serving from: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Open http://localhost:8000 in your browser"
Write-Host "   • Press Ctrl+C to stop the server"
Write-Host "   • Files are auto-reloaded (refresh your browser)"
Write-Host ""

# Start the development server
npm run dev

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Server failed to start. Please check the error above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"
