@echo off
chcp 65001 > nul
set PYTHONIOENCODING=utf-8
title TransformAI - SIH 2026 PS 26154

echo =================================================================
echo   Starting TransformAI Prototype (SIH 2026 PS 26154)
echo =================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting FastAPI Backend on http://localhost:8000 ...
start "TransformAI Backend" cmd /k "cd /d "%~dp0backend" && set PYTHONIOENCODING=utf-8 && venv\Scripts\python.exe run_backend.py"

echo [2/3] Starting Next.js Frontend on http://localhost:3000 ...
start "TransformAI Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo =================================================================
echo   TransformAI is launching!
echo   Frontend Web App: http://localhost:3000
echo   Backend API Docs: http://localhost:8000/docs
echo =================================================================
echo.
pause
