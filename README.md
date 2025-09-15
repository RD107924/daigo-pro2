# 代購平台 Pro

一個功能完整的代購電商平台，整合跑跑虎集運服務。

## 功能特色

- 完整的購物車系統
- 自動計算服務費和運費 (8%)
- 集運倉庫資訊管理 (廈門、義烏、深圳)
- 付款證明上傳系統
- 訂單追蹤功能
- 管理後台系統
- SendGrid 郵件通知
- 響應式設計 (蝦皮風格)

## 技術架構

### 前端
- HTML5 + CSS3 + JavaScript
- 蝦皮風格 UI 設計
- Font Awesome 圖標
- 響應式布局

### 後端
- Node.js + Express
- SendGrid 郵件服務
- JSON 文件存儲
- RESTful API

## 快速開始

### 1. 克隆項目
```bash
git clone https://github.com/你的用戶名/daigou-platform-pro.git
cd daigou-platform-pro
```

### 2. 安裝依賴
```bash
cd backend
npm install
```

### 3. 配置環境
複製 `.env.example` 為 `.env`:
```bash
cp .env.example .env
```

編輯 `.env` 文件，配置必要參數：
```env
NODE_ENV=production
PORT=3000
SENDGRID_API_KEY=你的SendGrid密鑰
SENDER_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### 4. 啟動服務
```bash
npm start
```

### 5. 訪問應用
- 前台：http://localhost:3000
- 管理後台：http://localhost:3000/admin/login (admin/admin123)

## 項目結構

```
daigou-platform-pro/
 backend/                    # 後端服務
    src/
       routes/            # API 路由
       services/          # 業務服務
       middleware/        # 中間件
    server.js              # 服務器入口
    package.json           # 依賴配置
 frontend/                   # 前端文件
    pages/                 # HTML 頁面
    css/                   # 樣式文件
    js/                    # JavaScript
    admin/                 # 管理後台
 config/                     # 配置文件
 docs/                      # 文檔
 render.yaml                # Render 部署配置
```

## 主要頁面

### 用戶端
- `/` - 首頁商品展示
- `/cart` - 購物車
- `/checkout` - 結帳頁面
- `/payment-upload` - 付款證明上傳
- `/order-tracking` - 訂單追蹤
- `/member-center` - 會員中心

### 管理端
- `/admin/login` - 管理員登入
- `/admin/dashboard` - 管理後台

## API 端點

### 產品管理
- `GET /api/products` - 獲取產品列表
- `GET /api/products/:id` - 獲取產品詳情

### 訂單管理
- `POST /api/orders/create` - 創建訂單
- `GET /api/orders/:id` - 獲取訂單詳情
- `PUT /api/orders/:id/status` - 更新訂單狀態

### 系統設定
- `GET /api/settings/settings` - 獲取系統設定
- `POST /api/settings/settings` - 更新系統設定

## 部署選項

### Render 部署
項目已配置 `render.yaml`，可直接部署到 Render：
1. 連接 GitHub 倉庫
2. 配置環境變數
3. 自動部署

### 本地部署
```bash
# 開發模式
npm run dev

# 生產模式
npm start
```

## 環境變數

| 變數名 | 說明 | 必需 |
|--------|------|------|
| `NODE_ENV` | 環境模式 | 否 |
| `PORT` | 服務端口 | 否 |
| `SENDGRID_API_KEY` | SendGrid API 密鑰 | 是 |
| `SENDER_EMAIL` | 發送者郵箱 | 是 |
| `ADMIN_EMAIL` | 管理員郵箱 | 是 |

## 貢獻指南

1. Fork 項目
2. 創建功能分支
3. 提交更改
4. 發起 Pull Request

## 授權

MIT License

## 聯絡方式

如有問題請提交 Issue 或聯絡維護者。
