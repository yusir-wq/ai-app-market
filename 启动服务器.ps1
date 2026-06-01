# AI应用市场 - 启动开发服务器
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   AI应用市场 - 启动开发服务器" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 pnpm
$pnpmPath = Get-Command pnpm -ErrorAction SilentlyContinue
if (-not $pnpmPath) {
    Write-Host "[错误] 未找到 pnpm，请先安装 pnpm" -ForegroundColor Red
    Write-Host "安装命令: npm install -g pnpm"
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "[1/3] 正在安装依赖..." -ForegroundColor Yellow
& pnpm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 依赖安装失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "[2/3] 依赖安装完成" -ForegroundColor Green
Write-Host ""
Write-Host "[3/3] 正在启动开发服务器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "------------------------------------------" -ForegroundColor Cyan
Write-Host "访问地址:" -ForegroundColor Cyan
Write-Host "  - 本机: http://localhost:3000" -ForegroundColor White
Write-Host "  - 局域网: http://192.168.0.51:3000" -ForegroundColor White
Write-Host "------------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

& pnpm dev

Read-Host "按回车键退出"
