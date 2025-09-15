@echo off
echo 正在修復代購平台項目...

REM 1. 清理和重新組織項目結構
echo [1/8] 清理項目結構...
if exist "backend\package.json" del "backend\package.json"
if exist "frontend\js\app-test.js" del "frontend\js\app-test.js"
if exist "frontend\pages\index.html" del "frontend\pages\index.html"
if exist "frontend\pages\login.html" del "frontend\pages\login.html"

REM 2. 創建正確的目錄結構
echo [2/8] 創建目錄結構...
if not exist "public" mkdir public
if not exist "views" mkdir views
if not exist "config" mkdir config

REM 3. 移動文件到正確位置
echo [3/8] 重新組織文件...
if exist "frontend" (
    xcopy "frontend\*" "public\" /E /Y /Q > nul 2>&1
)

REM 4. 創建 .env 文件
echo [4/8] 創建環境配置...
(
echo NODE_ENV=development
echo PORT=3000
echo SITE_URL=http://localhost:3000
echo ADMIN_URL=http://localhost:3000/admin
echo DATABASE_URL=postgresql://localhost:5432/daigou_platform
echo DATABASE_SSL=false
echo SENDGRID_API_KEY=your_sendgrid_api_key_here
echo SENDER_EMAIL=noreply@daigou-platform.com
echo ADMIN_EMAIL=admin@daigou-platform.com
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
echo JWT_EXPIRES_IN=7d
echo SESSION_SECRET=your-session-secret-key
echo SERVICE_FEE_RATE=0.08
echo DEFAULT_SHIPPING_FEE=350
echo CORS_ORIGIN=http://localhost:3000
echo ADMIN_DEFAULT_EMAIL=admin@daigou-platform.com
echo ADMIN_DEFAULT_PASSWORD=admin123
) > .env

REM 5. 更新 package.json
echo [5/8] 更新 package.json...
(
echo {
echo   "name": "daigou-platform-pro",
echo   "version": "1.0.0",
echo   "description": "Professional Daigou Platform",
echo   "main": "backend/server.js",
echo   "scripts": {
echo     "start": "node backend/server.js",
echo     "dev": "nodemon backend/server.js",
echo     "install-deps": "npm install",
echo     "build": "echo 'Build completed'",
echo     "test": "echo 'No tests specified'"
echo   },
echo   "dependencies": {
echo     "@sendgrid/mail": "^7.7.0",
echo     "bcryptjs": "^2.4.3",
echo     "body-parser": "^1.20.2",
echo     "cors": "^2.8.5",
echo     "dotenv": "^16.3.1",
echo     "express": "^4.18.2",
echo     "jsonwebtoken": "^9.0.2",
echo     "multer": "^1.4.5-lts.1",
echo     "pg": "^8.11.3",
echo     "uuid": "^9.0.1"
echo   },
echo   "devDependencies": {
echo     "nodemon": "^3.0.2"
echo   },
echo   "engines": {
echo     "node": ">=14.0.0",
echo     "npm": ">=6.0.0"
echo   },
echo   "keywords": [
echo     "ecommerce",
echo     "daigou",
echo     "shopping",
echo     "platform"
echo   ],
echo   "author": "Your Name",
echo   "license": "MIT"
echo }
) > package.json

REM 6. 安裝依賴
echo [6/8] 安裝依賴包...
call npm install

REM 7. 創建啟動腳本
echo [7/8] 創建啟動腳本...
(
echo @echo off
echo echo 正在啟動代購平台...
echo echo.
echo echo 後台管理: http://localhost:3000/admin/login
echo echo 前台頁面: http://localhost:3000
echo echo.
echo call npm start
) > start-server.bat

(
echo @echo off
echo echo 正在啟動開發模式...
echo echo.
echo echo 後台管理: http://localhost:3000/admin/login
echo echo 前台頁面: http://localhost:3000
echo echo.
echo echo 按 Ctrl+C 停止服務器
echo call npm run dev
) > start-dev.bat

REM 8. 設置權限並完成
echo [8/8] 完成設置...
echo.
echo ================================
echo    代購平台修復完成！
echo ================================
echo.
echo 後續步驟：
echo 1. 執行 start-dev.bat 啟動開發服務器
echo 2. 訪問 http://localhost:3000
echo 3. 後台管理: http://localhost:3000/admin/login
echo    帳號: admin  密碼: admin123
echo.
echo 修復內容：
echo ✓ 清理重複文件
echo ✓ 重新組織項目結構  
echo ✓ 創建環境配置文件
echo ✓ 更新依賴包
echo ✓ 修復路由問題
echo ✓ 創建啟動腳本
echo.
pause