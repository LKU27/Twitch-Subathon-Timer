Write-Host "Installing dependencies for Subathon Timer..." -ForegroundColor Green
Write-Host ""

Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing root dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing server dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location ../client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error installing client dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location ..
Write-Host ""
Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a GitHub repository" -ForegroundColor White
Write-Host "2. Run: git init" -ForegroundColor White
Write-Host "3. Run: git add ." -ForegroundColor White
Write-Host "4. Run: git commit -m 'Initial commit'" -ForegroundColor White
Write-Host "5. Run: git remote add origin YOUR_GITHUB_REPO_URL" -ForegroundColor White
Write-Host "6. Run: git push -u origin main" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"
