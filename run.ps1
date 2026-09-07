# =====================================================================
# TransformAI - 1-Click Launch Script for Windows PowerShell
# =====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "🚀  Starting TransformAI Prototype (SIH 2026 PS 26154)  🚀" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $Root "backend"
$FrontendDir = Join-Path $Root "frontend"

# 1. Check Python Venv
$PythonExe = Join-Path $BackendDir "venv\Scripts\python.exe"
if (-Not (Test-Path $PythonExe)) {
    Write-Host "[1/3] Creating Python virtual environment in $BackendDir..." -ForegroundColor Yellow
    python -m venv (Join-Path $BackendDir "venv")
    & $PythonExe -m pip install -r (Join-Path $BackendDir "requirements.txt")
} else {
    Write-Host "[1/3] Python environment verified." -ForegroundColor Green
}

# 2. Check Node & Frontend
$NpmCmd = "npm.cmd"
if (-Not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-Host "[2/3] Installing frontend node_modules..." -ForegroundColor Yellow
    Push-Location $FrontendDir
    & $NpmCmd install --legacy-peer-deps
    Pop-Location
} else {
    Write-Host "[2/3] Frontend packages verified." -ForegroundColor Green
}

# 3. Launch Backend in background process
Write-Host "[3/3] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Cyan
$BackendProcess = Start-Process -FilePath $PythonExe -ArgumentList "run_backend.py" -WorkingDirectory $BackendDir -PassThru

# 4. Launch Next.js Frontend
Write-Host "🌐 Launching Next.js Frontend on http://localhost:3000..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the application." -ForegroundColor Yellow
Write-Host ""

Push-Location $FrontendDir
try {
    & $NpmCmd run dev
} finally {
    Pop-Location
    if ($BackendProcess -and -not $BackendProcess.HasExited) {
        Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped backend process." -ForegroundColor Yellow
    }
}
