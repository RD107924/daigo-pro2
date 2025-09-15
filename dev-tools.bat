@echo off
title 代購平台開發工具

:menu
cls
echo ========================================
echo      代購平台開發工具
echo ========================================
echo.
echo [1] 啟動開發服務器
echo [2] 啟動生產服務器
echo [3] 重新安裝依賴
echo [4] 檢查項目狀態
echo [5] 查看日誌
echo [6] 清理緩存
echo [7] 打開瀏覽器
echo [8] 退出
echo.
set /p choice="請選擇操作 (1-8): "

if "%choice%"=="1" goto dev
if "%choice%"=="2" goto prod
if "%choice%"=="3" goto reinstall
if "%choice%"=="4" goto status
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto clean
if "%choice%"=="7" goto browser
if "%choice%"=="8" exit
goto menu

:dev
echo  啟動開發服務器...
call npm run dev
pause
goto menu

:prod
echo  啟動生產服務器...
call npm start
pause
goto menu

:reinstall
echo  重新安裝依賴...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
call npm install
echo  依賴重新安裝完成
pause
goto menu

:status
echo  檢查項目狀態...
echo Node.js 版本:
node --version
echo npm 版本:
npm --version
echo.
echo 關鍵文件狀態:
if exist "backend\server.js" (echo  backend\server.js) else (echo  backend\server.js)
if exist ".env" (echo  .env) else (echo  .env)
if exist "package.json" (echo  package.json) else (echo  package.json)
if exist "public\js\app.js" (echo  public\js\app.js) else (echo  public\js\app.js)
pause
goto menu

:logs
echo  查看日誌...
if exist "logs\app.log" (
    type logs\app.log
) else (
    echo 暫無日誌文件
)
pause
goto menu

:clean
echo  清理緩存...
if exist "logs" rmdir /s /q logs
if exist "temp" rmdir /s /q temp
echo  緩存清理完成
pause
goto menu

:browser
echo  打開瀏覽器...
start http://localhost:3000
start http://localhost:3000/admin/login
echo  瀏覽器已打開
pause
goto menu
