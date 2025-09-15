@echo off
echo ========================================
echo      代購平台完整測試
echo ========================================
echo.

REM 檢查 Node.js
echo [1/7] 檢查 Node.js 環境...
node --version >nul 2>&1
if errorlevel 1 (
    echo  Node.js 未安裝
    echo 請下載安裝: https://nodejs.org/
    pause
    exit /b 1
)
echo  Node.js 環境正常

REM 檢查依賴
echo [2/7] 檢查依賴包...
if not exist "node_modules" (
    echo  安裝依賴包...
    call npm install
    if errorlevel 1 (
        echo  依賴安裝失敗
        pause
        exit /b 1
    )
)
echo  依賴檢查完成

REM 檢查關鍵文件
echo [3/7] 檢查關鍵文件...
set "files=backend\server.js .env package.json public\js\app.js public\pages\home.html"
for %%f in (%files%) do (
    if not exist "%%f" (
        echo  缺少文件: %%f
        pause
        exit /b 1
    )
)
echo  關鍵文件檢查通過

REM 檢查端口
echo [4/7] 檢查端口 3000...
netstat -an | find "3000" >nul
if not errorlevel 1 (
    echo   端口 3000 已被占用
    echo 將嘗試終止占用進程...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "3000" ^| find "LISTENING"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
)

REM 語法檢查
echo [5/7] 檢查 JavaScript 語法...
node -c backend\server.js
if errorlevel 1 (
    echo  server.js 語法錯誤
    pause
    exit /b 1
)
echo  語法檢查通過

REM 創建日誌目錄
echo [6/7] 準備日誌目錄...
if not exist "logs" mkdir logs

REM 測試服務器啟動
echo [7/7] 測試服務器啟動...
echo 正在啟動測試服務器...
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo        測試完成！
echo ========================================
echo.
echo  準備啟動服務器...
echo.
echo  前台地址: http://localhost:3000
echo   管理後台: http://localhost:3000/admin/login
echo  管理員帳號: admin / admin123
echo.
echo 選擇啟動模式:
echo [1] 開發模式 (npm run dev)
echo [2] 生產模式 (npm start)  
echo [3] 取消
echo.
set /p choice="請輸入選擇 (1-3): "

if "%choice%"=="1" (
    echo  啟動開發模式...
    call npm run dev
) else if "%choice%"=="2" (
    echo  啟動生產模式...
    call npm start
) else (
    echo  測試完成，未啟動服務器
    pause
)
