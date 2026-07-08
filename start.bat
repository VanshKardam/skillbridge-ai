@echo off
echo =======================================================
echo Starting Skillbridge AI Full Stack Application...
echo =======================================================

echo.
echo Installing Backend Dependencies...
cd Backend
call npm install
echo Installing Puppeteer Chrome for Windows...
call npx puppeteer browsers install chrome
cd ..

echo.
echo Installing Frontend Dependencies...
cd Frontend
call npm install
cd ..

echo.
echo Starting Backend Server...
cd Backend
start "Skillbridge Backend" cmd /k "npm run dev"
cd ..

echo.
echo Starting Frontend Server...
cd Frontend
start "Skillbridge Frontend" cmd /k "npm run dev"
cd ..

echo.
echo =======================================================
echo Both servers are starting in new windows!
echo Your browser should open automatically shortly.
echo =======================================================
pause
