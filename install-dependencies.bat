@echo off
echo Installing dependencies for Subathon Timer...
echo.

echo Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies
    pause
    exit /b 1
)

echo.
echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd ../client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ All dependencies installed successfully!
echo.
echo Next steps:
echo 1. Create a GitHub repository
echo 2. Run: git init
echo 3. Run: git add .
echo 4. Run: git commit -m "Initial commit"
echo 5. Run: git remote add origin YOUR_GITHUB_REPO_URL
echo 6. Run: git push -u origin main
echo.
pause
