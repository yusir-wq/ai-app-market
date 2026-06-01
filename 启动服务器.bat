@echo off
chcp 65001 >nul
echo ==========================================
echo    AI应用市场 - 启动开发服务器
echo ==========================================
echo.

REM 检查是否安装了 pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未找到 pnpm，请先安装 pnpm
    echo 安装命令: npm install -g pnpm
    pause
    exit /b 1
)

echo [1/3] 正在安装依赖...
call pnpm install
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)

echo.
echo [2/3] 依赖安装完成
echo.
echo [3/3] 正在启动开发服务器...
echo.
echo ------------------------------------------
echo 访问地址:
echo   - 本机: http://localhost:3000
echo   - 局域网: http://192.168.0.51:3000
echo ------------------------------------------
echo.
echo 按 Ctrl+C 停止服务器
echo.

call pnpm dev

pause
