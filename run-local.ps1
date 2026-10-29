# SRGEC Admissions System - Run Local Development Environment
# Double click or run: .\run-local.ps1

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   SRGEC AI-Enabled Student Admission System - Local Run  " -ForegroundColor Cyan
Write-Host "   Seshadri Rao Gudlavalleru Engineering College (GECW)   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Start Mock Server in a new console window so logs are separated
Write-Host "🚀 Starting Local SRGEC Admissions Mock Server in a new window..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"`$Host.UI.RawUI.WindowTitle = 'SRGEC Admissions Mock Server'; node Backend/mock-server/server.js`""

# 2. Start Next.js Frontend in current console window
Write-Host "🎨 Starting SRGEC Next.js Frontend Dev Server on http://localhost:3000..." -ForegroundColor Cyan
Set-Location Frontend
npm run dev
