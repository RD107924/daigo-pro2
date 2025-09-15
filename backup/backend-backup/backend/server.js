const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 靜態文件服務 - 修復路徑問題
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/pages', express.static(path.join(__dirname, '../public/pages')));
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));

// API 路由
try {
    const userRoutes = require('./src/routes/userRoutes');
    const adminRoutes = require('./src/routes/adminRoutes');
    const productRoutes = require('./src/routes/productRoutes');
    const orderRoutes = require('./src/routes/orderRoutes');
    const paymentRoutes = require('./src/routes/paymentRoutes');
    const settingsRoutes = require('./src/routes/settingsRoutes');

    app.use('/api/users', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/settings', settingsRoutes);
} catch (error) {
    console.log('  部分 API 路由未載入:', error.message);
}

// 健康檢查
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 頁面路由 - 修復文件路徑
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../public/pages/home.html');
    if (require('fs').existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});

app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});

// 前台頁面路由
const pageRoutes = [
    'cart', 'checkout', 'order-tracking', 'payment-upload', 
    'product-detail', 'member-center', 'contact', 'member-login'
];

pageRoutes.forEach(route => {
    app.get(\/\\, (req, res) => {
        const filePath = path.join(__dirname, \../public/pages/\.html\);
        if (require('fs').existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('頁面不存在');
        }
    });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
    console.error('錯誤:', err.stack);
    res.status(500).json({
        success: false,
        message: '服務器內部錯誤',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 處理
app.use((req, res) => {
    res.status(404).send(\
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - 頁面不存在</title>
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    text-align: center; 
                    padding: 50px; 
                    background: #f5f5f5;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    max-width: 500px;
                    margin: 0 auto;
                }
                h1 { color: #EE4D2D; margin-bottom: 20px; }
                a { 
                    color: #EE4D2D; 
                    text-decoration: none;
                    background: #EE4D2D;
                    color: white;
                    padding: 12px 30px;
                    border-radius: 25px;
                    display: inline-block;
                    margin-top: 20px;
                }
                a:hover { background: #D73211; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404 - 頁面不存在</h1>
                <p>您訪問的頁面不存在或已被移除</p>
                <a href="/">返回首頁</a>
            </div>
        </body>
        </html>
    \);
});

// 啟動服務器
app.listen(PORT, () => {
    console.log('========================================');
    console.log(' 代購平台服務器已啟動');
    console.log(\ 前台頁面: http://localhost:\\);
    console.log(\  管理後台: http://localhost:\/admin/login\);
    console.log(\ 健康檢查: http://localhost:\/api/health\);
    console.log(\ 環境: \\);
    console.log('========================================');
});

module.exports = app;
