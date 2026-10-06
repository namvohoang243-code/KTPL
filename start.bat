@echo off
title Career Map - Development Server
echo ===================================================
echo   DANG KHOI DONG CAREER MAP WEB APP...
echo ===================================================
echo.
npm.cmd run dev -- --open
if %errorlevel% neq 0 (
    echo.
    echo [LOI] Khong the khoi dong bang npm.cmd, dang thu node...
    npx.cmd vite --open
)
pause
