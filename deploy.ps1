# Deploy script for Dentissimo
# Usage: .\deploy.ps1 "Описание изменений"

param(
    [string]$message = "Update site"
)

Write-Host "🔨 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Deploy cancelled." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Pushing to GitHub..." -ForegroundColor Cyan
git add .
git commit -m $message
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Done! Cloudflare will deploy in 1-2 minutes." -ForegroundColor Green
Write-Host "🌐 Site: https://dentissimo.sale" -ForegroundColor Green
